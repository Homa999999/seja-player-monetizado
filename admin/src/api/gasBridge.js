function gasRun(fnName, ...args) {
  return new Promise((resolve, reject) => {
    google.script.run
      .withSuccessHandler(resolve)
      .withFailureHandler((err) => reject(new Error(err?.message || String(err))))
      [fnName](...args);
  });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] || '');
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isGasAdmin() {
  return typeof google !== 'undefined' && google.script && google.script.run;
}

export function getGasToken() {
  return sessionStorage.getItem('pm_gas_token') || localStorage.getItem('pm_token') || '';
}

export function setGasToken(token, user) {
  sessionStorage.setItem('pm_gas_token', token);
  if (user) sessionStorage.setItem('pm_gas_user', user);
  localStorage.setItem('pm_token', token);
}

export function clearGasToken() {
  sessionStorage.removeItem('pm_gas_token');
  sessionStorage.removeItem('pm_gas_user');
  localStorage.removeItem('pm_token');
}

export const gasApi = {
  login: (email, password) => gasRun('loginAdmin', email, password),

  getContent: async () => {
    const data = await gasRun('getAdminContent', getGasToken());
    return data.content;
  },

  saveContent: async (content) => {
    const result = await gasRun('saveAdminContent', getGasToken(), JSON.stringify(content));
    return { updatedAt: result.updatedAt || new Date().toISOString() };
  },

  getStats: async () => {
    const data = await gasRun('getAdminContent', getGasToken());
    return {
      lastUpdate: new Date().toISOString(),
      editableSections: 12,
      siteOnline: data.content?.general?.siteOnline !== false,
      publicContentUrl: data.publicContentUrl
    };
  },

  getHistory: async () => [],

  upload: async (file) => {
    const base64 = await fileToBase64(file);
    return gasRun('uploadAdminImage', getGasToken(), base64, file.name, file.type);
  }
};
