import React, { useState } from 'react';
import { ApprenticeData } from '../types/induction';
import { ChildAvatar } from './ChildAvatar';
import { X, CheckCircle2 } from 'lucide-react';

interface ApprenticeProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  apprentice: ApprenticeData;
  onSave: (data: ApprenticeData) => void;
}

export const ApprenticeProfileModal: React.FC<ApprenticeProfileModalProps> = ({
  isOpen,
  onClose,
  apprentice,
  onSave,
}) => {
  const [formData, setFormData] = useState<ApprenticeData>({ ...apprentice });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border-2 border-orange-200 dark:border-orange-800 transition-colors">
        <div className="px-6 py-5 bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#FF6B00] text-white flex items-center justify-between border-b border-orange-400/30">
          <div className="flex items-center gap-3">
            <ChildAvatar variant="boy_hoodie" size="md" />
            <div>
              <h3 className="font-display text-lg font-bold">Datos del Aprendiz SENA</h3>
              <p className="text-xs text-orange-200">
                Esta información se imprimirá en tu Certificado Oficial de Inducción
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <ChildAvatar variant="boy_cap" size="xs" />
              <span>Nombre Completo del Aprendiz *</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all"
              placeholder="Ej. Carlos Andrés Rubio Cárdenas"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <ChildAvatar variant="detective" size="xs" />
                <span>Tipo</span>
              </label>
              <select
                value={formData.documentType}
                onChange={(e) =>
                  setFormData({ ...formData, documentType: e.target.value as ApprenticeData['documentType'] })
                }
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900]"
              >
                <option value="CC">CC (Cédula)</option>
                <option value="TI">TI (Tarjeta)</option>
                <option value="CE">CE (Extranjería)</option>
                <option value="PEP">PEP</option>
              </select>
            </div>
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <span>Número de Documento *</span>
              </label>
              <input
                type="text"
                required
                value={formData.documentNumber}
                onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20"
                placeholder="1020789456"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <ChildAvatar variant="reader" size="xs" />
                <span>Programa de Formación *</span>
              </label>
              <input
                type="text"
                required
                value={formData.trainingProgram}
                onChange={(e) => setFormData({ ...formData, trainingProgram: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20"
                placeholder="Análisis y Desarrollo de Software (ADSO)"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <ChildAvatar variant="gamer" size="xs" />
                <span>Ficha *</span>
              </label>
              <input
                type="text"
                required
                value={formData.fichaNumber}
                onChange={(e) => setFormData({ ...formData, fichaNumber: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm font-mono-data bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900]"
                placeholder="2874912"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <ChildAvatar variant="star" size="xs" />
                <span>Nivel Formativo</span>
              </label>
              <select
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as ApprenticeData['level'] })
                }
                className="w-full px-3 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900]"
              >
                <option value="Tecnólogo">Tecnólogo</option>
                <option value="Técnico">Técnico</option>
                <option value="Operario">Operario</option>
                <option value="Especialización Tecnológica">Especialización</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1 mb-1">
                <ChildAvatar variant="boy_glasses" size="xs" />
                <span>Regional SENA</span>
              </label>
              <input
                type="text"
                required
                value={formData.regional}
                onChange={(e) => setFormData({ ...formData, regional: e.target.value })}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900]"
                placeholder="Distrito Capital, Antioquia..."
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
              <ChildAvatar variant="girl_braids" size="xs" />
              <span>Centro de Formación</span>
            </label>
            <input
              type="text"
              required
              value={formData.trainingCenter}
              onChange={(e) => setFormData({ ...formData, trainingCenter: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 dark:text-white rounded-xl focus:outline-none focus:border-[#39A900]"
              placeholder="Centro de Gestión de Mercados, Tecnologías..."
            />
          </div>

          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Datos reflejados en tu certificado y sincronizables con Google Drive.
            </p>
            <div className="flex items-center justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] rounded-xl transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
              >
                {savedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>¡Guardado con Éxito!</span>
                  </>
                ) : (
                  <span>Guardar y Actualizar</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
