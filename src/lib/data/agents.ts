import { settings } from "./settings";
import type { Agent } from "./types";

/**
 * Team directory. Photos are intentionally NOT faked: cards use monogram
 * avatars until the agency supplies real portraits (`photo` path can be
 * added to the schema later). Phones route to the verified agency line.
 */
export const agents: Agent[] = [
  {
    id: "amine-belkacem",
    initials: "AB",
    name: { fr: "Amine Belkacem", ar: "أمين بلقاسم" },
    role: { fr: "Directeur — ventes & investissements", ar: "مدير — المبيعات والاستثمارات" },
    bio: {
      fr: "Suit les transactions de vente d'appartements, villas et immeubles de rapport à Alger Centre et sur les hauteurs. Négociation, montage du dossier et suivi notarial.",
      ar: "يتابع صفقات بيع الشقق والفلل والعقارات المدرة للدخل في وسط المدينة والأحياء العليا: التفاوض، إعداد الملف ومتابعة الإشهارات.",
    },
    email: "a.belkacem@islemimmobilier.dz",
    languages: ["Français", "العربية", "English"],
    specialties: ["apartment", "villa", "land"],
  },
  {
    id: "sofiane-merabet",
    initials: "SM",
    name: { fr: "Sofiane Merabet", ar: "سفيان مرابط" },
    role: { fr: "Conseiller foncier & commercial", ar: "مستشار الأراضي والمحلات" },
    bio: {
      fr: "Spécialiste des terrains, locaux commerciaux et bureaux. Étude de faisabilité, vérification des actes et mise en relation avec les acquéreurs qualifiés.",
      ar: "متخصص في الأراضي والمحلات التجارية والمكاتب: دراسات الجدوى، التحقق من الوثائق والربط بالمشتريين الجادين.",
    },
    email: "s.merabet@islemimmobilier.dz",
    languages: ["Français", "العربية"],
    specialties: ["land", "commercial", "office"],
  },
  {
    id: "lina-hamidi",
    initials: "LH",
    name: { fr: "Lina Hamidi", ar: "لينا حميدي" },
    role: { fr: "Location & gestion locative", ar: "الكراء والتسيير العقاري" },
    bio: {
      fr: "Gère la location des appartements meublés et nus, la constitution des dossiers (cautions, baux) et l'état des lieux avec les propriétaires.",
      ar: "تسيّر كراء الشقق المفروشة وغير المفروشة، وإعداد ملفات الكراء ومعاينة الحالة مع المالكين.",
    },
    email: "l.hamidi@islemimmobilier.dz",
    languages: ["Français", "العربية", "English"],
    specialties: ["apartment", "office"],
  },
  {
    id: "yacine-toumi",
    initials: "YT",
    name: { fr: "Yacine Toumi", ar: "ياسين تومي" },
    role: { fr: "Estimation & mise en vitrine", ar: "التقييم والعرض الإعلامي" },
    bio: {
      fr: "Évalue les biens avant mise en vente : prix de marché, reportage photo, descriptif bilingue et diffusion ciblée auprès de notre réseau.",
      ar: "يقوّم العقارات قبل عرضها: سعر السوق، تقرير مصوّر، وصف باللغتين ونشر موجّه عبر شبكتنا.",
    },
    email: "y.toumi@islemimmobilier.dz",
    languages: ["Français", "العربية"],
    specialties: ["apartment", "villa", "commercial"],
  },
];

export function getAgent(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}

/** Contact channels exposed on the site (verified agency line). */
export const agencyContact = {
  phone: settings.contact.phoneDisplay,
  email: settings.contact.email,
};
