import { User } from "@/utils/types";

export const nav_headers = (user: User | null) => [
  {
    name: "Home",
    href: "/",
    condition: true,
  },
  {
    name: "About",
    href: "/about",
    condition: true,
  },
  {
    name: "Contact",
    href: "/contact",
    condition: true,
  },
  {
    name: "Sign in",
    href: "/auth/signin",
    condition: !user,
  },
  {
    name: "Sign up",
    href: "/auth/signup",
    condition: !user,
  },
  {
    name: "Sign out",
    href: "",
    condition: user,
    action: true,
  },
];

export const countryUnits = {
  US: "imperial", // United States
  LR: "imperial", // Liberia
  MM: "imperial", // Myanmar
  CA: "metric", // Canada
  GB: "metric", // United Kingdom
  IN: "metric", // India
  AU: "metric", // Australia
  DE: "metric", // Germany
  FR: "metric", // France
  PK: "metric", // Pakistan
  BR: "metric", // Brazil
  CN: "metric", // China
  MX: "metric", // Mexico
  ES: "metric", // Spain
  IT: "metric", // Italy
  JP: "metric", // Japan
  RU: "metric", // Russia
  ZA: "metric", // South Africa
  AR: "metric", // Argentina
  NG: "metric", // Nigeria
  EG: "metric", // Egypt
  KR: "metric", // South Korea
  TH: "metric", // Thailand
  SG: "metric", // Singapore
  PH: "metric", // Philippines
};

export const tipConfigurations = {
  USD: { tips: [1, 5, 10, 20, 30, 40, 50], symbol: "$" },
  $: { tips: [1, 5, 10, 20, 30, 40, 50], symbol: "$" },
  PKR: { tips: [50, 100, 200, 300], symbol: "₨" },
  SAR: { tips: [5, 10, 20, 50, 100], symbol: "SAR" },
  AED: { tips: [5, 10, 20, 50, 100], symbol: "د.إ" },
  // Add more currencies and their specific tips as needed
};
export const defaultTipConfig = {
  tips: [1, 5, 10, 20, 30, 40, 50],
};

export const paymentGatewayDescriptions = {
  cash: "Simply Pay at the restaurant, when you pick up the food.",
  "cash on delivery":
    "Simply pay the driver, when he delivers the food to your doorstep.",
  jazzcash:
    "Either pay with your JazzCash card or your JazzCash wallet. You can add money to your JazzCash wallet from your bank account or credit card.",
  easypaisa:
    "You will be redirected to easypaisa after checkout. After you performed the payment, you will be redirected back to mealz & dealz.",
  gpay: "Pay securely using Google Pay. Once the payment is complete, the result will be returned to Mealz & Dealz to process your order.",
  default:
    "You will be redirected to the payment gateway after checkout. After you performed the payment, you will be redirected back to mealz & dealz.",
};
export const USER_ROLE = {
  SUPERADMIN: 1,
  ADMIN: 2,
  SUPERVISOR: 3,
  USER: 4,
  STAFF: 5,
};

export const paymentMethod = {
  1: "Cash",
  2: "Card",
  3: "Cash",
};

type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday";

export const standardDaysMap: Record<1 | 2 | 3 | 4 | 5 | 6 | 7, Weekday> = {
  1: "Sunday",
  2: "Monday",
  3: "Tuesday",
  4: "Wednesday",
  5: "Thursday",
  6: "Friday",
  7: "Saturday",
};
export const STATUS = {
  SERVER_ERROR:
    "We can’t connect to server. Check your internet or try again later.",
  FAILED_PAYMENT: "Payment Failed, Please try again.",
};

export const COMPANY_NAME = "Mealz N Dealz, Powered By Blazor Technologies Inc";
export const MAX_PRICE = 90000;
export const MIN_PRICE = 1;
export const MAX_NOTE = 200;
