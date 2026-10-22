import React from 'react';
import { ApprenticeData } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { ChildAvatar } from './ChildAvatar';
import { 
  Award, 
  BookOpen, 
  Gamepad2, 
  Scale, 
  HelpCircle, 
  CheckCircle2, 
  Clock, 
  User, 
  FileText,
  Sparkles,
  FileSpreadsheet,
  ArrowLeftRight
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroBannerProps {
  apprentice: ApprenticeData;
  progressPercent: number;
  totalScore: number;
  isCertificateUnlocked: boolean;
  onNavigate: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenCertificate: () => void;
  onOpenPlan: () => void;
  onOpenGoogleSheets: () => void;
  userRole?: 'instructor' | 'aprendiz';
  onOpenLanding?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  apprentice,
  progressPercent,
  totalScore,
  isCertificateUnlocked,
  onNavigate,
  onOpenProfile,
  onOpenCertificate,
  onOpenPlan,
  onOpenGoogleSheets,
  userRole = 'aprendiz',
  onOpenLanding,
}) => {
  const { language, t } = useLanguage();
  return (
    <div className="space-y-8">
      {/* Main Hero Card with High-Impact SENA Styling */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00324D] via-[#002235] to-[#011624] text-white p-8 md:p-12 shadow-xl border border-slate-700/50">
        {/* Subtle decorative geometric watermarks */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#39A900]/10 blur-3xl pointer-events-none" />
        <div className="absolute right-12 bottom-6 opacity-10 pointer-events-none hidden lg:block">
          <SenaLogo size={240} />
        </div>

        <div className="relative z-10 max-w-3xl space-y-6 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 via-orange-500/20 to-emerald-500/20 backdrop-blur-md border border-orange-400/30 text-xs font-medium text-emerald-300 max-w-full min-w-0">
              <ChildAvatar variant="star" size="xs" />
              <span className="truncate">{t.heroPill}</span>
            </div>
            {onOpenLanding && (
              <button
                onClick={onOpenLanding}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-orange-500/30 to-emerald-500/30 hover:from-orange-500/40 hover:to-emerald-500/40 text-white text-xs font-semibold border border-orange-400/40 transition-all shadow-sm cursor-pointer shrink-0"
                title={t.returnToChangeRole}
              >
                <ChildAvatar variant="instructor_kid" size="xs" />
                <span>{t.switchRole}</span>
              </button>
            )}
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            {t.heroTitlePart1} <span className="text-[#39A900]">{t.heroTitleSena}</span>{t.heroTitlePart2} <span className="text-[#FF6B00]">{t.heroTitleDuties}</span> {t.heroTitlePart3}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed font-light">
            {t.heroSubtitle}
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
            <button
              onClick={() => onNavigate('clasificador')}
              className="inline-flex items-center gap-2.5 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-[#39A900] via-[#2d8500] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white font-semibold text-xs sm:text-sm transition-all shadow-lg shadow-emerald-600/30 hover:shadow-orange-500/30 hover:-translate-y-0.5 cursor-pointer"
            >
              <ChildAvatar variant="gamer" size="xs" />
              <span>{t.startGamesBtn}</span>
            </button>

            <button
              onClick={() => onNavigate('reglamento')}
              className="inline-flex items-center gap-2.5 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs sm:text-sm transition-colors border border-orange-300/30 hover:border-[#39A900] cursor-pointer"
            >
              <ChildAvatar variant="reader" size="xs" />
              <span>{t.exploreArticlesBtn}</span>
            </button>

            <button
              onClick={onOpenPlan}
              className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-xl text-xs font-medium text-slate-300 hover:text-white transition-colors underline decoration-orange-400 underline-offset-4 cursor-pointer"
            >
              <ChildAvatar variant="boy_glasses" size="xs" />
              <span>{language === 'en' ? 'View 40-Hour Plan' : 'Ver Plan 40 Horas'}</span>
            </button>
          </div>
        </div>

        {/* Apprentice Identity Strip at bottom of Hero (Overflow Safe) */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-emerald-500/20 min-w-0">
            <ChildAvatar variant="boy_hoodie" size="sm" />
            <div className="min-w-0 flex-1">
              <span className="text-slate-400 block text-[11px]">{language === 'en' ? 'Enrolled Apprentice' : 'Aprendiz Matriculado'}</span>
              <span className="font-semibold text-white truncate block">{apprentice.fullName}</span>
              <span className="text-orange-300 text-[10px] truncate block font-medium">{apprentice.documentType} {apprentice.documentNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-orange-500/20 min-w-0">
            <ChildAvatar variant="reader" size="sm" />
            <div className="min-w-0 flex-1">
              <span className="text-slate-400 block text-[11px]">{language === 'en' ? 'Program & Cohort' : 'Programa & Ficha'}</span>
              <span className="font-semibold text-white truncate block">{apprentice.trainingProgram}</span>
              <span className="font-mono-data text-emerald-400 text-[11px] truncate block">{language === 'en' ? 'Cohort' : 'Ficha'} #{apprentice.fichaNumber}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-emerald-500/20 min-w-0">
            <ChildAvatar variant="detective" size="sm" />
            <div className="min-w-0 flex-1">
              <span className="text-slate-400 block text-[11px]">{language === 'en' ? 'Intensity' : 'Intensidad'}</span>
              <span className="font-semibold text-white truncate block">{language === 'en' ? '40 Regulatory Hours' : '40 Horas Normativas'}</span>
              <span className="text-orange-300 block text-[10px] truncate">{apprentice.regional}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white/5 p-3 rounded-xl backdrop-blur-sm border border-orange-500/20 min-w-0">
            <div className="min-w-0 flex-1">
              <span className="text-slate-400 block text-[11px]">{t.overallProgress}</span>
              <span className="font-mono-data text-base font-bold text-[#39A900]">{progressPercent}%</span>
              <span className="text-orange-300 text-[10px] block truncate font-medium">{language === 'en' ? 'Grade:' : 'Nota:'} {totalScore.toFixed(1)} / 5.0</span>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {userRole === 'instructor' ? (
                <button
                  onClick={onOpenGoogleSheets}
                  title="Sincronizar y ver en Google Sheets"
                  className="text-[11px] p-1.5 rounded-lg bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChildAvatar variant="gamer" size="xs" />
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  onClick={onOpenProfile}
                  className="text-[11px] px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <ChildAvatar variant="boy_cap" size="xs" />
                  <span>{language === 'en' ? 'Edit' : 'Editar'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Gamified Route Cards - 4 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Reglamento */}
        <div
          onClick={() => onNavigate('reglamento')}
          className="group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-100 dark:border-emerald-950/60 hover:border-[#39A900] dark:hover:border-[#39A900] shadow-sm hover:shadow-lg transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <ChildAvatar variant="reader" size="md" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {language === 'en' ? 'Phase 1' : 'Fase 1'}
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors">
              1. {t.route1Title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t.route1Desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-[#39A900] flex items-center gap-1">
            <span>{language === 'en' ? 'Explore articles' : 'Explorar artículos'}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 2: Clasificador Exprés */}
        <div
          onClick={() => onNavigate('clasificador')}
          className="group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-100 dark:border-orange-950/60 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] shadow-sm hover:shadow-lg transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <ChildAvatar variant="gamer" size="md" />
            <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
              {language === 'en' ? 'Phase 2' : 'Fase 2'}
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">
              2. {t.route2Title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t.route2Desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-[#FF6B00] flex items-center gap-1">
            <span>{language === 'en' ? 'Play sorter' : 'Jugar clasificador'}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 3: Casos y Dilemas */}
        <div
          onClick={() => onNavigate('casos')}
          className="group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 border-emerald-100 dark:border-emerald-950/60 hover:border-[#39A900] dark:hover:border-[#39A900] shadow-sm hover:shadow-lg transition-all space-y-3"
        >
          <div className="flex items-center justify-between">
            <ChildAvatar variant="detective" size="md" />
            <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              {language === 'en' ? 'Phase 3' : 'Fase 3'}
            </span>
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#39A900] transition-colors">
              3. {t.route3Title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t.route3Desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-[#39A900] flex items-center gap-1">
            <span>{language === 'en' ? 'Solve cases' : 'Resolver dilemas'}</span>
            <span>&rarr;</span>
          </div>
        </div>

        {/* Card 4: Evaluación & Certificado */}
        <div
          onClick={() => onNavigate('evaluacion')}
          className={`group cursor-pointer p-6 bg-white dark:bg-slate-900 rounded-2xl border-2 shadow-sm hover:shadow-lg transition-all space-y-3 ${
            isCertificateUnlocked
              ? 'border-[#FF6B00] dark:border-[#FF6B00] ring-2 ring-[#FF6B00]/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-[#FF6B00]'
          }`}
        >
          <div className="flex items-center justify-between">
            <ChildAvatar variant="graduate" size="md" />
            {isCertificateUnlocked ? (
              <span className="inline-flex items-center text-[11px] font-bold text-white bg-gradient-to-r from-[#39A900] to-[#FF6B00] px-2.5 py-0.5 rounded-full shadow-xs">
                {language === 'en' ? 'Unlocked!' : '¡Desbloqueado!'}
              </span>
            ) : (
              <span className="text-[10px] font-bold text-orange-700 dark:text-orange-300 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">
                {language === 'en' ? 'Final Phase' : 'Fase Final'}
              </span>
            )}
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-slate-900 dark:text-white group-hover:text-[#FF6B00] transition-colors">
              4. {t.route4Title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {t.route4Desc}
            </p>
          </div>
          <div className="pt-2 text-xs font-semibold text-[#FF6B00] flex items-center gap-1">
            <span>{isCertificateUnlocked ? (language === 'en' ? 'View certificate' : 'Ver diploma institucional') : (language === 'en' ? 'Take evaluation' : 'Rendir evaluación')}</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
