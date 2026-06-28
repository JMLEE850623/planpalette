import { useState } from 'react';
import Sidebar from './components/Sidebar';
import UploadZone from './components/UploadZone';
import IdeaCard from './components/IdeaCard';
import DetailPanel from './components/DetailPanel';
import { useDesignIdeas } from './hooks/useDesignIdeas';
import { STYLES, VIEWS, COLOR_THEMES } from './data/styles';
import { buildOklchPalette } from './utils/color';

function Toast({ message }) {
  return message ? <div className="toast">{message}</div> : null;
}

export default function App() {
  const [selectedStyle, setSelectedStyle] = useState('japan');
  const [selectedView, setSelectedView] = useState('living');
  const [selectedTheme, setSelectedTheme] = useState('warm-neutral');
  const [customColor, setCustomColor] = useState('#6a8caf');
  const [floorPlan, setFloorPlan] = useState(null);
  const [selectedIdea, setSelectedIdea] = useState(null);
  const [toast, setToast] = useState('');

  const { ideas, loading, error, generateIdeas } = useDesignIdeas();

  const resolvedTheme = selectedTheme === 'custom'
    ? buildOklchPalette(customColor)
    : COLOR_THEMES.find(t => t.id === selectedTheme) || COLOR_THEMES[0];

  const showToast = msg => {
    setToast(msg);
    setTimeout(() => setToast(''), 2000);
  };

  const handleUpload = ({ file, dataUrl, base64 }) => {
    setFloorPlan({ file, dataUrl, base64 });
    showToast(`Uploaded: ${file.name}`);
  };

  const handleGenerate = () => {
    generateIdeas({
      floorPlanBase64: floorPlan?.base64 || null,
      floorPlanMime: floorPlan?.file?.type || null,
      style: selectedStyle,
      theme: resolvedTheme,
      view: selectedView,
    });
    setSelectedIdea(null);
  };

  const viewName = VIEWS.find(v => v.id === selectedView)?.label || 'View';
  const styleName = STYLES.find(s => s.id === selectedStyle)?.name || 'Style';
  const themeName = resolvedTheme.name;

  return (
    <div className="app">
      <Sidebar
        selectedStyle={selectedStyle}
        setSelectedStyle={setSelectedStyle}
        selectedTheme={selectedTheme}
        setSelectedTheme={setSelectedTheme}
        customColor={customColor}
        setCustomColor={setCustomColor}
        customTheme={resolvedTheme}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
      />

      <main className="main">
        <div className="main-header">
          <div className="main-header-left">
            <h2>{viewName} · {styleName}{themeName ? ` · ${themeName}` : ''}</h2>
            <p>
              {ideas.length > 0
                ? `${ideas.length} render${ideas.length > 1 ? 's' : ''} generated`
                : 'Choose your style, colour theme and view, then generate'}
            </p>
          </div>
          <div className="header-actions">
            {floorPlan && (
              <button
                className="btn btn-secondary"
                onClick={() => { setFloorPlan(null); setSelectedIdea(null); }}
              >
                Clear Plan
              </button>
            )}
            <button
              className="btn btn-primary"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  Generating…
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Generate Ideas
                </>
              )}
            </button>
          </div>
        </div>

        <div className="canvas-area">
          {!floorPlan ? (
            <UploadZone onUpload={handleUpload} />
          ) : (
            <div className="floorplan-preview">
              <div className="floorplan-preview-header">
                <h3>Floor Plan</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{floorPlan.file.name}</span>
              </div>
              <div className="floorplan-preview-body">
                <img src={floorPlan.dataUrl} alt="Floor plan" />
              </div>
            </div>
          )}

          {loading && (
            <div className="ideas-section">
              <div className="loading-state">
                <div className="loading-spinner" />
                <p>Rendering {styleName} {viewName.toLowerCase()}… this can take 20–60s</p>
              </div>
            </div>
          )}

          {error && !loading && (
            <div style={{ background: 'oklch(0.95 0.04 25)', border: '1px solid oklch(0.85 0.08 25)', borderRadius: 'var(--radius)', padding: '12px 16px', fontSize: 13, color: 'oklch(0.45 0.12 25)' }}>
              ⚠ {error}
            </div>
          )}

          {!loading && ideas.length > 0 && (
            <div className="ideas-section">
              <div className="ideas-section-header">
                <h3>Design Ideas</h3>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ideas.length} concepts</span>
              </div>
              <div className="ideas-grid">
                {ideas.map(idea => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    onClick={setSelectedIdea}
                  />
                ))}
              </div>
            </div>
          )}

          {selectedIdea && (
            <DetailPanel
              idea={selectedIdea}
              onClose={() => setSelectedIdea(null)}
            />
          )}

          {!loading && ideas.length === 0 && !floorPlan && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Start designing</h3>
              <p>
                In the sidebar pick a <strong>style</strong>, a <strong>colour theme</strong> and a <strong>view</strong> (whole-home or a single room), upload your floor plan (or skip it), then click <strong>Generate Ideas</strong>. Gemini reads your plan and Pollinations renders it — free.
              </p>
            </div>
          )}

          {!loading && ideas.length === 0 && floorPlan && (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Floor plan ready</h3>
              <p>Click <strong>Generate Ideas</strong> to get design concepts tailored to your floor plan and selected style.</p>
            </div>
          )}
        </div>
      </main>

      <Toast message={toast} />
    </div>
  );
}
