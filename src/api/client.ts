import { BASE_URL } from '../constants/services';

type RequestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RequestOptions {
  method?: RequestMethod;
  body?: any;
  headers?: Record<string, string>;
  timeout?: number;
}

interface ApiError extends Error {
  status?: number;
  data?: any;
}

class APIClient {
  private baseURL: string;
  private defaultTimeout: number = 10000; // 10 segundos

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers, timeout = this.defaultTimeout } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    // Adicionar configuração para aceitar certificados não confiáveis em desenvolvimento
    if (__DEV__) {
      // @ts-ignore
      config.insecure = true;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      console.log(`📡 API ${method}: ${this.baseURL}${endpoint}`);
      
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = new Error(
          errorData.message || 
          errorData.error || 
          `Erro HTTP ${response.status}: ${response.statusText}`
        );
        error.status = response.status;
        error.data = errorData;
        
        console.error(`❌ API Error [${response.status}]:`, error.message);
        throw error;
      }

      const data = await response.json();
      console.log(`✅ API Success: ${method} ${endpoint}`);
      return data as Promise<T>;

    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          const timeoutError: ApiError = new Error('Tempo limite da requisição excedido');
          timeoutError.status = 408;
          throw timeoutError;
        }
        
        if (!navigator.onLine) {
          const networkError: ApiError = new Error('Sem conexão com a internet');
          networkError.status = 0;
          throw networkError;
        }
      }

      console.error(`💥 API Request Failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  public async get<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  public async post<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'POST', body });
  }

  public async put<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PUT', body });
  }

  public async delete<T>(endpoint: string, options: Omit<RequestOptions, 'method' | 'body'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }

  public async patch<T>(endpoint: string, body: any, options: Omit<RequestOptions, 'method'> = {}) {
    return this.request<T>(endpoint, { ...options, method: 'PATCH', body });
  }
}

// Instância padrão do cliente
const apiClient = new APIClient(BASE_URL);

// Função legacy para compatibilidade com código existente
async function api<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, headers, timeout = 20000 } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  };

  // Adicionar configuração para aceitar certificados não confiáveis em desenvolvimento
  if (__DEV__) {
    // @ts-ignore
    config.insecure = true;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    console.log(`📡 API ${method}: ${BASE_URL}${endpoint} (timeout: ${timeout}ms)`);
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Erro inesperado na requisição.');
    }

    return response.json() as Promise<T>;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('Tempo limite da requisição excedido');
      }
      
      if (!navigator.onLine) {
        throw new Error('Sem conexão com a internet');
      }
    }

    console.error(`💥 API Request Failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

export { apiClient as default, api };
export type { ApiError, RequestOptions };
