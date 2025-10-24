export const CATEGORIES = [
  'SEATING',
  'DESKS',
  'STORAGE',
  'TABLES',
  'ACCESSORIES',
  'LIGHTING',
  'OTHER'
] as const;

export type Category = typeof CATEGORIES[number];

export const isCategoryValid = (category: string): category is Category => {
  return CATEGORIES.includes(category as Category);
};
