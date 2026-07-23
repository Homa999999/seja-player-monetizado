import { useState } from 'react';
import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, ConfirmModal, SaveBar, LoadingState, SortableList } from '../components/UI';
import Icon from '../components/Icon';

export default function EditorTestimonials() {
  const { section, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('testimonials', 'Depoimentos');
  const [deleteId, setDeleteId] = useState(null);

  if (loading || !section) return <LoadingState />;

  function save(patch) {
    updateSection(patch);
  }

  function updateItem(i, field, value) {
    save({ items: section.items.map((t, idx) => idx === i ? { ...t, [field]: value } : t) });
  }

  return (
    <div className="editor-page">
      <PageHeader icon="star" title="Depoimentos" description="Gerencie prova social dos alunos." breadcrumb={[{ label: 'Dashboard', to: '/' }, { label: 'Depoimentos' }]} />

      <div className="editor-main">
        <Card title="Cabeçalho" icon="heading" delay={0}>
          <div className="form-grid">
            <Field label="Tag"><Input value={section.tag} onChange={e => save({ tag: e.target.value })} /></Field>
            <Field label="Título"><Input value={section.title} onChange={e => save({ title: e.target.value })} /></Field>
            <Field label="Subtítulo" fullWidth><Input value={section.subtitle} onChange={e => save({ subtitle: e.target.value })} /></Field>
            <Field label="Disclaimer" fullWidth><Input value={section.disclaimer} onChange={e => save({ disclaimer: e.target.value })} /></Field>
          </div>
        </Card>

        <Card title="Depoimentos" icon="comments" delay={80}>
          <SortableList
            items={section.items || []}
            onReorder={(items) => save({ items: items.map((t, idx) => ({ ...t, order: idx })) })}
            renderItem={(t, i) => (
              <div className="repeatable-card">
                <div className="repeatable-card__toolbar">
                  <strong>{t.name || `Depoimento ${i + 1}`}</strong>
                  <button type="button" className="btn btn--danger btn--sm" onClick={() => setDeleteId(t.id)}>
                    <Icon name="trash" /> Excluir
                  </button>
                </div>
                <div className="form-grid">
                  <Field label="Nome"><Input value={t.name} onChange={e => updateItem(i, 'name', e.target.value)} /></Field>
                  <Field label="Tagline"><Input value={t.tagline} onChange={e => updateItem(i, 'tagline', e.target.value)} placeholder="15 min por corte · 100% celular" /></Field>
                  <Field label="Texto do depoimento" fullWidth><Textarea value={t.text} onChange={e => updateItem(i, 'text', e.target.value)} rows={4} /></Field>
                </div>
              </div>
            )}
          />
        </Card>
      </div>

      <ConfirmModal
        open={!!deleteId}
        title="Excluir depoimento?"
        message="Esta ação não pode ser desfeita."
        onConfirm={() => { save({ items: section.items.filter(t => t.id !== deleteId) }); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
