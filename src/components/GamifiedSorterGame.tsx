import React, { useState } from 'react';
import { QUICK_CLASSIFIER_CARDS } from '../data/senaRegulationData';
import { CardClassificationType } from '../types/induction';
import { ChildAvatar } from './ChildAvatar';
import { 
  Gamepad2, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Flame, 
  Award,
  ArrowRight
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';

interface GamifiedSorterGameProps {
  onCompleteScore: (score: number) => void;
  onContinueToDilemmas: () => void;
}

export const GamifiedSorterGame: React.FC<GamifiedSorterGameProps> = ({
  onCompleteScore,
  onContinueToDilemmas,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<{
    selected: CardClassificationType;
    isCorrect: boolean;
    explanation: string;
    articleRef: string;
  } | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const totalCards = QUICK_CLASSIFIER_CARDS.length;
  const currentCard = QUICK_CLASSIFIER_CARDS[currentIndex];

  const handleSelect = (category: CardClassificationType) => {
    if (lastAnswer !== null) return; // Prevent double clicking before next

    const isCorrect = category === currentCard.category;
    let newScore = score;
    let newStreak = streak;

    if (isCorrect) {
      newStreak = streak + 1;
      const points = 10 + newStreak * 2;
      newScore = score + points;
      setScore(newScore);
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);
    } else {
      newStreak = 0;
      setStreak(0);
    }

    setLastAnswer({
      selected: category,
      isCorrect,
      explanation: currentCard.explanation,
      articleRef: currentCard.articleRef,
    });
  };

  const handleNext = () => {
    setLastAnswer(null);
    if (currentIndex + 1 < totalCards) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setGameFinished(true);
      onCompleteScore(score);
      triggerConfetti();
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setLastAnswer(null);
    setGameFinished(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Game Title & Metrics Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-950/60 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
        <div className="flex items-center gap-3">
          <ChildAvatar variant="gamer" size="md" />
          <div>
            <h2 className="font-display text-xl font-bold text-[#00324D] dark:text-white">
              Clasificador Exprés del Reglamento
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Pon a prueba tu agilidad: clasifica cada situación en Derecho, Deber o Prohibición.
            </p>
          </div>
        </div>

        {/* Gamified counters */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-400 font-bold border border-orange-300 dark:border-orange-800/60 shadow-xs">
            <Flame className="w-4 h-4 text-[#FF6B00] fill-[#FF6B00]" />
            <span>Racha: <strong className="font-mono-data">{streak}x</strong></span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold shadow-xs">
            <ChildAvatar variant="star" size="xs" />
            <span>Puntos: <strong className="font-mono-data text-[#39A900]">{score}</strong></span>
          </div>
        </div>
      </div>

      {!gameFinished ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <ChildAvatar variant="boy_cap" size="xs" />
                <span>Tarjeta {currentIndex + 1} de {totalCards}</span>
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-bold">{Math.round(((currentIndex) / totalCards) * 100)}% Completado</span>
            </div>
            <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#39A900] via-[#2d8500] to-[#FF6B00] transition-all duration-300 rounded-full shadow-xs"
                style={{ width: `${((currentIndex + 1) / totalCards) * 100}%` }}
              />
            </div>
          </div>

          {/* Active Flashcard */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-200/80 dark:border-orange-900/60 p-8 sm:p-10 shadow-lg text-center space-y-6 relative overflow-hidden transition-all">
            {/* Regulatory watermark stamp */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-orange-700 dark:text-orange-400 uppercase tracking-widest bg-orange-100/60 dark:bg-orange-950/40 py-1 px-3 rounded-full w-fit mx-auto border border-orange-200 dark:border-orange-800">
              <ChildAvatar variant="star" size="xs" />
              <span>Caso o Situación Institucional #{currentIndex + 1}</span>
            </div>

            <p className="font-display text-xl sm:text-2xl font-bold text-slate-900 dark:text-white max-w-xl mx-auto leading-relaxed">
              "{currentCard.text}"
            </p>

            {/* Answer Feedback Banner if answered */}
            {lastAnswer && (
              <div
                className={`p-4 rounded-2xl text-left border-2 transition-all animate-in fade-in-50 duration-200 ${
                  lastAnswer.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] text-emerald-900 dark:text-emerald-100'
                    : 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-100'
                }`}
              >
                <div className="flex items-start gap-3">
                  {lastAnswer.isCorrect ? (
                    <ChildAvatar variant="star" size="sm" />
                  ) : (
                    <ChildAvatar variant="detective" size="sm" />
                  )}
                  <div className="space-y-1 text-xs sm:text-sm">
                    <p className="font-bold flex items-center gap-1.5">
                      {lastAnswer.isCorrect ? '¡Correcto!' : '¡Atención! No es la categoría correcta.'}
                    </p>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{lastAnswer.explanation}</p>
                    <span className="font-mono-data text-[11px] text-orange-600 dark:text-orange-400 block pt-1 font-bold">
                      Referencia: {lastAnswer.articleRef}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-right">
                  <button
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
                  >
                    <span>{currentIndex + 1 < totalCards ? 'Siguiente Situación' : 'Ver Resultados'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Classification Action Buttons (3 choices) */}
            {!lastAnswer && (
              <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => handleSelect('derecho')}
                  className="group p-4 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 hover:border-[#39A900] bg-emerald-50/60 dark:bg-emerald-950/30 hover:bg-emerald-100/70 text-[#00324D] dark:text-emerald-300 transition-all flex flex-col items-center gap-2 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ChildAvatar variant="reader" size="md" />
                  <span className="font-bold text-sm text-emerald-800 dark:text-emerald-300">Es un DERECHO</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Garantía institucional</span>
                </button>

                <button
                  onClick={() => handleSelect('deber')}
                  className="group p-4 rounded-2xl border-2 border-orange-300 dark:border-orange-800 hover:border-[#FF6B00] bg-orange-50/60 dark:bg-orange-950/30 hover:bg-orange-100/70 text-orange-900 dark:text-orange-300 transition-all flex flex-col items-center gap-2 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ChildAvatar variant="boy_hoodie" size="md" />
                  <span className="font-bold text-sm text-orange-800 dark:text-orange-300">Es un DEBER</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Obligación del aprendiz</span>
                </button>

                <button
                  onClick={() => handleSelect('prohibicion')}
                  className="group p-4 rounded-2xl border-2 border-rose-300 dark:border-rose-900/60 hover:border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-100/70 text-rose-900 dark:text-rose-300 transition-all flex flex-col items-center gap-2 shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-0.5"
                >
                  <ChildAvatar variant="detective" size="md" />
                  <span className="font-bold text-sm text-rose-800 dark:text-rose-300">Es PROHIBICIÓN</span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">Conducta vetada</span>
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Results Screen */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border-2 border-orange-300 dark:border-orange-800 shadow-xl text-center space-y-6 transition-colors">
          <div className="flex justify-center">
            <ChildAvatar variant="graduate" size="xl" />
          </div>

          <div className="space-y-2">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white">
              ¡Reto del Clasificador Completado!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Has demostrado un dominio sólido distinguiendo entre lo que puedes exigir, lo que debes cumplir y lo que debes evitar en el SENA.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto py-2">
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">Puntaje Final</span>
              <span className="font-mono-data text-2xl font-bold text-[#39A900]">{score}</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
              <span className="text-[11px] font-bold text-orange-800 dark:text-orange-300 block">Mejor Racha</span>
              <span className="font-mono-data text-2xl font-bold text-orange-600 dark:text-orange-400">{bestStreak}x</span>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Efectividad</span>
              <span className="font-mono-data text-2xl font-bold text-[#00324D] dark:text-sky-400">
                {Math.min(100, Math.round((score / (totalCards * 14)) * 100))}%
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestart}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-orange-500" />
              <span>Volver a Jugar</span>
            </button>

            <button
              onClick={onContinueToDilemmas}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer transform hover:-translate-y-0.5"
            >
              <ChildAvatar variant="detective" size="xs" />
              <span>Continuar a Casos y Dilemas Reales</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
