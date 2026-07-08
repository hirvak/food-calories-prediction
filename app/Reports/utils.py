def format_food_name(name: str | None) -> str:
    if not name:
        return "Unknown Food"
    
    # Normalize: replace underscores and hyphens with spaces, convert to lowercase
    clean = name.replace("_", " ").replace("-", " ").strip().lower()
    
    # Collapse multiple spaces
    clean = " ".join(clean.split())
    
    # Centralized mapping for specific dishes
    SPECIAL_FOOD_MAPPINGS = {
        'masala dosa': 'dosa',
        'masaladosa': 'dosa',
        'butter naan': 'naan',
        'plain rice': 'rice',
        'veg biryani': 'biryani',
        'chicken biryani': 'biryani',
    }
    
    if clean in SPECIAL_FOOD_MAPPINGS:
        clean = SPECIAL_FOOD_MAPPINGS[clean]
    else:
        # Fallback generic word removals: masala, butter, plain, veg, vegetable, spicy, egg
        words_to_remove = {'masala', 'butter', 'plain', 'veg', 'vegetable', 'spicy', 'egg'}
        words = clean.split()
        filtered_words = [w for w in words if w not in words_to_remove]
        clean = " ".join(filtered_words)
        
    if not clean:
        return "Unknown Food"
        
    # Title Case capitalization
    return clean.title()
