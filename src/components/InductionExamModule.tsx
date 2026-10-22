import React, { useState } from 'react';
import { EXAM_QUESTIONS } from '../data/senaRegulationData';
import { ExamQuestion } from '../types/induction';
import { ChildAvatar } from './ChildAvatar';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  ArrowRight, 
  FileCheck2, 
  AlertCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface InductionExamModuleProps {
  onExamPassed: (finalScore: number, percentGrade: number) => void;
  onOpenCertificate: () => void;
  isUnlocked: boolean;
  currentScore: number;
}

export const InductionExamModule: React.FC<InductionExamModuleProps> = ({
  onExamPassed,
  onOpenCertificate,
  isUnlocked,
  currentScore,
}) => {
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [calculatedGrade, setCalculatedGrade] = useState(currentScore || 0);
  const [calculatedPercent, setCalculatedPercent] = useState(0);

  const totalQuestions = EXAM_QUESTIONS.length;
  const answeredCount = Object.keys(userAnswers).length;

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (isSubmitted) return;
    setUserAnswers({
      ...userAnswers,
      [questionIndex]: optionIndex,
    });
  };

  const handleSubmitExam = () => {
    let correctCount = 0;
    EXAM_QUESTIONS.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    // Grade on 0.0 - 5.0 scale (Colombian academic scale)
    const grade = Number(((correctCount / totalQuestions) * 5.0).toFixed(1));

    setCalculatedGrade(grade);
    setCalculatedPercent(percent);
    setIsSubmitted(true);

    if (grade >= 4.0) {
      onExamPassed(grade, percent);
      triggerConfetti();
    }
  };

  const handleRetake = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const isPassed = calculatedGrade >= 4.0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-950/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ChildAvatar variant="graduate" size="md" />
          <div>
            <h2 className="font-display text-xl font-bold text-[#00324D] dark:text-white">
              Evaluación Final de Inducción Institucional
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Requisito de inducción: 10 preguntas sobre el Reglamento. Calificación mínima de aprobación: <strong className="text-orange-600 dark:text-orange-400">4.0 / 5.0 (80%)</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isUnlocked && (
            <button
              onClick={onOpenCertificate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] text-white text-xs font-bold hover:from-[#329200] hover:to-[#ea580c] transition-all shadow-sm cursor-pointer"
            >
              <ChildAvatar variant="graduate" size="xs" />
              <span>Ver Certificado</span>
            </button>
          )}

          <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/50 dark:to-orange-950/50 border border-orange-200 dark:border-orange-800 text-slate-800 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 shadow-xs">
            <ChildAvatar variant="star" size="xs" />
            <span>Respondidas: <strong className="font-mono-data text-[#39A900]">{answeredCount}/{totalQuestions}</strong></span>
          </div>
        </div>
      </div>

      {/* Results Header Card if submitted */}
      {isSubmitted && (
        <div
          className={`p-6 sm:p-8 rounded-3xl border-2 text-center space-y-4 shadow-xl transition-all ${
            isPassed
              ? 'bg-gradient-to-b from-emerald-50 dark:from-emerald-950/50 via-white dark:via-slate-900 to-white dark:to-slate-900 border-[#39A900]'
              : 'bg-gradient-to-b from-orange-50 dark:from-orange-950/50 via-white dark:via-slate-900 to-white dark:to-slate-900 border-orange-400 dark:border-orange-800'
          }`}
        >
          <div className="flex justify-center">
            {isPassed ? <ChildAvatar variant="graduate" size="xl" /> : <ChildAvatar variant="detective" size="xl" />}
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              {isPassed ? '¡Felicitaciones! Has Aprobado la Inducción SENA' : 'No alcanzaste el puntaje mínimo aprobatorio'}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
              {isPassed
                ? 'Has alcanzado las competencias normativas y éticas reglamentarias. Tu Certificado Oficial ha sido generado con éxito.'
                : 'La calificación mínima es 4.0 (80%). Revisa las explicaciones de cada pregunta a continuación y vuelve a intentarlo sin límite.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 py-2">
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Nota Obtenida</span>
              <span className={`font-mono-data text-3xl font-extrabold ${isPassed ? 'text-[#39A900]' : 'text-orange-600 dark:text-orange-400'}`}>
                {calculatedGrade.toFixed(1)} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
              </span>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Porcentaje de Aciertos</span>
              <span className="font-mono-data text-3xl font-extrabold text-[#00324D] dark:text-sky-400">{calculatedPercent}%</span>
            </div>
            <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold block">Estado</span>
              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full shadow-xs ${isPassed ? 'bg-gradient-to-r from-[#39A900] to-[#2d8500] text-white' : 'bg-gradient-to-r from-orange-500 to-red-500 text-white'}`}>
                {isPassed ? 'APROBADO' : 'NO APROBADO'}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRetake}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-orange-500" />
              <span>Intentar de Nuevo</span>
            </button>

            {isPassed && (
              <button
                onClick={onOpenCertificate}
                className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer transform hover:-translate-y-0.5"
              >
                <ChildAvatar variant="graduate" size="xs" />
                <span>Generar e Imprimir Certificado</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="space-y-6">
        {EXAM_QUESTIONS.map((q, qIndex) => {
          const selectedAnswer = userAnswers[qIndex];
          const hasAnswered = selectedAnswer !== undefined;

          return (
            <div
              key={q.id}
              className={`p-6 sm:p-7 rounded-2xl border-2 transition-all ${
                isSubmitted
                  ? selectedAnswer === q.correctIndex
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/30 border-[#39A900]/70'
                    : 'bg-rose-50/40 dark:bg-rose-950/30 border-rose-300 dark:border-rose-800'
                  : hasAnswered
                  ? 'bg-white dark:bg-slate-900 border-orange-300 dark:border-orange-800 shadow-sm'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              {/* Question Header */}
              <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 mb-2">
                <span className="font-mono-data font-bold text-[#00324D] dark:text-emerald-400 flex items-center gap-1.5">
                  <ChildAvatar variant="reader" size="xs" />
                  <span>Pregunta {qIndex + 1} de {totalQuestions}</span>
                </span>
                <span className="text-[11px] bg-orange-100/70 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 px-2.5 py-0.5 rounded-md font-bold">
                  {q.chapter}
                </span>
              </div>

              <h4 className="font-display text-base font-bold text-slate-900 dark:text-white leading-snug mb-4">
                {q.question}
              </h4>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((opt, optIndex) => {
                  const isOptionSelected = selectedAnswer === optIndex;
                  const isCorrect = optIndex === q.correctIndex;

                  let optClass = 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50/30 text-slate-700 dark:text-slate-200';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optClass = 'border-[#39A900] bg-emerald-100/70 dark:bg-emerald-950/70 text-emerald-950 dark:text-emerald-100 font-semibold ring-2 ring-[#39A900]/40';
                    } else if (isOptionSelected && !isCorrect) {
                      optClass = 'border-rose-400 dark:border-rose-700 bg-rose-100/70 dark:bg-rose-950/70 text-rose-950 dark:text-rose-100';
                    } else {
                      optClass = 'border-slate-100 dark:border-slate-800/50 text-slate-400 dark:text-slate-600 opacity-50';
                    }
                  } else if (isOptionSelected) {
                    optClass = 'border-[#FF6B00] bg-orange-50 dark:bg-slate-800 text-orange-900 dark:text-orange-300 font-bold ring-2 ring-[#FF6B00]/40';
                  }

                  return (
                    <button
                      key={optIndex}
                      disabled={isSubmitted}
                      onClick={() => handleSelectOption(qIndex, optIndex)}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all flex items-start gap-3 text-xs sm:text-sm cursor-pointer ${optClass}`}
                    >
                      <span className="w-5 h-5 rounded-full border-2 border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300 flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                        {String.fromCharCode(65 + optIndex)}
                      </span>
                      <span className="leading-relaxed">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback Explanation after submit */}
              {isSubmitted && (
                <div className="mt-4 pt-3 border-t border-slate-200/80 dark:border-slate-700/80 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    {selectedAnswer === q.correctIndex ? (
                      <span className="text-[#39A900] flex items-center gap-1.5 font-bold">
                        <ChildAvatar variant="star" size="xs" />
                        <span>Acierto</span>
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-bold">
                        <ChildAvatar variant="detective" size="xs" />
                        <span>Respuesta Incorrecta</span>
                      </span>
                    )}
                    <span className="text-orange-600 dark:text-orange-400 font-semibold">· {q.articleRef}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Actions Bar if not submitted */}
      {!isSubmitted && (
        <div className="sticky bottom-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border-2 border-orange-300 dark:border-orange-800 shadow-xl flex items-center justify-between gap-4 transition-colors">
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {answeredCount < totalQuestions ? (
              <span>Faltan <strong className="font-mono-data text-orange-600 dark:text-orange-400 font-bold">{totalQuestions - answeredCount}</strong> preguntas por responder</span>
            ) : (
              <span className="text-[#39A900] font-bold flex items-center gap-1.5">
                <ChildAvatar variant="star" size="xs" />
                <span>Todas las preguntas han sido respondidas</span>
              </span>
            )}
          </div>

          <button
            onClick={handleSubmitExam}
            disabled={answeredCount < totalQuestions}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-md ${
              answeredCount === totalQuestions
                ? 'bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] shadow-emerald-700/20 cursor-pointer transform hover:-translate-y-0.5'
                : 'bg-slate-300 dark:bg-slate-800 cursor-not-allowed opacity-75'
            }`}
          >
            <ChildAvatar variant="graduate" size="xs" />
            <span>Finalizar y Calificar Examen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
