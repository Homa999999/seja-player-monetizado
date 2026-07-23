import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PageHeader, Card, LoadingState } from '../components/UI';
import Icon from '../components/Icon';

const SECTION_ICONS = {
  hero: 'rocket',
  course: 'graduation-cap',
  modules: 'layer-group',
  instructor: 'user-tie',
  testimonials: 'star',
  offer: 'tags',
  buttons: 'cart-shopping',
  general: 'gear',
  urgencyBar: 'bolt'
};

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getHistory().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState text="Carregando histórico..." />;

  return (
    <div>
      <PageHeader icon="clock-rotate-left" title="Histórico de Alterações" description="Registro das últimas edições no painel." />

      <Card delay={0}>
        {items.length === 0 ? (
          <div className="empty-state">
            <Icon name="inbox" className="empty-state__icon" />
            <p>Nenhuma alteração registrada ainda.</p>
          </div>
        ) : (
          <ul className="history-list">
            {items.map((item, i) => (
              <li key={item.id} className="history-item animate-in" style={{ animationDelay: `${i * 50}ms` }}>
                <span className="history-item__icon">
                  <Icon name={SECTION_ICONS[item.section] || 'pen'} />
                </span>
                <div className="history-item__body">
                  <strong>{item.section}</strong>
                  <span>{item.summary}</span>
                </div>
                <time><Icon name="clock" /> {new Date(item.createdAt).toLocaleString('pt-BR')}</time>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
