import React, { useState, useEffect } from 'react';
import { ChildAvatar, ChildAvatarVariant } from './ChildAvatar';
import { 
  Users, 
  FileSpreadsheet, 
  ExternalLink, 
  Copy, 
  Check, 
  Share2, 
  Eye, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  Award, 
  Download, 
  MessageSquare, 
  LogOut, 
  BookOpen,
  Filter,
  Layers,
  Sparkles,
  AlertCircle,
  ArrowLeftRight
} from 'lucide-react';
import { 
  getSheetApprenticeRecords, 
  SheetApprenticeRecord, 
  SpreadsheetInfo, 
  findOrCreateInductionSpreadsheet 
} from '../services/googleSheetsService';
import { getAccessToken, getCurrentUser, googleSignIn, googleSignOut } from '../services/googleAuth';
import { User as FirebaseUser } from 'firebase/auth';

interface InstructorDashboardProps {
  onSwitchToApprenticeView: () => void;
  onLogoutInstructor: () => void;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  onSwitchToApprenticeView,
  onLogoutInstructor,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    try {
      const cached = localStorage.getItem('sena_induction_spreadsheet');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [records, setRecords] = useState<SheetApprenticeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'approved' | 'in_progress'>('all');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [copiedSheetLink, setCopiedSheetLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Apprentice link to share
  const apprenticeShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${window.location.pathname}?role=aprendiz`
    : '';

  const whatsappMessage = `¡Hola aprendices! 👋 Bienvenidos al SENA. Les comparto el enlace de la plataforma interactiva para realizar la inducción del nuevo Reglamento del Aprendiz (Acuerdo No. 0009 de 2024): ${apprenticeShareUrl} . Por favor completen los módulos y descarguen su certificado oficial de aprobación.`;

  // Load records from Google Sheets
  const loadSheetData = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const token = await getAccessToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      let currentSheet = spreadsheet;
      if (!currentSheet) {
        currentSheet = await findOrCreateInductionSpreadsheet(token);
        setSpreadsheet(currentSheet);
        localStorage.setItem('sena_induction_spreadsheet', JSON.stringify(currentSheet));
      }

      if (currentSheet) {
        const rows = await getSheetApprenticeRecords(token, currentSheet.id);
        setRecords(rows);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al consultar la hoja de Google Drive';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSheetData();
  }, [currentUser]);

  const handleGoogleConnect = async () => {
    try {
      setIsLoading(true);
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        const sheet = await findOrCreateInductionSpreadsheet(res.accessToken);
        setSpreadsheet(sheet);
        localStorage.setItem('sena_induction_spreadsheet', JSON.stringify(sheet));
        const rows = await getSheetApprenticeRecords(res.accessToken, sheet.id);
        setRecords(rows);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const copyApprenticeLink = () => {
    navigator.clipboard.writeText(apprenticeShareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const copyWhatsappMessage = () => {
    navigator.clipboard.writeText(whatsappMessage);
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2500);
  };

  const copySheetUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedSheetLink(true);
    setTimeout(() => setCopiedSheetLink(false), 2500);
  };

  // Export records to CSV
  const handleExportCSV = () => {
    if (records.length === 0) return;
    const headers = [
      'ID Registro',
      'Fecha',
      'Tipo Doc',
      'Documento',
      'Nombre Aprendiz',
      'Programa',
      'Ficha',
      'Regional',
      'Centro',
      'Nivel',
      'Progreso',
      'Calificacion',
      'Estado',
      'Hash',
      'Reglamento'
    ];

    const rows = records.map((r) => [
      `"${r.id}"`,
      `"${r.timestamp}"`,
      `"${r.documentType}"`,
      `"${r.documentNumber}"`,
      `"${r.fullName}"`,
      `"${r.trainingProgram}"`,
      `"${r.fichaNumber}"`,
      `"${r.regional}"`,
      `"${r.trainingCenter}"`,
      `"${r.level}"`,
      `"${r.progressPercent}"`,
      `"${r.score}"`,
      `"${r.certificationStatus}"`,
      `"${r.verificationHash}"`,
      `"${r.regulationNorm}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SENA_Induccion_Aprendices_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculations
  const totalStudents = records.length;
  const certifiedStudents = records.filter(r => r.certificationStatus.includes('APROBADO')).length;
  const inProgressStudents = totalStudents - certifiedStudents;
  const averageScore = totalStudents > 0
    ? (records.reduce((acc, r) => acc + (parseFloat(r.score) || 0), 0) / totalStudents).toFixed(1)
    : '5.0';

  // Filtered records
  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.documentNumber.includes(searchTerm) ||
      r.fichaNumber.includes(searchTerm) ||
      r.trainingProgram.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'approved') return r.certificationStatus.includes('APROBADO');
    if (statusFilter === 'in_progress') return !r.certificationStatus.includes('APROBADO');
    return true;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Instructor Top Navigation Bar */}
      <div className="bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-950/60 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start sm:items-center gap-4">
          <ChildAvatar variant="instructor_kid" size="xl" />
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white bg-gradient-to-r from-[#39A900] to-[#FF6B00] px-3 py-0.5 rounded-full shadow-xs">
                Consola del Instructor
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">·</span>
              <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                Gestión Oficial de Inducción SENA
              </span>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00324D] dark:text-white">
              Seguimiento de Fichas y Aprendices
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Marco Normativo: <strong>Acuerdo No. 0009 de 2024</strong> (Reglamento del Aprendiz Vigente)
            </p>
          </div>
        </div>

        {/* View Switcher and Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={onSwitchToApprenticeView}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-50 to-orange-50 dark:from-emerald-950/60 dark:to-orange-950/60 hover:from-emerald-100 hover:to-orange-100 border border-orange-300 dark:border-orange-800 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all shadow-sm cursor-pointer"
          >
            <ChildAvatar variant="boy_hoodie" size="xs" />
            <span>Probar Vista de Aprendiz</span>
          </button>

          <button
            onClick={onLogoutInstructor}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/40 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
            title="Volver a la pantalla inicial para cambiar de rol"
          >
            <ArrowLeftRight className="w-4 h-4 text-rose-500" />
            <span>Pantalla Inicial (Cambiar Rol)</span>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="font-bold underline cursor-pointer">
            Cerrar
          </button>
        </div>
      )}

      {/* Section 1: Share Link with Apprentices */}
      <div className="bg-gradient-to-br from-emerald-500/10 via-orange-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-orange-950/20 dark:to-emerald-950/40 border-2 border-orange-300 dark:border-orange-800 rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ChildAvatar variant="star" size="md" />
            <div className="space-y-1">
              <h2 className="font-display text-lg font-bold text-slate-900 dark:text-white">
                Enlace Oficial para Compartir a los Aprendices
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                Comparte este enlace a tus fichas de formación. Los aprendices ingresarán directamente a su plataforma de inducción sin botones de configuración ni hojas de cálculo.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={copyApprenticeLink}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold shadow-md shadow-emerald-700/20 transition-all cursor-pointer"
            >
              <ChildAvatar variant="boy_hoodie" size="xs" />
              <span>{copiedLink ? '¡Enlace Copiado!' : 'Copiar Enlace Aprendices'}</span>
            </button>

            <button
              onClick={copyWhatsappMessage}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00324D] hover:bg-[#002538] text-white text-xs font-semibold shadow-md transition-all cursor-pointer"
            >
              <ChildAvatar variant="girl_braids" size="xs" />
              <span>{copiedMessage ? '¡Mensaje Copiado!' : 'Mensaje WhatsApp / Teams'}</span>
            </button>
          </div>
        </div>

        {/* Input with clean URL */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-2xl border-2 border-orange-200 dark:border-orange-800 min-w-0">
          <input
            type="text"
            readOnly
            value={apprenticeShareUrl}
            className="min-w-0 flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 select-all focus:outline-none"
          />
          <button
            onClick={copyApprenticeLink}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500/20 to-orange-500/20 hover:from-emerald-500/30 hover:to-orange-500/30 text-xs font-bold text-emerald-800 dark:text-orange-300 transition-colors shrink-0 cursor-pointer"
          >
            {copiedLink ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      </div>

      {/* Section 2: Google Sheets & Drive Management (Privileged Area) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-emerald-200 dark:border-emerald-950/60 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <ChildAvatar variant="gamer" size="md" />
            <div>
              <h2 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <span>Almacenamiento de Datos en Google Drive (Privilegio de Instructor)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                La hoja oficial donde se consolidan todos los aprendices que aprueban la inducción
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!currentUser ? (
              <button
                onClick={handleGoogleConnect}
                disabled={isLoading}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#4285F4] hover:bg-[#3367D6] text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <ChildAvatar variant="detective" size="xs" />
                <span>Conectar con Google</span>
              </button>
            ) : (
              <button
                onClick={loadSheetData}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Recargar Datos de Hoja</span>
              </button>
            )}

            {records.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 border border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300 text-xs font-bold transition-colors cursor-pointer"
                title="Descargar respaldo en CSV"
              >
                <ChildAvatar variant="reader" size="xs" />
                <span>Exportar CSV</span>
              </button>
            )}
          </div>
        </div>

        {/* Spreadsheet Link Bar */}
        {spreadsheet ? (
          <div className="bg-orange-50/30 dark:bg-orange-950/20 rounded-2xl p-4 border border-orange-200 dark:border-orange-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <span>Hoja Oficial:</span>
                <strong className="text-emerald-700 dark:text-emerald-400">{spreadsheet.name}</strong>
                <span className="text-slate-400">(Pestaña: Aprendices Inducción)</span>
              </span>

              <div className="flex items-center gap-3">
                <a
                  href={spreadsheet.webViewLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#FF6B00] hover:underline inline-flex items-center gap-1 text-xs"
                >
                  <span>Abrir en Google Drive</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <input
                type="text"
                readOnly
                value={spreadsheet.webViewLink}
                className="min-w-0 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 dark:text-slate-300 select-all"
              />
              <button
                onClick={() => copySheetUrl(spreadsheet.webViewLink)}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-medium text-slate-700 dark:text-slate-200 inline-flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
              >
                {copiedSheetLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSheetLink ? 'Copiado' : 'Copiar URL'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            Conecta tu cuenta de Google arriba para vincular y abrir automáticamente la hoja de cálculo de aprendices en tu Google Drive.
          </div>
        )}
      </div>

      {/* Section 3: Cohort Metrics (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/50 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider text-orange-700 dark:text-orange-400">Total Aprendices</span>
            <ChildAvatar variant="boy_hoodie" size="xs" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {totalStudents}
          </div>
          <p className="text-[11px] text-slate-500">Registrados en la hoja de cálculo</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">Certificados Aprobados</span>
            <ChildAvatar variant="graduate" size="xs" />
          </div>
          <div className="font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {certifiedStudents}
          </div>
          <p className="text-[11px] text-slate-500">Superaron la evaluación final</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-orange-200 dark:border-orange-900/50 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider text-orange-700 dark:text-orange-400">En Proceso</span>
            <ChildAvatar variant="detective" size="xs" />
          </div>
          <div className="font-display text-2xl font-bold text-amber-600 dark:text-amber-400">
            {inProgressStudents}
          </div>
          <p className="text-[11px] text-slate-500">Completando módulos de inducción</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-200 dark:border-emerald-900/50 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-700 dark:text-emerald-400">Promedio General</span>
            <ChildAvatar variant="star" size="xs" />
          </div>
          <div className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            {averageScore} <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <p className="text-[11px] text-slate-500">Calificación media de inducción</p>
        </div>
      </div>

      {/* Section 4: Live Apprentices Tracking Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border-2 border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <ChildAvatar variant="reader" size="sm" />
            <h3 className="font-display text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              Planilla Consolidada de Aprendices
            </h3>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-bold font-mono">({filteredRecords.length})</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'all'
                    ? 'bg-gradient-to-r from-[#39A900] to-[#FF6B00] text-white shadow-sm font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos ({totalStudents})
              </button>
              <button
                onClick={() => setStatusFilter('approved')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'approved'
                    ? 'bg-emerald-600 text-white shadow-sm font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Aprobados ({certifiedStudents})
              </button>
              <button
                onClick={() => setStatusFilter('in_progress')}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  statusFilter === 'in_progress'
                    ? 'bg-orange-500 text-white shadow-sm font-bold'
                    : 'hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                En Proceso ({inProgressStudents})
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nombre, documento o ficha..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        {isLoading ? (
          <div className="text-center py-12 text-xs text-slate-400 flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#39A900]" />
            <span>Consultando registros en vivo desde Google Sheets...</span>
          </div>
        ) : filteredRecords.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-400 border-2 border-dashed border-orange-200 dark:border-orange-900/40 rounded-2xl space-y-2">
            <div className="flex justify-center mb-1">
              <ChildAvatar variant="detective" size="md" />
            </div>
            <p>
              {records.length === 0
                ? 'Aún no hay aprendices registrados en la hoja de cálculo. Comparte el enlace de arriba a tus estudiantes para que inicien.'
                : 'No se encontraron aprendices con el filtro actual.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[500px] overflow-y-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3 whitespace-nowrap">Fecha / Hora</th>
                  <th className="p-3 whitespace-nowrap">Aprendiz</th>
                  <th className="p-3 whitespace-nowrap">Documento</th>
                  <th className="p-3 whitespace-nowrap">Ficha y Programa</th>
                  <th className="p-3 text-center whitespace-nowrap">Progreso</th>
                  <th className="p-3 text-center whitespace-nowrap">Nota</th>
                  <th className="p-3 text-center whitespace-nowrap">Estado Certificado</th>
                  <th className="p-3 whitespace-nowrap">Hash Verificación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredRecords.map((r, i) => {
                  const avatarVariants: ChildAvatarVariant[] = ['boy_cap', 'girl_pigtails', 'boy_glasses', 'girl_curls', 'boy_hoodie', 'girl_braids'];
                  const rowAvatar = avatarVariants[i % avatarVariants.length];
                  return (
                    <tr key={i} className="hover:bg-orange-50/30 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">{r.timestamp}</td>
                      <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <ChildAvatar variant={rowAvatar} size="xs" />
                          <span>{r.fullName}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                        {r.documentType} {r.documentNumber}
                      </td>
                      <td className="p-3 text-[11px] max-w-[220px] truncate" title={`Ficha #${r.fichaNumber} - ${r.trainingProgram}`}>
                        <strong className="text-orange-600 dark:text-orange-400">#{r.fichaNumber}</strong> · {r.trainingProgram}
                      </td>
                      <td className="p-3 text-center font-bold text-[#39A900] whitespace-nowrap">
                        {r.progressPercent}
                      </td>
                      <td className="p-3 text-center font-mono font-semibold whitespace-nowrap">
                        {r.score}
                      </td>
                      <td className="p-3 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            r.certificationStatus.includes('APROBADO')
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                              : 'bg-orange-100 text-orange-800 dark:bg-orange-950/70 dark:text-orange-300'
                          }`}
                        >
                          {r.certificationStatus.includes('APROBADO') ? '✓ Aprobado' : 'En Inducción'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-[10px] text-slate-400 whitespace-nowrap">
                        {r.verificationHash || 'Pendiente'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
