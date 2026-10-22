import React, { useRef } from 'react';
import { ApprenticeData } from '../types/induction';
import { SenaLogo } from './SenaLogo';
import { ChildAvatar } from './ChildAvatar';
import { 
  Printer, 
  Download, 
  CheckCircle2, 
  Shield, 
  Share2, 
  QrCode,
  Calendar,
  Building,
  User,
  ArrowLeft,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';

interface OfficialCertificateProps {
  apprentice: ApprenticeData;
  score: number;
  percentGrade: number;
  onBackToApp: () => void;
  onOpenProfile: () => void;
  onOpenGoogleSheets?: () => void;
  userRole?: 'instructor' | 'aprendiz';
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  apprentice,
  score,
  percentGrade,
  onBackToApp,
  onOpenProfile,
  onOpenGoogleSheets,
  userRole = 'aprendiz',
}) => {
  const certificateRef = useRef<HTMLDivElement>(null);
  const issueDate = new Date().toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const verificationHash = `SENA-IND-${apprentice.fichaNumber}-${Math.abs(
    apprentice.documentNumber.split('').reduce((a, b) => (a << 5) - a + b.charCodeAt(0), 0)
  )
    .toString(16)
    .toUpperCase()
    .slice(0, 8)}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Toolbar (Hidden in print) */}
      <div className="no-print bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border-2 border-orange-200 dark:border-orange-950/60 shadow-sm flex flex-wrap items-center justify-between gap-4 transition-colors">
        <button
          onClick={onBackToApp}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors cursor-pointer"
        >
          <ChildAvatar variant="boy_cap" size="xs" />
          <ArrowLeft className="w-4 h-4 text-orange-500" />
          <span>Volver al Panel de Inducción</span>
        </button>

        <div className="flex items-center gap-3">
          {userRole === 'instructor' && onOpenGoogleSheets && (
            <button
              onClick={onOpenGoogleSheets}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/60 hover:bg-orange-100 dark:hover:bg-orange-900/60 text-[#FF6B00] text-xs font-bold border border-orange-200 dark:border-orange-800 transition-colors cursor-pointer"
            >
              <ChildAvatar variant="gamer" size="xs" />
              <FileSpreadsheet className="w-4 h-4" />
              <span>Ver en Google Sheets</span>
            </button>
          )}

          <button
            onClick={onOpenProfile}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
          >
            <ChildAvatar variant="boy_hoodie" size="xs" />
            <span>Editar Datos</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer transform hover:-translate-y-0.5"
          >
            <ChildAvatar variant="graduate" size="xs" />
            <Printer className="w-4 h-4" />
            <span>Imprimir / Guardar en PDF</span>
          </button>
        </div>
      </div>

      {/* Diploma Container */}
      <div
        ref={certificateRef}
        className="print-only relative bg-[#FCFDFD] text-slate-900 p-8 sm:p-14 rounded-3xl border-8 border-double border-[#00324D]/30 shadow-2xl overflow-hidden"
      >
        {/* Subtle Watermark Logo in background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
          <SenaLogo size={550} />
        </div>

        {/* Inner Gold / Green Guilloche Margin Line */}
        <div className="border-2 border-[#39A900]/50 p-6 sm:p-10 rounded-2xl relative z-10 space-y-6">
          {/* Header Zone: Republic of Colombia & SENA Institutional Branding */}
          <div className="text-center space-y-3 border-b-2 border-slate-200 pb-6">
            <div className="flex items-center justify-center gap-3">
              <SenaLogo size={52} />
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
                REPÚBLICA DE COLOMBIA · MINISTERIO DEL TRABAJO
              </p>
              <h2 className="font-display text-xl sm:text-2xl font-extrabold text-[#00324D] tracking-wide">
                SERVICIO NACIONAL DE APRENDIZAJE — SENA
              </h2>
              <p className="text-xs text-slate-600 font-medium">
                {apprentice.regional} · {apprentice.trainingCenter}
              </p>
            </div>

            <div className="pt-2 flex flex-col items-center gap-1">
              <span className="inline-block px-6 py-1.5 rounded-full bg-gradient-to-r from-[#00324D] via-[#00476e] to-[#FF6B00] text-white font-display text-xs font-bold uppercase tracking-wider shadow-sm">
                CERTIFICADO OFICIAL DE INDUCCIÓN INSTITUCIONAL
              </span>
              <span className="text-[10px] text-emerald-800 font-semibold tracking-wide">
                En concordancia con el Acuerdo No. 0009 de 2024 del Consejo Directivo Nacional
              </span>
            </div>
          </div>

          {/* Certificate Body */}
          <div className="text-center space-y-6 max-w-2xl mx-auto py-2">
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              La Subdirección y el Comité Académico del Centro de Formación certifican que:
            </p>

            {/* Apprentice Name Callout */}
            <div className="py-2 border-b-2 border-[#39A900]/50 max-w-xl mx-auto">
              <div className="flex items-center justify-center gap-2.5">
                <ChildAvatar variant="graduate" size="sm" />
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#00324D] tracking-tight">
                  {apprentice.fullName}
                </h1>
              </div>
              <p className="text-xs font-mono-data text-slate-500 font-semibold mt-1">
                Identificación: {apprentice.documentType} No. {apprentice.documentNumber}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
              Cursó, participó activamente y aprobó satisfactoriamente el programa de{' '}
              <strong className="text-[#00324D] font-bold">
                INDUCCIÓN INTEGRAL Y APROPIACIÓN DEL REGLAMENTO DEL APRENDIZ SENA
              </strong>
              , correspondiente al programa de formación:
            </p>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 inline-block">
              <span className="block font-display text-sm sm:text-base font-bold text-[#00324D]">
                {apprentice.level}: {apprentice.trainingProgram}
              </span>
              <span className="block text-xs font-mono-data text-[#39A900] font-semibold mt-0.5">
                Ficha de Caracterización No. {apprentice.fichaNumber}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-xl mx-auto">
              Habiendo demostrado idoneidad y pleno conocimiento de los principios institucionales,
              los <strong>24 Derechos Fundamentales</strong> (Cap. II), <strong>Deberes y Prohibiciones</strong> (Cap. III), 
              modalidades de <strong>Permanencia y Etapa Productiva</strong> (Cap. IV) y el régimen de <strong>Faltas, Medidas Formativas y Debido Proceso</strong> (Cap. V) conforme al marco normativo vigente del <strong>Acuerdo No. 0009 de 2024</strong>.
            </p>
          </div>

          {/* Performance & Academic Hours Strip */}
          <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto py-3 bg-emerald-50/60 rounded-xl border border-emerald-200 text-center text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Intensidad</span>
              <span className="font-semibold text-[#00324D]">40 Horas Normativas</span>
            </div>
            <div className="border-x border-emerald-200">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Calificación</span>
              <span className="font-mono-data font-bold text-[#39A900]">
                {score.toFixed(1)} / 5.0 ({percentGrade}%)
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Juicio Evaluativo</span>
              <span className="font-bold text-[#00324D] uppercase">APROBADO</span>
            </div>
          </div>

          {/* Signatures & Verification Stamp Section */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center">
            {/* Signature 1 */}
            <div className="space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto pb-1">
                <span className="font-serif italic text-sm text-slate-700">Dr. Mauricio Morales B.</span>
              </div>
              <p className="text-[11px] font-bold text-slate-800">Subdirector de Centro</p>
              <p className="text-[10px] text-slate-500">SENA Regional {apprentice.regional}</p>
            </div>

            {/* Middle: Official Verification QR Stamp */}
            <div className="space-y-2 flex flex-col items-center">
              <div className="p-2 bg-white rounded-xl border-2 border-slate-300 shadow-sm">
                <QrCode className="w-16 h-16 text-[#00324D]" />
              </div>
              <div className="text-[10px] text-slate-500 space-y-0.5">
                <span className="font-mono-data font-bold block text-slate-700">{verificationHash}</span>
                <span>Verificación Digital Oficial SENA</span>
                <span className="block text-slate-400">Expedido: {issueDate}</span>
              </div>
            </div>

            {/* Signature 2 */}
            <div className="space-y-1">
              <div className="w-40 border-b border-slate-400 mx-auto pb-1">
                <span className="font-serif italic text-sm text-slate-700">Dra. Claudia R. Gómez P.</span>
              </div>
              <p className="text-[11px] font-bold text-slate-800">Coordinación Académica</p>
              <p className="text-[10px] text-slate-500">Comité de Formación Profesional</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
