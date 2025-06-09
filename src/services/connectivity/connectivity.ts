import { BASE_URL } from '../../constants/services';

export async function testServerConnectivity(): Promise<{
  isConnected: boolean;
  responseTime: number;
  error?: string;
}> {
  const startTime = Date.now();
  
  try {
    console.log('🔍 Testando conectividade com servidor...');
    
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000), // 5 segundos apenas para teste
    });
    
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
    
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      signal: AbortSignal.timeout(timeout),
    });
    
    const responseTime = Date.now() - startTime;
    
    return {
      success: response.ok,
      responseTime,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      success: false,
      responseTime,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
} 