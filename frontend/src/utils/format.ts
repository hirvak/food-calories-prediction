/**
 * Converts machine-friendly food identifiers into clean, human-readable display names.
 * - Replaces underscores and hyphens with spaces
 * - Strips unnecessary prefixes/adjectives (e.g. masala, butter, plain, veg, vegetable, spicy, egg)
 * - Properly capitalizes and normalizes spaces
 */
export function formatFoodName(name: string | null | undefined): string {
  if (!name) return 'Unknown Food';
  
  // Replace underscores and hyphens with spaces
  let clean = name.replace(/[_-]+/g, ' ');
  
  // List of unnecessary adjectives/prefixes to strip out as whole words
  const wordsToRemove = [
    'masala', 'butter', 'plain', 'veg', 'vegetable', 'spicy', 'egg'
  ];
  
  // Keep track of the original cleaned string before stripping words
  const originalCleaned = clean;
  
  wordsToRemove.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    clean = clean.replace(regex, '');
  });
  
  // Collapse spaces and trim
  clean = clean.replace(/\s+/g, ' ').trim();
  
  // If the string becomes empty after stripping, fall back to original cleaned name
  if (clean.length === 0) {
    clean = originalCleaned.replace(/\s+/g, ' ').trim();
  }
  
  if (clean.length === 0) {
    return 'Unknown Food';
  }
  
  // Capitalize properly
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
