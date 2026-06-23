import pandas as pd

from sqlmodel import Session

from Utils.utils import engine
from Nutrition.models import Nutrition

CSV_PATH = r"D:\Final_Model_Food _Calories\Datasets\food_nutrition_lookup_final (1).csv"

df = pd.read_csv(CSV_PATH)

with Session(engine) as session:

    for _, row in df.iterrows():

        nutrition = Nutrition(
            food_name=row["Food_Item"],
            calories_per_100g=row["Calories (kcal)"],
            protein=row["Protein (g)"],
            fat=row["Fat (g)"],
            carbohydrates=row["Carbohydrates (g)"],
            fiber=row["Fiber (g)"],
            sugar=row["Sugar (g)"]
        )

        session.add(nutrition)

    session.commit()

print("Nutrition data imported successfully")