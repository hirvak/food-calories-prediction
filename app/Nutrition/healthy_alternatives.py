ALTERNATIVES = {

    "pizza": [
        "Whole Wheat Veg Pizza",
        "Paneer Salad",
        "Grilled Sandwich",
    ],

    "burger": [
        "Grilled Chicken Burger",
        "Veg Wrap",
        "Paneer Wrap",
    ],

    "french-fry": [
        "Baked Potato",
        "Sweet Potato",
        "Roasted Vegetables",
    ],

    "rice": [
        "Brown Rice",
        "Quinoa",
        "Millets",
    ],

    "fried-rice": [
        "Brown Rice",
        "Vegetable Rice",
        "Quinoa Bowl",
    ],

    "noodles": [
        "Whole Wheat Noodles",
        "Vegetable Stir Fry",
        "Rice Noodles",
    ],

    "cake": [
        "Greek Yogurt",
        "Fruit Bowl",
        "Oats Pancake",
    ],

    "ice-cream": [
        "Frozen Yogurt",
        "Fruit Smoothie",
        "Banana Ice Cream",
    ],

    "chicken-wing": [
        "Grilled Chicken Breast",
        "Boiled Chicken",
        "Paneer Tikka",
    ],

    "fried-chicken": [
        "Grilled Chicken",
        "Chicken Salad",
        "Paneer Tikka",
    ],

    "donut": [
        "Fruit Salad",
        "Oats Muffin",
        "Dry Fruits",
    ],

    "hot-dog": [
        "Whole Wheat Sandwich",
        "Veg Wrap",
        "Chicken Sandwich",
    ],

    "sandwich": [
        "Whole Wheat Sandwich",
        "Paneer Sandwich",
        "Chicken Sandwich",
    ],

    "apple": [
        "Pear",
        "Orange",
        "Mixed Fruit Bowl",
    ],

    "banana": [
        "Apple",
        "Papaya",
        "Seasonal Fruits",
    ],

    "salad": [
        "Mixed Vegetable Salad",
        "Sprouts Salad",
        "Fruit Salad",
    ],

}

def get_healthy_alternatives(food_name: str):
    """
    Returns healthier alternatives for the detected food.
    """

    key = food_name.lower().strip()

    return ALTERNATIVES.get(
        key,
        [
            "Fresh Fruits",
            "Mixed Vegetable Salad",
            "Whole Grains",
        ],
    )