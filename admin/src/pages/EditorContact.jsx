import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, Textarea, Switch, SaveBar, LoadingState } from '../components/UI';

const CRUMB = [{ label: 'Dashboard', to: '/' }, { label: 'Contato' }];

export default function EditorContact() {
  const { section, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('contact', 'Contato');

  if (loading || !section) return <LoadingState />;

  function save(patch) {
    updateSection(patch);
  }

  function updateWhatsApp(field, value) {
    save({ whatsapp: { ...section.whatsapp, [field]: value } });
  }

  function updateInstagram(field, value) {
    save({ instagram: { ...section.instagram, [field]: value } });
  }

  return (
    <div className="editor-page">
      <PageHeader
        icon="address-book"
        title="Contato"
        description="Informações da página de contato e canais de atendimento."
        breadcrumb={CRUMB}
      />

      <Card title="Página de contato" icon="file-lines" delay={0}>
        <div className="form-grid">
          <Field label="Título da página"><Input value={section.pageTitle} onChange={e => save({ pageTitle: e.target.value })} /></Field>
          <Field label="Texto introdutório"><Textarea value={section.lead} onChange={e => save({ lead: e.target.value })} rows={2} /></Field>
        </div>
      </Card>

      <Card title="WhatsApp" icon="whatsapp" delay={80}>
        <Switch
          checked={section.whatsapp?.enabled !== false}
          onChange={(v) => updateWhatsApp('enabled', v)}
          label="Exibir card do WhatsApp"
          description="Botão com mensagem pré-definida na página de contato."
        />
        <div className="form-grid" style={{ marginTop: '1rem' }}>
          <Field label="Telefone (com DDI)"><Input value={section.whatsapp?.phone} onChange={e => updateWhatsApp('phone', e.target.value)} placeholder="5511999999999" /></Field>
          <Field label="Texto do botão"><Input value={section.whatsapp?.buttonText} onChange={e => updateWhatsApp('buttonText', e.target.value)} /></Field>
          <Field label="Mensagem pré-definida"><Textarea value={section.whatsapp?.message} onChange={e => updateWhatsApp('message', e.target.value)} rows={3} /></Field>
        </div>
      </Card>

      <Card title="Instagram" icon="instagram" delay={160}>
        <Switch
          checked={section.instagram?.enabled !== false}
          onChange={(v) => updateInstagram('enabled', v)}
          label="Exibir card do Instagram"
        />
        <div className="form-grid" style={{ marginTop: '1rem' }}>
          <Field label="Usuário"><Input value={section.instagram?.handle} onChange={e => updateInstagram('handle', e.target.value)} placeholder="@usuario" /></Field>
          <Field label="URL"><Input value={section.instagram?.url} onChange={e => updateInstagram('url', e.target.value)} placeholder="https://instagram.com/..." /></Field>
        </div>
      </Card>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
