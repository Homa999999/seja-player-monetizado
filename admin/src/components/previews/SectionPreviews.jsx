import { resolveMediaUrl } from '../../utils/mediaUrl';
import SitePreview from '../SitePreview';
import { BONUS_ICONS, MODULE_ICONS, STAR_SVG, TitleLine, formatPrice, highlightPhrase } from '../../utils/previewHelpers';

const ARROW_ICON = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const DEFAULT_INSTRUCTOR_PHOTO = '/assets/edits/lucas-joao.png';

export function HeroPreview({ hero }) {
  return (
    <SitePreview height={620} maxHeight={820}>
      <section className="hero site-preview-section">
        <div className="hero__bg" aria-hidden="true">
          <div className="hero__overlay" />
          <div className="hero__glow hero__glow--1" />
          <div className="hero__glow hero__glow--2" />
        </div>
        <div className="container hero__layout">
          <div className="hero__content">
            <div className="hero__badge visible">
              <span className="pulse-dot" />
              {hero.badge}
            </div>
            <h1 className="hero__title visible">
              <TitleLine line={hero.titleLine1} accent={hero.titleAccent1} accentClass="hero__title-accent--gold" />
              <TitleLine line={hero.titleLine2} accent={hero.titleAccent2} accentClass="hero__title-accent--green" />
            </h1>
            <p className="hero__subtitle visible">{highlightPhrase(hero.subtitle)}</p>
            <div className="hero__demo visible">
              <div className="hero-vsl">
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#000', borderRadius: 12 }}>
                  <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', color: '#64748b', fontSize: '0.8rem', gap: 4 }}>
                    <span style={{ fontSize: '1.5rem', opacity: 0.5 }}>▶</span>
                    {hero.videoId ? `VSL · ${hero.videoId}` : 'Vídeo VSL'}
                  </div>
                </div>
              </div>
            </div>
            <div className="hero__actions visible">
              <span className="btn btn--primary btn--lg btn--glow">
                <span>{hero.buttonText}</span>
                {ARROW_ICON}
              </span>
            </div>
          </div>
        </div>
      </section>
    </SitePreview>
  );
}

export function ButtonsPreview({ buttons }) {
  return (
    <SitePreview height={520} maxHeight={720} accentColor={buttons.buttonColor}>
      <div className="site-preview-section" style={{ padding: '1rem 0 1.5rem' }}>
        <div className="container">
          <div className="preview-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', background: 'rgba(6,10,18,0.95)', border: '1px solid var(--border-subtle)', borderRadius: 12, marginBottom: '1.25rem' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem' }}>Player Monetizado</span>
            <span className="btn btn--primary btn--sm">{buttons.headerCtaText || 'Comprar'}</span>
          </div>

          <div className="pricing-card glass-card" style={{ marginBottom: '1rem' }}>
            <div className="pricing-card__badge">Oferta de lançamento</div>
            <h3 className="pricing-card__title">Player Monetizado</h3>
            <p className="pricing-card__subtitle">Acesso completo + todos os bônus</p>
            <div className="pricing-card__price">
              <span className="pricing-card__installments">12x de R$ 10,03</span>
              <span className="pricing-card__amount">R$ 97,00 à vista</span>
            </div>
            <span className="btn btn--primary btn--lg btn--glow btn--block">{buttons.checkoutText || 'Comprar agora'}</span>
          </div>

          <div className="sticky-cta visible" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <div className="container sticky-cta__inner">
              <div className="sticky-cta__info">
                <span className="sticky-cta__price">12x R$ 10,03</span>
                <span className="sticky-cta__spots">Turma de lançamento · Garantia 7 dias</span>
              </div>
              <span className="btn btn--primary btn--sm">{buttons.stickyCtaText || buttons.checkoutText}</span>
            </div>
          </div>

          <section className="section section--cta-final" style={{ padding: '1.5rem 0 0' }}>
            <div className="container">
              <div className="cta-final glass-card visible">
                <div className="cta-final__glow" aria-hidden="true" />
                <h2>Pronto para monetizar seus <span className="gradient-text">cortes</span>?</h2>
                <p>Comece agora e posicione seu canal ainda hoje.</p>
                <span className="btn btn--primary btn--lg btn--glow">{buttons.finalCtaText || buttons.checkoutText}</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </SitePreview>
  );
}

export function InstructorPreview({ instructor }) {
  const photo = resolveMediaUrl(instructor.photo) || DEFAULT_INSTRUCTOR_PHOTO;
  return (
    <SitePreview height={640} maxHeight={960}>
      <section className="section section--instructor site-preview-section">
        <div className="container">
          <div className="instructor-grid">
            <div className="instructor-visual visible">
              <div className="instructor-photo glass-card">
                <img src={photo} alt={instructor.name || ''} width="400" height="480" loading="lazy" />
                <div className="instructor-photo__badge">Criador do método</div>
              </div>
            </div>
            <div className="instructor-content visible">
              <span className="section-tag">Quem ensina</span>
              <h2 className="section-title"><span className="gradient-text">{instructor.name}</span></h2>
              {instructor.instagram && (
                <span className="instructor-instagram">{instructor.instagram}</span>
              )}
              <p className="instructor-lead">{instructor.bio}</p>
              {instructor.bioExtra && <p>{instructor.bioExtra}</p>}
              {instructor.highlights?.length > 0 && (
                <ul className="instructor-highlights">
                  {instructor.highlights.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
    </SitePreview>
  );
}

export function CoursePreview({ course }) {
  return (
    <SitePreview height={560} maxHeight={900}>
      <section className="section section--solution site-preview-section">
        <div className="container">
          <div className="solution-grid">
            <div className="solution-content visible">
              {course.tag && <span className="section-tag section-tag--gold">{course.tag}</span>}
              <h2 className="section-title">{course.title}</h2>
              <p className="section-desc">{course.description}</p>
              {course.extraText && <p>{course.extraText}</p>}
              {course.highlightTitle && (
                <div className="solution-highlight">
                  <div className="solution-highlight__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 9H4.5a2.5 2.5 0 010-5H6" /><path d="M18 9h1.5a2.5 2.5 0 000-5H18" /><path d="M4 22h16" /><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" /><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" /><path d="M18 2H6v7a6 6 0 0012 0V2z" /></svg>
                  </div>
                  <div>
                    <strong>{course.highlightTitle}</strong>
                    <p>{course.highlightText}</p>
                  </div>
                </div>
              )}
              {course.items?.length > 0 && (
                <ul className="check-list">
                  {course.items.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              )}
              {course.ctaText && (
                <span className="btn btn--primary btn--lg solution-cta">{course.ctaText}</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </SitePreview>
  );
}

export function ModulesPreview({ modules }) {
  return (
    <SitePreview height={480} maxHeight={900}>
      <section className="section section--modules site-preview-section">
        <div className="container">
          <div className="section-header section-header--center visible">
            {modules.tag && <span className="section-tag">{modules.tag}</span>}
            <h2 className="section-title">{modules.title}</h2>
            <p className="section-desc">{modules.subtitle}</p>
          </div>
          <div className="modules-grid">
            {(modules.items || []).map((m, i) => (
              <article key={m.id || i} className="module-card visible">
                <div className="module-card__number">{m.number}</div>
                <div className="module-card__icon">{MODULE_ICONS[i % MODULE_ICONS.length]}</div>
                <h3>{m.name || 'Novo módulo'}</h3>
                <p>{m.description}</p>
                {m.topics?.length > 0 && (
                  <ul className="module-card__topics">
                    {m.topics.map((t, ti) => <li key={ti}>{t}</li>)}
                  </ul>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </SitePreview>
  );
}

export function TestimonialsPreview({ testimonials }) {
  return (
    <SitePreview height={480} maxHeight={900}>
      <section className="section section--results site-preview-section">
        <div className="container">
          <div className="section-header section-header--center visible">
            {testimonials.tag && <span className="section-tag">{testimonials.tag}</span>}
            <h2 className="section-title">{testimonials.title}</h2>
            <p className="section-desc">{testimonials.subtitle}</p>
          </div>
          <div className="testimonials-track">
            {(testimonials.items || []).slice(0, 3).map((t, i) => (
              <article key={t.id || i} className="testimonial-card glass-card visible">
                <header className="testimonial-card__header">
                  {t.photo ? (
                    <img src={resolveMediaUrl(t.photo)} alt={t.name} className="testimonial-card__avatar" width="56" height="56" loading="lazy" />
                  ) : (
                    <div className="testimonial-card__avatar" style={{ background: 'var(--bg-card)', display: 'grid', placeItems: 'center', fontSize: '1.25rem', color: 'var(--text-muted)' }}>?</div>
                  )}
                  <div className="testimonial-card__author">
                    <strong>{t.name || 'Aluno'}</strong>
                    <span>{t.tagline}</span>
                  </div>
                </header>
                <div className="testimonial-card__stars" aria-label="5 estrelas">
                  {Array.from({ length: 5 }).map((_, si) => <span key={si}>{STAR_SVG}</span>)}
                </div>
                <p>{t.text ? `"${t.text}"` : ''}</p>
              </article>
            ))}
          </div>
          {testimonials.disclaimer && (
            <p className="results-disclaimer visible">{testimonials.disclaimer}</p>
          )}
        </div>
      </section>
    </SitePreview>
  );
}

export function OfferPreview({ offer, checkoutText }) {
  return (
    <SitePreview height={560} maxHeight={960}>
      <div className="site-preview-section">
        {offer.bonuses?.length > 0 && (
          <section className="section section--bonus">
            <div className="container">
              <div className="section-header section-header--center visible">
                <span className="section-tag section-tag--gold">Bônus exclusivos</span>
                <h2 className="section-title">Incluso no seu <span className="gradient-text">acesso</span></h2>
              </div>
              <div className="bonus-grid">
                {offer.bonuses.slice(0, 2).map((b, i) => (
                  <article key={b.id || i} className="bonus-card visible">
                    <div className="bonus-card__value">{b.value}</div>
                    <div className="bonus-card__icon">{BONUS_ICONS[i % BONUS_ICONS.length]}</div>
                    <h3>{b.title || 'Bônus'}</h3>
                    <p>{b.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="section section--pricing">
          <div className="container">
            <div className="pricing-wrapper visible">
              <div className="pricing-card glass-card">
                {offer.badge && <div className="pricing-card__badge">{offer.badge}</div>}
                <h3 className="pricing-card__title">{offer.productName || 'Player Monetizado'}</h3>
                <p className="pricing-card__subtitle">{offer.productSubtitle}</p>
                <div className="pricing-card__price">
                  {offer.installments && <span className="pricing-card__installments">{offer.installments}</span>}
                  {offer.currentPrice && (
                    <span className="pricing-card__amount">{formatPrice(offer.currentPrice)} à vista</span>
                  )}
                </div>
                <span className="btn btn--primary btn--lg btn--glow btn--block">{checkoutText || 'Comprar agora'}</span>
                <div className="pricing-card__secure">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  Pagamento 100% seguro via Kiwify
                </div>
              </div>
              <div className="pricing-guarantee">
                <div className="guarantee-seal">
                  <div className="guarantee-seal__icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div className="guarantee-seal__days">{offer.guaranteeDays || 7}</div>
                  <div className="guarantee-seal__text">DIAS</div>
                </div>
                <h3>Garantia de Risco Zero</h3>
                <p>{offer.guaranteeText}</p>
              </div>
            </div>
            {offer.urgencyText && (
              <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--accent-gold)', fontSize: '0.85rem' }}>{offer.urgencyText}</p>
            )}
          </div>
        </section>
      </div>
    </SitePreview>
  );
}
