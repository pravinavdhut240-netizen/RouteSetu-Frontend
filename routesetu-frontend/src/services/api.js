export const authApi = {
  login: async (credentials) => ({ ok: true, ...credentials }),
  signup: async (details) => ({ ok: true, ...details }),
  requestReset: async (identifier) => ({ ok: true, identifier }),
  resetPassword: async (password) => ({ ok: true, password })
};
