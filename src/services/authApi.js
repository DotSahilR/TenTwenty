const MOCK_USER = {
  email: "test@tentwenty.com",
  password: "123456",
  token: "abc123_tentwenty_auth_token",
  name: "TenTest"
};

export const authApi = {
  async login(email, password) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (email === MOCK_USER.email && password === MOCK_USER.password) {
      return {
        success: true,
        token: MOCK_USER.token,
        user: {
          email: MOCK_USER.email,
          name: MOCK_USER.name
        }
      };
    } else {
      return {
        success: false,
        message: "Invalid email or password"
      };
    }
  },

  async logout() {
    localStorage.removeItem('authToken');
    sessionStorage.removeItem('authToken');
    return { success: true };
  },

  isAuthenticated() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return token === MOCK_USER.token;
  },

  getStoredToken() {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
  }
};
