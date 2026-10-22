import React, { useState } from 'react';
import { REGULATION_ARTICLES } from '../data/senaRegulationData';
import { RegulationCategory, RegulationArticle } from '../types/induction';
import { ChildAvatar, ChildAvatarVariant } from './ChildAvatar';
import { 
  Search, 
  ShieldCheck, 
  BookOpen, 
  AlertTriangle, 
  Briefcase, 
  Scale, 
  Users, 
  Compass,
  CheckCircle2,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface InteractiveRegulationExplorerProps {
  onTakeQuiz: () => void;
}

export const InteractiveRegulationExplorer: React.FC<InteractiveRegulationExplorerProps> = ({
  onTakeQuiz,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticle, setActiveArticle] = useState<RegulationArticle>(REGULATION_ARTICLES[1]); // Derecho a la formación by default

  const categories: { id: string; label: string; avatar: ChildAvatarVariant }[] = [
    { id: 'all', label: 'Todos los Capítulos', avatar: 'star' },
    { id: 'derechos', label: '24 Derechos (Cap. II)', avatar: 'reader' },
    { id: 'deberes', label: 'Deberes (Cap. III)', avatar: 'boy_cap' },
    { id: 'prohibiciones', label: 'Prohibiciones (Cap. III)', avatar: 'detective' },
    { id: 'etapa_productiva', label: 'Permanencia y Etapa Prod. (Cap. IV)', avatar: 'gamer' },
    { id: 'faltas_medidas', label: 'Faltas, Medidas y Sanciones (Cap. V)', avatar: 'graduate' },
  ];

  const filteredArticles = REGULATION_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.articleNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.keyPoints.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border-2 border-orange-200 dark:border-orange-950/60 shadow-sm transition-colors min-w-0">
        <div className="min-w-0 flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-100 to-orange-100 dark:from-emerald-950 dark:to-orange-950 text-emerald-800 dark:text-orange-300 text-[11px] font-bold mb-1.5 border border-orange-300 dark:border-orange-800 max-w-full truncate shadow-xs">
            <ChildAvatar variant="star" size="xs" />
            <span>Normativa Vigente Oficial</span>
            <span>·</span>
            <span>Acuerdo 0009 de 2024</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#00324D] dark:text-white truncate">
            Nuevo Reglamento del Aprendiz SENA
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Expedido por el Consejo Directivo Nacional · Deroga expresamente los Acuerdos 007/2012, 002/2014, 006/2023 y 002/2024
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por artículo, falta o derecho..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:border-[#39A900] focus:ring-2 focus:ring-[#FF6B00]/20 transition-all placeholder:text-slate-400 min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-orange-600 dark:text-orange-400 font-semibold cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* Segmented Category Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none w-full">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`inline-flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-xl whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#39A900] to-[#FF6B00] text-white shadow-md shadow-emerald-700/20'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-orange-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              <ChildAvatar variant={cat.avatar} size="xs" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Two-Zone Layout: Left List, Right Detailed Interactive Reading Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0">
        {/* Left Column: Articles Index */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ChildAvatar variant="reader" size="xs" />
              <span>Artículos y Capítulos ({filteredArticles.length})</span>
            </span>
          </div>

          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredArticles.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-orange-200 dark:border-orange-800">
                <div className="flex justify-center mb-2">
                  <ChildAvatar variant="detective" size="lg" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No se encontraron artículos</p>
                <p className="text-xs text-slate-400 mt-1">Prueba con otro término de búsqueda o categoría.</p>
              </div>
            ) : (
              filteredArticles.map((art) => {
                const isSelected = activeArticle.id === art.id;
                const avatarVariant: ChildAvatarVariant = 
                  art.category === 'derechos' ? 'reader' :
                  art.category === 'deberes' ? 'boy_cap' :
                  art.category === 'prohibiciones' ? 'detective' :
                  art.category === 'etapa_productiva' ? 'gamer' : 'graduate';

                return (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-emerald-50/90 to-orange-50/70 dark:from-emerald-950/40 dark:to-orange-950/30 border-[#39A900] shadow-sm ring-1 ring-[#FF6B00]/40'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-800 hover:bg-slate-50/70 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                      <div className="flex items-center gap-2">
                        <ChildAvatar variant={avatarVariant} size="xs" />
                        <span className="font-bold text-[#00324D] dark:text-emerald-400">{art.articleNumber}</span>
                      </div>
                      <span className="text-[11px] text-orange-600 dark:text-orange-400 font-semibold">{art.chapter.split(':')[0]}</span>
                    </div>

                    <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                      {art.title}
                    </h4>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                      {art.summary}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-[11px]">
                      <span className="text-[#39A900] dark:text-emerald-400 font-semibold flex items-center gap-1">
                        <span>Ver detalle y aplicación</span>
                        <ChevronRight className="w-3 h-3 text-[#FF6B00]" />
                      </span>
                      <span className="text-slate-400 font-medium">{art.keyPoints.length} puntos clave</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Detailed Interactive Card Deck */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border-2 border-orange-200/80 dark:border-orange-900/50 p-6 md:p-8 shadow-sm space-y-6 transition-colors">
          {/* Article Header */}
          <div className="border-b border-slate-100 dark:border-slate-800 pb-5">
            <div className="flex items-center justify-between gap-2 mb-2 text-xs">
              <span className="font-mono-data font-bold text-white bg-gradient-to-r from-[#39A900] to-[#FF6B00] px-3 py-1 rounded-lg shadow-xs">
                {activeArticle.articleNumber}
              </span>
              <span className="text-orange-600 dark:text-orange-400 font-semibold">{activeArticle.chapter}</span>
            </div>

            <div className="flex items-center gap-3 mt-3">
              <ChildAvatar 
                variant={
                  activeArticle.category === 'derechos' ? 'reader' :
                  activeArticle.category === 'deberes' ? 'boy_cap' :
                  activeArticle.category === 'prohibiciones' ? 'detective' :
                  activeArticle.category === 'etapa_productiva' ? 'gamer' : 'graduate'
                } 
                size="md" 
              />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-[#00324D] dark:text-white leading-tight">
                {activeArticle.title}
              </h3>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 font-medium">
              {activeArticle.summary}
            </p>
          </div>

          {/* Full Regulatory Statement */}
          <div className="p-4 rounded-xl bg-orange-50/40 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 space-y-2">
            <span className="text-[11px] font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
              <ChildAvatar variant="star" size="xs" />
              <span>Texto Reglamentario Oficial</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
              "{activeArticle.fullText}"
            </p>
          </div>

          {/* Key Points Checklist */}
          <div className="space-y-3">
            <h4 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ChildAvatar variant="detective" size="xs" />
              <span>Aspectos Clave que Debes Conocer</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {activeArticle.keyPoints.map((point, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 text-xs text-slate-700 dark:text-slate-300 leading-relaxed flex items-start gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-[#39A900] mt-1.5 shrink-0" />
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Practical Workshop / Real Life Application */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-orange-500/10 to-transparent border border-orange-300/40 dark:border-orange-800/40 space-y-1.5">
            <span className="text-[11px] font-bold text-[#00324D] dark:text-orange-300 uppercase tracking-wider flex items-center gap-1.5">
              <ChildAvatar variant="boy_hoodie" size="xs" />
              <span>Aplicación Práctica en tu Vida como Aprendiz</span>
            </span>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
              {activeArticle.practicalApplication}
            </p>
          </div>

          {/* Prompt to Gamified Practice */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ¿Listo para poner a prueba este conocimiento?
            </span>
            <button
              onClick={onTakeQuiz}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#39A900] to-[#FF6B00] hover:from-[#329200] hover:to-[#ea580c] text-white text-xs font-bold transition-all shadow-md shadow-emerald-700/20 cursor-pointer"
            >
              <ChildAvatar variant="gamer" size="xs" />
              <span>Practicar en Clasificador</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
