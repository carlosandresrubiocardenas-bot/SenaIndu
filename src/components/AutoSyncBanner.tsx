import React, { useState } from 'react';
import { AutoSyncState } from '../services/autoSyncService';
import { ChildAvatar } from './ChildAvatar';
import { FileSpreadsheet, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AutoSyncBannerProps {
  syncState: AutoSyncState;
  onConnect: () => Promise<boolean>;
  onOpenAuditModal: () => void;
}

export const AutoSyncBanner: React.FC<AutoSyncBannerProps> = ({
  syncState,
  onConnect,
  onOpenAuditModal,
}) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await onConnect();
    } finally {
      setIsConnecting(false);
    }
  };

  if (syncState.isConnected) {
    return (
      <div className="bg-gradient-to-r from-emerald-500/10 via-orange-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-orange-950/20 dark:to-emerald-950/40 border-2 border-orange-300 dark:border-orange-800 rounded-2xl p-3.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors overflow-hidden w-full min-w-0">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <ChildAvatar variant="star" size="sm" />
          <div className="min-w-0 flex-1">
            <span className="font-bold text-slate-800 dark:text-slate-100 block truncate">
              Sincronización Automática con Google Drive Activa
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block truncate">
              Tus avances, calificaciones y certificado se actualizan de forma continua en tu hoja de cálculo.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {syncState.sheetInfo?.webViewLink && (
            <a
              href={syncState.sheetInfo.webViewLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-orange-300 dark:border-orange-700 text-[#FF6B00] hover:bg-orange-50 dark:hover:bg-slate-800 font-bold text-[11px] transition-colors"
            >
              <ChildAvatar variant="gamer" size="xs" />
              <span>Abrir Hoja</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={onOpenAuditModal}
            className="px-3 py-1.5 rounded-xl bg-[#39A900] hover:bg-[#329200] text-white font-bold text-[11px] transition-colors cursor-pointer"
          >
            Ver Registros
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-emerald-500/10 via-orange-500/10 to-emerald-500/10 dark:from-emerald-950/40 dark:via-orange-950/20 dark:to-emerald-950/40 border-2 border-orange-200 dark:border-orange-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs transition-all overflow-hidden w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <ChildAvatar variant="gamer" size="md" />
        <div className="space-y-0.5 min-w-0 flex-1">
          <h4 className="font-display font-bold text-slate-900 dark:text-white text-xs sm:text-sm truncate">
            Activar Sincronización Automática en Google Sheets
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Conecta tu cuenta de Google una sola vez. Cada módulo y certificado se guardará en tu Google Drive sin que tengas que hacer nada.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-all disabled:opacity-50 cursor-pointer"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Conectando...</span>
            </>
          ) : (
            <>
              <ChildAvatar variant="star" size="xs" />
              <span>Activar en 1 Clic</span>
            </>
          )}
        </button>
        <button
          onClick={onOpenAuditModal}
          className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
        >
          Opciones
        </button>
      </div>
    </div>
  );
};
