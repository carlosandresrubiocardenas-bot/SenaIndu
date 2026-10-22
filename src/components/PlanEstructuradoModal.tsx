import React from 'react';
import { 
  FileText, 
  CheckCircle2, 
  Clock, 
  Target, 
  Layers, 
  TrendingUp, 
  Award, 
  ArrowRight,
  BookOpen,
  Scale,
  Sparkles
} from 'lucide-react';

interface PlanEstructuradoProps {
  onStartGamification: () => void;
}

export const PlanEstructuradoView: React.FC<PlanEstructuradoProps> = ({
  onStartGamification,
}) => {
  const phases = [
    {
      phase: 'Fase 1',
      title: 'Inmersión Institucional & Sentido de Pertenencia',
      duration: 'Horas 1 a 8 (20%)',
      objectives: 'Comprender la misión del SENA, los símbolos patrios e institucionales, el himno, el modelo pedagógico por competencias y el rol protagónico del aprendiz.',
      deliverables: [
        'Registro y caracterización del perfil en plataforma',
        'Reconocimiento de ambientes de aprendizaje y laboratorios',
        'Acercamiento a la comunidad de instructores y voceros',
      ],
      icon: BookOpen,
      color: 'bg-emerald-50 text-[#39A900]',
    },
    {
      phase: 'Fase 2',
      title: 'Apropiación Normativa: 24 Derechos, Deberes y Prohibiciones (Cap. II y III)',
      duration: 'Horas 9 a 18 (25%)',
      objectives: 'Interiorizar los 24 derechos fundamentales del aprendiz bajo el Acuerdo No. 0009 de 2024, las responsabilidades académicas, normas de SST y el protocolo de prevención de violencias y acoso.',
      deliverables: [
        'Exploración interactiva de los 5 capítulos del Acuerdo 0009 de 2024',
        'Ejercicios prácticos de identificación de deberes vs. derechos',
        'Porte institucional de carné (físico/digital) y uso ético de plataformas (Zajuna)',
      ],
      icon: Scale,
      color: 'bg-blue-50 text-[#00324D]',
    },
    {
      phase: 'Fase 3',
      title: 'Seguridad, SST, Etapa Productiva y Debido Proceso (Cap. IV y V)',
      duration: 'Horas 19 a 28 (25%)',
      objectives: 'Capacitación en Seguridad y Salud en el Trabajo (SST), alternativas de etapa productiva y funcionamiento garantista del Comité de Evaluación y Seguimiento.',
      deliverables: [
        'Simulación de protocolos de emergencia y uso de EPP',
        'Elección orientada de modalidad de Etapa Productiva (bitácoras quincenales)',
        'Comprensión del Debido Proceso: notificación, 3 días de descargos y reposición',
      ],
      icon: Layers,
      color: 'bg-amber-50 text-amber-700',
    },
    {
      phase: 'Fase 4',
      title: 'Evaluación Formativa Gamificada & Casos Reales',
      duration: 'Horas 29 a 36 (20%)',
      objectives: 'Evaluar el aprendizaje normativo mediante retos lúdicos (clasificador de tarjetas), toma de decisiones ante dilemas éticos y examen diagnóstico.',
      deliverables: [
        'Resolución de 4 dilemas éticos en taller con retroalimentación inmediata',
        'Reto clasificador con sistema de puntos y rachas',
        'Examen formal de 10 preguntas sobre el Acuerdo 0009 de 2024 (umbral 4.0/5.0)',
      ],
      icon: Sparkles,
      color: 'bg-purple-50 text-purple-700',
    },
    {
      phase: 'Fase 5',
      title: 'Legalización del Compromiso y Certificación Oficial',
      duration: 'Horas 37 a 40 (10%)',
      objectives: 'Firma simbólica del compromiso del aprendiz SENA, emisión y descarga del Certificado Institucional de Inducción con verificación QR.',
      deliverables: [
        'Expedición del Certificado Oficial de Inducción de 40 Horas',
        'Elección democrática del Vocero de Ficha',
        'Transición formal a la Etapa Lectiva curricular',
      ],
      icon: Award,
      color: 'bg-emerald-100 text-[#39A900]',
    },
  ];

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Plan Header */}
      <div className="bg-gradient-to-r from-[#00324D] to-[#002235] text-white p-8 sm:p-10 rounded-3xl shadow-lg border border-slate-700/50 space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#39A900]/20 text-[#39A900] text-xs font-semibold border border-[#39A900]/30">
          <FileText className="w-3.5 h-3.5" />
          <span>Plan Pedagógico Estructurado SENA · Acuerdo No. 0009 de 2024</span>
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight">
          Estructura del Plan de Inducción para Aprendices
        </h2>

        <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl font-light">
          Este plan transforma la inducción tradicional en una experiencia activa y gamificada de <strong>40 horas</strong> pedagógicas 
          conforme al <strong>Acuerdo No. 0009 de 2024</strong> (Nuevo Reglamento del Aprendiz SENA que deroga el Acuerdo 007 de 2012). 
          Asegura la retención de los 24 derechos, deberes y garantías procesales para prevenir la deserción temprana.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/10 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Intensidad Total</span>
            <span className="font-bold text-white text-sm">40 Horas</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Modalidad</span>
            <span className="font-bold text-white text-sm">Híbrida / Interactiva</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Evaluación</span>
            <span className="font-bold text-[#39A900] text-sm">Gamificada (Min. 4.0)</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Resultado</span>
            <span className="font-bold text-emerald-300 text-sm">Certificado con QR</span>
          </div>
        </div>
      </div>

      {/* 5 Phases Roadmap */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-[#00324D] dark:text-white">
            Fases de Implementación del Plan
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">5 Etapas Secuenciales</span>
        </div>

        <div className="space-y-4">
          {phases.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col md:flex-row items-start gap-5"
              >
                <div className={`p-3.5 rounded-2xl ${p.color} shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>

                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono-data text-xs font-bold text-[#39A900] uppercase">
                      {p.phase} · {p.duration}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                      Semana 1 de Formación
                    </span>
                  </div>

                  <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    {p.title}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {p.objectives}
                  </p>

                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1.5">
                      Entregables y Evidencias Formativas:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {p.deliverables.map((item, dIdx) => (
                        <div
                          key={dIdx}
                          className="flex items-start gap-1.5 text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 p-2 rounded-lg border border-slate-100 dark:border-slate-700/60"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Impact & KPIs Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="font-mono-data text-2xl font-bold text-[#39A900]">-35%</span>
          <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase">Reducción de Deserción</h5>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            La claridad en los canales de justificación de inasistencias y comités previene el abandono de ficha.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-sky-950/60 text-[#00324D] dark:text-sky-300 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <span className="font-mono-data text-2xl font-bold text-[#00324D] dark:text-sky-400">+94%</span>
          <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase">Retención del Reglamento</h5>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            La gamificación por casos prácticos y dilemas éticos supera la memorización pasiva de textos normativos.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <span className="font-mono-data text-2xl font-bold text-amber-600 dark:text-amber-400">100%</span>
          <h5 className="font-bold text-xs text-slate-900 dark:text-white uppercase">Trazabilidad Certificada</h5>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Cada aprendiz cuenta con su certificado con código criptográfico para su portafolio de evidencias.
          </p>
        </div>
      </div>

      {/* Direct CTA */}
      <div className="p-6 bg-slate-900 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-display text-base font-bold">
            ¿Deseas probar el flujo gamificado de este plan?
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Ingresa al clasificador exprés o resuelve los dilemas éticos para certificar tu inducción.
          </p>
        </div>

        <button
          onClick={onStartGamification}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#329200] text-white text-xs font-semibold transition-all shrink-0 shadow-md shadow-[#39A900]/25"
        >
          <span>Comenzar Evaluación Gamificada</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
