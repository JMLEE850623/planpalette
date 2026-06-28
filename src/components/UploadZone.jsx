import { useRef, useState } from 'react';

export default function UploadZone({ onUpload }) {
  const [drag, setDrag] = useState(false);
  const inputRef = useRef();

  const handleFile = file => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const dataUrl = e.target.result;
      const base64 = dataUrl.split(',')[1];
      onUpload({ file, dataUrl, base64 });
    };
    reader.readAsDataURL(file);
  };

  const onDrop = e => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files[0]);
  };

  return (
    <div
      className={`upload-zone ${drag ? 'drag-over' : ''}`}
      onDragOver={e => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={e => handleFile(e.target.files[0])}
        style={{ display: 'none' }}
      />
      <div className="upload-zone-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9M15 9v12" />
          <path d="M3 15h6M15 15h6" />
        </svg>
      </div>
      <h3>Upload Floor Plan</h3>
      <p>
        Drag & drop your floor plan image here, or{' '}
        <span className="browse-link">browse files</span>
      </p>
      <p style={{ marginTop: 8, fontSize: 12 }}>PNG, JPG, WebP · Max 10 MB</p>
    </div>
  );
}
