import type { L10n } from "./types";

export interface FaqEntry {
  q: L10n;
  a: L10n;
}

/**
 * Practical questions about buying/renting in Algiers. Answers describe the
 * general legal framework (not agency promises) and stay factual.
 */
export const faq: FaqEntry[] = [
  {
    q: {
      fr: "Quels documents vérifier avant d'acheter un bien à Alger ?",
      ar: "ما الوثائق الواجب التحقق منها قبل شراء عقار في الجزائر؟",
    },
    a: {
      fr: "L'acte de propriété (ou acte administratif), le certificat négatif auprès de la conservation foncière, l'état hypothécaire, le permis de construire et la conformité pour le neuf, ainsi que les justificatifs de charges et de taxe foncière. Notre équipe réunit et contrôle ces pièces avant toute offre.",
      ar: "عقد الملكية (أو العقد الإداري)، شهادة السلبية من مصلحة الحفظ العقاري، الحالة العقارية، رخصة البناء وشهادة المطابقة في الجديد، إضافة إلى وثائق التكاليف والضريبة العقارية. يعمل فريقنا على جمع هذه الوثائق ومراجعتها قبل أي عرض.",
    },
  },
  {
    q: {
      fr: "Comment se passe une visite avec ISLEM Immobilier ?",
      ar: "كيف تجري الزيارة مع ISLEM Immobilier؟",
    },
    a: {
      fr: "Vous choisissez un créneau via le formulaire « Demander une visite » ou par WhatsApp. Nous confirmons par téléphone, préparons les réponses sur le quartier et le dossier, et vous accompagnons sur place avec le propriétaire ou l'un de nos conseillers.",
      ar: "تختار موعدًا عبر نموذج «طلب زيارة» أو عبر واتساب. نؤكد الموعد هاتفيًا، ونحضر الإجابات حول الحي والملف، ونرافقك في العين سواء مع المالك أو أحد مستشارينا.",
    },
  },
  {
    q: {
      fr: "Les prix affichés sont-ils négociables ?",
      ar: "هل الأسعار المعروضة قابلة للتفاوض؟",
    },
    a: {
      fr: "Chaque annonce indique si le prix est ferme ou négociable. Nous transmettons toutes les offres sérieuses au propriétaire, sans filtrage, et vous aidons à les argumenter avec les comparables du quartier.",
      ar: "يذكر كل إعلان إن كان السعر نهائيًا أو قابلًا للتفاوض. ننقل كل العروض الجادة إلى المالك دون فرز، ونساعدك على تدعيم عرضك بأمثلة الحى.",
    },
  },
  {
    q: {
      fr: "Puis-je confier mon bien à l'agence si je vis à l'étranger ?",
      ar: "هل يمكنني إسناد عقاري إلى الوكالة إن كنت مقيمًا في الخارج؟",
    },
    a: {
      fr: "Oui. La visite de prospection, la photographie et la diffusion sont assurées par l'agence ; les décisions se prennent à distance avec un mandat et un pouvoir notarié. Un compte rendu est envoyé après chaque visite.",
      ar: "نعم. تتكفل الوكالة بالمعاينة الأولية والتصوير والنشر، وتُتخذ القرارات عن بعد بواسطة وكالة وتوكل عند الموثق. تُرسل لك ملاحظة بعد كل زيارة.",
    },
  },
  {
    q: {
      fr: "Combien coûte une estimation ?",
      ar: "كم تكلف عملية التقييم؟",
    },
    a: {
      fr: "L'estimation de marché réalisée lors de la visite du bien est gratuite et sans engagement. Un rapport écrit détaillé (comparables, fourchette de prix, recommandations) peut être établi sur demande.",
      ar: "تقييم السوق المنجز عند معاينة العقار مجاني ودون التزام. ويمكن إعداد تقرير مكتوب مفصل (الأمثلة، النطاق السعري، التوصيات) عند الطلب.",
    },
  },
];
