import React, { useState, useEffect } from 'react';
import { ApprenticeData } from '../types/induction';
import { 
  findOrCreateInductionSpreadsheet, 
  syncApprenticeToSheet, 
  getSheetApprenticeRecords,
  SpreadsheetInfo,
  SheetApprenticeRecord
} from '../services/googleSheetsService';
import { 
  googleSignIn, 
  googleSignOut, 
  getAccessToken, 
  getCurrentUser, 
  initAuth 
} from '../services/googleAuth';
import { GoogleSignInButton } from './GoogleSignInButton';
import { GoogleSheetsConfirmationModal } from './GoogleSheetsConfirmationModal';
import { 
  X, 
  FileSpreadsheet, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  User, 
  Search,
  Database,
  ArrowUpRight,
  Sparkles,
  Layers,
  Copy,
  Check
} from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  apprentice: ApprenticeData;
  progressPercent: number;
  score: number;
  isCertified: boolean;
  verificationHash: string;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  apprentice,
  progressPercent,
  score,
  isCertified,
  verificationHash,
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(getCurrentUser());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [spreadsheet, setSpreadsheet] = useState<SpreadsheetInfo | null>(() => {
    try {
      const cached = localStorage.getItem('sena_induction_spreadsheet');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [isLoadingSpreadsheet, setIsLoadingSpreadsheet] = useState(false);
  const [records, setRecords] = useState<SheetApprenticeRecord[]>([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Listen to auth changes
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setCurrentUser(user);
        loadSpreadsheet(token);
      },
      () => {
        setCurrentUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMessage(null);
    try {
      const result = await googleSignIn();
      if (result) {
        setCurrentUser(result.user);
        await loadSpreadsheet(result.accessToken);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      setErrorMessage(msg);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await googleSignOut();
    setCurrentUser(null);
    setSuccessMessage(null);
  };

  const loadSpreadsheet = async (token?: string) => {
    const activeToken = token || (await getAccessToken());
    if (!activeToken) return;

    setIsLoadingSpreadsheet(true);
    setErrorMessage(null);
    try {
      const sheet = await findOrCreateInductionSpreadsheet(activeToken);
      setSpreadsheet(sheet);
      try {
        localStorage.setItem('sena_induction_spreadsheet', JSON.stringify(sheet));
      } catch {
        // ignore
      }
      await fetchRecords(activeToken, sheet.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al vincular hoja en Google Drive';
      setErrorMessage(msg);
    } finally {
      setIsLoadingSpreadsheet(false);
    }
  };

  const copySpreadsheetLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const fetchRecords = async (token: string, sheetId: string) => {
    setIsLoadingRecords(true);
    try {
      const rows = await getSheetApprenticeRecords(token, sheetId);
      setRecords(rows);
    } catch (err: unknown) {
      console.warn('Error al leer registros:', err);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const executeSync = async () => {
    const token = await getAccessToken();
    if (!token || !spreadsheet) {
      setErrorMessage('No hay sesión activa con Google o no se ha encontrado la hoja de cálculo');
      setIsConfirmationOpen(false);
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    try {
      const result = await syncApprenticeToSheet(
        token,
        spreadsheet.id,
        apprentice,
        progressPercent,
        score,
        isCertified,
        verificationHash
      );

      const actionText = result.action === 'created' ? 'registrado' : 'actualizado';
      setSuccessMessage(`¡Aprendiz ${actionText} exitosamente en la fila ${result.rowNumber} de la hoja de cálculo!`);
      setIsConfirmationOpen(false);
      
      // Refresh list
      await fetchRecords(token, spreadsheet.id);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al sincronizar datos con Google Sheets';
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const filteredRecords = records.filter(
    (r) =>
      r.fullName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      r.documentNumber.includes(searchFilter) ||
      r.fichaNumber.includes(searchFilter) ||
      r.trainingProgram.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[92vh] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden my-auto">
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/5 to-teal-500/5">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#39A900] flex items-center justify-center shrink-0">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Almacenamiento en Google Sheets & Drive</span>
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Sincronización oficial de aprendices, calificaciones y certificados de inducción
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 sm:p-7 overflow-y-auto space-y-6 flex-1">
            {/* Notifications */}
            {errorMessage && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="flex-1">{errorMessage}</span>
                <button onClick={() => setErrorMessage(null)} className="text-rose-500 hover:text-rose-700">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {successMessage && (
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
                <span className="flex-1 font-medium">{successMessage}</span>
                <button onClick={() => setSuccessMessage(null)} className="text-emerald-600 hover:text-emerald-800">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Auth Card */}
            {!currentUser ? (
              <div className="bg-slate-50 dark:bg-slate-800/60 rounded-3xl p-6 sm:p-8 border border-dashed border-slate-300 dark:border-slate-700 text-center space-y-4">
                <div className="w-14 h-14 mx-auto rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-[#4285F4] flex items-center justify-center">
                  <Database className="w-7 h-7" />
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="font-display text-base font-bold text-slate-900 dark:text-white">
                    Conectar cuenta de Google
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Para registrar a los aprendices y almacenar los registros de inducción en una hoja de Google Drive, 
                    inicia sesión con tu cuenta institucional o personal.
                  </p>
                </div>
                <div className="pt-2">
                  <GoogleSignInButton onClick={handleSignIn} isLoading={isSigningIn} />
                </div>

                {/* If there is a cached spreadsheet URL from a previous session */}
                {spreadsheet && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-left bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider block mb-1">
                      Enlace de la Hoja de Cálculo detectada anteriormente:
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={spreadsheet.webViewLink}
                        className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-700 dark:text-slate-300 select-all"
                      />
                      <button
                        onClick={() => copySpreadsheetLink(spreadsheet.webViewLink)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium inline-flex items-center gap-1.5 transition-colors"
                      >
                        {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                      </button>
                      <a
                        href={spreadsheet.webViewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg bg-[#39A900] text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#329200] transition-colors"
                      >
                        <span>Abrir</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                )}

                {/* Direct links to Google Drive and Google Sheets */}
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-500">
                  <span>Accesos directos:</span>
                  <a
                    href="https://docs.google.com/spreadsheets/u/0/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#39A900] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Google Sheets</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <span>·</span>
                  <a
                    href="https://drive.google.com/drive/u/0/my-drive"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#39A900] hover:underline inline-flex items-center gap-1"
                  >
                    <span>Mi Google Drive</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* User & Connected Sheet Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Google User Profile */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 truncate">
                      {currentUser.photoURL ? (
                        <img
                          src={currentUser.photoURL}
                          alt={currentUser.displayName || 'Google User'}
                          className="w-10 h-10 rounded-full border border-slate-300 dark:border-slate-600 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950/70 text-[#4285F4] flex items-center justify-center font-bold text-sm shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-semibold text-xs sm:text-sm text-slate-800 dark:text-slate-200 block truncate">
                          {currentUser.displayName || 'Usuario de Google'}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {currentUser.email}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleSignOut}
                      title="Cerrar sesión de Google"
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors shrink-0"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Connected Spreadsheet in Drive */}
                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                          Hoja Oficial en Google Drive
                        </span>
                        {spreadsheet && (
                          <span className="text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] px-2 py-0.5 rounded-full font-bold">
                            Tab: Aprendices Inducción
                          </span>
                        )}
                      </div>

                      {isLoadingSpreadsheet ? (
                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                          <div className="w-3.5 h-3.5 border-2 border-[#39A900] border-t-transparent rounded-full animate-spin" />
                          <span>Buscando o creando hoja oficial...</span>
                        </div>
                      ) : spreadsheet ? (
                        <div className="space-y-2 mt-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 truncate">
                              {spreadsheet.name}
                            </span>
                            <a
                              href={spreadsheet.webViewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-[#39A900] hover:underline shrink-0"
                            >
                              <span>Abrir en Drive</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>

                          {/* Copyable link input */}
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              readOnly
                              value={spreadsheet.webViewLink}
                              className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 text-[11px] font-mono text-slate-600 dark:text-slate-300 select-all"
                            />
                            <button
                              onClick={() => copySpreadsheetLink(spreadsheet.webViewLink)}
                              title="Copiar enlace"
                              className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-[11px] font-medium inline-flex items-center gap-1 shrink-0 transition-colors"
                            >
                              {copiedLink ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                              <span>{copiedLink ? 'Copiado' : 'Copiar'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 mt-1">No se ha vinculado la hoja</div>
                      )}
                    </div>

                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[11px]">
                      <span className="text-slate-500">
                        Total registros: <strong className="text-slate-800 dark:text-slate-200">{records.length}</strong>
                      </span>
                      <button
                        onClick={() => loadSpreadsheet()}
                        disabled={isLoadingSpreadsheet}
                        className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
                      >
                        <RefreshCw className={`w-3 h-3 ${isLoadingSpreadsheet ? 'animate-spin' : ''}`} />
                        <span>Actualizar</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Apprentice Current Status Callout & Sync Action */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-teal-500/10 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-[#39A900] text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                      <span>Listo para guardar</span>
                    </div>
                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {apprentice.fullName} · {apprentice.documentType} {apprentice.documentNumber}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Ficha #{apprentice.fichaNumber} · Progreso: <strong>{progressPercent}%</strong> · Nota: <strong>{score.toFixed(1)}/5.0</strong> · Estado: <strong>{isCertified ? 'Aprobado' : 'En proceso'}</strong>
                    </p>
                  </div>

                  <button
                    onClick={() => setIsConfirmationOpen(true)}
                    disabled={!spreadsheet || isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#329200] text-white text-xs font-semibold shadow-md shadow-[#39A900]/25 transition-all shrink-0 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Sincronizar mis Datos en Google Sheets</span>
                  </button>
                </div>

                {/* Table of Records in the Google Sheet */}
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#39A900]" />
                      <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                        Registros Almacenados en la Hoja
                      </h4>
                      <span className="text-xs text-slate-400">({filteredRecords.length})</span>
                    </div>

                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Buscar por nombre, documento o ficha..."
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  {isLoadingRecords ? (
                    <div className="text-center py-8 text-xs text-slate-400 flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#39A900] border-t-transparent rounded-full animate-spin" />
                      <span>Cargando registros desde Google Sheets...</span>
                    </div>
                  ) : filteredRecords.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                      {records.length === 0
                        ? 'La hoja aún no contiene filas de aprendices. ¡Haz clic en "Sincronizar mis Datos" para registrar el primero!'
                        : 'No se encontraron registros que coincidan con la búsqueda.'}
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 max-h-64 overflow-y-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                          <tr>
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Aprendiz</th>
                            <th className="p-3">Documento</th>
                            <th className="p-3">Ficha / Programa</th>
                            <th className="p-3 text-center">Progreso</th>
                            <th className="p-3 text-center">Nota</th>
                            <th className="p-3 text-center">Estado</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                          {filteredRecords.map((r, i) => (
                            <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                              <td className="p-3 text-[11px] text-slate-500 whitespace-nowrap">{r.timestamp}</td>
                              <td className="p-3 font-semibold text-slate-900 dark:text-white whitespace-nowrap">
                                {r.fullName}
                              </td>
                              <td className="p-3 font-mono text-[11px] whitespace-nowrap">
                                {r.documentType} {r.documentNumber}
                              </td>
                              <td className="p-3 text-[11px] max-w-[200px] truncate" title={`${r.fichaNumber} - ${r.trainingProgram}`}>
                                #{r.fichaNumber} - {r.trainingProgram}
                              </td>
                              <td className="p-3 text-center font-bold text-[#39A900]">{r.progressPercent}</td>
                              <td className="p-3 text-center font-mono font-semibold">{r.score}</td>
                              <td className="p-3 text-center whitespace-nowrap">
                                <span
                                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    r.certificationStatus.includes('APROBADO')
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                  }`}
                                >
                                  {r.certificationStatus.includes('APROBADO') ? 'Aprobado' : 'En Inducción'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#39A900]" />
              <span>Conexión segura mediante OAuth y Firebase Auth</span>
            </span>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before mutating Google Sheets */}
      <GoogleSheetsConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setIsConfirmationOpen(false)}
        onConfirm={executeSync}
        apprentice={apprentice}
        progressPercent={progressPercent}
        score={score}
        isCertified={isCertified}
        spreadsheetTitle={spreadsheet?.name || 'SENA - Registro de Inducción de Aprendices'}
        isSaving={isSaving}
      />
    </>
  );
};
