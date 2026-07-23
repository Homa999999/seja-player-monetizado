import { useState } from 'react';
import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, SortableList, ConfirmModal, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';

const CRUMB = [{ label: 'Dashboard', to: '/' }, { label: 'FAQ' }];

function newFaqItem() {
  return { id: crypto.randomUUID(), question: '', answer: '' };
}

export default function EditorFAQ() {
  const { section, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('faq', 'FAQ');
  const [deleteId, setDeleteId] = useState(null);

  if (loading || !section) return <LoadingState />;

  function save(patch) {
    updateSection(patch);
  }

  function updateItem(i, field, value) {
    save({ items: section.items.map((item, idx) => idx === i ? { ...item, [field]: value } : item) });
  }

  return (
    <div className="editor-page">
      <PageHeader
        icon="circle-question"
        title="FAQ"
        description="Perguntas frequentes exibidas na landing page."
        breadcrumb={CRUMB}
      />

      <Card title="Cabeçalho da seção" icon="heading" delay={0}>
        <div className="form-grid">
          <Field label="Tag"><Input value={section.tag} onChange={e => save({ tag: e.target.value })} /></Field>
          <Field label="Título"><Input value={section.title} onChange={e => save({ title: e.target.value })} /></Field>
          <Field label="Destaque no título"><Input value={section.titleAccent} onChange={e => save({ titleAccent: e.target.value })} placeholder="frequentes" /></Field>
        </div>
      </Card>

      <Card title="Perguntas e respostas" icon="list" delay={80}>
        <SortableList
          items={section.items || []}
          onReorder={(items) => save({ items })}
          renderItem={(item, i) => (
            <div className="repeatable-card">
              <div className="repeatable-card__toolbar">
                <strong>Pergunta {i + 1}</strong>
                <button type="button" className="btn btn--danger btn--sm" onClick={() => setDeleteId(item.id)}>
                  <Icon name="trash" /> Remover
                </button>
              </div>
              <div className="form-grid">
                <Field label="Pergunta"><Input value={item.question} onChange={e => updateItem(i, 'question', e.target.value)} /></Field>
                <Field label="Resposta"><Textarea value={item.answer} onChange={e => updateItem(i, 'answer', e.target.value)} rows={3} /></Field>
              </div>
            </div>
          )}
        />
        <button type="button" className="btn btn--primary" onClick={() => save({ items: [...(section.items || []), newFaqItem()] })}>
          <Icon name="plus" /> Adicionar pergunta
        </button>
      </Card>

      <ConfirmModal
        open={!!deleteId}
        title="Excluir pergunta?"
        message="Esta ação não pode ser desfeita."
        onConfirm={() => { save({ items: section.items.filter(item => item.id !== deleteId) }); setDeleteId(null); }}
        onCancel={() => setDeleteId(null)}
      />

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
