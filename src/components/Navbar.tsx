import React, { useState } from 'react';
import { SenaLogo } from './SenaLogo';
import { ChildAvatar } from './ChildAvatar';
import { 
  Award, 
  UserCheck, 
  Moon, 
  Sun, 
  FileSpreadsheet, 
  ShieldCheck, 
  Eye, 
  ArrowLeftRight,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types/induction';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenProfile: () => void;
  onOpenCertificate: () => void;
  onOpenGoogleSheets: () => void;
  isCertificateUnlocked: boolean;
  score: number;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isAutoSyncConnected?: boolean;
  isAutoSyncing?: boolean;
  userRole: UserRole;
  onOpenInstructorLogin?: () => void;
  onSwitchToInstructor?: () => void;
  onOpenLanding?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenProfile,
  onOpenCertificate,
  onOpenGoogleSheets,
  isCertificateUnlocked,
  score,
  isDarkMode,
  onToggleDarkMode,
  isAutoSyncConnected,
  isAutoSyncing,
  userRole,
  onOpenInstructorLogin,
  onSwitchToInstructor,
  onOpenLanding,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b-2 border-orange-500/20 dark:border-orange-500/30 transition-colors duration-200 w-full overflow-hidden shadow-xs">
      {/* Top micro bar with green & orange gradient */}
      <div className="h-1 w-full bg-gradient-to-r from-[#39A900] via-[#F97316] to-[#FF6B00]" />

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 min-h-16 py-2 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
        {/* Zone 1: Brand Wordmark with Friendly Child Avatar */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0 min-w-0">
          <button
            onClick={() => (onOpenLanding ? onOpenLanding() : setActiveTab(userRole === 'instructor' ? 'instructor_dashboard' : 'inicio'))}
            className="flex items-center gap-2 sm:gap-2.5 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] rounded-lg cursor-pointer group min-w-0"
            title="Volver a la pantalla inicial de selección de rol"
          >
            <div className="shrink-0 scale-90 sm:scale-100 flex items-center gap-1.5">
              <SenaLogo size={42} />
              <ChildAvatar 
                variant={userRole === 'instructor' ? 'instructor_kid' : 'boy_cap'} 
                size="sm" 
                glow={true}
                className="hidden xs:inline-flex border-2 border-orange-400"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-display text-base sm:text-lg font-bold tracking-tight text-[#00324D] dark:text-white whitespace-nowrap shrink-0 group-hover:text-[#39A900] transition-colors flex items-center gap-1">
                <span>SENA</span>
                <span className="text-[#39A900]">Inducción</span>
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 truncate flex items-center gap-1">
                {userRole === 'instructor' ? (
                  <span className="text-orange-600 dark:text-orange-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
                    <span>Consola Instructor</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#39A900]" />
                    <span>Portal Aprendiz</span>
                  </span>
                )}
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Desktop Navigation Links (Each with Child Face Avatar + Green & Orange Accent) */}
        <nav className="hidden lg:flex items-center gap-2 xl:gap-3 text-xs font-medium text-slate-600 dark:text-slate-300">
          {userRole === 'instructor' ? (
            <>
              <button
                onClick={() => setActiveTab('instructor_dashboard')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'instructor_dashboard'
                    ? 'bg-gradient-to-r from-emerald-500/15 to-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="instructor_kid" size="xs" />
                <span>Seguimiento</span>
              </button>
              <button
                onClick={() => setActiveTab('inicio')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'inicio'
                    ? 'bg-gradient-to-r from-emerald-500/15 to-orange-500/15 text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="boy_cap" size="xs" />
                <span>Inducción</span>
              </button>
              <button
                onClick={() => setActiveTab('reglamento')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'reglamento'
                    ? 'bg-gradient-to-r from-emerald-500/15 to-orange-500/15 text-orange-600 dark:text-orange-400 font-bold border-b-2 border-orange-500'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="reader" size="xs" />
                <span>Reglamento</span>
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'plan'
                    ? 'bg-gradient-to-r from-emerald-500/15 to-orange-500/15 text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="graduate" size="xs" />
                <span>Plan Curricular</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('inicio')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'inicio'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="boy_cap" size="xs" />
                <span>Inicio</span>
              </button>
              <button
                onClick={() => setActiveTab('reglamento')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'reglamento'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold border-b-2 border-[#FF6B00]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="reader" size="xs" />
                <span>Reglamento</span>
              </button>
              <button
                onClick={() => setActiveTab('clasificador')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'clasificador'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="gamer" size="xs" />
                <span>Clasificador</span>
              </button>
              <button
                onClick={() => setActiveTab('casos')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'casos'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold border-b-2 border-[#FF6B00]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="detective" size="xs" />
                <span>Casos</span>
              </button>
              <button
                onClick={() => setActiveTab('evaluacion')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'evaluacion'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] font-bold border-b-2 border-[#39A900]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="graduate" size="xs" />
                <span>Evaluación</span>
              </button>
              <button
                onClick={() => setActiveTab('plan')}
                className={`inline-flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl transition-all whitespace-nowrap shrink-0 ${
                  activeTab === 'plan'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 font-bold border-b-2 border-[#FF6B00]'
                    : 'hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="girl_curls" size="xs" />
                <span>Plan 40H</span>
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Actions & Theme Toggle with Green & Orange Combination */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Cambiar Rol button with Child Avatar */}
          {onOpenLanding && (
            <button
              onClick={onOpenLanding}
              title="Volver a la pantalla inicial para cambiar de rol"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/80 dark:to-orange-950/80 hover:from-emerald-100 hover:to-orange-100 text-slate-800 dark:text-orange-200 border-2 border-orange-400/60 dark:border-orange-500/60 transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <ChildAvatar variant={userRole === 'instructor' ? 'boy_cap' : 'instructor_kid'} size="xs" />
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF6B00]" />
              <span className="hidden xs:inline">Cambiar Rol</span>
              <span className="xs:hidden">Rol</span>
            </button>
          )}

          {/* Dark Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/50 rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6B00] shrink-0 border border-transparent hover:border-orange-300"
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 hover:text-slate-900 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* INSTRUCTOR PRIVILEGED BUTTONS */}
          {userRole === 'instructor' ? (
            <>
              {/* Google Sheets Sync & Management Button */}
              <button
                onClick={onOpenGoogleSheets}
                title={
                  isAutoSyncing
                    ? 'Sincronizando automáticamente con Google Sheets...'
                    : isAutoSyncConnected
                    ? 'Google Drive: Sincronización continua activa (clic para ver hoja)'
                    : 'Conectar y sincronizar con Google Sheets en Google Drive'
                }
                className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-sm border ${
                  isAutoSyncConnected
                    ? 'text-orange-900 dark:text-orange-200 bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950 dark:to-orange-950 border-orange-300 dark:border-orange-700'
                    : 'text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700'
                }`}
              >
                <ChildAvatar variant="detective" size="xs" />
                <span className="hidden sm:inline">Sheets</span>
                {isAutoSyncing ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00] animate-ping ml-0.5" />
                ) : isAutoSyncConnected ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#39A900] ml-0.5" title="Sincronización activa" />
                ) : null}
              </button>

              <button
                onClick={() => setActiveTab(activeTab === 'instructor_dashboard' ? 'inicio' : 'instructor_dashboard')}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-xl bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 text-orange-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700 transition-colors shrink-0"
              >
                <Eye className="w-3.5 h-3.5 text-[#FF6B00]" />
                <span>{activeTab === 'instructor_dashboard' ? 'Inducción' : 'Consola'}</span>
              </button>
            </>
          ) : (
            /* APPRENTICE BUTTONS: Mis Datos & Certificado with Child Face Avatars */
            <>
              <button
                onClick={onOpenProfile}
                title="Ver o editar datos del aprendiz"
                className="hidden md:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 rounded-xl transition-colors whitespace-nowrap shrink-0 border border-slate-200 dark:border-slate-700 hover:border-[#39A900]"
              >
                <ChildAvatar variant="girl_pigtails" size="xs" />
                <span>Mis Datos</span>
              </button>

              <button
                onClick={onOpenCertificate}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 shadow-md ${
                  isCertificateUnlocked
                    ? 'bg-gradient-to-r from-[#39A900] via-[#22c55e] to-[#FF6B00] text-white hover:opacity-95 shadow-[#FF6B00]/20'
                    : 'bg-gradient-to-r from-[#00324D] to-[#FF6B00] text-white hover:opacity-95'
                }`}
              >
                <ChildAvatar variant="graduate" size="xs" glow={isCertificateUnlocked} />
                <span className="hidden xs:inline">{isCertificateUnlocked ? 'Certificado' : `Certificado (${score.toFixed(1)})`}</span>
                <span className="xs:hidden">{score.toFixed(1)}</span>
              </button>

              {/* Discreet Instructor Link */}
              {onOpenInstructorLogin && (
                <button
                  onClick={onOpenInstructorLogin}
                  title="Ingreso de Instructor para configuración y seguimiento"
                  className="hidden 2xl:inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  <ChildAvatar variant="instructor_kid" size="xs" />
                  <span>Instructor</span>
                </button>
              )}
            </>
          )}

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:bg-orange-50 dark:hover:bg-orange-950/60 rounded-xl transition-colors shrink-0 border border-slate-200 dark:border-slate-700"
            aria-label="Abrir menú de navegación"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 text-[#FF6B00]" /> : <Menu className="w-5 h-5 text-[#39A900]" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation with Child Avatars */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-orange-500/30 bg-white/98 dark:bg-slate-900/98 px-4 py-3 space-y-1.5 shadow-lg animate-in fade-in duration-150">
          {userRole === 'instructor' ? (
            <>
              <button
                onClick={() => handleTabClick('instructor_dashboard')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'instructor_dashboard'
                    ? 'bg-gradient-to-r from-orange-50 to-emerald-50 dark:from-orange-950/60 dark:to-emerald-950/60 text-[#FF6B00] border-l-4 border-[#FF6B00]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="instructor_kid" size="sm" />
                <span>Seguimiento y Consola de Instructor</span>
              </button>
              <button
                onClick={() => handleTabClick('inicio')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'inicio'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] border-l-4 border-[#39A900]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="boy_cap" size="sm" />
                <span>Vista de Inducción</span>
              </button>
              <button
                onClick={() => handleTabClick('reglamento')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'reglamento'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF6B00] border-l-4 border-[#FF6B00]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="reader" size="sm" />
                <span>Reglamento (Acuerdo 0009 de 2024)</span>
              </button>
              <button
                onClick={() => handleTabClick('plan')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'plan'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] border-l-4 border-[#39A900]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="graduate" size="sm" />
                <span>Plan Curricular de Inducción</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleTabClick('inicio')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'inicio'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] border-l-4 border-[#39A900]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="boy_cap" size="sm" />
                <span>Inicio & Pilares Institucionales</span>
              </button>
              <button
                onClick={() => handleTabClick('reglamento')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'reglamento'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF6B00] border-l-4 border-[#FF6B00]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="reader" size="sm" />
                <span>Explorador de Reglamento</span>
              </button>
              <button
                onClick={() => handleTabClick('clasificador')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'clasificador'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] border-l-4 border-[#39A900]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="gamer" size="sm" />
                <span>Clasificador Exprés de Faltas</span>
              </button>
              <button
                onClick={() => handleTabClick('casos')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'casos'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF6B00] border-l-4 border-[#FF6B00]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="detective" size="sm" />
                <span>Casos Reales y Dilemas Éticos</span>
              </button>
              <button
                onClick={() => handleTabClick('evaluacion')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'evaluacion'
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#39A900] border-l-4 border-[#39A900]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="graduate" size="sm" />
                <span>Evaluación Final de Inducción</span>
              </button>
              <button
                onClick={() => handleTabClick('plan')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2.5 transition-colors ${
                  activeTab === 'plan'
                    ? 'bg-orange-50 dark:bg-orange-950/60 text-[#FF6B00] border-l-4 border-[#FF6B00]'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <ChildAvatar variant="girl_curls" size="sm" />
                <span>Plan Estructurado (40 Horas)</span>
              </button>
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-orange-950/50 rounded-lg inline-flex items-center gap-2"
                >
                  <ChildAvatar variant="girl_pigtails" size="xs" />
                  <span>Mis Datos de Aprendiz</span>
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};
