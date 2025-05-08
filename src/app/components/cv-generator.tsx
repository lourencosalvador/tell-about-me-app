// CVGenerator.js
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Platform,
    Share,
    Alert
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from "expo-print";
import BackButtomCv from "@/src/svg/back-buttom-cv";
import { useAuthStore } from "@/src/store/user";
import ButtomCv from '@/src/svg/cv-buttom';
import * as MediaLibrary from 'expo-media-library';

// Template HTML para o CV

const generateHtml = (userData: any) => {
    return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Currículo - ${userData.name}</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
                background-color: #f9f9f9;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                padding-bottom: 20px;
                border-bottom: 2px solid #8258E5;
            }
            .name {
                font-size: 32px;
                font-weight: bold;
                margin-bottom: 5px;
                color: #8258E5;
            }
            .title {
                font-size: 18px;
                color: #666;
                margin-bottom: 10px;
            }
            .contact {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 15px;
                margin-top: 15px;
            }
            .contact-item {
                display: flex;
                align-items: center;
                gap: 5px;
            }
            .section {
                margin-top: 25px;
            }
            .section-title {
                font-size: 22px;
                color: #8258E5;
                border-bottom: 1px solid #ddd;
                padding-bottom: 5px;
                margin-bottom: 15px;
            }
            .experience-item, .education-item, .skill-item {
                margin-bottom: 20px;
            }
            .experience-title, .education-degree {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 5px;
            }
            .experience-company, .education-institution {
                font-size: 16px;
                color: #666;
                margin-bottom: 5px;
            }
            .experience-date, .education-date {
                font-size: 14px;
                color: #888;
                margin-bottom: 10px;
            }
            .experience-description {
                font-size: 14px;
                line-height: 1.5;
            }
            .skills-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }
            .skill-tag {
                background-color: #f0e6ff;
                color: #8258E5;
                padding: 5px 10px;
                border-radius: 15px;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="name">${userData.name}</div>
                <div class="title">Desenvolvedor Front-End</div>
                <div class="contact">
                    <div class="contact-item">
                        <span>📧</span>
                        <span>${userData.email || "exemplo@email.com"}</span>
                    </div>
                    <div class="contact-item">
                        <span>📱</span>
                        <span>${userData.phone || "(00) 00000-0000"}</span>
                    </div>
                    <div class="contact-item">
                        <span>🔗</span>
                        <span>linkedin.com/in/${userData.name.toLowerCase().replace(/\s+/g, '-')}</span>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Resumo Profissional</div>
                <p>
                    Desenvolvedor Front-End apaixonado por criar interfaces interativas e responsivas. 
                    Comprometido com a entrega de código limpo e de alta qualidade, sempre buscando
                    aprimorar minhas habilidades e aprender novas tecnologias.
                </p>
            </div>

            <div class="section">
                <div class="section-title">Experiência Profissional</div>
                <div class="experience-item">
                    <div class="experience-title">Desenvolvedor Front-End</div>
                    <div class="experience-company">Empresa Inovadora Ltda.</div>
                    <div class="experience-date">Janeiro 2023 - Presente</div>
                    <div class="experience-description">
                        <ul>
                            <li>Desenvolvimento de interfaces responsivas utilizando React Native</li>
                            <li>Implementação de APIs RESTful e integração com back-end</li>
                            <li>Criação de componentes reutilizáveis para melhorar a manutenção do código</li>
                            <li>Colaboração em equipes ágeis, participando de rituais Scrum</li>
                        </ul>
                    </div>
                </div>
                <div class="experience-item">
                    <div class="experience-title">Estagiário de Desenvolvimento</div>
                    <div class="experience-company">Tech Solutions S.A.</div>
                    <div class="experience-date">Março 2022 - Dezembro 2022</div>
                    <div class="experience-description">
                        <ul>
                            <li>Auxílio no desenvolvimento de aplicações web com React.js</li>
                            <li>Correção de bugs e implementação de novas funcionalidades</li>
                            <li>Testes de usabilidade e garantia de qualidade</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Formação Acadêmica</div>
                <div class="education-item">
                    <div class="education-degree">Bacharelado em Ciência da Computação</div>
                    <div class="education-institution">Universidade Federal</div>
                    <div class="education-date">2020 - 2024</div>
                </div>
                <div class="education-item">
                    <div class="education-degree">Curso Técnico em Desenvolvimento de Sistemas</div>
                    <div class="education-institution">Instituto Técnico Profissionalizante</div>
                    <div class="education-date">2018 - 2019</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Habilidades</div>
                <div class="skills-container">
                    <div class="skill-tag">React Native</div>
                    <div class="skill-tag">JavaScript</div>
                    <div class="skill-tag">TypeScript</div>
                    <div class="skill-tag">HTML5</div>
                    <div class="skill-tag">CSS3</div>
                    <div class="skill-tag">Redux</div>
                    <div class="skill-tag">Git</div>
                    <div class="skill-tag">UI/UX</div>
                    <div class="skill-tag">API REST</div>
                    <div class="skill-tag">Figma</div>
                </div>
            </div>

            <div class="section">
                <div class="section-title">Idiomas</div>
                <div class="skills-container">
                    <div class="skill-tag">Português - Nativo</div>
                    <div class="skill-tag">Inglês - Avançado</div>
                    <div class="skill-tag">Espanhol - Básico</div>
                </div>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const CVGenerator = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [cvReady, setCvReady] = useState(false);
    const [pdfUri, setPdfUri] = useState('');
    const { user: userData } = useAuthStore();
    const scrollViewRef = useRef(null);

    const [progressPercentage, setProgressPercentage] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    function onDownloadProgress({
        totalBytesWritten,
        totalBytesExpectedToWrite,
    }: FileSystem.DownloadProgressData) {
        const percentage = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
        setProgressPercentage(percentage);
    }


    const generateCV = async () => {
        setIsGenerating(true);
        setCvReady(false);

        try {
            const html = generateHtml(userData);

            const { uri } = await Print.printToFileAsync({
                html,
                base64: false,
            });

            setPdfUri(uri);
            setCvReady(true);
        } catch (error) {
            console.error('Erro ao gerar CV:', error);
            Alert.alert(
                'Erro',
                'Ocorreu um erro ao gerar o seu currículo. Por favor, tente novamente.'
            );
        } finally {
            setIsGenerating(false);
        }
    };

    const sharePDF = async () => {
        try {
            if (!pdfUri) {
                Alert.alert("Erro", "Nenhum arquivo PDF disponível para compartilhar.");
                return;
            }

            const filename = `curriculo-${userData?.name || 'meu-curriculo'}.pdf`;

            if (Platform.OS === 'android') {
  
                const newUri = FileSystem.cacheDirectory + filename;
                await FileSystem.copyAsync({
                    from: pdfUri,
                    to: newUri
                });
                await Sharing.shareAsync(newUri);
            } else {

                await Sharing.shareAsync(pdfUri);
            }
        } catch (error) {
            console.error('Erro ao compartilhar CV:', error);
            Alert.alert('Erro', 'Não foi possível compartilhar o currículo.');
        }
    };


    const handleOpenModal = () => {
        setModalVisible(true);
        generateCV();
    };

    // Componente de previsualização do CV

    const CVPreview = () => (
        <View style={styles.cvPreview}>
            <View style={styles.cvHeader}>
                <Text style={styles.cvName}>{userData?.name}</Text>
                <Text style={styles.cvTitle}>Desenvolvedor Front-End</Text>
            </View>

            <View style={styles.cvSection}>
                <Text style={styles.cvSectionTitle}>Resumo Profissional</Text>
                <Text style={styles.cvText}>
                    Desenvolvedor Front-End apaixonado por criar interfaces interativas e responsivas.
                    Comprometido com a entrega de código limpo e de alta qualidade.
                </Text>
            </View>

            <View style={styles.cvSection}>
                <Text style={styles.cvSectionTitle}>Experiência</Text>
                <View style={styles.cvItem}>
                    <Text style={styles.cvItemTitle}>Desenvolvedor Front-End</Text>
                    <Text style={styles.cvItemSubtitle}>Empresa Inovadora Ltda.</Text>
                    <Text style={styles.cvItemDate}>Jan 2023 - Presente</Text>
                </View>
            </View>

            <View style={styles.cvSection}>
                <Text style={styles.cvSectionTitle}>Formação</Text>
                <View style={styles.cvItem}>
                    <Text style={styles.cvItemTitle}>Bacharelado em Ciência da Computação</Text>
                    <Text style={styles.cvItemSubtitle}>Universidade Federal</Text>
                </View>
            </View>

            <View style={styles.cvSection}>
                <Text style={styles.cvSectionTitle}>Habilidades</Text>
                <View style={styles.skillsContainer}>
                    <View style={styles.skillTag}><Text style={styles.skillText}>React Native</Text></View>
                    <View style={styles.skillTag}><Text style={styles.skillText}>JavaScript</Text></View>
                    <View style={styles.skillTag}><Text style={styles.skillText}>TypeScript</Text></View>
                    <View style={styles.skillTag}><Text style={styles.skillText}>API REST</Text></View>
                </View>
            </View>
        </View>
    );

    return (
        <>
            {/* Botão para gerar CV */}
            <TouchableOpacity onPress={handleOpenModal}>
                <ButtomCv />
            </TouchableOpacity>

            {/* Modal para visualizar o CV */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() => setModalVisible(false)}
                            style={styles.backButton}
                        >
                            <BackButtomCv />
                        </TouchableOpacity>
                        <Text style={styles.headerTitle}>Currículo Profissional</Text>
                    </View>

                    <ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={styles.contentContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {isGenerating ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color="#8258E5" />
                                <Text style={styles.loadingText}>Gerando seu currículo...</Text>
                            </View>
                        ) : (
                            <>
                                <CVPreview />

                                <Text style={styles.noteText}>
                                    Este é apenas um exemplo do seu currículo. O PDF gerado contém informações mais detalhadas.
                                </Text>

                                <TouchableOpacity
                                    style={styles.downloadButton}
                                    onPress={sharePDF}
                                    disabled={!cvReady || isDownloading}
                                >
                                    {isDownloading ? (
                                        <>
                                            <Text style={styles.downloadButtonText}>
                                                {progressPercentage.toFixed(1)}% baixado...
                                            </Text>
                                            <ActivityIndicator color="#FFFFFF" style={{ marginTop: 8 }} />
                                        </>
                                    ) : (
                                        <Text style={styles.downloadButtonText}>
                                            {cvReady ? "Baixar CV" : "Preparando..."}
                                        </Text>
                                    )}
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.regenerateButton}
                                    onPress={generateCV}
                                    disabled={isGenerating}
                                >
                                    <Text style={styles.regenerateButtonText}>Regenerar CV</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </ScrollView>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: '#161616',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 16,
        backgroundColor: '#161616',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginLeft: 16,
    },
    backButton: {
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 40,
        paddingHorizontal: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#FFFFFF',
        textAlign: 'center',
    },
    cvPreview: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginVertical: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cvHeader: {
        borderBottomWidth: 2,
        borderBottomColor: '#8258E5',
        paddingBottom: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    cvName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#8258E5',
        marginBottom: 4,
    },
    cvTitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 10,
    },
    cvSection: {
        marginBottom: 15,
    },
    cvSectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8258E5',
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingBottom: 5,
        marginBottom: 10,
    },
    cvText: {
        fontSize: 14,
        lineHeight: 20,
        color: '#333',
    },
    cvItem: {
        marginBottom: 12,
    },
    cvItemTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cvItemSubtitle: {
        fontSize: 14,
        color: '#666',
    },
    cvItemDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#f0e6ff',
        paddingVertical: 4,
        paddingHorizontal: 10,
        borderRadius: 12,
    },
    skillText: {
        color: '#8258E5',
        fontSize: 12,
    },
    noteText: {
        fontSize: 14,
        color: '#AAAAAA',
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    downloadButton: {
        backgroundColor: '#8258E5',
        borderRadius: 50,
        padding: 16,
        alignItems: 'center',
        marginVertical: 10,
    },
    downloadButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    regenerateButton: {
        backgroundColor: '#333333',
        borderRadius: 50,
        padding: 16,
        alignItems: 'center',
        marginTop: 10,
    },
    regenerateButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CVGenerator;