import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, SaveBar, LoadingState } from '../components/UI';

export default function EditorHero() {
  const { section: hero, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('hero', 'Hero');

  if (loading || !hero) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  return (
    <div className="editor-page">
      <PageHeader icon="rocket" title="Hero Section" description="Primeira impressão da sua landing page." />

      <div className="editor-main">
        <Card title="Conteúdo principal" icon="align-left" delay={0}>
          <div className="form-grid">
            <Field label="Badge" icon="certificate"><Input icon="certificate" value={hero.badge} onChange={e => update('badge', e.target.value)} /></Field>
            <Field label="Título — linha 1"><Input value={hero.titleLine1} onChange={e => update('titleLine1', e.target.value)} /></Field>
            <Field label="Destaque linha 1"><Input value={hero.titleAccent1} onChange={e => update('titleAccent1', e.target.value)} /></Field>
            <Field label="Título — linha 2"><Input value={hero.titleLine2} onChange={e => update('titleLine2', e.target.value)} /></Field>
            <Field label="Destaque linha 2"><Input value={hero.titleAccent2} onChange={e => update('titleAccent2', e.target.value)} /></Field>
            <Field label="Subtítulo" hint="Texto abaixo do título principal." fullWidth>
              <Textarea value={hero.subtitle} onChange={e => update('subtitle', e.target.value)} rows={4} />
            </Field>
            <Field label="ID do vídeo (VTurb)" icon="video" hint="Ex: vid-6a0911f9f38f377fba3e82ea" fullWidth>
              <Input value={hero.videoId} onChange={e => update('videoId', e.target.value)} />
            </Field>
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
