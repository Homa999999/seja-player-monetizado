import { useEffect } from 'react';
import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, SaveBar, LoadingState, Switch } from '../components/UI';

const DEFAULT_PHONE = '5511995791061';

export default function EditorSettings() {
  const { content, loading, isDirty, saving, patchContent, handleSave, discard } = useEditor(null, 'Configurações');

  useEffect(() => {
    if (!content?.general || content.general.contactPhone) return;
    patchContent(prev => ({
      ...prev,
      general: { ...prev.general, contactPhone: DEFAULT_PHONE }
    }));
  }, [content, patchContent]);

  if (loading || !content) return <LoadingState />;

  const general = content.general || {};
  const urgency = content.urgencyBar || {};
  const siteOnline = general.siteOnline !== false;

  function updateGeneral(field, value) {
    patchContent(prev => ({ ...prev, general: { ...prev.general, [field]: value } }));
  }

  function updateUrgency(field, value) {
    patchContent(prev => ({ ...prev, urgencyBar: { ...prev.urgencyBar, [field]: value } }));
  }

  return (
    <div className="editor-page">
      <PageHeader icon="gear" title="Configurações Gerais" description="Contato e status do site." />

      <div className="editor-main">
        <Card title="Identidade" icon="palette" delay={0}>
          <div className="form-grid">
            <Field label="Nome do curso"><Input value={general.courseName} onChange={e => updateGeneral('courseName', e.target.value)} /></Field>
            <Field label="E-mail de contato"><Input type="email" value={general.contactEmail} onChange={e => updateGeneral('contactEmail', e.target.value)} /></Field>
            <Field label="Telefone" hint="Com DDI, apenas números. Ex: 5511999999999">
              <Input
                type="tel"
                inputMode="numeric"
                value={general.contactPhone || DEFAULT_PHONE}
                onChange={e => updateGeneral('contactPhone', e.target.value.replace(/\D/g, ''))}
                placeholder={DEFAULT_PHONE}
              />
            </Field>
          </div>

          <div className="field field--full field--switch">
            <span className="field__label">Status do site</span>
            <Switch
              checked={siteOnline}
              onChange={(v) => updateGeneral('siteOnline', v)}
              label={siteOnline ? 'Site publicado' : 'Modo manutenção'}
              description="Quando desativado, visitantes veem aviso de manutenção."
            />
          </div>
        </Card>

        <Card title="Barra de urgência" icon="bolt" delay={80}>
          <div className="form-grid">
            <Field label="Badge"><Input value={urgency.badge} onChange={e => updateUrgency('badge', e.target.value)} /></Field>
            <Field label="Texto" fullWidth><Input value={urgency.text} onChange={e => updateUrgency('text', e.target.value)} /></Field>
          </div>
        </Card>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
