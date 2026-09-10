import type { L10n } from "./types";

/**
 * Areas covered by the agency around Algiers. Coordinates are neighbourhood
 * centres (used for map zoom levels; exact pins come from each listing).
 */
export interface Neighborhood {
  id: string;
  name: L10n;
  /** District shown in the AR UI (بلدية / مقاطعة). */
  district: L10n;
  coords: { lat: number; lng: number };
  /** Approximate sale price band (DA/m²) — reference only, configurable. */
  note?: L10n;
}

export const NEIGHBORHOODS: Neighborhood[] = [
  {
    id: "alger-centre",
    name: { fr: "Alger Centre", ar: "الجزائر الوسطى" },
    district: { fr: "Alger Centre", ar: "وسط المدينة" },
    coords: { lat: 36.776, lng: 3.06 },
    note: {
      fr: "Cœur historique : immeubles haussmanniens, bureaux et commerces rue Didouche Mourad, Audin, Michelet.",
      ar: "القلب التاريخي: عمارات هاوسمانية ومكاتب ومحلات في شوارع ديدوش مراد وأودان وميشلي.",
    },
  },
  {
    id: "hydra",
    name: { fr: "Hydra", ar: "حيدرة" },
    district: { fr: "Hydra", ar: "حيدرة" },
    coords: { lat: 36.764, lng: 3.035 },
    note: {
      fr: "Quartier résidentiel et diplomatique, vue sur la baie, résidences sécurisées.",
      ar: "حي سكني ودبلوماسي، إطلالة على الخليج وإقامات مؤمّنة.",
    },
  },
  {
    id: "el-biar",
    name: { fr: "El Biar", ar: "البير" },
    district: { fr: "El Biar", ar: "البير" },
    coords: { lat: 36.7747, lng: 3.0296 },
    note: {
      fr: "Collines résidentielles entre Alger Centre et Dely Ibrahim, villas et grands appartements.",
      ar: "تلال سكنية بين وسط المدينة ودالي إبراهيم، فلل وشقق واسعة.",
    },
  },
  {
    id: "ben-aknoun",
    name: { fr: "Ben Aknoun", ar: "بن عكنون" },
    district: { fr: "Ben Aknoun", ar: "بن عكنون" },
    coords: { lat: 36.7836, lng: 2.9861 },
    note: {
      fr: "Villes nouvelles, universités et villas cossues dans un cadre verdoyant.",
      ar: "مدن جديدة وجامعات وفلل فاخرة في محيط أخضر.",
    },
  },
  {
    id: "dely-ibrahim",
    name: { fr: "Dely Ibrahim", ar: "دالي إبراهيم" },
    district: { fr: "Dely Ibrahim", ar: "دالي إبراهيم" },
    coords: { lat: 36.7667, lng: 3.0058 },
  },
  {
    id: "sidi-yahia",
    name: { fr: "Sidi Yahia", ar: "سيدي يحيى" },
    district: { fr: "El Madania / Hydra", ar: "المدنية / حيدرة" },
    coords: { lat: 36.7576, lng: 3.0476 },
    note: {
      fr: "Village prisé pour ses cafés, bureaux et appartements meublés.",
      ar: "حي مطلوب لمقاهيه ومكاتبه وشققه المفروشة.",
    },
  },
  {
    id: "kouba",
    name: { fr: "Kouba", ar: "القبة" },
    district: { fr: "Kouba", ar: "القبة" },
    coords: { lat: 36.7506, lng: 3.0744 },
  },
  {
    id: "bir-mourad-rais",
    name: { fr: "Bir Mourad Raïs", ar: "بئر مراد رايس" },
    district: { fr: "Bir Mourad Raïs", ar: "بئر مراد رايس" },
    coords: { lat: 36.7419, lng: 3.0386 },
  },
  {
    id: "birkhadem",
    name: { fr: "Birkhadem", ar: "بئر خادم" },
    district: { fr: "Birkhadem", ar: "بئر خادم" },
    coords: { lat: 36.7297, lng: 3.0556 },
  },
  {
    id: "mohammadia",
    name: { fr: "Mohammadia", ar: "المحمدية" },
    district: { fr: "Mohammadia", ar: "المحمدية" },
    coords: { lat: 36.7569, lng: 2.9308 },
    note: {
      fr: "Pôle urbain ouest : terrain foncier, nouvelles résidences et zone d'activité.",
      ar: "قطب حضري غربي: أوعية عقارية وإقامات جديدة ومناطق نشاط.",
    },
  },
  {
    id: "ouled-fayet",
    name: { fr: "Ouled Fayet", ar: "أولاد فايت" },
    district: { fr: "Ouled Fayet", ar: "أولاد فايت" },
    coords: { lat: 36.7836, lng: 2.9529 },
  },
  {
    id: "cheraga",
    name: { fr: "Chéraga", ar: "الشراقة" },
    district: { fr: "Chéraga", ar: "الشراقة" },
    coords: { lat: 36.7106, lng: 2.9503 },
  },
  {
    id: "staoueli",
    name: { fr: "Staouéli", ar: "الستاولي" },
    district: { fr: "Staouéli", ar: "الستاولي" },
    coords: { lat: 36.7126, lng: 2.8842 },
  },
  {
    id: "bab-ezzouar",
    name: { fr: "Bab Ezzouar", ar: "باب الزوار" },
    district: { fr: "Bab Ezzouar", ar: "باب الزوار" },
    coords: { lat: 36.7264, lng: 3.1786 },
    note: {
      fr: "Pôle d'affaires de l'est : tours, centres commerciaux et bureaux modernes.",
      ar: "قطب الأعمال شرق المدينة: أبراج ومراكز تجارية ومكاتب عصرية.",
    },
  },
  {
    id: "dar-el-beida",
    name: { fr: "Dar El Beïda", ar: "الدار البيضاء" },
    district: { fr: "Dar El Beïda", ar: "الدار البيضاء" },
    coords: { lat: 36.7131, lng: 3.2153 },
  },
];

export function getNeighborhood(id: string): Neighborhood | undefined {
  return NEIGHBORHOODS.find((n) => n.id === id);
}

export function neighborhoodLabel(id: string, locale: "fr" | "ar"): string {
  return getNeighborhood(id)?.name[locale] ?? id;
}
