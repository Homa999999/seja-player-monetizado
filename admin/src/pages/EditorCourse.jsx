import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';

export default function EditorCourse() {
  const { section: course, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('course', 'Sobre o Curso');

  if (loading || !course) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  function updateItem(i, value) {
    const items = [...(course.items || [])];
    items[i] = value;
    update('items', items);
  }

  return (
    <div className="editor-page">
      <PageHeader icon="graduation-cap" title="Sobre o Curso" description="Apresentação do método e benefícios." />

      <div className="editor-main">
          <Card title="Informações" icon="circle-info" delay={0}>
            <div className="form-grid">
              <Field label="Tag da seção"><Input value={course.tag} onChange={e => update('tag', e.target.value)} /></Field>
              <Field label="Título"><Input value={course.title} onChange={e => update('title', e.target.value)} /></Field>
              <Field label="Descrição"><Textarea value={course.description} onChange={e => update('description', e.target.value)} /></Field>
              <Field label="Texto complementar"><Textarea value={course.extraText} onChange={e => update('extraText', e.target.value)} /></Field>
              <Field label="Destaque — título"><Input value={course.highlightTitle} onChange={e => update('highlightTitle', e.target.value)} /></Field>
              <Field label="Destaque — texto"><Textarea value={course.highlightText} onChange={e => update('highlightText', e.target.value)} rows={2} /></Field>
              <Field label="Texto do botão CTA"><Input value={course.ctaText} onChange={e => update('ctaText', e.target.value)} /></Field>
            </div>
          </Card>

          <Card title="Lista de benefícios" icon="list-check" delay={80}>
            {(course.items || []).map((item, i) => (
              <div key={i} className="list-editor-row animate-in" style={{ animationDelay: `${i * 40}ms` }}>
                <Input value={item} onChange={e => updateItem(i, e.target.value)} />
                <button type="button" className="btn btn--ghost btn--sm btn--icon" onClick={() => {
                  if (window.confirm('Remover este item?')) update('items', course.items.filter((_, idx) => idx !== i));
                }}><Icon name="trash" /></button>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => update('items', [...(course.items || []), 'Novo benefício'])}>
              <Icon name="plus" /> Adicionar item
            </button>
          </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
