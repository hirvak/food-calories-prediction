/**
 * Converts machine-friendly food identifiers into clean, human-readable display names.
 * - Replaces underscores and hyphens with spaces
 * - Strips unnecessary prefixes/adjectives (e.g. masala, butter, plain, veg, vegetable, spicy, egg)
 * - Properly capitalizes and normalizes spaces
 */
const SPECIAL_FOOD_MAPPINGS: Record<string, string> = {
  'masala dosa': 'dosa',
  'masaladosa': 'dosa',
  'butter naan': 'naan',
  'plain rice': 'rice',
  'veg biryani': 'biryani',
  'chicken biryani': 'biryani',
};

export function formatFoodName(name: string | null | undefined): string {
  if (!name) return 'Unknown Food';
  
  // Normalize: replace underscores and hyphens with spaces, convert to lowercase
  let clean = name.replace(/[_-]+/g, ' ').trim().toLowerCase();
  
  // Collapse extra spaces
  clean = clean.replace(/\s+/g, ' ');

  // 1. Check if the normalized string matches our centralized mapping
  if (SPECIAL_FOOD_MAPPINGS[clean] !== undefined) {
    clean = SPECIAL_FOOD_MAPPINGS[clean];
  } else {
    // 2. Generic prefix word removals as fallback
    const wordsToRemove = [
      'masala', 'butter', 'plain', 'veg', 'vegetable', 'spicy', 'egg'
    ];
    wordsToRemove.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      clean = clean.replace(regex, '');
    });
  }
  
  // Collapse extra spaces again and trim
  clean = clean.replace(/\s+/g, ' ').trim();
  
  if (clean.length === 0) {
    return 'Unknown Food';
  }
  
  // 3. Capitalize proper title case
  return clean
    .split(' ')
    .filter(word => word.length > 0)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Extracts and formats the food name from a backend prediction or stats object.
 * Checks multiple possible fields returned by the API.
 */
export function getFoodNameFromItem(item: any): string {
  if (!item) return 'Unknown Food';
  
  // Handle case where item is directly a string
  if (typeof item === 'string') {
    return formatFoodName(item);
  }
  
  const name = item.food_name ?? item.food ?? item.predicted_food ?? item.detected_food ?? item.ingredient ?? item.class_name;
  return formatFoodName(name);
}
