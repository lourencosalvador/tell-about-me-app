import { BASE_URL } from '../../constants/services';

export async function testServerConnectivity(): Promise<{
  isConnected: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Testando conectividade com servidor...');
    
    // Criar AbortController manualmente para compatibilidade com React Native
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos
    
    const response = await fetch(`${BASE_URL}/users/e40d5be4-bbed-483a-b63a-5555e8ce9257/videos`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': 'true', // Para evitar warning do ngrok
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    if (response.ok) {
      console.log(`✅ Servidor respondeu em ${responseTime}ms`);
      return {
        isConnected: true,
        responseTime,
      };
    } else {
      console.log(`⚠️ Servidor respondeu com erro: ${response.status}`);
      return {
        isConnected: false,
        responseTime,
        error: `HTTP ${response.status}`,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      console.log(`❌ Timeout de conectividade (${responseTime}ms)`);
      return {
        isConnected: false,
        responseTime,
        error: 'Timeout de conexão',
      };
    }
    
    console.log(`❌ Erro de conectividade: ${error} (${responseTime}ms)`);
    
    return {
      isConnected: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

export async function testSpecificEndpoint(endpoint: string, timeout: number = 5000): Promise<{
  success: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    console.log(`🔍 Testando endpoint: ${endpoint}`);
    
    // Usar AbortController compatível com React Native
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`${BASE_URL}/${endpoint}`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
    
    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;
    
    return {
      success: response.ok,
      responseTime,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        responseTime,
        error: 'Timeout de conexão',
      };
    }
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
} 