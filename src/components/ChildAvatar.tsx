import React from 'react';

export type ChildAvatarVariant = 
  | 'boy_cap'         // Niño con gorra deportiva verde/naranja
  | 'girl_pigtails'   // Niña con coletas y lazos
  | 'boy_glasses'     // Niño con lentes y pecas
  | 'girl_curls'      // Niña con rizos y diadema
  | 'boy_hoodie'      // Niño sonriente con sudadera
  | 'girl_braids'     // Niña alegre con trenzas
  | 'graduate'        // Niño/niña con birrete de graduación
  | 'instructor_kid'  // Pequeño guía con gafete y corbatín
  | 'detective'       // Niño explorador/investigador
  | 'gamer'           // Niño con audífonos gamer
  | 'star'            // Niña celebrando con brillo
  | 'reader';         // Niño con libro

interface ChildAvatarProps {
  variant?: ChildAvatarVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  className?: string;
  badge?: React.ReactNode;
  alt?: string;
  glow?: boolean;
}

export const ChildAvatar: React.FC<ChildAvatarProps> = ({
  variant = 'boy_cap',
  size = 'md',
  className = '',
  badge,
  alt = 'Avatar de niño aprendiz',
  glow = false,
}) => {
  // Determine pixel size
  let dimension = 36;
  if (typeof size === 'number') {
    dimension = size;
  } else {
    switch (size) {
      case 'xs': dimension = 20; break;
      case 'sm': dimension = 28; break;
      case 'md': dimension = 38; break;
      case 'lg': dimension = 50; break;
      case 'xl': dimension = 72; break;
    }
  }

  // Render specific child face vector artwork
  const renderFace = () => {
    switch (variant) {
      case 'girl_pigtails':
        return (
          <g>
            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-orange-green)" />
            {/* Hair back / pigtails */}
            <circle cx="20" cy="35" r="14" fill="#6B3A1C" />
            <circle cx="80" cy="35" r="14" fill="#6B3A1C" />
            <ellipse cx="20" cy="32" rx="5" ry="4" fill="#FF6B00" />
            <ellipse cx="80" cy="32" rx="5" ry="4" fill="#FF6B00" />
            {/* Ears */}
            <circle cx="28" cy="54" r="6" fill="#FCD5B5" />
            <circle cx="72" cy="54" r="6" fill="#FCD5B5" />
            {/* Face */}
            <circle cx="50" cy="55" r="26" fill="#FCD5B5" />
            {/* Bangs / Hair Front */}
            <path d="M 28 45 C 35 30, 65 30, 72 45 C 65 38, 55 42, 50 38 C 45 42, 35 38, 28 45 Z" fill="#6B3A1C" />
            {/* Cheeks */}
            <circle cx="38" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
            <circle cx="62" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
            {/* Eyes */}
            <ellipse cx="40" cy="53" rx="3.5" ry="4" fill="#1E293B" />
            <ellipse cx="60" cy="53" rx="3.5" ry="4" fill="#1E293B" />
            <circle cx="41.5" cy="51.5" r="1.3" fill="#FFFFFF" />
            <circle cx="61.5" cy="51.5" r="1.3" fill="#FFFFFF" />
            {/* Happy Smile */}
            <path d="M 43 62 Q 50 70 57 62" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Green and Orange Hairclip */}
            <circle cx="32" cy="35" r="3.5" fill="#39A900" />
          </g>
        );

      case 'boy_glasses':
        return (
          <g>
            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-green-orange)" />
            {/* Hair */}
            <path d="M 26 46 C 24 24, 76 24, 74 46 C 70 32, 60 30, 50 32 C 40 30, 30 32, 26 46 Z" fill="#3E2723" />
            {/* Ears */}
            <circle cx="26" cy="54" r="6" fill="#FBD2B0" />
            <circle cx="74" cy="54" r="6" fill="#FBD2B0" />
            {/* Face */}
            <circle cx="50" cy="54" r="26" fill="#FBD2B0" />
            {/* Cheeks with freckles */}
            <circle cx="38" cy="62" r="3.5" fill="#FFA4A4" opacity="0.5" />
            <circle cx="62" cy="62" r="3.5" fill="#FFA4A4" opacity="0.5" />
            <circle cx="36" cy="60" r="0.8" fill="#9A3412" />
            <circle cx="40" cy="60" r="0.8" fill="#9A3412" />
            <circle cx="60" cy="60" r="0.8" fill="#9A3412" />
            <circle cx="64" cy="60" r="0.8" fill="#9A3412" />
            {/* Glasses Frame (Green/Orange) */}
            <circle cx="40" cy="52" r="7.5" stroke="#FF6B00" strokeWidth="2.2" fill="rgba(255,255,255,0.4)" />
            <circle cx="60" cy="52" r="7.5" stroke="#FF6B00" strokeWidth="2.2" fill="rgba(255,255,255,0.4)" />
            <line x1="47.5" y1="52" x2="52.5" y2="52" stroke="#FF6B00" strokeWidth="2.2" />
            {/* Eyes behind glasses */}
            <circle cx="40" cy="52" r="3" fill="#0F172A" />
            <circle cx="60" cy="52" r="3" fill="#0F172A" />
            <circle cx="41.2" cy="50.8" r="1.1" fill="#FFFFFF" />
            <circle cx="61.2" cy="50.8" r="1.1" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M 43 64 Q 50 71 57 64" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'girl_curls':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-orange-green)" />
            {/* Afro Curls Back */}
            <circle cx="28" cy="38" r="14" fill="#261C14" />
            <circle cx="72" cy="38" r="14" fill="#261C14" />
            <circle cx="50" cy="28" r="16" fill="#261C14" />
            <circle cx="36" cy="28" r="13" fill="#261C14" />
            <circle cx="64" cy="28" r="13" fill="#261C14" />
            {/* Orange and Green Headband */}
            <path d="M 28 44 Q 50 34 72 44" stroke="#FF6B00" strokeWidth="5" fill="none" strokeLinecap="round" />
            <circle cx="34" cy="40" r="4" fill="#39A900" />
            {/* Ears */}
            <circle cx="28" cy="54" r="5.5" fill="#E8B382" />
            <circle cx="72" cy="54" r="5.5" fill="#E8B382" />
            {/* Face */}
            <circle cx="50" cy="55" r="24" fill="#E8B382" />
            {/* Rosy Cheeks */}
            <circle cx="38" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
            <circle cx="62" cy="62" r="4" fill="#FF8A8A" opacity="0.6" />
            {/* Eyes */}
            <ellipse cx="41" cy="53" rx="3.2" ry="4" fill="#1C1917" />
            <ellipse cx="59" cy="53" rx="3.2" ry="4" fill="#1C1917" />
            <circle cx="42.2" cy="51.5" r="1.2" fill="#FFFFFF" />
            <circle cx="60.2" cy="51.5" r="1.2" fill="#FFFFFF" />
            {/* Big Smile */}
            <path d="M 43 63 Q 50 71 57 63" stroke="#78350F" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </g>
        );

      case 'graduate':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-green-orange)" />
            {/* Face */}
            <circle cx="50" cy="56" r="24" fill="#FCD5B5" />
            {/* Cheeks */}
            <circle cx="38" cy="63" r="3.5" fill="#FF8A8A" opacity="0.6" />
            <circle cx="62" cy="63" r="3.5" fill="#FF8A8A" opacity="0.6" />
            {/* Eyes */}
            <circle cx="41" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="59" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="42.5" cy="52.5" r="1.2" fill="#FFFFFF" />
            <circle cx="60.5" cy="52.5" r="1.2" fill="#FFFFFF" />
            {/* Big Joyful Smile */}
            <path d="M 42 63 Q 50 73 58 63" stroke="#B45309" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Hair below cap */}
            <path d="M 30 50 C 35 44, 40 46, 50 44 C 60 46, 65 44, 70 50" stroke="#5C3317" strokeWidth="3" fill="none" />
            {/* Graduation Cap (Green with Orange Tassel) */}
            <polygon points="50,18 78,32 50,42 22,32" fill="#39A900" stroke="#00324D" strokeWidth="1.5" />
            <rect x="36" y="36" width="28" height="8" rx="2" fill="#00324D" />
            {/* Tassel */}
            <line x1="50" y1="30" x2="68" y2="38" stroke="#FF6B00" strokeWidth="2" />
            <circle cx="68" cy="40" r="2.5" fill="#FF6B00" />
            {/* Little star */}
            <polygon points="50,12 52,16 56,16 53,19 54,23 50,20 46,23 47,19 44,16 48,16" fill="#FBBF24" />
          </g>
        );

      case 'instructor_kid':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-orange-green)" />
            {/* Hair */}
            <path d="M 28 45 C 26 26, 74 26, 72 45 C 68 34, 50 30, 28 45 Z" fill="#2E1805" />
            {/* Ears */}
            <circle cx="27" cy="54" r="5" fill="#FCD5B5" />
            <circle cx="73" cy="54" r="5" fill="#FCD5B5" />
            {/* Face */}
            <circle cx="50" cy="54" r="25" fill="#FCD5B5" />
            {/* Instructor Glasses */}
            <rect x="34" y="47" width="13" height="10" rx="3" stroke="#00324D" strokeWidth="2" fill="rgba(255,255,255,0.5)" />
            <rect x="53" y="47" width="13" height="10" rx="3" stroke="#00324D" strokeWidth="2" fill="rgba(255,255,255,0.5)" />
            <line x1="47" y1="52" x2="53" y2="52" stroke="#00324D" strokeWidth="2" />
            {/* Eyes */}
            <circle cx="40.5" cy="52" r="2.5" fill="#0F172A" />
            <circle cx="59.5" cy="52" r="2.5" fill="#0F172A" />
            <circle cx="41.5" cy="51" r="0.9" fill="#FFFFFF" />
            <circle cx="60.5" cy="51" r="0.9" fill="#FFFFFF" />
            {/* Smile */}
            <path d="M 44 65 Q 50 71 56 65" stroke="#9A3412" strokeWidth="2.3" strokeLinecap="round" fill="none" />
            {/* Bowtie (Orange with Green Center) */}
            <polygon points="43,76 50,78 43,82" fill="#FF6B00" />
            <polygon points="57,76 50,78 57,82" fill="#FF6B00" />
            <circle cx="50" cy="78" r="2.5" fill="#39A900" />
          </g>
        );

      case 'gamer':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-green-orange)" />
            {/* Headset Band */}
            <path d="M 22 52 C 20 25, 80 25, 78 52" stroke="#FF6B00" strokeWidth="5" fill="none" strokeLinecap="round" />
            {/* Headset Ear Cushions */}
            <rect x="18" y="44" width="8" height="18" rx="4" fill="#39A900" stroke="#FF6B00" strokeWidth="1.5" />
            <rect x="74" y="44" width="8" height="18" rx="4" fill="#39A900" stroke="#FF6B00" strokeWidth="1.5" />
            {/* Face */}
            <circle cx="50" cy="55" r="24" fill="#FBD2B0" />
            {/* Hair */}
            <path d="M 29 46 C 35 32, 65 32, 71 46 C 63 36, 52 40, 50 36 C 46 40, 36 36, 29 46 Z" fill="#4B270A" />
            {/* Cheeks */}
            <circle cx="39" cy="63" r="3.5" fill="#FF8A8A" opacity="0.6" />
            <circle cx="61" cy="63" r="3.5" fill="#FF8A8A" opacity="0.6" />
            {/* Sparkly Gamer Eyes */}
            <ellipse cx="41" cy="54" rx="3.5" ry="4" fill="#1E293B" />
            <ellipse cx="59" cy="54" rx="3.5" ry="4" fill="#1E293B" />
            <circle cx="42.5" cy="52" r="1.3" fill="#FFFFFF" />
            <circle cx="60.5" cy="52" r="1.3" fill="#FFFFFF" />
            {/* Energetic Smile */}
            <path d="M 43 64 Q 50 72 57 64" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Mic */}
            <path d="M 24 58 Q 32 68 40 68" stroke="#39A900" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="40" cy="68" r="2" fill="#FF6B00" />
          </g>
        );

      case 'reader':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-orange-green)" />
            {/* Hair */}
            <path d="M 28 44 C 30 26, 70 26, 72 44 C 64 36, 55 34, 50 36 C 45 34, 34 36, 28 44 Z" fill="#6B3A1C" />
            {/* Face */}
            <circle cx="50" cy="52" r="24" fill="#FCD5B5" />
            {/* Cheeks */}
            <circle cx="39" cy="60" r="3.5" fill="#FF8A8A" opacity="0.6" />
            <circle cx="61" cy="60" r="3.5" fill="#FF8A8A" opacity="0.6" />
            {/* Focused Happy Eyes */}
            <path d="M 37 50 Q 41 46 45 50" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 55 50 Q 59 46 63 50" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Sweet Smile */}
            <path d="M 44 60 Q 50 66 56 60" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Mini Book Held at Bottom */}
            <polygon points="32,70 50,74 50,86 32,82" fill="#39A900" />
            <polygon points="68,70 50,74 50,86 68,82" fill="#FF6B00" />
            <line x1="50" y1="74" x2="50" y2="86" stroke="#FFFFFF" strokeWidth="1.5" />
          </g>
        );

      case 'detective':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-green-orange)" />
            {/* Detective / Explorer Hat */}
            <ellipse cx="50" cy="38" rx="30" ry="8" fill="#D97706" />
            <path d="M 30 38 C 30 24, 70 24, 70 38 Z" fill="#B45309" />
            <rect x="30" y="34" width="40" height="4" fill="#39A900" />
            {/* Face */}
            <circle cx="50" cy="56" r="23" fill="#FBD2B0" />
            {/* Cheeks */}
            <circle cx="39" cy="64" r="3.5" fill="#FF8A8A" opacity="0.5" />
            <circle cx="61" cy="64" r="3.5" fill="#FF8A8A" opacity="0.5" />
            {/* Winking / Curious Eyes */}
            <circle cx="41" cy="54" r="3.5" fill="#1E293B" />
            <circle cx="42.5" cy="52" r="1.2" fill="#FFFFFF" />
            <path d="M 57 54 Q 61 50 65 54" stroke="#1E293B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            {/* Inquisitive Smile */}
            <path d="M 44 65 Q 50 71 56 66" stroke="#9A3412" strokeWidth="2.2" strokeLinecap="round" fill="none" />
            {/* Mini Magnifier badge in corner */}
            <circle cx="70" cy="70" r="7" stroke="#FF6B00" strokeWidth="2" fill="rgba(255,255,255,0.7)" />
            <line x1="75" y1="75" x2="82" y2="82" stroke="#39A900" strokeWidth="3" strokeLinecap="round" />
          </g>
        );

      case 'star':
        return (
          <g>
            {/* Background */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-orange-green)" />
            {/* Cute Hair with Star Clip */}
            <path d="M 28 44 C 32 26, 68 26, 72 44 C 64 36, 52 38, 50 36 C 44 38, 36 36, 28 44 Z" fill="#451A03" />
            {/* Face */}
            <circle cx="50" cy="54" r="24" fill="#FCD5B5" />
            {/* Cheeks */}
            <circle cx="38" cy="62" r="4" fill="#FF8A8A" opacity="0.7" />
            <circle cx="62" cy="62" r="4" fill="#FF8A8A" opacity="0.7" />
            {/* Happy Eyes (Arches) */}
            <path d="M 37 52 Q 41 46 45 52" stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            <path d="M 55 52 Q 59 46 63 52" stroke="#1E293B" strokeWidth="2.8" fill="none" strokeLinecap="round" />
            {/* Wide Joyful Open Smile */}
            <path d="M 43 61 Q 50 72 57 61 Z" fill="#DC2626" />
            {/* Star on Hair */}
            <polygon points="32,32 34,36 38,36 35,39 36,43 32,40 28,43 29,39 26,36 30,36" fill="#FBBF24" stroke="#FF6B00" strokeWidth="1" />
          </g>
        );

      case 'boy_cap':
      default:
        return (
          <g>
            {/* Background Circle */}
            <circle cx="50" cy="50" r="48" fill="url(#grad-green-orange)" />
            {/* Face */}
            <circle cx="50" cy="56" r="25" fill="#FCD5B5" />
            {/* Cheeks */}
            <circle cx="38" cy="64" r="3.5" fill="#FF8A8A" opacity="0.6" />
            <circle cx="62" cy="64" r="3.5" fill="#FF8A8A" opacity="0.6" />
            {/* Friendly Big Eyes */}
            <circle cx="41" cy="54" r="3.8" fill="#0F172A" />
            <circle cx="59" cy="54" r="3.8" fill="#0F172A" />
            <circle cx="42.5" cy="52" r="1.4" fill="#FFFFFF" />
            <circle cx="60.5" cy="52" r="1.4" fill="#FFFFFF" />
            {/* Warm Wide Smile */}
            <path d="M 43 64 Q 50 73 57 64" stroke="#9A3412" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            {/* Hair tips under cap */}
            <path d="M 28 52 C 26 48, 28 44, 30 46" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
            <path d="M 72 52 C 74 48, 72 44, 70 46" stroke="#451A03" strokeWidth="3" strokeLinecap="round" />
            {/* Cap Dome (SENA Green) */}
            <path d="M 28 44 C 28 26, 72 26, 72 44 Z" fill="#39A900" />
            {/* Cap Visor (Vibrant Orange) */}
            <path d="M 24 44 C 24 40, 76 40, 78 44 C 68 47, 34 47, 24 44 Z" fill="#FF6B00" />
            <circle cx="50" cy="27" r="2" fill="#FF6B00" />
            {/* Tiny SENA Star/Check on cap */}
            <circle cx="50" cy="36" r="2.5" fill="#FFFFFF" />
          </g>
        );
    }
  };

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none transition-transform hover:scale-105 ${
        glow ? 'ring-2 ring-[#FF6B00] shadow-md shadow-[#FF6B00]/30' : ''
      } ${className}`}
      style={{ width: dimension, height: dimension }}
      title={alt}
    >
      <svg
        viewBox="0 0 100 100"
        width={dimension}
        height={dimension}
        className="w-full h-full rounded-full overflow-hidden"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Green to Orange Gradient */}
          <linearGradient id="grad-green-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39A900" />
            <stop offset="60%" stopColor="#22C55E" />
            <stop offset="100%" stopColor="#FF6B00" />
          </linearGradient>

          {/* Orange to Green Gradient */}
          <linearGradient id="grad-orange-green" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6B00" />
            <stop offset="50%" stopColor="#FB923C" />
            <stop offset="100%" stopColor="#39A900" />
          </linearGradient>

          {/* Vibrant Sunburst Gradient */}
          <linearGradient id="grad-vibrant" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#39A900" />
            <stop offset="100%" stopColor="#F97316" />
          </linearGradient>
        </defs>

        {renderFace()}
      </svg>

      {/* Optional contextual badge icon overlay */}
      {badge && (
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-xs border border-orange-200 dark:border-orange-800 flex items-center justify-center text-[10px]">
          {badge}
        </div>
      )}
    </div>
  );
};
