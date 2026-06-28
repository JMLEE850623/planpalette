import { STYLES, VIEWS, COLOR_THEMES } from '../data/styles';
import { hasGeminiKey } from '../services/gemini';

export default function Sidebar({
  selectedStyle, setSelectedStyle,
  selectedTheme, setSelectedTheme,
  customColor, setCustomColor, customTheme,
  selectedView, setSelectedView,
}) {
  const keyReady = hasGeminiKey();
  const overviewViews = VIEWS.filter(v => v.kind === 'overview');
  const roomViews = VIEWS.filter(v => v.kind === 'room');

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <h1>PlanPalette</h1>
        </div>
        <div className="sidebar-subtitle">AI Interior Design Studio</div>
      </div>

      <div className="sidebar-body">
        {/* Gemini key status */}
        <div className={`key-status ${keyReady ? 'ok' : 'missing'}`}>
          <span className="key-status-dot" />
          {keyReady
            ? 'Gemini on · reads your floor plan'
            : 'No Gemini key · renders still work (generic)'}
        </div>

        {/* 1 — Design style */}
        <div>
          <div className="section-label">1 · Design Style</div>
          <div className="style-grid">
            {STYLES.map(style => (
              <div
                key={style.id}
                className={`style-card ${selectedStyle === style.id ? 'active' : ''}`}
                onClick={() => setSelectedStyle(style.id)}
              >
                <div
                  className="style-card-photo"
                  style={{ backgroundImage: `url(/styles/${style.id}.jpg)` }}
                />
                <div className="style-card-name">{style.emoji} {style.name}</div>
                <div className="style-card-desc">{style.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 2 — Colour theme combinations */}
        <div>
          <div className="section-label">2 · Colour Theme</div>
          <div className="theme-combo-list">
            {COLOR_THEMES.map(theme => (
              <button
                key={theme.id}
                className={`theme-combo ${selectedTheme === theme.id ? 'active' : ''}`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <div className="theme-combo-swatch">
                  {theme.colors.map((c, i) => (
                    <span key={i} style={{ background: c }} />
                  ))}
                </div>
                <span className="theme-combo-name">{theme.name}</span>
              </button>
            ))}

            {/* Custom — pick one colour, OKLCH builds the rest */}
            <button
              className={`theme-combo ${selectedTheme === 'custom' ? 'active' : ''}`}
              onClick={() => setSelectedTheme('custom')}
            >
              <div className="theme-combo-swatch">
                {customTheme.colors.map((c, i) => (
                  <span key={i} style={{ background: c }} />
                ))}
              </div>
              <span className="theme-combo-name">Custom</span>
              <label className="theme-custom-picker" onClick={e => e.stopPropagation()}>
                <input
                  type="color"
                  value={customColor}
                  onChange={e => { setCustomColor(e.target.value); setSelectedTheme('custom'); }}
                />
              </label>
            </button>
          </div>
          {selectedTheme === 'custom' && (
            <div className="theme-custom-hint">Auto-matched from {customColor} via OKLCH</div>
          )}
        </div>

        {/* 3 — What to render */}
        <div>
          <div className="section-label">3 · View</div>
          <div className="view-group-label">Whole home</div>
          <div className="room-list">
            {overviewViews.map(view => (
              <button
                key={view.id}
                className={`room-btn ${selectedView === view.id ? 'active' : ''}`}
                onClick={() => setSelectedView(view.id)}
              >
                <div className="room-btn-icon">{view.icon}</div>
                {view.label}
              </button>
            ))}
          </div>
          <div className="view-group-label">Single room</div>
          <div className="room-list">
            {roomViews.map(view => (
              <button
                key={view.id}
                className={`room-btn ${selectedView === view.id ? 'active' : ''}`}
                onClick={() => setSelectedView(view.id)}
              >
                <div className="room-btn-icon">{view.icon}</div>
                {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
