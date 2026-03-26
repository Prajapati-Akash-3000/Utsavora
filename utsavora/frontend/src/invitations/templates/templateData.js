import BirthdayCard from "./BirthdayCard";
import BirthdayFun from "./BirthdayFun";
import WeddingCard from "./WeddingCard";
import WeddingClassic from "./WeddingClassic";
import GeneralCool from "./GeneralCool";
import GeneralStylish from "./GeneralStylish";
import CorporatePremium from "./CorporatePremium";
import CorporateModern from "./CorporateModern";
import ConcertNeon from "./ConcertNeon";
import ConcertVibrant from "./ConcertVibrant";
import FestivalColorful from "./FestivalColorful";
import FestivalTraditional from "./FestivalTraditional";
import EngagementRomantic from "./EngagementRomantic";
import EngagementElegant from "./EngagementElegant";
import SocialFun from "./SocialFun";
import SocialMinimal from "./SocialMinimal";
import BasicClean from "./BasicClean";
import BasicElegant from "./BasicElegant";

// ─── Template Registry ───
// Minimum 2 per event category · Styles: funny, stylish, premium, elegant, cool
export const templates = [

  // ─── Birthday ───────────────────────────────
  {
    id: "birthday_fun",
    name: "Birthday Fun",
    style: "Funny",
    eventCategory: "birthday",
    component: BirthdayFun,
    color: "#FEF3C7",
    accent: "#EA580C",
  },
  {
    id: "birthday_elegant",
    name: "Birthday Elegant",
    style: "Premium",
    eventCategory: "birthday",
    component: BirthdayCard,
    color: "#FDFBF7",
    accent: "#2D1B4E",
  },

  // ─── Wedding ────────────────────────────────
  {
    id: "wedding_elegant",
    name: "Wedding Elegant",
    style: "Elegant",
    eventCategory: "wedding",
    component: WeddingCard,
    color: "#FDF8F8",
    accent: "#7F1D1D",
  },
  {
    id: "wedding_classic",
    name: "Wedding Classic",
    style: "Premium",
    eventCategory: "wedding",
    component: WeddingClassic,
    color: "#FFFBEB",
    accent: "#B45309",
  },

  // ─── Corporate ──────────────────────────────
  {
    id: "corporate_premium",
    name: "Corporate Premium",
    style: "Premium",
    eventCategory: "corporate",
    component: CorporatePremium,
    color: "#0F172A",
    accent: "#6366F1",
  },
  {
    id: "corporate_modern",
    name: "Corporate Modern",
    style: "Stylish",
    eventCategory: "corporate",
    component: CorporateModern,
    color: "#F8FAFC",
    accent: "#0EA5E9",
  },

  // ─── Concert ────────────────────────────────
  {
    id: "concert_neon",
    name: "Concert Neon",
    style: "Cool",
    eventCategory: "concert",
    component: ConcertNeon,
    color: "#0C0A1A",
    accent: "#A78BFA",
  },
  {
    id: "concert_vibrant",
    name: "Concert Vibrant",
    style: "Funny",
    eventCategory: "concert",
    component: ConcertVibrant,
    color: "#DC2626",
    accent: "#FFFFFF",
  },

  // ─── Festival ───────────────────────────────
  {
    id: "festival_colorful",
    name: "Festival Colorful",
    style: "Funny",
    eventCategory: "festival",
    component: FestivalColorful,
    color: "#FCE7F3",
    accent: "#BE185D",
  },
  {
    id: "festival_traditional",
    name: "Festival Traditional",
    style: "Elegant",
    eventCategory: "festival",
    component: FestivalTraditional,
    color: "#FFFBEB",
    accent: "#92400E",
  },

  // ─── Engagement ─────────────────────────────
  {
    id: "engagement_romantic",
    name: "Engagement Romantic",
    style: "Elegant",
    eventCategory: "engagement",
    component: EngagementRomantic,
    color: "#FECDD3",
    accent: "#BE123C",
  },
  {
    id: "engagement_elegant",
    name: "Engagement Elegant",
    style: "Premium",
    eventCategory: "engagement",
    component: EngagementElegant,
    color: "#F3E8FF",
    accent: "#7C3AED",
  },

  // ─── Social ─────────────────────────────────
  {
    id: "social_fun",
    name: "Social Fun",
    style: "Funny",
    eventCategory: "social",
    component: SocialFun,
    color: "#D1FAE5",
    accent: "#059669",
  },
  {
    id: "social_minimal",
    name: "Social Minimal",
    style: "Stylish",
    eventCategory: "social",
    component: SocialMinimal,
    color: "#F3F4F6",
    accent: "#6366F1",
  },

  // ─── Other / Basic (works for any event) ────
  {
    id: "basic_clean",
    name: "Basic Clean",
    style: "Stylish",
    eventCategory: "other",
    component: BasicClean,
    color: "#F8FAFC",
    accent: "#475569",
  },
  {
    id: "basic_elegant",
    name: "Basic Elegant",
    style: "Premium",
    eventCategory: "other",
    component: BasicElegant,
    color: "#1C1917",
    accent: "#D97706",
  },

  // ─── General (shown for every category) ─────
  {
    id: "general_cool",
    name: "Cool Modern",
    style: "Cool",
    eventCategory: "general",
    component: GeneralCool,
    color: "#1E293B",
    accent: "#38BDF8",
  },
  {
    id: "general_stylish",
    name: "Stylish Minimal",
    style: "Stylish",
    eventCategory: "general",
    component: GeneralStylish,
    color: "#FAFAFA",
    accent: "#171717",
  },
];

// Helper: look up a template by string ID (supports legacy ids like "birthday", "wedding")
export function getTemplateById(id) {
  if (!id) return templates[0];
  const byId = templates.find((t) => t.id === id);
  if (byId) return byId;
  // Legacy fallbacks
  if (id === "birthday") return templates.find((t) => t.id === "birthday_elegant") || templates[0];
  if (id === "wedding") return templates.find((t) => t.id === "wedding_elegant") || templates[0];
  return templates[0];
}

export function getTemplatesForCategory(categorySlug) {
  if (!categorySlug) return templates;
  const slug = String(categorySlug).toLowerCase();

  // Robust mapping from backend DB slug to frontend template categories
  let mappedCategory = slug;
  if (slug.includes("corporate") || slug.includes("conference") || slug.includes("networking") || slug.includes("workshop") || slug.includes("exhibition")) mappedCategory = "corporate";
  else if (slug.includes("birthday") || slug.includes("baby")) mappedCategory = "birthday";
  else if (slug.includes("social")) mappedCategory = "social";
  else if (slug.includes("concert")) mappedCategory = "concert";
  else if (slug.includes("wedding") || slug.includes("engagement")) mappedCategory = "wedding";
  else if (slug.includes("festival")) mappedCategory = "festival";

  return templates.filter(
    (t) => t.eventCategory === mappedCategory || t.eventCategory === "general" || t.eventCategory === "other"
  );
}
