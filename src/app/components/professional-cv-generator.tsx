import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ScrollView,
    TextInput,
    Image,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useAuthStore } from '@/src/store/user';
import { useToastHelpers } from '@/src/hooks/useToastHelpers';
import { useRecommendation } from '@/src/services/recommendations/useRecommendations';
import { useUserVideos } from '@/src/services/videos/useVideos';
import { useAchievements } from '@/src/hooks/useAchievements';
import { useChallenges } from '@/src/hooks/useChallenges';

interface CVData {
    // Dados pessoais
    name: string;
    email: string;
    phone: string;
    linkedin: string;
    github: string;
    address: string;
    
    // Resumo profissional
    professionalSummary: string;
    
    // Experiências
    experiences: {
        title: string;
        company: string;
        period: string;
        description: string;
    }[];
    
    // Formação
    education: {
        degree: string;
        institution: string;
        period: string;
    }[];
    
    // Habilidades
    technicalSkills: string[];
    softSkills: string[];
    
    // Certificações
    certifications: {
        name: string;
        institution: string;
        date: string;
    }[];
    
    // Projetos
    projects: {
        name: string;
        description: string;
        technologies: string;
        link?: string;
    }[];
}

interface ProfessionalCVGeneratorProps {
    visible: boolean;
    onClose: () => void;
}

export const ProfessionalCVGenerator: React.FC<ProfessionalCVGeneratorProps> = ({
    visible,
    onClose,
}) => {
    const { user } = useAuthStore();
    const { showSuccess, showError, showWarning, showInfo } = useToastHelpers();
    const { data: recommendationData } = useRecommendation(user?.id || '');
    const { data: videos = [] } = useUserVideos(user?.id || '');
    const { achievements, totalStreaks, currentLevel } = useAchievements();
    const { completedChallenges } = useChallenges();
    
    const [step, setStep] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [professionalPhoto, setProfessionalPhoto] = useState<string | null>(null);
    
    const [cvData, setCvData] = useState<CVData>({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        linkedin: '',
        github: '',
        address: '',
        professionalSummary: '',
        experiences: [{ title: '', company: '', period: '', description: '' }],
        education: [{ degree: '', institution: '', period: '' }],
        technicalSkills: [],
        softSkills: [],
        certifications: [],
        projects: [],
    });

    const selectProfessionalPhoto = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (status !== 'granted') {
                showWarning('Permissão Necessária', 'Precisamos de acesso à galeria para selecionar sua foto profissional.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [3, 4], // Formato mais profissional
                quality: 0.8,
            });

            if (!result.canceled) {
                setProfessionalPhoto(result.assets[0].uri);
                showSuccess('Foto Selecionada!', 'Foto profissional adicionada com sucesso.');
            }
        } catch (error) {
            showError('Erro', 'Não foi possível selecionar a foto profissional.');
        }
    };

    const generateSkillsFromData = () => {
        const skills = new Set<string>();
        
        // Extrair habilidades das transcrições dos vídeos
        videos.forEach(video => {
            // Corrigindo o acesso à transcrição usando a estrutura correta
            const text = video.transcription?.toLowerCase() || '';
            
            // Lista de tecnologias para detectar
            const techKeywords = [
                'react', 'javascript', 'typescript', 'python', 'java', 'nodejs',
                'express', 'mongodb', 'sql', 'html', 'css', 'figma', 'photoshop',
                'git', 'github', 'docker', 'aws', 'firebase', 'vue', 'angular',
                'react native', 'flutter', 'swift', 'kotlin', 'php', 'laravel',
                'bootstrap', 'tailwind', 'sass', 'less', 'webpack', 'vite'
            ];
            
            techKeywords.forEach(tech => {
                if (text.includes(tech)) {
                    skills.add(tech.charAt(0).toUpperCase() + tech.slice(1));
                }
            });
        });

        // Adicionar habilidades das recomendações
        if (recommendationData?.recommendation?.area_recomendada) {
            const area = recommendationData.recommendation.area_recomendada.toLowerCase();
            
            if (area.includes('frontend') || area.includes('front-end')) {
                skills.add('React').add('JavaScript').add('CSS').add('HTML');
            }
            if (area.includes('backend') || area.includes('back-end')) {
                skills.add('Node.js').add('Python').add('SQL').add('APIs REST');
            }
            if (area.includes('mobile')) {
                skills.add('React Native').add('Flutter').add('Mobile Development');
            }
            if (area.includes('fullstack') || area.includes('full-stack')) {
                skills.add('React').add('Node.js').add('JavaScript').add('TypeScript');
            }
            if (area.includes('data') || area.includes('dados')) {
                skills.add('Python').add('SQL').add('Power BI').add('Excel');
            }
        }

        // Se não há habilidades detectadas, adicionar algumas básicas
        if (skills.size === 0) {
            skills.add('Microsoft Office');
            skills.add('Comunicação');
            skills.add('Trabalho em Equipe');
            skills.add('Resolução de Problemas');
        }

        return Array.from(skills);
    };

    const generateProfessionalSummary = () => {
        const skills = generateSkillsFromData();
        const videoCount = videos.length;
        const hasRecommendation = recommendationData?.hasRecommendation;
        
        let summary = `Profissional da área de tecnologia com experiência em desenvolvimento de software`;
        
        if (skills.length > 0) {
            summary += `, especializado em ${skills.slice(0, 3).join(', ')}`;
        }
        
        if (videoCount > 0) {
            summary += `. Possui portfólio com ${videoCount} projetos documentados`;
        }
        
        if (hasRecommendation) {
            summary += ` e foco em ${recommendationData.recommendation?.area_recomendada || 'desenvolvimento'}`;
        }
        
        summary += '. Comprometido com a entrega de soluções de qualidade e sempre em busca de novos desafios e aprendizados.';
        
        return summary;
    };

    const generateHTMLCV = async () => {
        const skills = generateSkillsFromData();
        const summary = generateProfessionalSummary();
        
        // Converter foto para base64
        let photoBase64 = '';
        if (professionalPhoto) {
            try {
                const base64 = await FileSystem.readAsStringAsync(professionalPhoto, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                photoBase64 = `data:image/jpeg;base64,${base64}`;
            } catch (error) {
                console.error('Erro ao converter foto para base64:', error);
            }
        }
        
        return `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Currículo - ${cvData.name}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background: #fff;
                }
                
                .cv-container {
                    max-width: 800px;
                    margin: 0 auto;
                    background: white;
                    display: flex;
                    min-height: 100vh;
                }
                
                .sidebar {
                    width: 30%;
                    background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
                    color: white;
                    padding: 30px 20px;
                }
                
                .main-content {
                    width: 70%;
                    padding: 30px;
                }
                
                .profile-photo {
                    width: 120px;
                    height: 150px;
                    border-radius: 8px;
                    margin: 0 auto 20px;
                    display: block;
                    object-fit: cover;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                }
                
                .name {
                    font-size: 24px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 5px;
                }
                
                .title {
                    font-size: 14px;
                    text-align: center;
                    opacity: 0.9;
                    margin-bottom: 25px;
                }
                
                .contact-info {
                    margin-bottom: 25px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 8px;
                    font-size: 12px;
                }
                
                .contact-icon {
                    width: 16px;
                    margin-right: 10px;
                    text-align: center;
                }
                
                .section-title {
                    font-size: 16px;
                    font-weight: bold;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
                }
                
                .main-section-title {
                    font-size: 20px;
                    font-weight: bold;
                    color: #8B5CF6;
                    margin-bottom: 15px;
                    padding-bottom: 5px;
                    border-bottom: 2px solid #8B5CF6;
                }
                
                .skills-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                }
                
                .skill-item {
                    background: rgba(255, 255, 255, 0.2);
                    padding: 6px 10px;
                    border-radius: 15px;
                    font-size: 11px;
                    text-align: center;
                }
                
                .experience-item, .education-item, .project-item {
                    margin-bottom: 20px;
                }
                
                .item-title {
                    font-size: 16px;
                    font-weight: bold;
                    color: #333;
                    margin-bottom: 3px;
                }
                
                .item-subtitle {
                    font-size: 14px;
                    color: #666;
                    margin-bottom: 3px;
                }
                
                .item-date {
                    font-size: 12px;
                    color: #888;
                    margin-bottom: 8px;
                }
                
                .item-description {
                    font-size: 13px;
                    line-height: 1.5;
                }
                
                .professional-summary {
                    font-size: 14px;
                    text-align: justify;
                    margin-bottom: 25px;
                    line-height: 1.6;
                }
                
                .tech-skills {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-bottom: 15px;
                }
                
                .tech-skill {
                    background: #f0e6ff;
                    color: #8B5CF6;
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 11px;
                    font-weight: 500;
                }
            </style>
        </head>
        <body>
            <div class="cv-container">
                <div class="sidebar">
                    ${photoBase64 ? `<img src="${photoBase64}" alt="Foto Profissional" class="profile-photo">` : ''}
                    
                    <div class="name">${cvData.name}</div>
                    <div class="title">${recommendationData?.recommendation?.area_recomendada || 'Desenvolvedor'}</div>
                    
                    <div class="contact-info">
                        <div class="section-title">CONTATO</div>
                        <div class="contact-item">
                            <span class="contact-icon">📧</span>
                            <span>${cvData.email}</span>
                        </div>
                        ${cvData.phone ? `
                        <div class="contact-item">
                            <span class="contact-icon">📱</span>
                            <span>${cvData.phone}</span>
                        </div>` : ''}
                        ${cvData.linkedin ? `
                        <div class="contact-item">
                            <span class="contact-icon">💼</span>
                            <span>${cvData.linkedin}</span>
                        </div>` : ''}
                        ${cvData.github ? `
                        <div class="contact-item">
                            <span class="contact-icon">🔗</span>
                            <span>${cvData.github}</span>
                        </div>` : ''}
                        ${cvData.address ? `
                        <div class="contact-item">
                            <span class="contact-icon">📍</span>
                            <span>${cvData.address}</span>
                        </div>` : ''}
                    </div>
                    
                    <div class="section-title">HABILIDADES TÉCNICAS</div>
                    <div class="skills-grid">
                        ${skills.concat(cvData.technicalSkills).map(skill => 
                            `<div class="skill-item">${skill}</div>`
                        ).join('')}
                    </div>
                    
                    ${cvData.softSkills.length > 0 ? `
                    <div style="margin-top: 20px;">
                        <div class="section-title">SOFT SKILLS</div>
                        <div class="skills-grid">
                            ${cvData.softSkills.map(skill => 
                                `<div class="skill-item">${skill}</div>`
                            ).join('')}
                        </div>
                    </div>` : ''}
                </div>
                
                <div class="main-content">
                    <div class="main-section-title">RESUMO PROFISSIONAL</div>
                    <div class="professional-summary">
                        ${cvData.professionalSummary || summary}
                    </div>
                    
                    ${cvData.experiences.filter(exp => exp.title && exp.company).length > 0 ? `
                    <div class="main-section-title">EXPERIÊNCIA PROFISSIONAL</div>
                    ${cvData.experiences.filter(exp => exp.title && exp.company).map(exp => `
                        <div class="experience-item">
                            <div class="item-title">${exp.title}</div>
                            <div class="item-subtitle">${exp.company}</div>
                            <div class="item-date">${exp.period}</div>
                            <div class="item-description">${exp.description}</div>
                        </div>
                    `).join('')}` : ''}
                    
                    ${cvData.education.filter(edu => edu.degree && edu.institution).length > 0 ? `
                    <div class="main-section-title">FORMAÇÃO ACADÊMICA</div>
                    ${cvData.education.filter(edu => edu.degree && edu.institution).map(edu => `
                        <div class="education-item">
                            <div class="item-title">${edu.degree}</div>
                            <div class="item-subtitle">${edu.institution}</div>
                            <div class="item-date">${edu.period}</div>
                        </div>
                    `).join('')}` : ''}
                    
                    ${cvData.projects.filter(proj => proj.name).length > 0 ? `
                    <div class="main-section-title">PROJETOS</div>
                    ${cvData.projects.filter(proj => proj.name).map(proj => `
                        <div class="project-item">
                            <div class="item-title">${proj.name}</div>
                            <div class="item-description">${proj.description}</div>
                            <div style="font-size: 12px; color: #888; margin-top: 5px;">
                                <strong>Tecnologias:</strong> ${proj.technologies}
                                ${proj.link ? ` | <strong>Link:</strong> ${proj.link}` : ''}
                            </div>
                        </div>
                    `).join('')}` : ''}
                    
                    ${cvData.certifications.filter(cert => cert.name).length > 0 ? `
                    <div class="main-section-title">CERTIFICAÇÕES</div>
                    ${cvData.certifications.filter(cert => cert.name).map(cert => `
                        <div class="education-item">
                            <div class="item-title">${cert.name}</div>
                            <div class="item-subtitle">${cert.institution}</div>
                            <div class="item-date">${cert.date}</div>
                        </div>
                    `).join('')}` : ''}
                    
                    ${videos.length > 0 ? `
                    <div class="main-section-title">PORTFÓLIO DE PROJETOS</div>
                    <div class="item-description">
                        Possui ${videos.length} projeto(s) documentado(s) em vídeo, demonstrando 
                        aplicação prática de conhecimentos e desenvolvimento de soluções.
                        ${recommendationData?.recommendation?.justificativa ? 
                            ` Foco em ${recommendationData.recommendation.area_recomendada} 
                            conforme análise de competências.` : ''
                        }
                    </div>` : ''}

                    ${achievements.length > 0 ? `
                    <div class="main-section-title">CONQUISTAS & CERTIFICAÇÕES</div>
                    ${achievements.map(achievement => `
                        <div class="education-item">
                            <div class="item-title">${achievement.icon} ${achievement.name}</div>
                            <div class="item-subtitle">Plataforma de Desenvolvimento Profissional</div>
                            <div class="item-date">${new Date(achievement.earnedAt).toLocaleDateString('pt-BR')}</div>
                            <div class="item-description">${achievement.description}</div>
                        </div>
                    `).join('')}
                    
                    <div class="education-item">
                        <div class="item-title">🏆 Nível ${currentLevel} - Desenvolvedor</div>
                        <div class="item-subtitle">Sistema de Gamificação Profissional</div>
                        <div class="item-date">${new Date().toLocaleDateString('pt-BR')}</div>
                        <div class="item-description">
                            Alcançou nível ${currentLevel} através de atividades práticas, conquistou ${achievements.length} badges 
                            e acumulou ${totalStreaks} pontos de consistência. 
                            ${completedChallenges.length > 0 ? `Completou ${completedChallenges.length} desafios técnicos.` : ''}
                        </div>
                    </div>` : ''}
                </div>
            </div>
        </body>
        </html>
        `;
    };

    const generatePDF = async () => {
        // Validações mais flexíveis para teste
        if (!professionalPhoto) {
            showWarning('Aviso', 'Recomendamos adicionar uma foto profissional para valorizar seu currículo.');
        }

        if (!cvData.phone && !cvData.linkedin) {
            showWarning('Aviso', 'Recomendamos preencher pelo menos telefone ou LinkedIn para contato.');
        }

        // Para teste: permitir gerar mesmo com dados mínimos
        const skills = generateSkillsFromData();
        if (videos.length === 0) {
            showInfo('Portfólio Vazio', 'Envie alguns vídeos para enriquecer seu currículo com projetos reais.');
        }

        if (skills.length === 0) {
            showInfo('Habilidades', 'Envie vídeos com tecnologias mencionadas para detectar habilidades automaticamente.');
        }

        setIsGenerating(true);
        
        try {
            const htmlContent = await generateHTMLCV();
            
            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false,
            });

            await Sharing.shareAsync(uri, {
                mimeType: 'application/pdf',
                dialogTitle: 'Compartilhar Currículo',
                UTI: 'com.adobe.pdf',
            });

            showSuccess('CV Gerado! 🎉', 'Seu currículo profissional foi criado e está pronto para compartilhar.');
            onClose();
            
        } catch (error) {
            console.error('Erro ao gerar PDF:', error);
            showError('Erro na Geração', 'Não foi possível gerar o currículo. Tente novamente.');
        } finally {
            setIsGenerating(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View className="flex-1 p-6">
                        <Text className="text-white text-xl font-bold mb-6 text-center">
                            Foto Profissional
                        </Text>
                        
                        <View className="items-center mb-8">
                            {professionalPhoto ? (
                                <View className="relative">
                                    <Image
                                        source={{ uri: professionalPhoto }}
                                        className="w-32 h-40 rounded-lg"
                                        style={{ backgroundColor: '#2D2D3A' }}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setProfessionalPhoto(null)}
                                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                                    >
                                        <MaterialIcons name="close" size={16} color="white" />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    onPress={selectProfessionalPhoto}
                                    className="w-32 h-40 border-2 border-dashed border-purple-400 rounded-lg items-center justify-center"
                                >
                                    <MaterialIcons name="add-a-photo" size={32} color="#A855F7" />
                                    <Text className="text-purple-400 text-sm mt-2 text-center">
                                        Adicionar Foto Profissional
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                        
                        <Text className="text-gray-300 text-sm text-center mb-6">
                            Uma foto profissional valoriza seu currículo.{'\n'}
                            Use uma imagem com boa iluminação e vestimenta adequada.
                        </Text>
                        
                        <TouchableOpacity
                            onPress={() => setStep(2)}
                            disabled={!professionalPhoto}
                            className={`py-3 px-6 rounded-lg ${professionalPhoto ? 'bg-purple-600' : 'bg-gray-600'}`}
                        >
                            <Text className="text-white text-center font-semibold">
                                Continuar
                            </Text>
                        </TouchableOpacity>
                    </View>
                );
                
            case 2:
                return (
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <Text className="text-white text-xl font-bold mb-6 text-center">
                            Dados Pessoais
                        </Text>
                        
                        <View className="space-y-4">
                            <View>
                                <Text className="text-white mb-2">Nome Completo *</Text>
                                <TextInput
                                    value={cvData.name}
                                    onChangeText={(text) => setCvData(prev => ({ ...prev, name: text }))}
                                    placeholder="Seu nome completo"
                                    placeholderTextColor="#666"
                                    className="bg-gray-800 text-white p-3 rounded-lg"
                                />
                            </View>
                            
                            <View>
                                <Text className="text-white mb-2">Telefone *</Text>
                                <TextInput
                                    value={cvData.phone}
                                    onChangeText={(text) => setCvData(prev => ({ ...prev, phone: text }))}
                                    placeholder="(11) 99999-9999"
                                    placeholderTextColor="#666"
                                    className="bg-gray-800 text-white p-3 rounded-lg"
                                />
                            </View>
                            
                            <View>
                                <Text className="text-white mb-2">LinkedIn *</Text>
                                <TextInput
                                    value={cvData.linkedin}
                                    onChangeText={(text) => setCvData(prev => ({ ...prev, linkedin: text }))}
                                    placeholder="linkedin.com/in/seuperfil"
                                    placeholderTextColor="#666"
                                    className="bg-gray-800 text-white p-3 rounded-lg"
                                />
                            </View>
                            
                            <View>
                                <Text className="text-white mb-2">GitHub</Text>
                                <TextInput
                                    value={cvData.github}
                                    onChangeText={(text) => setCvData(prev => ({ ...prev, github: text }))}
                                    placeholder="github.com/seuusuario"
                                    placeholderTextColor="#666"
                                    className="bg-gray-800 text-white p-3 rounded-lg"
                                />
                            </View>
                            
                            <View>
                                <Text className="text-white mb-2">Endereço</Text>
                                <TextInput
                                    value={cvData.address}
                                    onChangeText={(text) => setCvData(prev => ({ ...prev, address: text }))}
                                    placeholder="Cidade, Estado"
                                    placeholderTextColor="#666"
                                    className="bg-gray-800 text-white p-3 rounded-lg"
                                />
                            </View>
                        </View>
                        
                        <View className="flex-row mt-8 space-x-4">
                            <TouchableOpacity
                                onPress={() => setStep(1)}
                                className="flex-1 py-3 px-6 rounded-lg bg-gray-600"
                            >
                                <Text className="text-white text-center font-semibold">Voltar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={() => setStep(3)}
                                className="flex-1 py-3 px-6 rounded-lg bg-purple-600"
                            >
                                <Text className="text-white text-center font-semibold">Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                );
            
            case 3:
                return (
                    <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
                        <Text className="text-white text-xl font-bold mb-6 text-center">
                            Finalizar Currículo
                        </Text>
                        
                        <View className="bg-gray-800 p-4 rounded-lg mb-6">
                            <Text className="text-white font-semibold mb-2">📋 Resumo do CV:</Text>
                            <Text className="text-gray-300 text-sm">
                                • Foto profissional: {professionalPhoto ? '✅' : '⚠️ Recomendado'}{'\n'}
                                • Dados de contato: {(cvData.phone || cvData.linkedin) ? '✅' : '⚠️ Adicione telefone/LinkedIn'}{'\n'}
                                • Habilidades detectadas: {generateSkillsFromData().length} tecnologia(s){'\n'}
                                • Projetos no portfólio: {videos.length} vídeo(s){'\n'}
                                • Área recomendada: {recommendationData?.recommendation?.area_recomendada || 'Não definida'}
                            </Text>
                        </View>
                        
                        {/* Avisos específicos */}
                        {videos.length === 0 && (
                            <View className="bg-orange-900/30 border border-orange-500/50 p-3 rounded-lg mb-4">
                                <Text className="text-orange-400 text-sm">
                                    💡 Dica: Envie vídeos para enriquecer seu CV com projetos reais
                                </Text>
                            </View>
                        )}
                        
                        {generateSkillsFromData().length === 0 && (
                            <View className="bg-blue-900/30 border border-blue-500/50 p-3 rounded-lg mb-4">
                                <Text className="text-blue-400 text-sm">
                                    🚀 Dica: Mencione tecnologias nos vídeos para detecção automática de habilidades
                                </Text>
                            </View>
                        )}
                        
                        {!professionalPhoto && (
                            <View className="bg-purple-900/30 border border-purple-500/50 p-3 rounded-lg mb-4">
                                <Text className="text-purple-400 text-sm">
                                    📸 Dica: Uma foto profissional valoriza muito seu currículo
                                </Text>
                            </View>
                        )}
                        
                        <Text className="text-gray-300 text-sm text-center mb-6">
                            Seu currículo será gerado automaticamente com base nos seus dados, 
                            vídeos enviados e recomendações recebidas. Mesmo com dados mínimos, 
                            você pode gerar e depois atualizar!
                        </Text>
                        
                        <View className="flex-row space-x-4">
                            <TouchableOpacity
                                onPress={() => setStep(2)}
                                className="flex-1 py-3 px-6 rounded-lg bg-gray-600"
                            >
                                <Text className="text-white text-center font-semibold">Voltar</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                onPress={generatePDF}
                                disabled={isGenerating}
                                className="flex-1 py-3 px-6 rounded-lg bg-green-600"
                            >
                                {isGenerating ? (
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text className="text-white text-center font-semibold">
                                        Gerar CV 🎉
                                    </Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                );
                
            default:
                return null;
        }
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <LinearGradient
                colors={['#1F1F23', '#161618']}
                className="flex-1"
            >
                {/* Header */}
                <View className="flex-row items-center justify-between p-6 pt-12">
                    <TouchableOpacity onPress={onClose}>
                        <MaterialIcons name="close" size={24} color="white" />
                    </TouchableOpacity>
                    
                    <Text className="text-white text-lg font-bold">
                        Currículo Profissional
                    </Text>
                    
                    <Text className="text-purple-400 text-sm">
                        {step}/3
                    </Text>
                </View>
                
                {/* Progress Bar */}
                <View className="mx-6 mb-6">
                    <View className="h-2 bg-gray-700 rounded-full">
                        <View 
                            className="h-2 bg-purple-500 rounded-full transition-all duration-300"
                            style={{ width: `${(step / 3) * 100}%` }}
                        />
                    </View>
                </View>
                
                <KeyboardAvoidingView 
                    className="flex-1"
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    {renderStepContent()}
                </KeyboardAvoidingView>
            </LinearGradient>
        </Modal>
    );
}; 