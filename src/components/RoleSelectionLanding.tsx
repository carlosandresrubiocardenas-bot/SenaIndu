import React, { useState } from 'react';
import { ApprenticeData, UserRole } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { ChildAvatar } from './ChildAvatar';
import { translations } from '../utils/translations';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  BookOpen, 
  CheckCircle2, 
  FileSpreadsheet, 
  Award, 
  Eye, 
  EyeOff, 
  KeyRound, 
  HelpCircle,
  FileCheck2,
  Users,
  Compass,
  Building2,
  MapPin,
  BookMarked,
  Layers,
  Sun,
  Moon,
  Sparkles,
  Play,
  X
} from 'lucide-react';

interface RoleSelectionLandingProps {
  currentApprentice: ApprenticeData;
  onSelectInstructor: () => void;
  onSelectAprendiz: (apprenticeData: ApprenticeData) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  initialRole?: UserRole | null;
  language: 'es' | 'en';
  onToggleLanguage: () => void;
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  currentApprentice,
  onSelectInstructor,
  onSelectAprendiz,
  isDarkMode,
  onToggleDarkMode,
  initialRole,
  language,
  onToggleLanguage,
}) => {
  const t = translations[language];
  // Active Tab for mobile or focused view ('aprendiz' | 'instructor')
  const [selectedTab, setSelectedTab] = useState<'aprendiz' | 'instructor'>(
    initialRole === 'instructor' ? 'instructor' : 'aprendiz'
  );

  // Instructor Password State
  const [instructorPassword, setInstructorPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Apprentice Form State (pre-filled with defaults, editable without any password)
  const [apprenticeForm, setApprenticeForm] = useState<ApprenticeData>({ ...currentApprentice });
  const [apprenticeError, setApprenticeError] = useState<string | null>(null);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // Handle Instructor Password Submission
  const handleInstructorSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPassword = instructorPassword.trim();
    if (cleanPassword === 'Sena1234') {
      setPasswordError(null);
      onSelectInstructor();
    } else {
      setPasswordError('Clave incorrecta. Por favor ingresa la clave de autorización institucional.');
    }
  };

  // Quick fill helper for testing instructor password
  const handleFillInstructorPassword = () => {
    setInstructorPassword('Sena1234');
    setPasswordError(null);
  };

  // Handle Apprentice Registration Submission (No password!)
  const handleAprendizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!apprenticeForm.fullName.trim() || !apprenticeForm.documentNumber.trim() || !apprenticeForm.fichaNumber.trim()) {
      setApprenticeError('Por favor completa al menos tu nombre completo, número de documento y ficha.');
      return;
    }
    setApprenticeError(null);
    onSelectAprendiz(apprenticeForm);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''} bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 overflow-x-hidden w-full max-w-full`}>
      {/* Institutional Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-3 min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0 scale-90 sm:scale-100">
              <SenaLogo size={48} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-[#00324D] dark:text-white whitespace-nowrap">
                  SENA <span className="text-[#39A900]">Inducción</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0">
                  Acuerdo 0009 de 2024
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden xs:block truncate">
                Servicio Nacional de Aprendizaje · República de Colombia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Language Toggle Button (ES / EN) */}
            <button
              onClick={onToggleLanguage}
              aria-label="Cambiar idioma español / inglés"
              title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
              className="inline-flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-orange-100 dark:hover:bg-orange-950/50 rounded-xl transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#39A900] shrink-0 border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <span className="text-sm">{language === 'es' ? '🇪🇸' : '🇬🇧'}</span>
              <span className="font-extrabold text-[11px]">{language === 'es' ? 'ES' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={onToggleDarkMode}
              aria-label={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              title={isDarkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className="p-2 sm:p-2.5 text-slate-600 dark:text-amber-400 hover:text-slate-900 dark:hover:text-amber-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl transition-all shadow-sm shrink-0"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 rotate-0 scale-100 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 hover:text-slate-900 transition-transform hover:-rotate-12" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 min-w-0">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4 px-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-950/80 dark:to-orange-950/80 text-orange-700 dark:text-orange-300 border-2 border-orange-400/40 shadow-sm max-w-full">
            <ChildAvatar variant="boy_cap" size="xs" />
            <Sparkles className="w-3.5 h-3.5 text-[#39A900] shrink-0" />
            <span className="truncate">{t.systemBadge}</span>
          </div>

          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-extrabold text-[#00324D] dark:text-white tracking-tight leading-tight">
            {language === 'en' ? 'Access Portal & Profile Selection' : 'Portal de Acceso y Selección de'} <span className="text-[#39A900]">{language === 'en' ? '' : 'Perfil'}</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
            {t.landingSubtitle}
          </p>

          {/* Universal Role Switcher for All Screen Sizes */}
          <div className="flex p-1.5 rounded-2xl bg-gradient-to-r from-emerald-100/70 to-orange-100/70 dark:from-slate-800 dark:to-slate-800 border-2 border-orange-400/40 mt-6 max-w-md mx-auto shadow-inner w-full">
            <button
              type="button"
              onClick={() => setSelectedTab('aprendiz')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                selectedTab === 'aprendiz'
                  ? 'bg-white dark:bg-slate-900 text-[#39A900] shadow-md border-2 border-emerald-500'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ChildAvatar variant="boy_cap" size="xs" />
              <span className="truncate">{t.apprenticeTab}</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTab('instructor')}
              className={`flex-1 py-2.5 sm:py-3 px-2 sm:px-3 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 sm:gap-2 cursor-pointer ${
                selectedTab === 'instructor'
                  ? 'bg-gradient-to-r from-[#FF6B00] to-[#ea580c] text-white shadow-md border-2 border-orange-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ChildAvatar variant="instructor_kid" size="xs" />
              <span className="truncate">{t.instructorTab}</span>
            </button>
          </div>

          {/* Video Tutorial Launch Button */}
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setIsVideoOpen(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#FF6B00] via-[#ea580c] to-[#39A900] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg hover:scale-105 transition-all cursor-pointer"
            >
              <ChildAvatar variant="gamer" size="xs" />
              <Play className="w-4 h-4 fill-current text-white" />
              <span>{t.watchVideo}</span>
            </button>
          </div>
        </div>

        {/* Dual Cards Grid: Distinct Roles */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch w-full min-w-0">
          
          {/* ======================================================== */}
          {/* CARD 1: ROL APRENDIZ (SIN CLAVE - INGRESO DIRECTO) */}
          {/* ======================================================== */}
          <div className={`lg:col-span-7 flex-col min-w-0 ${selectedTab === 'aprendiz' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-emerald-500/60 dark:border-emerald-500/60 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-orange-500">
              {/* Header Card */}
              <div className="p-4 sm:p-6 lg:p-7 bg-gradient-to-r from-emerald-500/15 via-teal-500/5 to-orange-500/15 dark:from-emerald-950/40 dark:to-orange-950/40 border-b-2 border-emerald-500/30">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ChildAvatar variant="boy_cap" size="lg" glow={true} className="border-2 border-orange-400" />
                    <div className="min-w-0">
                      <h2 className="font-display text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate flex items-center gap-2">
                        <span>{t.apprenticeProfile}</span>
                        <span className="w-2 h-2 rounded-full bg-[#39A900]" />
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {t.apprenticeDesc}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-950 dark:to-orange-950 text-emerald-800 dark:text-orange-300 border border-orange-300 dark:border-orange-700 shrink-0 shadow-xs">
                    <ChildAvatar variant="star" size="xs" />
                    <span>{t.noKeyBadge}</span>
                  </span>
                </div>
              </div>

              {/* Body & Form */}
              <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between space-y-6 min-w-0">
                <div className="space-y-4 min-w-0">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-orange-50/90 dark:from-emerald-950/40 dark:to-orange-950/40 border-2 border-orange-300/40 dark:border-orange-800/40 text-xs text-emerald-900 dark:text-emerald-200 space-y-1">
                    <p className="font-bold flex items-center gap-1.5 text-orange-700 dark:text-orange-300">
                      <ChildAvatar variant="girl_pigtails" size="xs" />
                      <span>{t.fillDataNotice}</span>
                    </p>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                      {t.noticeBody}
                    </p>
                  </div>

                  {apprenticeError && (
                    <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
                      {apprenticeError}
                    </div>
                  )}

                  <form id="aprendiz-form" onSubmit={handleAprendizSubmit} className="space-y-4">
                    {/* Nombre Completo */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <ChildAvatar variant="boy_hoodie" size="xs" />
                        <span>{t.fullNameLabel}</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={apprenticeForm.fullName}
                        onChange={(e) => setApprenticeForm({ ...apprenticeForm, fullName: e.target.value })}
                        placeholder="ej. Carlos Andrés Morales Peña"
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white transition-all"
                      />
                    </div>

                    {/* Document Type & Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="detective" size="xs" />
                          <span>{t.docTypeLabel}</span>
                        </label>
                        <select
                          value={apprenticeForm.documentType}
                          onChange={(e) =>
                            setApprenticeForm({
                              ...apprenticeForm,
                              documentType: e.target.value as ApprenticeData['documentType'],
                            })
                          }
                          className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        >
                          <option value="CC">Cédula de Ciudadanía (C.C.)</option>
                          <option value="TI">Tarjeta de Identidad (T.I.)</option>
                          <option value="CE">Cédula de Extranjería (C.E.)</option>
                          <option value="PEP">Permiso Especial (P.E.P.)</option>
                        </select>
                      </div>

                      <div className="sm:col-span-7 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="boy_glasses" size="xs" />
                          <span>{t.docNumberLabel}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={apprenticeForm.documentNumber}
                          onChange={(e) => setApprenticeForm({ ...apprenticeForm, documentNumber: e.target.value })}
                          placeholder="ej. 1020789456"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Programa & Ficha */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-8 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="reader" size="xs" />
                          <span>{t.programLabel}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={apprenticeForm.trainingProgram}
                          onChange={(e) => setApprenticeForm({ ...apprenticeForm, trainingProgram: e.target.value })}
                          placeholder="ej. Análisis y Desarrollo de Software (ADSO)"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-4 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="gamer" size="xs" />
                          <span>{t.fichaLabel}</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={apprenticeForm.fichaNumber}
                          onChange={(e) => setApprenticeForm({ ...apprenticeForm, fichaNumber: e.target.value })}
                          placeholder="ej. 2874912"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Regional & Centro */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="boy_cap" size="xs" />
                          <span>{t.regionalLabel}</span>
                        </label>
                        <input
                          type="text"
                          value={apprenticeForm.regional}
                          onChange={(e) => setApprenticeForm({ ...apprenticeForm, regional: e.target.value })}
                          placeholder="ej. Distrito Capital"
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        />
                      </div>

                      <div className="sm:col-span-7 space-y-1">
                        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                          <ChildAvatar variant="girl_braids" size="xs" />
                          <span>{t.centerLabel}</span>
                        </label>
                        <input
                          type="text"
                          value={apprenticeForm.trainingCenter}
                          onChange={(e) => setApprenticeForm({ ...apprenticeForm, trainingCenter: e.target.value })}
                          placeholder="ej. Centro de Gestión de Mercados..."
                          className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </form>
                </div>

                {/* Submit Action for Aprendiz */}
                <div className="pt-2">
                  <button
                    type="submit"
                    form="aprendiz-form"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#39A900] via-[#2d8500] to-[#FF6B00] hover:from-[#329200] hover:to-[#EA580C] text-white font-bold text-sm flex items-center justify-center gap-3 shadow-lg shadow-emerald-600/25 hover:shadow-orange-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <ChildAvatar variant="graduate" size="xs" />
                    <span>{t.enterApprenticeBtn}</span>
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-2">
                    {t.directAccess}
                  </p>
                  <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 text-center">
                    <button
                      type="button"
                      onClick={() => setSelectedTab('instructor')}
                      className="text-xs text-orange-600 dark:text-orange-400 font-semibold hover:underline inline-flex items-center gap-1.5"
                    >
                      <ChildAvatar variant="instructor_kid" size="xs" />
                      <span>{t.switchInstructorPrompt} &rarr;</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* CARD 2: ROL INSTRUCTOR (CON CLAVE: Sena1234) */}
          {/* ======================================================== */}
          <div className={`lg:col-span-5 flex-col min-w-0 ${selectedTab === 'instructor' ? 'flex' : 'hidden lg:flex'}`}>
            <div className="h-full bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-300 dark:border-orange-800 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl hover:border-[#FF6B00] dark:hover:border-orange-400">
              {/* Header Card */}
              <div className="p-4 sm:p-6 lg:p-7 bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#FF6B00] text-white">
                <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <ChildAvatar variant="instructor_kid" size="md" />
                    <div className="min-w-0">
                      <h2 className="font-display text-lg sm:text-xl font-bold truncate flex items-center gap-2">
                        <span>{t.instructorProfile}</span>
                      </h2>
                      <p className="text-xs text-orange-200 truncate">
                        {t.instructorDesc}
                      </p>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 shrink-0 backdrop-blur-xs">
                    <ChildAvatar variant="star" size="xs" />
                    <span>{t.requiresKeyBadge}</span>
                  </span>
                </div>
              </div>

              {/* Body & Password Form */}
              <div className="p-4 sm:p-6 lg:p-7 flex-1 flex flex-col justify-between space-y-6 min-w-0">
                <div className="space-y-5 min-w-0">
                  <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                      <ChildAvatar variant="detective" size="xs" />
                      <span>{t.instructorPrivileges}</span>
                    </h3>
                    <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30">
                        <ChildAvatar variant="gamer" size="xs" />
                        <span>{t.priv1}</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/30">
                        <ChildAvatar variant="reader" size="xs" />
                        <span>{t.priv2}</span>
                      </li>
                      <li className="flex items-start gap-2.5 p-2 rounded-xl bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200/50 dark:border-orange-900/30">
                        <ChildAvatar variant="graduate" size="xs" />
                        <span>{t.priv3}</span>
                      </li>
                    </ul>
                  </div>

                  {/* Password Form */}
                  <form onSubmit={handleInstructorSubmit} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800 min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex flex-wrap items-center justify-between gap-1">
                        <span className="flex items-center gap-1.5">
                          <ChildAvatar variant="boy_glasses" size="xs" />
                          <span>{t.instructorKeyLabel}</span>
                        </span>
                        <span className="text-[11px] font-bold text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-950/60 px-2 py-0.5 rounded-md border border-orange-200 dark:border-orange-800">
                          {t.requiresKeyBadge}
                        </span>
                      </label>

                      <div className="relative min-w-0">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={instructorPassword}
                          onChange={(e) => {
                            setInstructorPassword(e.target.value);
                            setPasswordError(null);
                          }}
                          placeholder={t.enterPasswordPlaceholder}
                          autoComplete="current-password"
                          className="w-full pl-3.5 pr-10 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#FF6B00] focus:ring-2 focus:ring-[#39A900]/20 text-slate-900 dark:text-white min-w-0 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {passwordError && (
                        <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                          {passwordError}
                        </p>
                      )}
                    </div>

                    {/* Quick fill button */}
                    <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400">
                      <span>{t.quickAccessQuery}</span>
                      <button
                        type="button"
                        onClick={handleFillInstructorPassword}
                        className="text-[#FF6B00] hover:text-[#EA580C] font-semibold hover:underline cursor-pointer"
                      >
                        {t.autoFillKey}
                      </button>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#FF6B00] hover:from-[#002538] hover:to-[#ea580c] text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-sky-950/20 hover:shadow-orange-500/25 transition-all cursor-pointer mt-4 transform hover:-translate-y-0.5"
                    >
                      <ChildAvatar variant="instructor_kid" size="xs" />
                      <span>{t.enterInstructorConsoleBtn}</span>
                    </button>
                  </form>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 text-center space-y-2">
                  <p>
                    {t.instructorNote}
                  </p>
                  <div>
                    <button
                      type="button"
                      onClick={() => setSelectedTab('aprendiz')}
                      className="text-xs text-[#39A900] font-semibold hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ChildAvatar variant="boy_hoodie" size="xs" />
                      <span>{language === 'en' ? 'Are you an Apprentice? Switch to Apprentice Profile (No Password) →' : '¿Eres un Aprendiz? Cambiar a Perfil Aprendiz (Sin Clave) →'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Institutional Pillars Guarantee (Acuerdo No. 0009 de 2024) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-[#39A900] flex items-start gap-3 transition-colors shadow-xs">
            <ChildAvatar variant="reader" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Acuerdo No. 0009 de 2024
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Marco pedagógico institucional integral vigente para todas las modalidades y centros.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/50 hover:border-[#FF6B00] flex items-start gap-3 transition-colors shadow-xs">
            <ChildAvatar variant="detective" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-orange-800 dark:text-orange-300">
                Sincronización Automática
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Los aprendices realizan las actividades y el sistema guarda sus datos en Google Drive en segundo plano.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/50 hover:border-[#39A900] flex items-start gap-3 transition-colors shadow-xs">
            <ChildAvatar variant="graduate" size="sm" />
            <div>
              <h4 className="text-xs font-bold text-emerald-800 dark:text-emerald-300">
                Certificación Inmediata
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Al aprobar la evaluación con puntaje mínimo de 3.5 se genera el certificado oficial con código de verificación.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Institutional Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <SenaLogo size={20} />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              Servicio Nacional de Aprendizaje — SENA
            </span>
            <span aria-hidden="true">·</span>
            <span>Dirección de Formación Profesional</span>
          </div>

          <div className="text-[11px] text-slate-400">
            Plataforma de Inducción Formativa y Certificación Digital
          </div>
        </div>
      </footer>

      {/* Video Tutorial Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border-2 border-orange-500/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#FF6B00] text-white">
              <div className="flex items-center gap-3">
                <ChildAvatar variant="gamer" size="sm" glow={true} />
                <div>
                  <h3 className="font-display text-sm sm:text-base font-bold flex items-center gap-2">
                    <span>Video Tutorial de Inducción SENA</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] bg-white/20 text-white font-bold border border-white/30">
                      Google Drive
                    </span>
                  </h3>
                  <p className="text-xs text-orange-200">
                    Guía paso a paso para navegar, aprender y certificarse
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
                aria-label="Cerrar video"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Body */}
            <div className="p-4 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
              <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-orange-400/40 bg-black flex items-center justify-center">
                <video
                  src="/assets/aistudio/2026__16_26_08890761.mp4"
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Tu navegador no soporta la reproducción de video.
                </video>
              </div>
              <p className="text-center text-xs text-slate-400 mt-3">
                Utiliza los controles de reproducción integrados (reproducir, pausar, volumen, pantalla completa).
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
                <ChildAvatar variant="instructor_kid" size="xs" />
                <span>SENA — Dirección de Formación Profesional</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#39A900] hover:bg-[#329200] text-white text-xs font-bold transition-all cursor-pointer"
              >
                Cerrar Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
