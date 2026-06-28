import { useState, useEffect, useRef } from 'react';
import { renderWalkthrough } from '../utils/walkthrough';

export default function WalkthroughPanel({ imageUrls }) {
  const [status, setStatus] = useState('idle'); // idle | rendering | done | error
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState(null);
  const [error, setError] = useState(null);
  const resultRef = useRef(null);

  // Revoke the previous object URL when a new one replaces it / on unmount.
  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  // Scroll the finished video into view so it's never hidden below the fold.
  useEffect(() => {
    if (status === 'done') resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [status]);

  const create = async () => {
    if (videoUrl) { URL.revokeObjectURL(videoUrl); setVideoUrl(null); }
    setStatus('rendering');
    setProgress(0);
    setError(null);
    try {
      const blob = await renderWalkthrough(imageUrls, {
        secondsPerImage: 3,
        onProgress: setProgress,
      });
      setVideoUrl(URL.createObjectURL(blob));
      setStatus('done');
    } catch (e) {
      setError(e.message || 'Could not create the video.');
      setStatus('error');
    }
  };

  const busy = status === 'rendering';

  return (
    <div className="ideas-section walkthrough-panel">
      <div className="ideas-section-header">
        <h3>Walkthrough Video</h3>
        <div className="walkthrough-header-actions">
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {imageUrls.length} image{imageUrls.length > 1 ? 's' : ''} · ~{imageUrls.length * 3}s
          </span>
          <button className="btn btn-primary" onClick={create} disabled={busy}>
            {busy ? (
              <>
                <span className="btn-spinner" />
                Rendering… {Math.round(progress * 100)}%
              </>
            ) : (
              <>🎬 {status === 'done' ? 'Re-create video' : 'Create walkthrough video'}</>
            )}
          </button>
        </div>
      </div>

      <div className="walkthrough-body">
        <p className="walkthrough-hint">
          Animate your renders into a short pan-and-zoom walkthrough clip (.webm) —
          made right in your browser, no GPU needed.
        </p>

        {busy && (
          <div className="walkthrough-progress">
            <div className="walkthrough-progress-bar" style={{ width: `${Math.round(progress * 100)}%` }} />
          </div>
        )}

        {status === 'error' && (
          <div className="walkthrough-error">⚠ {error}</div>
        )}

        {status === 'done' && videoUrl && (
          <div className="walkthrough-result" ref={resultRef}>
            <video src={videoUrl} controls autoPlay loop muted playsInline />
            <a className="btn btn-secondary" href={videoUrl} download="planpalette-walkthrough.webm">
              ↓ Download .webm
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
