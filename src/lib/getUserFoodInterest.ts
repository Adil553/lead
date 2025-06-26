import { MenuItem } from "@/utils/types";

// lib/getUserFoodInterest.ts
export const getUserFoodInterest = () => {
  const foodHistory = JSON.parse(localStorage.getItem("foodHistory") || "[]");
  const viewedCategories = JSON.parse(
    localStorage.getItem("viewedCategories") || "[]"
  );

  if (foodHistory.length === 0 && viewedCategories.length === 0) return null;

  const keywords =
    foodHistory.map((item: MenuItem) => item.productname).join(", ") +
    ", " +
    viewedCategories.join(", ");
  return keywords.trim();
};
