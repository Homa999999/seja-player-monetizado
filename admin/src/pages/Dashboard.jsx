import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { PageHeader, Card } from '../components/UI';
import Icon from '../components/Icon';

const CARDS = [
  { to: '/hero', title: 'Editar Página', desc: 'Hero, textos principais e vídeo', icon: 'pen-to-square', color: '#10b981' },
  { to: '/depoimentos', title: 'Gerenciar Depoimentos', desc: 'Adicionar, editar e reordenar', icon: 'star', color: '#f59e0b' },
  { to: '/oferta', title: 'Configurar Oferta', desc: 'Preços, bônus e urgência', icon: 'tags', color: '#8b5cf6' },
  { to: '/configuracoes', title: 'Configurações Gerais', desc: 'Logo, favicon e identidade', icon: 'gear', color: '#3b82f6' }
];

function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current || !target) return;
    started.current = true;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) requestAnimationFrame(tick);
      else setValue(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.getStats().then(setStats).catch(() => setStats({
      lastUpdate: new Date().toISOString(),
      editableSections: 8,
      siteOnline: true
    }));
  }, []);

  const sectionCount = useCountUp(stats?.editableSections ?? 8);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div>
      <PageHeader
        icon="house"
        title={`${greeting()}, ${user?.name || 'Admin'}`}
        description="Gerencie sua landing page de vendas sem mexer no código."
      />

      <div className="stats-grid">
        <Card className="stat-card-widget stat-card-widget--animated" icon="clock" delay={0}>
          <span className="stat-card-widget__label">Última atualização</span>
          <strong>{stats ? new Date(stats.lastUpdate).toLocaleString('pt-BR') : '—'}</strong>
        </Card>
        <Card className="stat-card-widget stat-card-widget--animated" icon="table-columns" delay={80}>
          <span className="stat-card-widget__label">Seções editáveis</span>
          <strong className="stat-count">{sectionCount}</strong>
        </Card>
        <Card className="stat-card-widget stat-card-widget--animated" icon="signal" delay={160}>
          <span className="stat-card-widget__label">Status do site</span>
          <strong className={`stat-status${stats?.siteOnline !== false ? ' stat-status--online' : ''}`}>
            <span className="stat-status__dot" />
            {stats?.siteOnline !== false ? 'Online' : 'Offline'}
          </strong>
        </Card>
      </div>

      <div className="dash-cards">
        {CARDS.map((card, i) => (
          <Link key={card.to} to={card.to} className="dash-card animate-in" style={{ animationDelay: `${200 + i * 80}ms` }}>
            <span className="dash-card__icon" style={{ background: `${card.color}22`, color: card.color }}>
              <Icon name={card.icon} />
            </span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
            <span className="dash-card__arrow"><Icon name="chevron-right" /></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
