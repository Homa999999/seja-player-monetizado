import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, PreviewPanel, SaveBar, LoadingState, ColorInput } from '../components/UI';
import { ButtonsPreview } from '../components/previews/SectionPreviews';

export default function EditorButtons() {
  const { section: btns, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('buttons', 'Botões');

  if (loading || !btns) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  return (
    <div className="editor-page">
      <PageHeader icon="cart-shopping" title="Botões de Compra" description="CTAs e link de checkout." breadcrumb={[{ label: 'Dashboard', to: '/' }, { label: 'Botões CTA' }]} />

      <div className="editor-layout editor-layout--preview-wide">
        <div className="editor-main">
          <Card title="Configuração" icon="sliders" delay={0}>
            <div className="form-grid">
              <Field label="Texto do botão principal"><Input value={btns.checkoutText} onChange={e => update('checkoutText', e.target.value)} /></Field>
              <Field label="Link do checkout (Kiwify)"><Input value={btns.checkoutUrl} onChange={e => update('checkoutUrl', e.target.value)} /></Field>
              <Field label="Cor do botão">
                <ColorInput value={btns.buttonColor || '#10b981'} onChange={(v) => update('buttonColor', v)} label="Cor do botão" />
              </Field>
              <Field label="CTA do header"><Input value={btns.headerCtaText} onChange={e => update('headerCtaText', e.target.value)} /></Field>
              <Field label="CTA sticky (mobile)"><Input value={btns.stickyCtaText} onChange={e => update('stickyCtaText', e.target.value)} /></Field>
              <Field label="CTA final"><Input value={btns.finalCtaText} onChange={e => update('finalCtaText', e.target.value)} /></Field>
            </div>
          </Card>
        </div>

        <PreviewPanel wide>
          <ButtonsPreview buttons={btns} />
        </PreviewPanel>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
