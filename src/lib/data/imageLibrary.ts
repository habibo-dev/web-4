import type { L10n } from "./types";

/**
 * Central image registry (self-hosted in /public/images, served through
 * next/image with AVIF/WebP auto-negotiation). Listing data references
 * these keys so alt-text and dimensions live in one place.
 *
 * ⚠️ The photography shipped with the template is illustrative AI-rendered
 * imagery; the agency replaces the files in /public/images (same names)
 * with real property photos — zero code change required.
 */
export interface LibImage {
  src: string;
  width: number;
  height: number;
  alt: L10n;
}

const W = 1600;
const H = 1067;

function img(file: string, fr: string, ar: string, width = W, height = H): LibImage {
  return { src: `/images/${file}.webp`, width, height, alt: { fr, ar } };
}

export const IMAGE_LIB: Record<string, LibImage> = {
  // ── City / architecture ────────────────────────────────────────────
  "city/alger-bay": img(
    "city/alger-bay",
    "Vue aérienne de la baie d'Alger au coucher du soleil, entre mer et collines",
    "إطلالة جوية على خليج الجزائر عند الغروب، بين البحر والتلال",
    2200,
    1300,
  ),
  "city/alger-facades": img(
    "city/alger-facades",
    "Façades haussmanniennes restaurées en plein centre d'Alger",
    "واجهات هاوسمانية مُرمَّمة في قلب وسط مدينة الجزائر",
  ),
  "city/alger-evening-street": img(
    "city/alger-evening-street",
    "Rue animée du centre d'Alger en soirée, lumière dorée sur les immeubles",
    "شارع حيّ في وسط المدينة مساءً بضوء ذهبي على العمارات",
  ),
  // ── Appartements ───────────────────────────────────────────────────
  "apt/living-bright": img(
    "apt/living-bright",
    "Séjour lumineux au sol clair, grandes ouvertures sur l'extérieur",
    "غرفة معيشة مشرقة بأرضية فاتحة ونوافذ واسعة نحو الخارج",
  ),
  "apt/kitchen-modern": img(
    "apt/kitchen-modern",
    "Cuisine équipée moderne, plans de travail en pierre claire",
    "مطبخ عصري مجهز بأسطح عمل حجرية فاتحة",
  ),
  "apt/bedroom-calm": img(
    "apt/bedroom-calm",
    "Chambre aux tons neutres avec rangements intégrés",
    "غرفة نوم بألوان محايدة وخزائن مدمجة",
  ),
  "apt/bathroom-marble": img(
    "apt/bathroom-marble",
    "Salle de bains en marbre avec double vasque et douche à l'italienne",
    "حمام من الرخام بحوض مزدوج ودش إيطالي",
  ),
  "apt/terrace-sea": img(
    "apt/terrace-sea",
    "Terrasse d'appartement donnant sur la Méditerranée",
    "شرفة شقة تطل على البحر المتوسط",
  ),
  "apt/living-renovated": img(
    "apt/living-renovated",
    "Grand séjour rénové avec moulures et parquet",
    "صالة كبيرة مجددة بتفاصيل جصية وأرضية خشبية",
  ),
  "apt/kitchen-open": img(
    "apt/kitchen-open",
    "Cuisine ouverte sur l'espace à manger, îlot central",
    "مطبخ مفتوح على غرفة الأكل بجزيرة وسطية",
  ),
  "apt/bedroom-primary": img(
    "apt/bedroom-primary",
    "Suite parentale avec dressing et vue dégagée",
    "جناح رئيسي بحجرة لباس وإطلالة مفتوحة",
  ),
  "apt/balcony-city": img(
    "apt/balcony-city",
    "Balcon filigrane de fer forgé surplombant les toits d'Alger",
    "شرفة من الحديد المطاوع تطل على أسطح الجزائر",
  ),
  "apt/living-furnished": img(
    "apt/living-furnished",
    "Salon meublé contemporain, prêt à emménager",
    "صالون مفروش عصري جاهز للسكن",
  ),
  "apt/study-nook": img(
    "apt/study-nook",
    "Coin bureau et bibliothèque intégrée dans la lumière du matin",
    "ركن مكتب مع مكتبة مدمجة في ضوء الصباح",
  ),
  // ── Villas ─────────────────────────────────────────────────────────
  "villa/exterior-pool": img(
    "villa/exterior-pool",
    "Villa contemporaine avec piscine à débordement et terrasse ombragée",
    "فيلا عصرية بمسبح لا متناهي وشرفة مظللة",
  ),
  "villa/exterior-modern": img(
    "villa/exterior-modern",
    "Façade minérale d'une villa récente, jardins paysagers",
    "واجهة حجرية لفيلا حديثة بحدائق منسقة",
  ),
  "villa/living-double": img(
    "villa/living-double",
    "Double séjour traversant sous plafond cathédrale",
    "صالة مزدوجة مفتوحة بسقف عالٍ",
  ),
  "villa/bedroom-suite": img(
    "villa/bedroom-suite",
    "Suite parentale avec terrasse privée et vue sur le jardin",
    "جناح النوم الرئيسي بشرفة خاصة وإطلالة على الحديقة",
  ),
  "villa/garden-terrace": img(
    "villa/garden-terrace",
    "Terrasse de jardin avec pergola, oliviers et salon d'été",
    "شرفة حديقة بعرش وأشجار زيتون وجلسة صيفية",
  ),
  "villa/kitchen-dining": img(
    "villa/kitchen-dining",
    "Cuisine généreuse avec long îlot et salle à manger attenante",
    "مطبخ واسع بجزيرة طويلة وغرفة طعام مجاورة",
  ),
  "villa/pool-evening": img(
    "villa/pool-evening",
    "Piscine éclairée au crépuscule autour de la villa",
    "مسبح مضاء وقت الغروب حول الفيلا",
  ),
  // ── Terrains ───────────────────────────────────────────────────────
  "land/plot-hill-view": img(
    "land/plot-hill-view",
    "Terrain à bâtir en position dominante avec vue sur la plaine et la mer",
    "أرض للبناء في مرتفع تطل على السهل والبحر",
  ),
  "land/plot-urban": img(
    "land/plot-urban",
    "Parcelle viabilisée en bordure de voirie, prête à construire",
    "قطعة أرض مجهزة بجانب طريق عامة جاهزة للبناء",
  ),
  "land/plot-terraces": img(
    "land/plot-terraces",
    "Terrain en restanques dans un environnement résidentiel calme",
    "أرض مدرّجة في محيط سكني هادئ",
  ),
  // ── Locaux commerciaux ─────────────────────────────────────────────
  "com/shop-front": img(
    "com/shop-front",
    "Local commercial de plain-pied avec grande vitrine sur avenue passante",
    "محل تجاري في الطابق الأرضي بواجهة زجاجية واسعة على شارع حيوي",
  ),
  "com/retail-space": img(
    "com/retail-space",
    "Espace de vente brut, hauteur sous plafond généreuse",
    "فضاء بيع فارغ بارتفاع سقف كبير",
  ),
  "com/showroom": img(
    "com/showroom",
    "Showroom lumineux au sol poli, idéal pour commerce ou exposition",
    "قاعة عرض مشرقة بأرضية مصقولة، مناسبة للعرض التجاري",
  ),
  // ── Bureaux ────────────────────────────────────────────────────────
  "office/meeting-glass": img(
    "office/meeting-glass",
    "Salle de réunion vitrée avec vue sur la ville",
    "قاعة اجتماعات زجاجية بإطلالة على المدينة",
  ),
  "office/open-space": img(
    "office/open-space",
    "Open-space aménagé, bois clair et lumière naturelle",
    "فضاء عمل مفتوح مجهز بخشب فاتح وضوء طبيعي",
  ),
  "office/reception": img(
    "office/reception",
    "Accueil et hall d'entrée d'un étage de bureaux privatif",
    "استقبال بهو لطابق مكاتب خاص",
  ),
};

export type ImageKey = keyof typeof IMAGE_LIB;

export function resolveImage(key: string): LibImage {
  const found = IMAGE_LIB[key];
  if (!found) {
    throw new Error(`[data] unknown image key "${key}" — check IMAGE_LIB`);
  }
  return found;
}
