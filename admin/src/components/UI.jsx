import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Icon from './Icon';

export function SaveBar({ isDirty, saving, onSave, onDiscard, label = 'Salvar alterações' }) {
  const bar = (
    <div className={`save-bar${isDirty ? ' save-bar--dirty' : ''}${saving ? ' save-bar--saving' : ''}`}>
      <div className="save-bar__info">
        {saving && (
          <>
            <Icon name="spinner" className="fa-spin" />
            <span>Salvando...</span>
          </>
        )}
        {!saving && isDirty && (
          <>
            <Icon name="circle-exclamation" />
            <span>Alterações não salvas</span>
          </>
        )}
        {!saving && !isDirty && (
          <>
            <Icon name="circle-check" />
            <span>Tudo salvo</span>
          </>
        )}
      </div>
      <div className="save-bar__actions">
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onDiscard}
          disabled={!isDirty || saving}
        >
          <Icon name="rotate-left" /> Descartar
        </button>
        <button
          type="button"
          className="btn btn--primary btn--sm"
          onClick={onSave}
          disabled={!isDirty || saving}
        >
          <Icon name="floppy-disk" /> {label}
        </button>
      </div>
    </div>
  );

  const mount = typeof document !== 'undefined' ? document.querySelector('.admin-shell') : null;
  return mount ? createPortal(bar, mount) : bar;
}

export function PageHeader({ title, description, action, icon, breadcrumb }) {
  return (
    <div className="page-header animate-in">
      <div className="page-header__text">
        {breadcrumb?.length > 0 && (
          <nav className="breadcrumb" aria-label="Breadcrumb">
            {breadcrumb.map((item, i) => (
              <span key={item.label} className="breadcrumb__item">
                {i > 0 && <Icon name="chevron-right" className="breadcrumb__sep" />}
                {item.to ? <Link to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {icon && <span className="page-header__icon"><Icon name={icon} /></span>}
        <div>
          <h1>{title}</h1>
          {description && <p>{description}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function Card({ title, icon, children, className = '', delay = 0 }) {
  return (
    <section className={`card animate-in ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {title && (
        <h2 className="card__title">
          {icon && <Icon name={icon} />}
          {title}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Field({ label, hint, icon, children, fullWidth = false }) {
  return (
    <div className={`field${fullWidth ? ' field--full' : ''}`}>
      <span className="field__label">
        {icon && <Icon name={icon} />}
        {label}
      </span>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  );
}

export function Input({ value, onChange, icon, ...props }) {
  return (
    <div className={`input-wrap${icon ? ' input-wrap--icon' : ''}`}>
      {icon && <Icon name={icon} className="input-wrap__icon" />}
      <input className="input" value={value ?? ''} onChange={onChange} {...props} />
    </div>
  );
}

export function Textarea({ value, onChange, rows = 4, ...props }) {
  return <textarea className="input input--textarea" value={value ?? ''} onChange={onChange} rows={rows} {...props} />;
}

export function Switch({ checked, onChange, label, description }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle__track"><span className="toggle__thumb" /></span>
      <span className="toggle__copy">
        <strong>{label}</strong>
        {description && <small>{description}</small>}
      </span>
    </label>
  );
}

export function ColorInput({ value, onChange, label }) {
  const color = value || '#10b981';
  return (
    <div className="color-field">
      <input type="color" value={color} onChange={(e) => onChange(e.target.value)} aria-label={label || 'Cor'} />
      <Input value={color} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function SortableList({ items, onReorder, renderItem, keyFn = (item, i) => item.id || i }) {
  function handleDragStart(e, index) {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', String(index));
    e.currentTarget.classList.add('is-dragging');
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove('is-dragging');
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  function handleDrop(e, dropIndex) {
    e.preventDefault();
    const from = Number(e.dataTransfer.getData('text/plain'));
    if (Number.isNaN(from) || from === dropIndex) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(dropIndex, 0, moved);
    onReorder(next);
  }

  return (
    <div className="sortable-list">
      {items.map((item, index) => (
        <div
          key={keyFn(item, index)}
          className="sortable-list__item"
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragEnd={handleDragEnd}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, index)}
        >
          <button type="button" className="sortable-list__handle" aria-label="Arrastar para reordenar" tabIndex={-1}>
            <Icon name="grip-vertical" />
          </button>
          <div className="sortable-list__body">{renderItem(item, index)}</div>
        </div>
      ))}
    </div>
  );
}

export function ConfirmModal({ open, title, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop animate-fade" onClick={onCancel}>
      <div className="modal animate-scale" onClick={e => e.stopPropagation()}>
        <div className="modal__icon"><Icon name="triangle-exclamation" /></div>
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            <Icon name="xmark" /> Cancelar
          </button>
          <button type="button" className="btn btn--danger" onClick={onConfirm}>
            <Icon name="trash" /> Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoadingState({ text = 'Carregando...' }) {
  return (
    <div className="loading-state animate-in">
      <Icon name="spinner" className="fa-spin loading-state__icon" />
      <p>{text}</p>
    </div>
  );
}
