import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, SaveBar, LoadingState } from '../components/UI';

export default function EditorInstructor() {
  const { section: inst, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('instructor', 'Professor');

  if (loading || !inst) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  return (
    <div className="editor-page">
      <PageHeader icon="user-tie" title="Professor" description="Informações do instrutor do curso." />

      <div className="editor-main">
        <Card title="Perfil" icon="id-card" delay={0}>
          <div className="form-grid">
            <Field label="Nome"><Input value={inst.name} onChange={e => update('name', e.target.value)} /></Field>
            <Field label="Instagram"><Input value={inst.instagram} onChange={e => update('instagram', e.target.value)} /></Field>
            <Field label="Biografia" fullWidth><Textarea value={inst.bio} onChange={e => update('bio', e.target.value)} rows={4} /></Field>
            <Field label="Biografia extra" fullWidth><Textarea value={inst.bioExtra} onChange={e => update('bioExtra', e.target.value)} rows={3} /></Field>
          </div>
        </Card>

        <Card title="Destaques" icon="award" delay={80}>
          {(inst.highlights || []).map((h, i) => (
            <div key={i} className="list-editor-row">
              <Input value={h} onChange={e => {
                const highlights = [...inst.highlights];
                highlights[i] = e.target.value;
                update('highlights', highlights);
              }} />
            </div>
          ))}
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
