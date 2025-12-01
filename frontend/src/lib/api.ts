const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Get token from localStorage
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Set token in localStorage
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove token from localStorage
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// API client with auth header
const apiClient = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with any custom headers
  if (options.headers) {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || 'Request failed');
  }

  return response.json();
};

// Auth API calls
export const authAPI = {
  signup: async (data: { name: string; email: string; password: string }) => {
    return apiClient('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: async (data: { email: string; password: string }) => {
    return apiClient('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  getProfile: async () => {
    return apiClient('/api/auth/profile');
  },
};

// Todo API calls
export const todoAPI = {
  getAll: async () => {
    return apiClient('/api/todos');
  },

  create: async (title: string) => {
    return apiClient('/api/todos', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  update: async (id: number, completed: boolean) => {
    return apiClient(`/api/todos/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ completed }),
    });
  },

  delete: async (id: number) => {
    return apiClient(`/api/todos/${id}`, {
      method: 'DELETE',
    });
  },
};
