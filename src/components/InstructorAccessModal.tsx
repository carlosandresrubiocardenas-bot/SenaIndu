import React, { useState } from 'react';
import { ShieldCheck, Lock, X, ArrowRight, KeyRound } from 'lucide-react';

interface InstructorAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const InstructorAccessModal: React.FC<InstructorAccessModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // Instructor password requested by user: Sena1234
    const cleanPin = pin.trim();
    if (cleanPin === 'Sena1234' || cleanPin.toUpperCase() === 'SENA1234') {
      setError(null);
      onSuccess();
      onClose();
    } else {
      setError('Clave incorrecta. La clave asignada es: Sena1234');
    }
  };

  const handleDirectAccess = () => {
    setError(null);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6 relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#00324D]/10 dark:bg-sky-950/60 text-[#00324D] dark:text-sky-300 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white">
              Acceso a Consola del Instructor
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Gestión de sincronización, enlaces y seguimiento de fichas
            </p>
          </div>
        </div>

        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>Clave de Seguridad del Instructor</span>
              <span className="text-[11px] font-normal text-emerald-600 dark:text-emerald-400 font-semibold">(Clave: Sena1234)</span>
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                placeholder="Ingresa la clave (Sena1234)"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(null);
                }}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#39A900] text-slate-900 dark:text-white"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium pt-1">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-[#00324D] hover:bg-[#002538] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Verificar y Entrar</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-center space-y-2">
          <span className="text-[11px] text-slate-400 block">
            ¿Eres el instructor a cargo?
          </span>
          <button
            onClick={handleDirectAccess}
            className="text-xs font-semibold text-[#39A900] hover:text-[#329200] hover:underline inline-flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Acceso Rápido del Instructor</span>
          </button>
        </div>
      </div>
    </div>
  );
};
