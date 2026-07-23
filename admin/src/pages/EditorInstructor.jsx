import { useEditor } from '../hooks/useEditor';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import { PageHeader, Card, Field, Input, Textarea, PreviewPanel, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';
import { InstructorPreview } from '../components/previews/SectionPreviews';

export default function EditorInstructor() {
  const { section: inst, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('instructor', 'Professor');
  const { showToast } = useToast();

  if (loading || !inst) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { url } = await api.upload(file);
      update('photo', url);
      showToast('Foto enviada com sucesso!');
    } catch (err) {
      showToast(err.message || 'Erro ao enviar foto.', 'error');
    } finally {
      e.target.value = '';
    }
  }

  return (
    <div className="editor-page">
      <PageHeader icon="user-tie" title="Professor" description="Informações do instrutor do curso." />

      <div className="editor-layout editor-layout--preview-wide">
        <div className="editor-main">
          <Card title="Perfil" icon="id-card" delay={0}>
            <div className="form-grid">
              <Field label="Foto" icon="camera">
                <div className="upload-field">
                  {inst.photo && <img src={resolveMediaUrl(inst.photo)} alt="" className="upload-preview" />}
                  <label className="btn btn--outline btn--sm upload-btn">
                    <Icon name="upload" /> Enviar foto
                    <input type="file" accept="image/*" onChange={handlePhoto} hidden />
                  </label>
                </div>
              </Field>
              <Field label="Nome"><Input value={inst.name} onChange={e => update('name', e.target.value)} /></Field>
              <Field label="Instagram"><Input value={inst.instagram} onChange={e => update('instagram', e.target.value)} /></Field>
              <Field label="Biografia"><Textarea value={inst.bio} onChange={e => update('bio', e.target.value)} /></Field>
              <Field label="Biografia extra"><Textarea value={inst.bioExtra} onChange={e => update('bioExtra', e.target.value)} /></Field>
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

        <PreviewPanel wide>
          <InstructorPreview instructor={inst} />
        </PreviewPanel>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
