/**
 * MacroNutritionEngine — Industrial Grade Nutrition & Hydration Analytics
 * Formulas: Mifflin-St Jeor BMR, Total Daily Energy Expenditure (TDEE),
 * Dynamic Macro breakdown (Protein, Carbs, Fats) calibrated for Cut, Bulk, or Maintain.
 */

export class MacroNutritionEngine {
  static GOALS = {
    cut: { name: 'Cutting / Fat Loss', calorieMultiplier: 0.8, proteinPerKg: 2.2, fatRatio: 0.25 },
    maintain: { name: 'Recomposition / Maintain', calorieMultiplier: 1.0, proteinPerKg: 2.0, fatRatio: 0.28 },
    bulk: { name: 'Hypertrophy / Lean Bulk', calorieMultiplier: 1.15, proteinPerKg: 2.0, fatRatio: 0.25 }
  };

  /**
   * Calculate Target Macros based on Weight, Height, Age, Gender, and Goal
   */
  static calculateTargets(weightKg = 75, heightCm = 175, age = 25, isMale = true, activityFactor = 1.45, goalKey = 'bulk') {
    // Mifflin-St Jeor Equation
    let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + (isMale ? 5 : -161);
    let tdee = Math.round(bmr * activityFactor);

    const goal = this.GOALS[goalKey] || this.GOALS.maintain;
    const targetCalories = Math.round(tdee * goal.calorieMultiplier);

    // Protein: ~2.0 - 2.2g per kg bodyweight
    const targetProtein = Math.round(weightKg * goal.proteinPerKg);
    const proteinCalories = targetProtein * 4;

    // Fats: ~25-28% of total calories
    const fatCalories = targetCalories * goal.fatRatio;
    const targetFats = Math.round(fatCalories / 9);

    // Carbs: Remaining calories
    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const targetCarbs = Math.round(carbCalories / 4);

    return {
      tdee,
      targetCalories,
      targetProtein,
      targetCarbs,
      targetFats,
      targetWaterMl: Math.round(weightKg * 38), // 38ml per kg bodyweight standard for lifters
      goalName: goal.name
    };
  }

  /**
   * Calculate dynamic progress percentages & calorie balance
   */
  static computeProgress(logged, targets) {
    const calories = (logged.protein * 4) + (logged.carbs * 4) + (logged.fats * 9);
    return {
      consumedCalories: calories,
      remainingCalories: Math.max(0, targets.targetCalories - calories),
      caloriePct: Math.min(100, Math.round((calories / targets.targetCalories) * 100)),
      proteinPct: Math.min(100, Math.round(((logged.protein || 0) / targets.targetProtein) * 100)),
      carbsPct: Math.min(100, Math.round(((logged.carbs || 0) / targets.targetCarbs) * 100)),
      fatsPct: Math.min(100, Math.round(((logged.fats || 0) / targets.targetFats) * 100)),
      waterPct: Math.min(100, Math.round(((logged.waterMl || 0) / targets.targetWaterMl) * 100))
    };
  }
}

export default MacroNutritionEngine;

