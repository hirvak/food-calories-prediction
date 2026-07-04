import math

from Nutrition.schema import (
    BMICalculatorRequest,
    BMICalculatorResponse,
)


class NutritionService:

    @staticmethod
    def calculate_bmi(data: BMICalculatorRequest) -> BMICalculatorResponse:
        """
        Calculate BMI and recommended daily calorie intake.
        """

        height_m = data.height_cm / 100

        bmi = round(data.weight_kg / (height_m ** 2), 2)

        if bmi < 18.5:
            category = "Underweight"
        elif bmi < 25:
            category = "Normal"
        elif bmi < 30:
            category = "Overweight"
        else:
            category = "Obese"

        # Mifflin-St Jeor Equation
        if data.gender == "male":
            bmr = (
                10 * data.weight_kg
                + 6.25 * data.height_cm
                - 5 * data.age
                + 5
            )
        else:
            bmr = (
                10 * data.weight_kg
                + 6.25 * data.height_cm
                - 5 * data.age
                - 161
            )

        activity_multiplier = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9,
        }

        maintenance = round(
            bmr * activity_multiplier[data.activity_level]
        )

        return BMICalculatorResponse(
            bmi=bmi,
            bmi_category=category,
            maintenance_calories=maintenance,
            weight_loss_calories=max(1200, maintenance - 500),
            weight_gain_calories=maintenance + 500,
        )