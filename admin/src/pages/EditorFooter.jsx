import { useEditor } from '../hooks/useEditor';
import { PageHeader, Card, Field, Input, SortableList, SaveBar, LoadingState } from '../components/UI';
import Icon from '../components/Icon';

const CRUMB = [{ label: 'Dashboard', to: '/' }, { label: 'Rodapé' }];

function newLink() {
  return { id: crypto.randomUUID(), label: '', url: '' };
}

export default function EditorFooter() {
  const { section, loading, isDirty, saving, updateSection, handleSave, discard } = useEditor('footer', 'Rodapé');

  if (loading || !section) return <LoadingState />;

  function save(patch) {
    updateSection(patch);
  }

  function updateLink(i, field, value) {
    save({ links: section.links.map((link, idx) => idx === i ? { ...link, [field]: value } : link) });
  }

  return (
    <div className="editor-page">
      <PageHeader
        icon="window-minimize"
        title="Rodapé"
        description="Textos e links exibidos no final do site."
        breadcrumb={CRUMB}
      />

      <Card title="Conteúdo" icon="align-left" delay={0}>
        <div className="form-grid">
          <Field label="Frase da marca"><Input value={section.tagline} onChange={e => save({ tagline: e.target.value })} /></Field>
          <Field label="Copyright"><Input value={section.copyright} onChange={e => save({ copyright: e.target.value })} /></Field>
        </div>
      </Card>

      <Card title="Links do rodapé" icon="link" delay={80}>
        <SortableList
          items={section.links || []}
          onReorder={(links) => save({ links })}
          renderItem={(link, i) => (
            <div className="form-grid repeatable-card__fields">
              <Field label="Texto"><Input value={link.label} onChange={e => updateLink(i, 'label', e.target.value)} /></Field>
              <Field label="URL"><Input value={link.url} onChange={e => updateLink(i, 'url', e.target.value)} placeholder="contato.html" /></Field>
            </div>
          )}
        />
        <button type="button" className="btn btn--outline btn--sm" onClick={() => save({ links: [...(section.links || []), newLink()] })}>
          <Icon name="plus" /> Adicionar link
        </button>
      </Card>

      <SaveBar isDirty={isDirty} saving={saving} onSave={handleSave} onDiscard={discard} />
    </div>
  );
}
