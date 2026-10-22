import React from 'react';
import { ApprenticeData } from '../types/induction';
import { AlertCircle, FileSpreadsheet, Check, X } from 'lucide-react';

interface GoogleSheetsConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  apprentice: ApprenticeData;
  progressPercent: number;
  score: number;
  isCertified: boolean;
  spreadsheetTitle: string;
  isSaving: boolean;
}

export const GoogleSheetsConfirmationModal: React.FC<GoogleSheetsConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  apprentice,
  progressPercent,
  score,
  isCertified,
  spreadsheetTitle,
  isSaving,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-[#39A900] flex items-center justify-center shrink-0">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              ¿Confirmar sincronización en Google Drive?
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Se registrarán o actualizarán los datos del aprendiz en la hoja de cálculo oficial.
            </p>
          </div>
        </div>

        {/* Data summary payload preview */}
        <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-500 dark:text-slate-400">Hoja de destino:</span>
            <span className="font-semibold text-emerald-700 dark:text-emerald-400 truncate max-w-[220px]">
              {spreadsheetTitle}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 block">Aprendiz</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{apprentice.fullName}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Documento</span>
              <span className="font-mono text-slate-800 dark:text-slate-200">
                {apprentice.documentType} {apprentice.documentNumber}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Ficha y Programa</span>
              <span className="text-slate-800 dark:text-slate-200 truncate block">
                #{apprentice.fichaNumber} · {apprentice.trainingProgram}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Progreso y Calificación</span>
              <span className="font-bold text-[#39A900]">
                {progressPercent}% · {score.toFixed(1)} / 5.0
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Certificación</span>
              <span className={`font-semibold ${isCertified ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                {isCertified ? 'APROBADO' : 'EN PROCESO'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block">Reglamento</span>
              <span className="text-slate-600 dark:text-slate-300 font-medium">Acuerdo 0009 de 2024</span>
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2.5 text-xs text-slate-500 dark:text-slate-400 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/60 dark:border-amber-800/50">
          <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>
            Esta operación agregará una nueva fila o actualizará la fila existente en caso de que el documento y ficha ya se encuentren registrados.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#39A900] hover:bg-[#329200] text-white text-xs font-semibold shadow-md shadow-[#39A900]/25 transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sincronizando con Drive...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Confirmar y Guardar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
