import React, { useState } from 'react';

interface AIAnalysisButtonProps {
  videoId: string;
  hasAIAnalysis?: boolean;
  onAnalysisComplete?: () => void;
}

export function AIAnalysisButton({ 
  videoId, 
  hasAIAnalysis = false, 
  onAnalysisComplete 
}: AIAnalysisButtonProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAIAnalysis = async () => {
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult(data.data);
        onAnalysisComplete?.();
        
        // Mostrar notificação de sucesso
        console.log('🚀 Análise AI concluída:', data.data);
      } else {
        console.error('Erro na análise AI:', data.error);
      }
    } catch (error) {
      console.error('Erro ao solicitar análise AI:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (hasAIAnalysis) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <span>✨</span>
        <span>Análise AI concluída</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAIAnalysis}
        disabled={isAnalyzing}
        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg border-none hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAnalyzing ? (
          <>🔄 Analisando com IA...</>
        ) : (
          <>🧠 🚀 Análise INSANA com IA</>
        )}
      </button>

      {result && (
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="space-y-2">
            <h4 className="font-semibold text-purple-800 flex items-center gap-2">
              <span>✨</span>
              Resultado da Análise Híbrida
            </h4>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-blue-600">Hard Skills</div>
                <div className="text-2xl font-bold text-blue-700">{result.hardSkills}</div>
                <div className="text-xs text-gray-500">
                  {result.hybridScores.hardSkillsAccuracy}% precisão
                </div>
              </div>
              
              <div className="bg-white p-3 rounded border">
                <div className="font-medium text-pink-600">Soft Skills</div>
                <div className="text-2xl font-bold text-pink-700">{result.softSkills}</div>
                <div className="text-xs text-gray-500">
                  {result.hybridScores.softSkillsAccuracy}% precisão
                </div>
              </div>
            </div>

            <div className="bg-white p-3 rounded border mt-3">
              <div className="font-medium text-purple-600 mb-2">Insights da IA</div>
              <div className="text-sm space-y-1">
                <div><strong>Perfil:</strong> {result.aiInsights.personalityProfile}</div>
                <div><strong>Pontos Fortes:</strong> {result.aiInsights.strengthsAnalysis}</div>
                <div><strong>Estilo:</strong> {result.aiInsights.communicationStyle}</div>
                <div><strong>Maturidade:</strong> {result.aiInsights.professionalMaturity}/100</div>
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="font-medium text-green-700 mb-1">Conselho de Carreira</div>
              <div className="text-sm text-green-600">{result.aiInsights.careerAdvice}</div>
            </div>

            <div className="text-center mt-3">
              <div className="inline-flex items-center gap-2 bg-purple-100 px-3 py-1 rounded-full text-sm">
                <span>🧠</span>
                <span className="text-purple-700 font-medium">
                  Confiabilidade: {result.hybridScores.overallReliability}%
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 