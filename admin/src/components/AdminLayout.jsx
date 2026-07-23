import { useEffect, useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useContent } from '../context/ContentContext';
import Logo from './Logo';
import Icon from './Icon';
import PageTransition from './PageTransition';

const NAV_GROUPS = [
  {
    label: 'Visão geral',
    items: [
      { to: '/', label: 'Dashboard', icon: 'chart-pie', end: true }
    ]
  },
  {
    label: 'Landing page',
    items: [
      { to: '/hero', label: 'Hero', icon: 'rocket' },
      { to: '/curso', label: 'Sobre / Benefícios', icon: 'graduation-cap' },
      { to: '/modulos', label: 'Módulos', icon: 'layer-group' },
      { to: '/professor', label: 'Professor', icon: 'user-tie' },
      { to: '/depoimentos', label: 'Depoimentos', icon: 'star' },
      { to: '/oferta', label: 'Oferta', icon: 'tags' },
      { to: '/faq', label: 'FAQ', icon: 'circle-question' },
      { to: '/botoes', label: 'Botões CTA', icon: 'cart-shopping' }
    ]
  },
  {
    label: 'Site',
    items: [
      { to: '/contato', label: 'Contato', icon: 'address-book' },
      { to: '/rodape', label: 'Rodapé', icon: 'window-minimize' },
      { to: '/configuracoes', label: 'Configurações', icon: 'gear' },
      { to: '/historico', label: 'Histórico', icon: 'clock-rotate-left' }
    ]
  }
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { saving, isDirty, lastSaved } = useContent();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.classList.toggle('admin-sidebar-open', sidebarOpen);
    return () => document.body.classList.remove('admin-sidebar-open');
  }, [sidebarOpen]);

  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 900) setSidebarOpen(false);
    }
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <div className={`admin-shell${sidebarOpen ? ' admin-shell--sidebar-open' : ''}`}>
      <button
        type="button"
        className="sidebar-edge-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
        aria-expanded={sidebarOpen}
      >
        <Icon name="chevron-right" />
      </button>

      <button
        type="button"
        className="sidebar-backdrop"
        aria-label="Fechar menu"
        onClick={() => setSidebarOpen(false)}
        tabIndex={sidebarOpen ? 0 : -1}
      />

      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar__head">
          <Logo size="sm" />
          <span className="admin-sidebar__badge"><Icon name="shield-halved" /> CMS</span>
          <button
            type="button"
            className="sidebar-close-btn"
            onClick={() => setSidebarOpen(false)}
            aria-label="Fechar menu"
          >
            <Icon name="chevron-left" />
          </button>
        </div>
        <nav className="admin-nav">
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="admin-nav__group">
              <span className="admin-nav__group-label">{group.label}</span>
              {group.items.map((item, i) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}
                  style={{ animationDelay: `${i * 24}ms` }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="admin-nav__icon"><Icon name={item.icon} /></span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
        <div className="admin-sidebar__foot">
          <div className="admin-user">
            <div className="admin-user__avatar">{user?.name?.[0]?.toUpperCase() || 'A'}</div>
            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <small>{user?.email}</small>
            </div>
          </div>
          <button type="button" className="btn btn--ghost btn--sm btn--block" onClick={() => { logout(); navigate('/login'); }}>
            <Icon name="right-from-bracket" /> Sair
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-main__mesh" aria-hidden="true" />
        <header className="admin-topbar">
          <div className="admin-topbar__start">
            <button
              type="button"
              className="sidebar-toggle btn btn--ghost btn--icon"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label={sidebarOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={sidebarOpen}
            >
              <Icon name={sidebarOpen ? 'chevron-left' : 'chevron-right'} />
            </button>
            <div className="admin-topbar__status">
            {saving && (
              <span className="status-pill status-pill--saving">
                <Icon name="spinner" className="fa-spin" /> Salvando...
              </span>
            )}
            {!saving && isDirty && (
              <span className="status-pill status-pill--dirty">
                <Icon name="circle-exclamation" /> Alterações não salvas
              </span>
            )}
            {!saving && !isDirty && lastSaved && (
              <span className="status-pill status-pill--saved">
                <Icon name="circle-check" /> Salvo
              </span>
            )}
            </div>
          </div>
        </header>
        <main className="admin-content">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
