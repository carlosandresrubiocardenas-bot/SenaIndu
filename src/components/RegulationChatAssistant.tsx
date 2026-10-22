import React, { useState } from 'react';
import { Bot, Send, Sparkles, HelpCircle, BookOpen, ChevronRight, User } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  article: string;
}

const FREQUENT_QUESTIONS: FaqItem[] = [
  {
    question: '¿Qué es el Acuerdo No. 0009 de 2024 y qué normas deroga?',
    answer: 'El Acuerdo No. 0009 de 2024 (22 de noviembre de 2024) es el nuevo Reglamento del Aprendiz expedido por el Consejo Directivo Nacional. Deroga expresamente el histórico Acuerdo 007 de 2012, el Acuerdo 002 de 2014, el 006 de 2023 y el 002 de 2024, actualizando la formación a las modalidades presencial, virtual (LMS Zajuna) y combinada con enfoque de género y derechos humanos.',
    article: 'Disposiciones Generales (Acuerdo 0009 de 2024)',
  },
  {
    question: '¿Qué pasa si falto 3 días hábiles consecutivos sin justificación?',
    answer: 'Se configura la causal de DESERCIÓN según el Artículo 22 del Acuerdo No. 0009 de 2024. El instructor reporta a coordinación académica y se envía citación oficial. Tienes 5 días hábiles para justificar tu ausencia con soportes válidos; de no hacerlo, el Subdirector ordenará la cancelación de matrícula.',
    article: 'Art. 22 (Deserción - Acuerdo 0009 de 2024)',
  },
  {
    question: '¿Cómo solicito una revisión si estoy en desacuerdo con una nota?',
    answer: 'Tienes derecho a radicar solicitud escrita fundamentada dentro de los tres (3) días hábiles siguientes a la publicación del resultado. El instructor revisa pedagógicamente; si persiste la inconformidad, la coordinación académica designará un segundo evaluador técnico.',
    article: 'Art. 7 Num. 9 (Acuerdo 0009 de 2024)',
  },
  {
    question: '¿Cuáles son las alternativas autorizadas para la Etapa Productiva?',
    answer: 'El Acuerdo 0009 de 2024 ampara alternativas formales: 1) Contrato de Aprendizaje, 2) Proyecto Productivo (Fondo Emprender / TecnoParque), 3) Pasantía, 4) Vínculo laboral afín con el programa, y 5) Monitoría en ambientes del Centro, con seguimiento de bitácoras cada 15 días.',
    article: 'Artículos 24 al 30 (Acuerdo 0009 de 2024)',
  },
  {
    question: '¿Cuál es la diferencia entre una medida formativa y una sanción?',
    answer: 'Las MEDIDAS FORMATIVAS (Llamado de atención verbal y Plan de Mejoramiento pedagógico) son preventivas y NO generan antecedente disciplinario. Las SANCIONES (Llamado de atención escrito a hoja de vida, Condicionamiento de matrícula y Cancelación con inhabilidad de 6 a 24 meses) son actos administrativos formales.',
    article: 'Artículos 40 al 44 (Acuerdo 0009 de 2024)',
  },
  {
    question: '¿Qué garantías tengo ante una citación al Comité de Evaluación?',
    answer: 'Gozas del pleno DERECHO AL DEBIDO PROCESO: notificación formal con pliego de cargos, término de tres (3) días hábiles para radicar descargos y aportar pruebas, derecho a ser escuchado en audiencia acompañado de tu Vocero de Ficha y derecho al Recurso de Reposición.',
    article: 'Artículos 46 al 49 (Acuerdo 0009 de 2024)',
  },
];

export const RegulationChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'bot' | 'user'; text: string; article?: string }>>([
    {
      sender: 'bot',
      text: '¡Hola! Soy SofIA, tu asistente de inducción SENA. Pregúntame sobre el nuevo Acuerdo No. 0009 de 2024, tus 24 derechos fundamentales, deberes, deserción, etapa productiva o debido proceso.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputVal.trim();
    if (!query) return;

    const newMessages = [...messages, { sender: 'user' as const, text: query }];
    setMessages(newMessages);
    if (!textToSend) setInputVal('');

    // Match FAQ or provide smart contextual response
    const normalized = query.toLowerCase();
    const foundFaq = FREQUENT_QUESTIONS.find((f) =>
      normalized.includes('falta') && normalized.includes('días')
        ? f.question.includes('3 días')
        : normalized.includes('revis') || normalized.includes('nota') || normalized.includes('calific')
        ? f.question.includes('revisión')
        : normalized.includes('productiv') || normalized.includes('práctica') || normalized.includes('contrato')
        ? f.question.includes('Etapa Productiva')
        : normalized.includes('sancion') || normalized.includes('formativ') || normalized.includes('medida')
        ? f.question.includes('medida formativa')
        : normalized.includes('comit') || normalized.includes('descargo') || normalized.includes('debido')
        ? f.question.includes('Comité')
        : f.question.toLowerCase().includes(normalized.slice(0, 15))
    );

    setTimeout(() => {
      if (foundFaq) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: foundFaq.answer,
            article: foundFaq.article,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: `En relación a "${query}": De acuerdo con el Reglamento del Aprendiz SENA (Acuerdo 007), toda actuación académica o disciplinaria se rige por los principios de la dignidad humana, la formación profesional integral y el debido proceso. Te recomendamos consultar las secciones de Derechos (Cap. II), Deberes (Cap. III) o radicar tu inquietud ante la Coordinación Académica o el Comité de tu Centro de Formación.`,
            article: 'Reglamento General SENA',
          },
        ]);
      }
    }, 400);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px] transition-colors">
      {/* Header */}
      <div className="p-4 bg-[#00324D] dark:bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-[#39A900] rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold">SofIA · Consultorio del Reglamento</h3>
            <p className="text-[11px] text-slate-300 dark:text-slate-400">Respuestas normativas al instante</p>
          </div>
        </div>
        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-emerald-300 font-mono-data">
          Acuerdo 007
        </span>
      </div>

      {/* Suggested quick pills */}
      <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <span className="text-slate-400 dark:text-slate-400 font-medium whitespace-nowrap pl-1">Consultas rápidas:</span>
        {FREQUENT_QUESTIONS.slice(0, 3).map((faq, i) => (
          <button
            key={i}
            onClick={() => handleSend(faq.question)}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#39A900] dark:hover:border-[#39A900] text-slate-700 dark:text-slate-200 whitespace-nowrap shrink-0 transition-all text-[11px]"
          >
            {faq.question.split('?')[0]}?
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAFCFD] dark:bg-slate-950/50">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'bot' && (
              <div className="w-7 h-7 rounded-lg bg-[#00324D] dark:bg-[#39A900] text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-[#39A900] text-white rounded-tr-none'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm rounded-tl-none'
              }`}
            >
              <p>{m.text}</p>
              {m.article && (
                <span className="mt-2 block pt-1.5 border-t border-slate-100 dark:border-slate-700 text-[10px] font-mono-data text-[#39A900] dark:text-emerald-400 font-semibold">
                  Fundamento: {m.article}
                </span>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Escribe tu duda sobre el reglamento..."
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] focus:bg-white dark:focus:bg-slate-800 placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="p-2 rounded-xl bg-[#00324D] dark:bg-[#39A900] hover:bg-[#002235] dark:hover:bg-[#329200] text-white transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
