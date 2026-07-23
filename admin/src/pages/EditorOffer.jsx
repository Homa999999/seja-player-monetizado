import { useEditor } from '../hooks/useEditor';
import { useContent } from '../context/ContentContext';
import { PageHeader, Card, Field, Input, Textarea, PreviewPanel, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';
import { OfferPreview } from '../components/previews/SectionPreviews';

export default function EditorOffer() {
  const { section: offer, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('offer', 'Oferta');
  const { content } = useContent();
  const checkoutText = content?.buttons?.checkoutText;

  if (loading || !offer) return <LoadingState />;

  function update(field, value) {
    updateSection({ [field]: value });
  }

  function updateBonus(i, field, value) {
    update('bonuses', offer.bonuses.map((b, idx) => idx === i ? { ...b, [field]: value } : b));
  }

  return (
    <div className="editor-page">
      <PageHeader icon="tags" title="Oferta" description="Preços, bônus, garantia e urgência." />

      <div className="editor-layout editor-layout--preview-wide">
        <div className="editor-main">
          <Card title="Preços" icon="dollar-sign" delay={0}>
            <div className="form-grid">
              <Field label="Preço antigo (riscado)"><Input value={offer.oldPrice} onChange={e => update('oldPrice', e.target.value)} placeholder="297" /></Field>
              <Field label="Preço atual"><Input value={offer.currentPrice} onChange={e => update('currentPrice', e.target.value)} placeholder="97,00" /></Field>
              <Field label="Parcelamento"><Input value={offer.installments} onChange={e => update('installments', e.target.value)} /></Field>
              <Field label="Preço sticky (barra fixa)"><Input value={offer.stickyPrice} onChange={e => update('stickyPrice', e.target.value)} placeholder="12x R$ 10,03" /></Field>
              <Field label="Desconto (%)"><Input type="number" value={offer.discountPercent} onChange={e => update('discountPercent', Number(e.target.value))} /></Field>
              <Field label="Garantia (dias)"><Input type="number" value={offer.guaranteeDays} onChange={e => update('guaranteeDays', Number(e.target.value))} /></Field>
              <Field label="Texto de urgência"><Input value={offer.urgencyText} onChange={e => update('urgencyText', e.target.value)} placeholder="Últimas vagas disponíveis" /></Field>
              <Field label="Texto da garantia"><Textarea value={offer.guaranteeText} onChange={e => update('guaranteeText', e.target.value)} rows={3} /></Field>
            </div>
          </Card>

          <Card title="Produto" icon="box" delay={80}>
            <div className="form-grid">
              <Field label="Nome do produto"><Input value={offer.productName} onChange={e => update('productName', e.target.value)} /></Field>
              <Field label="Subtítulo"><Input value={offer.productSubtitle} onChange={e => update('productSubtitle', e.target.value)} /></Field>
              <Field label="Badge"><Input value={offer.badge} onChange={e => update('badge', e.target.value)} /></Field>
            </div>
          </Card>

          <Card title="Bônus inclusos" icon="gift" delay={160}>
            {offer.bonuses?.map((b, i) => (
              <div key={b.id || i} className="bonus-editor animate-in" style={{ animationDelay: `${i * 40}ms` }}>
                <Field label="Valor"><Input value={b.value} onChange={e => updateBonus(i, 'value', e.target.value)} /></Field>
                <Field label="Título"><Input value={b.title} onChange={e => updateBonus(i, 'title', e.target.value)} /></Field>
                <Field label="Descrição"><Textarea value={b.description} onChange={e => updateBonus(i, 'description', e.target.value)} rows={2} /></Field>
              </div>
            ))}
            <button type="button" className="btn btn--outline btn--sm" onClick={() => update('bonuses', [...(offer.bonuses || []), { id: crypto.randomUUID(), value: 'R$ 0,00', title: '', description: '' }])}>
              <Icon name="plus" /> Bônus
            </button>
          </Card>
        </div>

        <PreviewPanel wide>
          <OfferPreview offer={offer} checkoutText={checkoutText} />
        </PreviewPanel>
      </div>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
