import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import Icon from '../components/Icon';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Erro ao entrar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__bg" aria-hidden="true">
        <div className="login-grid" />
        <div className="login-glow login-glow--1" />
        <div className="login-glow login-glow--2" />
        <div className="login-float login-float--1"><Icon name="chart-line" /></div>
        <div className="login-float login-float--2"><Icon name="video" /></div>
        <div className="login-float login-float--3"><Icon name="dollar-sign" /></div>
      </div>

      <div className="login-card animate-scale">
        <div className="login-card__head">
          <Logo />
          <p><Icon name="lock" /> Painel administrativo do curso</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label className="field">
            <span className="field__label"><Icon name="envelope" /> E-mail</span>
            <div className="input-wrap input-wrap--icon">
              <Icon name="at" className="input-wrap__icon" />
              <input
                className="input"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
          </label>

          <label className="field">
            <span className="field__label"><Icon name="key" /> Senha</span>
            <div className="input-wrap input-wrap--icon input-wrap--action">
              <Icon name="lock" className="input-wrap__icon" />
              <input
                className="input"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <button type="button" className="input-wrap__action" onClick={() => setShowPass(v => !v)} tabIndex={-1}>
                <Icon name={showPass ? 'eye-slash' : 'eye'} />
              </button>
            </div>
          </label>

          {error && (
            <div className="login-error animate-shake" role="alert">
              <Icon name="circle-xmark" /> {error}
            </div>
          )}

          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={loading}>
            {loading ? <><Icon name="spinner" className="fa-spin" /> Entrando...</> : <><Icon name="right-to-bracket" /> Entrar</>}
          </button>
        </form>

        <p className="login-note"><Icon name="info-circle" /> Acesso temporário aberto — qualquer e-mail e senha funcionam.</p>
      </div>
    </div>
  );
}
