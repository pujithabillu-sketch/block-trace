const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('blocktrace_jwt_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(role: string, address?: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, address })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('blocktrace_jwt_token', data.token);
      }
      return data;
    } catch (err) {
      console.warn('API login failed, falling back to offline mode:', err);
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Dashboard
  async getDashboard() {
    try {
      const res = await fetch(`${API_BASE_URL}/dashboard`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Products
  async getProducts(params?: Record<string, string>) {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/products${query}`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async getProductById(id: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async registerProduct(productData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(productData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async transferProduct(id: string, transferData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/transfer`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(transferData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async receiveProduct(id: string, receiveData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(id)}/receive`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(receiveData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Participants
  async getParticipants() {
    try {
      const res = await fetch(`${API_BASE_URL}/participants`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async authorizeParticipant(participantData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/participants/authorize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(participantData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async revokeParticipant(wallet: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/participants/${encodeURIComponent(wallet)}/revoke`, {
        method: 'POST',
        headers: getAuthHeaders()
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Blockchain activity
  async getTransactions(params?: Record<string, string>) {
    try {
      const query = params ? '?' + new URLSearchParams(params).toString() : '';
      const res = await fetch(`${API_BASE_URL}/blockchain/transactions${query}`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Recalls
  async getRecalls() {
    try {
      const res = await fetch(`${API_BASE_URL}/recalls`, { headers: getAuthHeaders() });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  async recordRecall(recallData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/recalls`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(recallData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Counterfeit reports
  async reportCounterfeit(reportData: any) {
    try {
      const res = await fetch(`${API_BASE_URL}/reports/counterfeit`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reportData)
      });
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  },

  // Public verification
  async verifyProduct(productId: string) {
    try {
      const res = await fetch(`${API_BASE_URL}/verify/${encodeURIComponent(productId)}`);
      return await res.json();
    } catch (err) {
      return { success: false, error: 'Backend unreachable' };
    }
  }
};
