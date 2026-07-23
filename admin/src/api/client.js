import { isGasAdmin, gasApi, getGasToken } from './gasBridge';

const API = '/api';

function getToken() {
  return getGasToken();
}

async function request(path, options = {}) {
  const headers = { ...options.headers };
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));

  if (!res.ok) throw new Error(data.error || 'Erro na requisição');
  return data;
}

const restApi = {
  login: (email, password) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),

  getMe: () => request('/auth/me'),

  getContent: () => request('/content'),

  saveContent: (data, section, summary) =>
    request('/content', {
      method: 'PUT',
      body: JSON.stringify({ data, section, summary })
    }),

  patchSection: (section, patch, summary) =>
    request(`/content/${section}`, {
      method: 'PATCH',
      body: JSON.stringify({ ...patch, _summary: summary })
    }),

  getStats: () => request('/stats'),

  getHistory: () => request('/history'),

  upload: async (file) => {
    const form = new FormData();
    form.append('file', file);
    return request('/upload', { method: 'POST', body: form, headers: {} });
  }
};

function resolveApi() {
  return isGasAdmin() ? gasApi : restApi;
}

export const api = {
  login: (...args) => resolveApi().login(...args),
  getMe: (...args) => resolveApi().getMe(...args),
  getContent: (...args) => resolveApi().getContent(...args),
  saveContent: (...args) => resolveApi().saveContent(...args),
  patchSection: (...args) => resolveApi().patchSection(...args),
  getStats: (...args) => resolveApi().getStats(...args),
  getHistory: (...args) => resolveApi().getHistory(...args),
  upload: (...args) => resolveApi().upload(...args)
};

export { isGasAdmin };
