import React, { useState, useEffect } from 'react';
import { AutoSyncState } from '../services/autoSyncService';
import { CheckCircle2, AlertCircle, RefreshCw, ExternalLink, X } from 'lucide-react';

interface AutoSyncToastProps {
  syncState: AutoSyncState;
  onRetry: () => void;
  onOpenAuditModal?: () => void;
  userRole?: 'instructor' | 'aprendiz';
}

export const AutoSyncToast: React.FC<AutoSyncToastProps> = ({
  syncState,
  onRetry,
  onOpenAuditModal,
  userRole = 'instructor',
}) => {
  const [isDismissed, setIsDismissed] = useState(false);

  // When status changes to syncing or saved or error, reset dismissal
  useEffect(() => {
    if (syncState.status !== 'idle' && syncState.status !== 'unconnected') {
      setIsDismissed(false);
    }
  }, [syncState.status, syncState.message]);

  if (isDismissed) return null;
  if (syncState.status === 'idle' || syncState.status === 'unconnected') return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-5 right-5 z-50 max-w-sm sm:max-w-md w-full animate-fade-in no-print"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200/80 dark:border-slate-800 rounded-2xl p-3.5 shadow-xl shadow-black/10 flex items-start gap-3 transition-all duration-300">
        {/* Status Icon */}
        <div className="shrink-0 mt-0.5">
          {syncState.status === 'syncing' && (
            <div className="w-7 h-7 rounded-xl bg-blue-50 dark:bg-blue-950/70 text-[#4285F4] flex items-center justify-center">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
          )}
          {syncState.status === 'saved' && (
            <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-[#39A900] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {syncState.status === 'error' && (
            <div className="w-7 h-7 rounded-xl bg-rose-50 dark:bg-rose-950/70 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {syncState.status === 'syncing'
                ? 'Sincronización en vivo'
                : syncState.status === 'saved'
                ? 'Guardado en Google Drive'
                : 'Aviso de conexión'}
            </span>
          </div>

          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-snug mt-0.5">
            {syncState.message || (syncState.status === 'syncing' ? 'Actualizando fila en Google Sheets...' : '')}
          </p>

          {/* Action Links (Exclusively for Instructor) */}
          <div className="flex items-center gap-3 mt-2 text-[11px]">
            {userRole === 'instructor' && syncState.sheetInfo?.webViewLink && (
              <a
                href={syncState.sheetInfo.webViewLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-[#39A900] hover:underline"
              >
                <span>Ver Hoja en Drive</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}

            {userRole === 'instructor' && onOpenAuditModal && (
              <button
                onClick={onOpenAuditModal}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-300 transition-colors"
              >
                Auditar tabla
              </button>
            )}

            {syncState.status === 'error' && (
              <button
                onClick={onRetry}
                className="font-semibold text-rose-600 dark:text-rose-400 hover:underline"
              >
                Reintentar
              </button>
            )}
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissed(true)}
          title="Cerrar notificación"
          className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
