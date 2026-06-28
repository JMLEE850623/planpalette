import { useState } from 'react';

export default function IdeaCard({ idea, onClick }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="idea-card" onClick={() => onClick(idea)}>
      {idea.image && !failed ? (
        <div className="idea-card-image">
          <img src={idea.image} alt={idea.title} loading="lazy" onError={() => setFailed(true)} />
        </div>
      ) : (
        <div className="idea-card-palette">
          {idea.palette.map((color, i) => (
            <span key={i} style={{ background: color }} />
          ))}
        </div>
      )}

      <div className="idea-card-body">
        <div className="idea-card-style-badge">
          {idea.style}
        </div>
        <h4>{idea.title}</h4>
        <p>{idea.description}</p>
      </div>

      <div className="idea-card-footer">
        <div className="idea-card-materials">
          {idea.materials.slice(0, 3).map((m, i) => (
            <span key={i} className="material-tag">{m}</span>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{idea.mood}</span>
      </div>
    </div>
  );
}
