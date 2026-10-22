import React, { useState } from 'react';
import { ETHICAL_DILEMMAS } from '../data/senaRegulationData';
import { EthicalDilemma, EthicalDilemmaOption } from '../types/induction';
import { ChildAvatar } from './ChildAvatar';
import { 
  Scale, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  RotateCcw, 
  HelpCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface EthicalDilemmasModuleProps {
  onCompleteScore: (score: number) => void;
  onProceedToExam: () => void;
}

export const EthicalDilemmasModule: React.FC<EthicalDilemmasModuleProps> = ({
  onCompleteScore,
  onProceedToExam,
}) => {
  const [currentDilemmaIndex, setCurrentDilemmaIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<EthicalDilemmaOption | null>(null);
  const [accumulatedScore, setAccumulatedScore] = useState(0);
  const [answeredCases, setAnsweredCases] = useState<number[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);

  const totalDilemmas = ETHICAL_DILEMMAS.length;
  const currentDilemma = ETHICAL_DILEMMAS[currentDilemmaIndex];

  const handleSelectOption = (option: EthicalDilemmaOption) => {
    if (selectedOption !== null) return; // Prevent changing after answer
    setSelectedOption(option);

    const newScore = accumulatedScore + option.score;
    setAccumulatedScore(newScore);
    setAnsweredCases([...answeredCases, currentDilemmaIndex]);
  };

  const handleNextCase = () => {
    setSelectedOption(null);
    if (currentDilemmaIndex + 1 < totalDilemmas) {
      setCurrentDilemmaIndex(currentDilemmaIndex + 1);
    } else {
      setIsCompleted(true);
      onCompleteScore(accumulatedScore);
      triggerConfetti();
    }
  };

  const handleReset = () => {
    setCurrentDilemmaIndex(0);
    setSelectedOption(null);
    setAccumulatedScore(0);
    setAnsweredCases([]);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-950/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ChildAvatar variant="detective" size="md" />
          <div>
            <h2 className="font-display text-xl font-bold text-[#00324D] dark:text-white">
              Simulador de Casos y Dilemas Reales
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Aprende a actuar ante situaciones cotidianas de taller, proyectos y convivencia en el SENA.
            </p>
          </div>
        </div>

        <div className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/50 dark:to-orange-950/50 text-[#00324D] dark:text-emerald-300 font-bold text-xs border border-orange-300 dark:border-orange-800 flex items-center gap-1.5 shadow-xs">
          <ChildAvatar variant="star" size="xs" />
          <span>Puntos Éticos: <strong className="font-mono-data text-[#39A900]">{accumulatedScore} / 100</strong></span>
        </div>
      </div>

      {!isCompleted ? (
        <div className="space-y-6">
          {/* Step Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
              <ChildAvatar variant="reader" size="xs" />
              <span>Caso {currentDilemmaIndex + 1} de {totalDilemmas}</span>
            </span>
            <span className="font-mono-data text-orange-600 dark:text-orange-400 font-bold">{currentDilemma.context}</span>
          </div>

          {/* Dilemma Scenario Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-200/80 dark:border-orange-900/60 shadow-md p-6 sm:p-8 space-y-6 transition-colors">
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-white bg-gradient-to-r from-[#39A900] to-[#FF6B00] px-3 py-0.5 rounded-full uppercase tracking-wider inline-block shadow-xs">
                {currentDilemma.context}
              </span>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white leading-snug">
                {currentDilemma.title}
              </h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                {currentDilemma.scenario}
              </div>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-orange-700 dark:text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
                <ChildAvatar variant="star" size="xs" />
                <span>¿Cuál es la conducta correcta que debes adoptar?</span>
              </span>

              {currentDilemma.options.map((opt) => {
                const isSelected = selectedOption?.id === opt.id;
                let btnStyle = 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/80 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50/30 text-slate-800 dark:text-slate-200';

                if (selectedOption !== null) {
                  if (opt.isCorrect) {
                    btnStyle = 'border-[#39A900] bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-950 dark:text-emerald-100 ring-2 ring-[#39A900]/30';
                  } else if (isSelected && !opt.isCorrect) {
                    btnStyle = 'border-rose-400 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-950 dark:text-rose-100 ring-2 ring-rose-400/30';
                  } else {
                    btnStyle = 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600 opacity-60';
                  }
                }

                return (
                  <button
                    key={opt.id}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelectOption(opt)}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-start gap-3.5 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border-2 border-orange-400 dark:border-orange-600 text-orange-700 dark:text-orange-300 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {opt.id.slice(-1).toUpperCase()}
                    </span>
                    <span className="text-xs sm:text-sm leading-relaxed">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback Deck when answered */}
            {selectedOption && (
              <div
                className={`p-4 rounded-2xl border-2 text-xs sm:text-sm space-y-2 animate-in fade-in-50 duration-200 ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {selectedOption.isCorrect ? (
                    <>
                      <ChildAvatar variant="star" size="xs" />
                      <span>Decisión Correcta (+25 Puntos)</span>
                    </>
                  ) : (
                    <>
                      <ChildAvatar variant="detective" size="xs" />
                      <span>Conducta Contradictoria al Reglamento (0 Puntos)</span>
                    </>
                  )}
                </div>

                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{selectedOption.feedback}</p>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-700/60">
                  <span className="font-mono-data text-orange-600 dark:text-orange-400">Fundamento Normativo: {selectedOption.articleReference}</span>
                  <button
                    onClick={handleNextCase}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer shrink-0"
                  >
                    <span>{currentDilemmaIndex + 1 < totalDilemmas ? 'Siguiente Caso' : 'Ver Balance de Dilemas'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Completion screen */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-orange-300 dark:border-orange-800 shadow-xl text-center space-y-6 transition-colors">
          <div className="flex justify-center">
            <ChildAvatar variant="graduate" size="xl" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white">
              ¡Simulación Ética Completada!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Has analizado los dilemas con criterio profesional integral, conociendo el conducto regular para defender tus derechos y cumplir tus deberes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/40 dark:to-orange-950/40 border-2 border-orange-200 dark:border-orange-800 max-w-sm mx-auto shadow-sm">
            <span className="text-xs font-bold text-orange-700 dark:text-orange-300 block uppercase">Puntaje Ético Acumulado</span>
            <span className="font-mono-data text-4xl font-extrabold text-[#39A900]">{accumulatedScore} / 100</span>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1 font-medium">
              {accumulatedScore >= 75 ? 'Excelente criterio formativo' : 'Recomendamos repasar el reglamento'}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-orange-500" />
              <span>Repetir Casos</span>
            </button>

            <button
              onClick={onProceedToExam}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer transform hover:-translate-y-0.5"
            >
              <ChildAvatar variant="graduate" size="xs" />
              <span>Ir a la Evaluación Final para Certificarme</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
