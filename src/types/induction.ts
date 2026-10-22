export type ApprenticeData = {
  fullName: string;
  documentType: 'CC' | 'TI' | 'CE' | 'PEP';
  documentNumber: string;
  trainingProgram: string;
  fichaNumber: string;
  regional: string;
  trainingCenter: string;
  level: 'Tecnólogo' | 'Técnico' | 'Operario' | 'Especialización Tecnológica';
  startDate: string;
};

export type UserRole = 'instructor' | 'aprendiz';

export type RegulationCategory = 'generalidades' | 'derechos' | 'deberes' | 'prohibiciones' | 'etapa_productiva' | 'faltas_medidas' | 'comite_proceso';

export interface RegulationArticle {
  id: string;
  chapter: string;
  articleNumber: string;
  title: string;
  category: RegulationCategory;
  summary: string;
  fullText: string;
  keyPoints: string[];
  practicalApplication: string;
  iconName?: string;
}

export type CardClassificationType = 'derecho' | 'deber' | 'prohibicion';

export interface QuickClassifierItem {
  id: string;
  text: string;
  category: CardClassificationType;
  explanation: string;
  articleRef: string;
}

export interface EthicalDilemmaOption {
  id: string;
  text: string;
  isCorrect: boolean;
  score: number;
  feedback: string;
  articleReference: string;
}

export interface EthicalDilemma {
  id: string;
  title: string;
  scenario: string;
  context: string;
  options: EthicalDilemmaOption[];
}

export interface ExamQuestion {
  id: string;
  question: string;
  chapter: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  articleRef: string;
}

export interface CertificateRecord {
  id: string;
  verificationCode: string;
  issueDate: string;
  apprentice: ApprenticeData;
  score: number; // e.g. 4.8 / 5.0
  gradePercent: number; // e.g. 96%
  completedHours: number; // 40 horas inducción
  instructorSignature: string;
  subdirectorSignature: string;
  status: 'Aprobado' | 'No Aprobado';
}
