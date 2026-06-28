import { useState } from 'react';

export default function DetailPanel({ idea, onClose }) {
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [imgFailed, setImgFailed] = useState(false);

  const copy = (val, idx) => {
    navigator.clipboard.writeText(val);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={e => e.stopPropagation()}>
      <div className="detail-panel-header">
        <div className="idea-card-style-badge" style={{ margin: 0 }}>{idea.style}</div>
        <h3>{idea.title}</h3>
        <button
          onClick={onClose}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 18, lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div className="detail-panel-body">
        {idea.image && !imgFailed && (
          <div className="detail-image">
            <img src={idea.image} alt={idea.title} onError={() => setImgFailed(true)} />
            <a
              className="btn btn-secondary detail-download"
              href={idea.image}
              download={`${idea.title.replace(/[\s·]+/g, '-').toLowerCase()}.png`}
            >
              ↓ Download render
            </a>
          </div>
        )}

        <div className="detail-color-row">
          {idea.palette.map((color, i) => (
            <div
              key={i}
              className="detail-swatch"
              style={{ background: color, cursor: 'pointer' }}
              title={`Click to copy: ${color}`}
              onClick={() => copy(color, i)}
            >
              {copiedIdx === i ? '✓' : ''}
            </div>
          ))}
        </div>

        <p className="detail-desc">{idea.description}</p>

        <div className="detail-specs">
          <div className="detail-spec">
            <div className="detail-spec-label">Mood</div>
            <div className="detail-spec-value">{idea.mood}</div>
          </div>
          <div className="detail-spec">
            <div className="detail-spec-label">Lighting</div>
            <div className="detail-spec-value">{idea.lighting}</div>
          </div>
          <div className="detail-spec" style={{ gridColumn: '1 / -1' }}>
            <div className="detail-spec-label">Key Materials</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
              {idea.materials.map((m, i) => (
                <span key={i} className="material-tag" style={{ fontSize: 12, padding: '4px 10px' }}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Palette values */}
        <div style={{ marginTop: 16 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Palette {idea.themeName ? `· ${idea.themeName}` : ''}</div>
          {idea.palette.map((color, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <div style={{ width: 16, height: 16, borderRadius: 4, background: color, border: '1px solid oklch(0 0 0 / 0.08)', flexShrink: 0 }} />
              <code style={{ flex: 1, fontSize: 11, background: 'var(--bg-secondary)', padding: '3px 8px', borderRadius: 4, fontFamily: 'Courier New', color: 'var(--text)' }}>
                {color}
              </code>
              <button className="palette-copy" onClick={() => copy(color, `oklch-${i}`)}>
                {copiedIdx === `oklch-${i}` ? '✓' : 'Copy'}
              </button>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
