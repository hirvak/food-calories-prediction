def generate_nutrition_coach(calories, protein, fat, carbohydrates, fiber, sugar):
    """
    Analyzes nutrition values to generate meal score, star rating, points, and recommendations.
    """
    good_points = []
    warnings = []
    
    # Analyze protein
    if protein >= 15:
        good_points.append("Good source of protein")
    elif protein < 5:
        warnings.append("Low protein content")

    # Analyze calories
    if calories <= 550:
        good_points.append("Balanced calorie intake")
    else:
        warnings.append("High calorie content")

    # Analyze fats
    if fat > 20:
        warnings.append("High fat content")
    elif fat > 0:
        good_points.append("Healthy fats present")

    # Analyze fiber
    if fiber >= 3:
        good_points.append("High dietary fiber")
    else:
        warnings.append("Low fiber content")

    # Analyze sugar
    if sugar > 15:
        warnings.append("High sugar content")

    # Calculate score
    score = 80
    if len(good_points) > len(warnings):
        score += 10
    elif len(good_points) < len(warnings):
        score -= 15
        
    score = max(30, min(100, score))
    
    # Calculate stars
    if score >= 90:
        stars = 5
    elif score >= 75:
        stars = 4
    elif score >= 60:
        stars = 3
    else:
        stars = 2

    # Recommendation
    if fiber < 3:
        recommendation = "Pair this meal with vegetables or whole grains to improve fiber intake."
    elif fat > 20:
        recommendation = "Try reducing fatty toppings or dressings next time."
    else:
        recommendation = "This is a very balanced meal. Keep up the good work!"

    return {
        "score": score,
        "stars": stars,
        "good_points": good_points if good_points else ["Macronutrients are within normal ranges"],
        "warnings": warnings if warnings else ["No major concerns detected"],
        "recommendation": recommendation,
        "hydration_tip": "Drink 2–3 glasses of water after this meal."
    }
