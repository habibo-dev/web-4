import type { Service } from "./types";

/**
 * The five core services of the agency. Copy is descriptive of *how* the
 * agency works — no invented results, delays or guarantees.
 */
export const services: Service[] = [
  {
    key: "achat",
    icon: "key",
    title: { fr: "Achat", ar: "الشراء" },
    tagline: { fr: "Trouver le bon bien, au juste prix.", ar: "أن تجد العقار المناسب بالسعر العادل." },
    description: {
      fr: "Nous sélectionnons des biens selon votre budget, vos critères de localisation et votre projet de vie. Chaque visite est préparée : dossier de propriété vérifié, charges de copropriété, environnement du quartier. Vous n'achetez pas les yeux fermés.",
      ar: "ننتقي العقارات حسب ميزانيتك ومعايير الموقع ومشروع حياتك. كل زيارة تُحضَّر مسبقًا: وثائق الملكية مُتحقق منها، تكاليف الإقامة ومحيط الحي. فلا تشتري وأنت مطرق الرأس.",
    },
    bullets: [
      { fr: "Définition des critères et recherche active", ar: "تحديد المعايير والبحث النشط" },
      { fr: "Pré-visites et visites accompagnées", ar: "زيارات أولية ومرافقة عند المعاينة" },
      { fr: "Vérification de l'acte et du certificat négatif", ar: "التحقق من العقد وشهادة السلبية" },
      { fr: "Accompagnement jusqu'à l'acte notarié", ar: "المرافقة إلى غاية تحرير العقد النهائي" },
    ],
  },
  {
    key: "vente",
    icon: "handshake",
    title: { fr: "Vente", ar: "البيع" },
    tagline: { fr: "Mettre votre bien en valeur, du premier appel à la signature.", ar: "نُبرز عقارك من أول مكالمة إلى غاية التوقيع." },
    description: {
      fr: "Estimation honnête fondée sur les prix réellement pratiqués dans votre quartier, reportage photo professionnel, annonce bilingue français-arabe et diffusion auprès de notre fichier d'acquéreurs. Nous filtrons les visites et vous rendons compte de chaque retour.",
      ar: "تقييم صادق مبني على الأسعار المطبقة فعليًا في حيك، تقرير مصوّر احترافي، إعلان باللغتين الفرنسية والعربية ونشر عبر ملف مشترينا. نُصفّي الزيارات وننقل لك ملاحظات كل واحدة.",
    },
    bullets: [
      { fr: "Estimation de marché et prix conseil", ar: "دراسة السوق والسعر الموصى به" },
      { fr: "Photos, plans et annonce bilingue", ar: "صور ومخططات وإعلان ثنائي اللغة" },
      { fr: "Filtrage des acquéreurs et visites encadrées", ar: "فرز المشترين وتأطير الزيارات" },
      { fr: "Coordination notaire, banque et documents", ar: "التنسيق مع الموثق والبنك وإعداد الوثائق" },
    ],
  },
  {
    key: "location",
    icon: "building",
    title: { fr: "Location", ar: "الكراء" },
    tagline: { fr: "Des dossiers de locataires sains et vérifiés.", ar: "ملفات مستأجرين سليمة ومتحقق منها." },
    description: {
      fr: "Pour les propriétaires : recherche de locataires, vérification des revenus et des cautions, rédaction du bail et état des lieux contradictoire. Pour les locataires : une sélection de biens visitables rapidement et des dossiers expliqués avant signature.",
      ar: "للمالكين: البحث عن المستأجرين والتحقق من الدخل والضمانات، تحرير العقد ومعاينة الحالة بصورة مشتركة. وللمستأجرين: عقارات مختارة يمكن زيارتها بسرعة وملفات تُشرح قبل التوقيع.",
    },
    bullets: [
      { fr: "Étude du dossier locataire (revenus, garant)", ar: "دراسة ملف المستأجر (الدخل، الكفيل)" },
      { fr: "Rédaction du bail conforme à la loi 07-05", ar: "تحرير عقد الإيجار طبقًا للقانون 07-05" },
      { fr: "État des lieux d'entrée et de sortie", ar: "معاينة الحالة عند الدخول والخروج" },
      { fr: "Locations meublées et vides", ar: "كراء مفروش وغير مفروش" },
    ],
  },
  {
    key: "estimation",
    icon: "scale",
    title: { fr: "Estimation", ar: "التقييم العقاري" },
    tagline: { fr: "Le prix juste se défend avec des données.", ar: "السعر العادل يُدعم بالبيانات." },
    description: {
      fr: "Une estimation écrite, pièce par pièce : comparables du quartier, état du bien, étage, exposition, ascenseur, parking et demandes actuelles du marché local. Utile avant une vente, une succession, un apport ou simplement pour savoir.",
      ar: "تقييم مكتوب بندًا بندًا: الأمثلة المماثلة في الحي، حالة العقار، الطابق والتوجه والمصعد والمرآب والطلب الحالي في السوق المحلي. مفيد قبل البيع أو القسمة أو الإسهام، أو لمجرد معرفة القيمة.",
    },
    bullets: [
      { fr: "Comparables réels du quartier", ar: "أمثلة حقيقية من الحي" },
      { fr: "Note détaillée sur l'état du bien", ar: "مفصلة حول حالة العقار" },
      { fr: "Fourchette prix + prix conseillé", ar: "نطاق سعري وسعر موصى به" },
      { fr: "Sans engagement de votre part", ar: "دون أي التزام من جانبك" },
    ],
  },
  {
    key: "conseil",
    icon: "compass",
    title: { fr: "Conseil", ar: "الاستشارة" },
    tagline: { fr: "Investir à Alger en confiance.", ar: "استثمر في الجزائر بثقة." },
    description: {
      fr: "Rendement locatif, choix d'un quartier, rénovation, statut juridique, fiscalité de la plus-value : nous répondons aux questions qui précèdent les décisions importantes, avec des repères clairs et des contacts fiables (notaires, architectes, artisans).",
      ar: "العائد من الكراء، اختيار الحي، الترميم، الوضع القانوني، ضريبة القيمة المضافة: نجيب عن الأسئلة التي تسبق القرارات الكبرى، بمؤشرات واضحة وعلاقات موثوقة (موثقون، مهندسون معماريون، حرفيون).",
    },
    bullets: [
      { fr: "Étude de rentabilité locative", ar: "دراسة مردودية الكراء" },
      { fr: "Mode d'acquisition et montage juridique", ar: "طريقة الاقتناء والبناء القانوني" },
      { fr: "Orientation vers notaires et techniciens", ar: "التوجيه نحو الموثقين والتقنيين" },
      { fr: "Suivi après la transaction", ar: "متابعة بعد إتمام الصفقة" },
    ],
  },
];

export function getService(key: string): Service | undefined {
  return services.find((s) => s.key === key);
}
