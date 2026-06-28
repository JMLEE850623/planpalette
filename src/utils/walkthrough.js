// Turn a set of still images into a short walkthrough video — entirely in the
// browser, no AI model and no GPU. We animate each image with a Ken Burns effect
// (slow zoom + pan) and crossfade between them on a <canvas>, capture the canvas
// with MediaRecorder, and return a .webm Blob.

function loadImage(url) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // keep cross-origin (Pollinations) frames untainted
    img.onload = () => resolve(img);
    img.onerror = () => {
      // Last resort: retry without CORS so at least same-origin/blob URLs load.
      const plain = new Image();
      plain.onload = () => resolve(plain);
      plain.onerror = () => resolve(null);
      plain.src = url;
    };
    img.src = url;
  });
}

function pickMime() {
  const candidates = ['video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm'];
  return candidates.find(m => window.MediaRecorder?.isTypeSupported?.(m)) || 'video/webm';
}

const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Draw an image scaled to cover the canvas, with an extra zoom factor and pan.
function drawCover(ctx, img, W, H, scale, panFrac, alpha) {
  const ir = img.width / img.height;
  const cr = W / H;
  let dw, dh;
  if (ir > cr) { dh = H * scale; dw = dh * ir; }
  else { dw = W * scale; dh = dw / ir; }

  const overflowX = dw - W;
  const overflowY = dh - H;
  // pan within 30% of the available overflow so the frame always stays covered
  const x = (W - dw) / 2 + overflowX * 0.15 * panFrac;
  const y = (H - dh) / 2 + overflowY * 0.15 * panFrac;

  ctx.globalAlpha = alpha;
  ctx.drawImage(img, x, y, dw, dh);
  ctx.globalAlpha = 1;
}

export async function renderWalkthrough(imageUrls, opts = {}) {
  const {
    width = 1280,
    height = 720,
    secondsPerImage = 3,
    fps = 30,
    onProgress,
  } = opts;

  if (!window.MediaRecorder) throw new Error('Your browser does not support video recording (MediaRecorder).');

  const imgs = (await Promise.all(imageUrls.map(loadImage))).filter(Boolean);
  if (imgs.length === 0) throw new Error('No images could be loaded for the video.');

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const mime = pickMime();
  const stream = canvas.captureStream(fps);
  const rec = new MediaRecorder(stream, { mimeType: mime });
  const chunks = [];
  rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

  const transition = Math.min(0.6, secondsPerImage * 0.4);
  const total = imgs.length * secondsPerImage;
  // panel directions alternate so consecutive shots don't drift the same way
  const dir = i => (i % 2 === 0 ? 1 : -1);

  return new Promise((resolve, reject) => {
    let raf = 0;
    let start = 0;

    rec.onstop = () => resolve(new Blob(chunks, { type: mime }));
    rec.onerror = e => { cancelAnimationFrame(raf); reject(e.error || new Error('Recording failed.')); };

    const frame = now => {
      if (!start) start = now;
      const t = (now - start) / 1000;

      if (t >= total) {
        // hold the final frame briefly so the encoder flushes it, then stop
        const last = imgs.length - 1;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        drawCover(ctx, imgs[last], width, height, 1.15, dir(last), 1);
        onProgress?.(1);
        setTimeout(() => { try { rec.stop(); } catch { reject(new Error('Recording failed.')); } }, 150);
        return;
      }

      const idx = Math.min(imgs.length - 1, Math.floor(t / secondsPerImage));
      const localT = t - idx * secondsPerImage;
      const p = localT / secondsPerImage;
      const scale = 1.05 + 0.10 * easeInOut(p);
      const panFrac = (easeInOut(p) - 0.5) * 2 * dir(idx);

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
      drawCover(ctx, imgs[idx], width, height, scale, panFrac, 1);

      // crossfade into the next image during the tail of this shot
      if (idx < imgs.length - 1 && localT > secondsPerImage - transition) {
        const tp = (localT - (secondsPerImage - transition)) / transition;
        const nScale = 1.05 + 0.10 * easeInOut(tp * 0.3);
        const nPan = (easeInOut(0) - 0.5) * 2 * dir(idx + 1);
        drawCover(ctx, imgs[idx + 1], width, height, nScale, nPan, easeInOut(tp));
      }

      onProgress?.(Math.min(0.99, t / total));
      raf = requestAnimationFrame(frame);
    };

    rec.start();
    raf = requestAnimationFrame(frame);
  });
}
