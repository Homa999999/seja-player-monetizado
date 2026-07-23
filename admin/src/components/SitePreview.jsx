import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Icon from './Icon';

const PREVIEW_OVERRIDES = `
  html, body { margin: 0; padding: 0; background: var(--bg-primary); overflow: hidden; }
  .reveal { opacity: 1 !important; transform: none !important; transition: none !important; }
  .site-preview-section { pointer-events: none; }
  .site-preview-section a,
  .site-preview-section button { pointer-events: none; cursor: default; }
  .hero { min-height: auto !important; padding-top: 1.5rem !important; padding-bottom: 2rem !important; }
  .sticky-cta { position: relative !important; bottom: auto !important; left: auto !important; right: auto !important; opacity: 1 !important; visibility: visible !important; transform: none !important; }
  .preview-header-bar { pointer-events: none; }
`;

const VIEWPORTS = {
  mobile: { width: 390, ratio: 19.5 / 9, label: 'Vertical', icon: 'mobile-screen-button', hint: 'Celular' },
  desktop: { width: 1280, ratio: 16 / 10, label: 'Horizontal', icon: 'desktop', hint: 'PC' },
};

function writePreviewDocument(doc) {
  doc.open();
  doc.write(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base href="/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Sora:wght@600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/css/main.css">
  <link rel="stylesheet" href="/css/animations.css">
  <style id="preview-overrides">${PREVIEW_OVERRIDES}</style>
</head>
<body><div id="preview-root"></div></body>
</html>`);
  doc.close();
}

export default function SitePreview({ children, accentColor, height = 480, maxHeight = 900 }) {
  const iframeRef = useRef(null);
  const viewportRef = useRef(null);
  const [mountNode, setMountNode] = useState(null);
  const [orientation, setOrientation] = useState('mobile');
  const [containerWidth, setContainerWidth] = useState(360);
  const [contentHeight, setContentHeight] = useState(height);

  const viewport = VIEWPORTS[orientation];
  const isDesktop = orientation === 'desktop';
  const scale = isDesktop
    ? containerWidth / viewport.width
    : Math.min(1, containerWidth / viewport.width);
  const scaledHeight = contentHeight * scale;
  const scaledWidth = viewport.width * scale;
  const viewportHeight = isDesktop ? scaledHeight : undefined;

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    writePreviewDocument(iframe.contentDocument);
    setMountNode(iframe.contentDocument.getElementById('preview-root'));
  }, []);

  useEffect(() => {
    if (!mountNode) return;
    const doc = mountNode.ownerDocument;
    let style = doc.getElementById('preview-accent');
    if (accentColor) {
      if (!style) {
        style = doc.createElement('style');
        style.id = 'preview-accent';
        doc.head.appendChild(style);
      }
      style.textContent = `:root { --accent-green: ${accentColor}; --accent-green-light: ${accentColor}; --accent-green-dark: ${accentColor}; --glow-green: ${accentColor}59; }`;
    } else if (style) {
      style.remove();
    }
  }, [mountNode, accentColor]);

  useEffect(() => {
    if (!viewportRef.current) return;

    function measure() {
      setContainerWidth(viewportRef.current.clientWidth || 360);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(viewportRef.current);
    return () => observer.disconnect();
  }, [orientation]);

  useEffect(() => {
    if (!mountNode || !iframeRef.current) return;

    const iframe = iframeRef.current;
    const resize = () => {
      const next = Math.min(Math.max(mountNode.scrollHeight + 8, height), maxHeight);
      iframe.style.height = `${next}px`;
      setContentHeight(next);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mountNode);
    return () => observer.disconnect();
  }, [mountNode, children, height, maxHeight, orientation]);

  return (
    <div className={`site-preview site-preview--${orientation}`}>
      <div className="site-preview__toolbar" role="group" aria-label="Orientação da preview">
        {Object.entries(VIEWPORTS).map(([key, cfg]) => (
          <button
            key={key}
            type="button"
            className={`site-preview__mode${orientation === key ? ' site-preview__mode--active' : ''}`}
            onClick={() => setOrientation(key)}
            title={`${cfg.label} — ${cfg.hint}`}
            aria-pressed={orientation === key}
          >
            <Icon name={cfg.icon} />
            <span>{cfg.label}</span>
            <small>{cfg.hint}</small>
          </button>
        ))}
      </div>

      <div
        className="site-preview__viewport"
        ref={viewportRef}
        style={viewportHeight ? { height: viewportHeight } : undefined}
      >
        <div
          className="site-preview__scaler"
          style={{ width: scaledWidth, height: scaledHeight }}
        >
          <div
            className={`site-preview__frame site-preview__frame--${orientation}`}
            style={{
              width: viewport.width,
              height: contentHeight,
              transform: `scale(${scale})`,
            }}
          >
            <iframe
              ref={iframeRef}
              className="site-preview-iframe"
              title="Preview do site"
              style={{ height: contentHeight }}
              sandbox="allow-same-origin"
            >
              {mountNode && createPortal(children, mountNode)}
            </iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
