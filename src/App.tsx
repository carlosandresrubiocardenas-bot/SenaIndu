import React, { useState, useEffect } from 'react';
import { DEFAULT_APPRENTICE } from './data/senaRegulationData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { InteractiveRegulationExplorer } from './components/InteractiveRegulationExplorer';
import { GamifiedSorterGame } from './components/GamifiedSorterGame';
import { EthicalDilemmasModule } from './components/EthicalDilemmasModule';
import { InductionExamModule } from './components/InductionExamModule';
import { OfficialCertificate } from './components/OfficialCertificate';
import { ApprenticeProfileModal } from './components/ApprenticeProfileModal';
import { RegulationChatAssistant } from './components/RegulationChatAssistant';
import { PlanEstructuradoView } from './components/PlanEstructuradoModal';
import { GoogleSheetsSyncModal } from './components/GoogleSheetsSyncModal';
import { AutoSyncBanner } from './components/AutoSyncBanner';
import { AutoSyncToast } from './components/AutoSyncToast';
import { InstructorDashboard } from './components/InstructorDashboard';
import { InstructorAccessModal } from './components/InstructorAccessModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { useAutoSync } from './hooks/useAutoSync';
import { SenaLogo } from './components/SenaLogo';
import { ChildAvatar } from './components/ChildAvatar';
import { UserRole, ApprenticeData } from './types/induction';
import { 
  ShieldCheck, 
  BookOpen, 
  Scale, 
  Award, 
  HelpCircle,
  FileCheck2,
  Users,
  Compass,
  Lock,
  ArrowRight,
  ArrowLeftRight
} from 'lucide-react';

export default function App() {
  // Role State: 'instructor' | 'aprendiz'
  const [userRole, setUserRole] = useState<UserRole>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const roleParam = params.get('role');
      if (roleParam === 'aprendiz' || roleParam === 'instructor') {
        return roleParam as UserRole;
      }
      const saved = localStorage.getItem('sena_user_role') as UserRole;
      if (saved === 'aprendiz' || saved === 'instructor') {
        return saved;
      }
    }
    return 'aprendiz';
  });

  // Role Selection Landing Page Visibility
  // Opens by default unless a role was already confirmed in localStorage and no ?landing=true is set
  const [isLandingOpen, setIsLandingOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('landing') === 'true') return true;
      if (params.get('landing') === 'false') return false;
      const confirmed = localStorage.getItem('sena_role_confirmed');
      if (confirmed === 'true') {
        return false;
      }
    }
    return true;
  });

  const [isInstructorAccessOpen, setIsInstructorAccessOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('role') === 'instructor') return 'instructor_dashboard';
      if (params.get('role') === 'aprendiz') return 'inicio';
      const saved = localStorage.getItem('sena_user_role');
      if (saved === 'instructor') return 'instructor_dashboard';
    }
    return 'inicio';
  });

  const [apprentice, setApprentice] = useState<ApprenticeData>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_apprentice_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // fallback to default
        }
      }
    }
    return DEFAULT_APPRENTICE;
  });

  const [language, setLanguage] = useState<'es' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('sena_lang') as 'es' | 'en') || 'es';
    }
    return 'es';
  });

  const handleToggleLanguage = () => {
    const nextLang = language === 'es' ? 'en' : 'es';
    setLanguage(nextLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_lang', nextLang);
    }
  };

  const handleSelectInstructor = () => {
    setUserRole('instructor');
    setActiveTab('instructor_dashboard');
    setIsLandingOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_user_role', 'instructor');
      localStorage.setItem('sena_role_confirmed', 'true');
      const url = new URL(window.location.href);
      url.searchParams.set('role', 'instructor');
      url.searchParams.delete('landing');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSelectAprendiz = (newApprenticeData: ApprenticeData) => {
    setApprentice(newApprenticeData);
    setUserRole('aprendiz');
    setActiveTab('inicio');
    setIsLandingOpen(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_user_role', 'aprendiz');
      localStorage.setItem('sena_role_confirmed', 'true');
      localStorage.setItem('sena_apprentice_profile', JSON.stringify(newApprenticeData));
      const url = new URL(window.location.href);
      url.searchParams.set('role', 'aprendiz');
      url.searchParams.delete('landing');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleOpenLanding = () => {
    setIsLandingOpen(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sena_role_confirmed');
      const url = new URL(window.location.href);
      url.searchParams.set('landing', 'true');
      window.history.replaceState({}, '', url.toString());
    }
  };

  const handleSetRole = (newRole: UserRole) => {
    setUserRole(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_user_role', newRole);
      const url = new URL(window.location.href);
      url.searchParams.set('role', newRole);
      window.history.replaceState({}, '', url.toString());
    }
    if (newRole === 'instructor') {
      setActiveTab('instructor_dashboard');
    } else {
      setActiveTab('inicio');
    }
  };
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState<boolean>(false);
  
  // Dark mode state and full-screen blur transition trigger
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_induction_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isScreenBlurActive, setIsScreenBlurActive] = useState<boolean>(false);

  // Sync dark mode class on document element and body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle dark mode with the requested full-screen blur effect
  const handleToggleDarkMode = () => {
    const nextMode = !isDarkMode;
    setIsDarkMode(nextMode);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_induction_theme', nextMode ? 'dark' : 'light');
      if (nextMode) {
        document.documentElement.classList.add('dark');
        document.body.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
        document.body.classList.remove('dark');
      }
    }

    // Trigger full-screen blur flash effect
    setIsScreenBlurActive(true);
    setTimeout(() => {
      setIsScreenBlurActive(false);
    }, 750);
  };

  // Gamification & Progression State
  const [classifierScore, setClassifierScore] = useState<number>(0);
  const [dilemmaScore, setDilemmaScore] = useState<number>(0);
  const [examGrade, setExamGrade] = useState<number>(4.8); // Default demo high grade or initial
  const [examPercent, setExamPercent] = useState<number>(96);
  const [isCertificateUnlocked, setIsCertificateUnlocked] = useState<boolean>(true); // Ready to view or update

  // Calculate overall induction progress percentage
  const calculateProgress = () => {
    let p = 25; // Base profile registered
    if (classifierScore > 0) p += 25;
    if (dilemmaScore > 0) p += 25;
    if (isCertificateUnlocked) p += 25;
    return Math.min(100, p);
  };

  const currentProgress = calculateProgress();
  const currentVerificationHash = `SENA-IND-${apprentice.fichaNumber}-${Math.abs(
    apprentice.documentNumber.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 8)}`;

  // Automatic Background Google Sheets Synchronizer
  const autoSync = useAutoSync({
    apprentice,
    progressPercent: currentProgress,
    score: examGrade,
    isCertified: isCertificateUnlocked,
    verificationHash: currentVerificationHash,
  });

  const handleExamPassed = (grade: number, percent: number) => {
    setExamGrade(grade);
    setExamPercent(percent);
    setIsCertificateUnlocked(true);
  };

  // If role selection landing page is active, show the dedicated landing portal
  if (isLandingOpen) {
    return (
      <RoleSelectionLanding
        currentApprentice={apprentice}
        onSelectInstructor={handleSelectInstructor}
        onSelectAprendiz={handleSelectAprendiz}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        initialRole={userRole}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative overflow-x-hidden w-full max-w-full`}>
      {/* Full Screen Blur Effect Overlay when dark mode is toggled */}
      {isScreenBlurActive && (
        <div
          className="fixed inset-0 z-50 pointer-events-none screen-blur-effect bg-black/25 backdrop-blur-lg"
          aria-hidden="true"
        />
      )}

      {/* 3-Zone Top Bar with Dark Mode Toggle in Zone 3 and Role Awareness */}
      <div className="no-print w-full overflow-hidden">
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenProfile={() => setIsProfileOpen(true)}
          onOpenCertificate={() => setActiveTab('certificado')}
          onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          isCertificateUnlocked={isCertificateUnlocked}
          score={examGrade}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          isAutoSyncConnected={autoSync.isConnected}
          isAutoSyncing={autoSync.status === 'syncing'}
          userRole={userRole}
          onOpenInstructorLogin={() => setIsInstructorAccessOpen(true)}
          onSwitchToInstructor={() => handleSetRole('instructor')}
          onOpenLanding={handleOpenLanding}
          language={language}
          onToggleLanguage={handleToggleLanguage}
        />
      </div>

      {/* Role State Banner with Green & Orange Combination + Child Avatar */}
      <div className="no-print bg-gradient-to-r from-emerald-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-900 dark:to-orange-950/40 border-b-2 border-orange-400/40 dark:border-orange-500/40 py-2 px-3 sm:px-4 transition-colors overflow-hidden w-full shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4 text-xs min-w-0">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <ChildAvatar 
              variant={userRole === 'instructor' ? 'instructor_kid' : 'boy_cap'} 
              size="sm" 
              glow={true}
              className="border-2 border-emerald-500" 
            />
            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 truncate">
              {userRole === 'instructor' ? (
                <>
                  <span className="truncate text-orange-600 dark:text-orange-400 font-bold">Instructor SENA</span>
                </>
              ) : (
                <>
                  <span className="truncate text-emerald-700 dark:text-emerald-400 font-bold">Aprendiz: {apprentice.fullName}</span>
                </>
              )}
            </span>
            <span className="text-orange-300 dark:text-orange-600 hidden sm:inline shrink-0">·</span>
            <span className="text-slate-500 dark:text-slate-400 hidden md:inline truncate">
              {userRole === 'instructor'
                ? 'Consola con sincronización a Google Drive'
                : `Ficha #${apprentice.fichaNumber} · ${apprentice.trainingProgram}`}
            </span>
          </div>

          <button
            onClick={handleOpenLanding}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer shrink-0 whitespace-nowrap"
            title="Volver a la pantalla inicial para cambiar de rol"
          >
            <ChildAvatar variant="star" size="xs" />
            <ArrowLeftRight className="w-3.5 h-3.5 text-white" />
            <span className="hidden sm:inline">Regresar a </span>
            <span>Cambiar Rol</span>
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 min-w-0">
        {/* INSTRUCTOR EXCLUSIVE DASHBOARD VIEW */}
        {activeTab === 'instructor_dashboard' && (
          <InstructorDashboard
            onSwitchToApprenticeView={() => handleSetRole('aprendiz')}
            onLogoutInstructor={handleOpenLanding}
          />
        )}

        {/* TAB 1: INICIO (Dashboard principal & presentación de inducción) */}
        {activeTab === 'inicio' && (
          <div className="space-y-10">
            <HeroBanner
              apprentice={apprentice}
              progressPercent={currentProgress}
              totalScore={examGrade}
              isCertificateUnlocked={isCertificateUnlocked}
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenProfile={() => setIsProfileOpen(true)}
              onOpenCertificate={() => setActiveTab('certificado')}
              onOpenPlan={() => setActiveTab('plan')}
              onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
              userRole={userRole}
              onOpenLanding={handleOpenLanding}
            />

            {/* Background Google Drive Auto-Sync Banner (Visible only for Instructor) */}
            {userRole === 'instructor' && (
              <AutoSyncBanner
                syncState={autoSync}
                onConnect={autoSync.connectAndSync}
                onOpenAuditModal={() => setIsGoogleSheetsOpen(true)}
              />
            )}

            {/* Split Section: SofIA Consultorio & Institutional Pillars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: SofIA Assistant */}
              <div className="lg:col-span-5 space-y-4">
                <div className="flex items-center gap-2">
                  <ChildAvatar variant="girl_curls" size="sm" glow={true} />
                  <span className="font-display text-base font-bold text-[#00324D] dark:text-white flex items-center gap-1.5">
                    <span>Consultorio SofIA</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-800">
                      En Vivo
                    </span>
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">· Respuestas Inmediatas</span>
                </div>
                <RegulationChatAssistant />
              </div>

              {/* Right Column: Key Regulatory Highlights & Guarantees */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-950 dark:to-orange-950 text-orange-700 dark:text-orange-300 border border-orange-300/50 mb-1">
                    <ChildAvatar variant="boy_hoodie" size="xs" />
                    <span>Pilares Normativos Institucionales</span>
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#00324D] dark:text-white">
                    Lo que todo <span className="text-[#39A900]">Aprendiz</span> <span className="text-[#FF6B00]">SENA</span> debe tener claro
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Tres pilares esenciales del marco normativo institucional para garantizar tu permanencia exitosa
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {/* Pillar 1: Green Accent with Star Child Avatar */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-500/30 dark:border-emerald-600/30 shadow-sm space-y-2 hover:border-[#39A900] dark:hover:border-[#39A900] hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <ChildAvatar variant="star" size="md" glow={true} />
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Tus Derechos son Inalienables (Capítulo II)</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                            24 Garantías
                          </span>
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Educación gratuita, Bienestar y Trato Digno</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                      El SENA te garantiza formación técnica y tecnológica integral sin ningún costo, acceso a talleres dotados,
                      orientación actitudinal, beneficios de Bienestar (deportes, psicología, apoyos) y el derecho a solicitar
                      revisión objetiva de tus evaluaciones en 3 días hábiles.
                    </p>
                  </div>

                  {/* Pillar 2: Orange Accent with Reader Child Avatar */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-500/30 dark:border-orange-600/30 shadow-sm space-y-2 hover:border-[#FF6B00] dark:hover:border-[#FF6B00] hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <ChildAvatar variant="reader" size="md" glow={true} />
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Deberes y Cumplimiento de Evidencias (Capítulo III)</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300">
                            Compromiso
                          </span>
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Asistencia, Porte de Carné y Cero Plagio</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                      Debes portar siempre visible tu carné institucional, respetar las normas de Seguridad y Salud en el Trabajo (SST),
                      asistir con puntualidad y justificar inasistencias en máximo 3 días hábiles. Recuerda que el plagio de código o
                      proyectos es falta grave.
                    </p>
                  </div>

                  {/* Pillar 3: Duo Green & Orange with Detective Child Avatar */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-500/30 dark:border-amber-600/30 shadow-sm space-y-2 hover:border-amber-500 dark:hover:border-amber-400 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3">
                      <ChildAvatar variant="detective" size="md" glow={true} />
                      <div>
                        <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                          <span>Medidas Formativas vs. Sanciones y Comité (Capítulos VII y IX)</span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                            Debido Proceso
                          </span>
                        </h4>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500">Planes de Mejoramiento y Garantía del Debido Proceso</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-12">
                      Ante una dificultad académica, el instructor concertará un Plan de Mejoramiento (medida formativa pedagógica sin sanción).
                      Si un caso pasa al Comité de Evaluación, tienes derecho a ser citado formalmente, radicar tus descargos en 3 días hábiles
                      y asistir con tu Vocero de Ficha.
                    </p>
                  </div>
                </div>

                <div className="p-5 bg-gradient-to-r from-emerald-500/15 via-orange-500/10 to-emerald-500/15 dark:from-emerald-950/40 dark:to-orange-950/40 rounded-2xl border-2 border-orange-400/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <ChildAvatar variant="gamer" size="lg" glow={true} />
                    <div>
                      <h5 className="font-display text-sm font-bold text-[#00324D] dark:text-white">
                        ¿Quieres comprobar tus conocimientos ahora?
                      </h5>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        Juega el Clasificador Exprés o responde los casos reales para desbloquear tu certificado.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('clasificador')}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold whitespace-nowrap shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    Ir al Clasificador
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: REGLAMENTO (Explorador interactivo de artículos) */}
        {activeTab === 'reglamento' && (
          <InteractiveRegulationExplorer
            onTakeQuiz={() => setActiveTab('clasificador')}
          />
        )}

        {/* TAB 3: CLASIFICADOR EXPRÉS (Minijuego de tarjetas) */}
        {activeTab === 'clasificador' && (
          <GamifiedSorterGame
            onCompleteScore={(pts) => setClassifierScore(pts)}
            onContinueToDilemmas={() => setActiveTab('casos')}
          />
        )}

        {/* TAB 4: CASOS Y DILEMAS ÉTICOS (Simulador de decisiones) */}
        {activeTab === 'casos' && (
          <EthicalDilemmasModule
            onCompleteScore={(pts) => setDilemmaScore(pts)}
            onProceedToExam={() => setActiveTab('evaluacion')}
          />
        )}

        {/* TAB 5: EVALUACIÓN FINAL DE INDUCCIÓN (Examen de 10 preguntas) */}
        {activeTab === 'evaluacion' && (
          <InductionExamModule
            onExamPassed={handleExamPassed}
            onOpenCertificate={() => setActiveTab('certificado')}
            isUnlocked={isCertificateUnlocked}
            currentScore={examGrade}
          />
        )}

        {/* TAB 6: PLAN ESTRUCTURADO (La propuesta curricular solicitada) */}
        {activeTab === 'plan' && (
          <PlanEstructuradoView
            onStartGamification={() => setActiveTab('clasificador')}
          />
        )}

        {/* TAB 7: CERTIFICADO OFICIAL */}
        {activeTab === 'certificado' && (
          <OfficialCertificate
            apprentice={apprentice}
            score={examGrade}
            percentGrade={examPercent}
            onBackToApp={() => setActiveTab(userRole === 'instructor' ? 'instructor_dashboard' : 'inicio')}
            onOpenProfile={() => setIsProfileOpen(true)}
            onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
            userRole={userRole}
          />
        )}
      </main>

      {/* Modal: Apprentice Data Editor */}
      <ApprenticeProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        apprentice={apprentice}
        onSave={(data) => setApprentice(data)}
      />

      {/* Modal: Google Sheets & Drive Sync (Privileged for Instructor) */}
      {userRole === 'instructor' && (
        <GoogleSheetsSyncModal
          isOpen={isGoogleSheetsOpen}
          onClose={() => setIsGoogleSheetsOpen(false)}
          apprentice={apprentice}
          progressPercent={currentProgress}
          score={examGrade}
          isCertified={isCertificateUnlocked}
          verificationHash={currentVerificationHash}
        />
      )}

      {/* Modal: Instructor Access Verification */}
      <InstructorAccessModal
        isOpen={isInstructorAccessOpen}
        onClose={() => setIsInstructorAccessOpen(false)}
        onSuccess={() => handleSetRole('instructor')}
      />

      {/* Non-blocking Floating Auto-Sync Toast */}
      <AutoSyncToast
        syncState={autoSync}
        onRetry={autoSync.forceSync}
        onOpenAuditModal={() => setIsGoogleSheetsOpen(true)}
        userRole={userRole}
      />

      {/* Quiet Footer (Hidden in print) */}
      <footer className="no-print mt-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <SenaLogo size={22} />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Servicio Nacional de Aprendizaje — SENA
            </span>
            <span aria-hidden="true">·</span>
            <span>República de Colombia</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
            <span>Reglamento del Aprendiz (Acuerdo No. 0009 de 2024)</span>
            <span aria-hidden="true">·</span>
            {userRole === 'instructor' ? (
              <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Modo Instructor Activo</span>
              </span>
            ) : (
              <span>Sistema Integral de Inducción Formativa</span>
            )}
            <span aria-hidden="true">·</span>
            {userRole === 'aprendiz' ? (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenLanding}
                  className="text-xs text-slate-400 hover:text-[#39A900] transition-colors inline-flex items-center gap-1 font-medium"
                  title="Volver al portal de bienvenida para cambiar de rol"
                >
                  <ArrowLeftRight className="w-3 h-3 text-[#39A900]" />
                  <span>Cambiar Rol</span>
                </button>
                <button
                  onClick={() => setIsInstructorAccessOpen(true)}
                  className="text-xs text-slate-400 hover:text-[#39A900] transition-colors inline-flex items-center gap-1"
                  title="Acceso exclusivo para el docente o instructor"
                >
                  <Lock className="w-3 h-3" />
                  <span>Acceso Instructor</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenLanding}
                  className="text-xs text-slate-400 hover:text-[#39A900] transition-colors inline-flex items-center gap-1 font-medium"
                  title="Volver al portal de bienvenida para cambiar de rol"
                >
                  <ArrowLeftRight className="w-3 h-3 text-[#39A900]" />
                  <span>Cambiar Rol</span>
                </button>
                <button
                  onClick={() => handleSetRole('aprendiz')}
                  className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  Probar Vista Aprendiz
                </button>
              </div>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
