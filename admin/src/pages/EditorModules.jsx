import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, PreviewPanel, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';
import { ModulesPreview } from '../components/previews/SectionPreviews';

function newModule(num) {
  return { id: crypto.randomUUID(), number: String(num).padStart(2, '0'), name: '', description: '', topics: [''] };
}

export default function EditorModules() {
  const { section: mod, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('modules', 'Módulos');

  if (loading || !mod) return <LoadingState />;

  function saveItems(items) {
    updateSection({ items });
  }

  function updateModule(i, field, value) {
    saveItems(mod.items.map((m, idx) => idx === i ? { ...m, [field]: value } : m));
  }

  function updateTopic(mi, ti, value) {
    saveItems(mod.items.map((m, idx) => {
      if (idx !== mi) return m;
      const topics = [...m.topics];
      topics[ti] = value;
      return { ...m, topics };
    }));
  }

  return (
    <div className="editor-page">
      <PageHeader icon="layer-group" title="Módulos do Curso" description="Organize o conteúdo do treinamento." />

      <div className="editor-layout editor-layout--preview-wide">
        <div className="editor-main">
          <Card title="Cabeçalho da seção" icon="heading" delay={0}>
            <div className="form-grid">
              <Field label="Tag"><Input value={mod.tag} onChange={e => updateSection({ tag: e.target.value })} /></Field>
              <Field label="Título"><Input value={mod.title} onChange={e => updateSection({ title: e.target.value })} /></Field>
              <Field label="Subtítulo"><Input value={mod.subtitle} onChange={e => updateSection({ subtitle: e.target.value })} /></Field>
            </div>
          </Card>

          {mod.items?.map((m, i) => (
            <Card key={m.id || i} title={`Módulo ${m.number}`} icon="book" delay={80 + i * 40} className="module-editor">
              <div className="form-grid">
                <Field label="Número"><Input value={m.number} onChange={e => updateModule(i, 'number', e.target.value)} /></Field>
                <Field label="Nome"><Input value={m.name} onChange={e => updateModule(i, 'name', e.target.value)} /></Field>
                <Field label="Descrição"><Textarea value={m.description} onChange={e => updateModule(i, 'description', e.target.value)} /></Field>
              </div>
              <p className="field__label"><Icon name="list" /> Tópicos</p>
              {m.topics?.map((t, ti) => (
                <div key={ti} className="list-editor-row">
                  <Input value={t} onChange={e => updateTopic(i, ti, e.target.value)} />
                </div>
              ))}
              <div className="module-editor__actions">
                <button type="button" className="btn btn--ghost btn--sm" onClick={() => updateModule(i, 'topics', [...m.topics, 'Novo tópico'])}>
                  <Icon name="plus" /> Tópico
                </button>
                <button type="button" className="btn btn--danger btn--sm" onClick={() => {
                  if (window.confirm('Excluir este módulo?')) saveItems(mod.items.filter((_, idx) => idx !== i));
                }}>
                  <Icon name="trash" /> Excluir módulo
                </button>
              </div>
            </Card>
          ))}

          <button type="button" className="btn btn--primary" onClick={() => saveItems([...mod.items, newModule(mod.items.length + 1)])}>
            <Icon name="plus" /> Adicionar módulo
          </button>
        </div>

        <PreviewPanel wide>
          <ModulesPreview modules={mod} />
        </PreviewPanel>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
