import { useToast } from '@/src/components/Toast/ToastContext';

export const useToastHelpers = () => {
  const { showToast } = useToast();

  const showSuccess = (title: string, message: string) => {
    showToast({
      type: 'success',
      title,
      description: message,
      duration: 4000,
    });
  };

  const showError = (title: string, message: string) => {
    showToast({
      type: 'error',
      title,
      description: message,
      duration: 5000,
    });
  };

  const showWarning = (title: string, message: string) => {
    showToast({
      type: 'warning',
      title,
      description: message,
      duration: 4000,
    });
  };

  const showInfo = (title: string, message: string) => {
    showToast({
      type: 'info',
      title,
      description: message,
      duration: 3000,
    });
  };

  const showPersistent = (
    type: 'success' | 'error' | 'warning' | 'info',
    title: string,
    description?: string,
    action?: { label: string; onPress: () => void }
  ) => {
    showToast({
      type,
      title,
      description,
      action,
      duration: 0, // Não auto-dismiss
    });
  };

  // Toasts específicos para Upload
  const showUploadSuccess = (message: string) => {
    showToast({
      type: 'success',
      title: 'Upload Concluído!',
      description: message,
      duration: 4000,
    });
  };

  const showUploadError = (message: string) => {
    showToast({
      type: 'error',
      title: 'Erro no Upload',
      description: message,
      duration: 5000,
    });
  };

  // Toast específico para Recomendações
  const showRecommendationReady = (message: string) => {
    showToast({
      type: 'success',
      title: 'Recomendação Pronta! 🎯',
      description: message,
      duration: 5000,
    });
  };

  // Toasts específicos para CV
  const showCVGenerating = () => {
    showToast({
      type: 'info',
      title: 'Gerando Currículo...',
      description: 'Por favor, aguarde enquanto criamos seu CV profissional',
      duration: 8000,
    });
  };

  const showCVSuccess = () => {
    showToast({
      type: 'success',
      title: 'CV Gerado com Sucesso! 🎉',
      description: 'Seu currículo profissional está pronto para compartilhar',
      duration: 6000,
    });
  };

  const showCVError = (message: string) => {
    showToast({
      type: 'error',
      title: 'Erro na Geração do CV',
      description: message,
      duration: 5000,
    });
  };

  const showPhotoRequired = () => {
    showToast({
      type: 'warning',
      title: 'Foto Profissional Necessária',
      description: 'Adicione uma foto profissional para valorizar seu currículo',
      duration: 4000,
    });
  };

  const showDataIncomplete = () => {
    showToast({
      type: 'warning',
      title: 'Dados Incompletos',
      description: 'Preencha pelo menos telefone e LinkedIn para continuar',
      duration: 4000,
    });
  };

  const showPhotoSelected = () => {
    showToast({
      type: 'success',
      title: 'Foto Selecionada!',
      description: 'Foto profissional adicionada com sucesso',
      duration: 3000,
    });
  };

  // Toasts específicos para Favoritos
  const showFavoriteAdded = () => {
    showToast({
      type: 'success',
      title: 'Adicionado aos Favoritos! ❤️',
      description: 'Vídeo salvo na sua lista de favoritos',
      duration: 3000,
    });
  };

  const showFavoriteRemoved = () => {
    showToast({
      type: 'info',
      title: 'Removido dos Favoritos',
      description: 'Vídeo removido da sua lista de favoritos',
      duration: 3000,
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPersistent,
    showUploadSuccess,
    showUploadError,
    showRecommendationReady,
    showCVGenerating,
    showCVSuccess,
    showCVError,
    showPhotoRequired,
    showDataIncomplete,
    showPhotoSelected,
    showFavoriteAdded,
    showFavoriteRemoved,
  };
}; 