import { useEditor } from '../hooks/useEditor';
import { resolveMediaUrl } from '../utils/mediaUrl';
import { api } from '../api/client';
import { PageHeader, Card, Field, Input, SaveBar, LoadingState, Switch } from '../components/UI';
import Icon from '../components/Icon';

export default function EditorSettings() {
  const { content, loading, isDirty, saving, patchContent, handleSave, discard } = useEditor(null, 'Configurações');

  if (loading || !content) return <LoadingState />;

  const general = content.general || {};
  const urgency = content.urgencyBar || {};

  function updateGeneral(field, value) {
    patchContent(prev => ({ ...prev, general: { ...prev.general, [field]: value } }));
  }

  function updateUrgency(field, value) {
    patchContent(prev => ({ ...prev, urgencyBar: { ...prev.urgencyBar, [field]: value } }));
  }

  async function uploadLogo(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await api.upload(file);
    updateGeneral('logo', url);
  }

  async function uploadFavicon(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const { url } = await api.upload(file);
    updateGeneral('favicon', url);
  }

  return (
    <div className="editor-page">
      <PageHeader icon="gear" title="Configurações Gerais" description="Identidade visual e status do site." />

      <Card title="Identidade" icon="palette" delay={0}>
        <div className="form-grid">
          <Field label="Nome do curso"><Input value={general.courseName} onChange={e => updateGeneral('courseName', e.target.value)} /></Field>
          <Field label="E-mail de contato"><Input value={general.contactEmail} onChange={e => updateGeneral('contactEmail', e.target.value)} /></Field>
          <Field label="Logo">
            <div className="upload-field">
              {general.logo && <img src={resolveMediaUrl(general.logo)} alt="" className="upload-preview" />}
              <label className="btn btn--outline btn--sm upload-btn">
                <Icon name="upload" /> Enviar logo
                <input type="file" accept="image/*" onChange={uploadLogo} hidden />
              </label>
            </div>
          </Field>
          <Field label="Favicon">
            <div className="upload-field">
              {general.favicon && <img src={resolveMediaUrl(general.favicon)} alt="" className="upload-preview" style={{ maxWidth: 48 }} />}
              <label className="btn btn--outline btn--sm upload-btn">
                <Icon name="upload" /> Enviar favicon
                <input type="file" accept="image/*,.svg" onChange={uploadFavicon} hidden />
              </label>
            </div>
          </Field>
          <Field label="Site online">
            <Switch
              checked={general.siteOnline !== false}
              onChange={(v) => updateGeneral('siteOnline', v)}
              label={general.siteOnline !== false ? 'Site publicado' : 'Modo manutenção'}
              description="Quando desativado, visitantes veem aviso de manutenção."
            />
          </Field>
        </div>
      </Card>

      <Card title="Barra de urgência" icon="bolt" delay={80}>
        <div className="form-grid">
          <Field label="Badge"><Input value={urgency.badge} onChange={e => updateUrgency('badge', e.target.value)} /></Field>
          <Field label="Texto"><Input value={urgency.text} onChange={e => updateUrgency('text', e.target.value)} /></Field>
        </div>
      </Card>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
