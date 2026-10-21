/**
 * AI-Driven Hyper-Personalization Engine for openGym Enterprise
 * Provides intelligent auto-regulation, RPE fatigue analysis,
 * recovery readiness scoring, and progression adjustments.
 */

export class HyperPersonalizationEngine {
  /**
   * Calculate Recovery Readiness Score (0 - 100%)
   * @param {Array} workouts - User's workout history
   * @param {Array} sleepOrStressLogs - Optional subjective readiness
   * @param {String} targetMuscle - The muscle group to assess
   */
  static calculateMuscleReadiness(muscle, lastTrainedTimestamp, totalVolumeLastSession = 0) {
    if (!lastTrainedTimestamp) return { readiness: 100, status: 'Fresh', hoursSince: Infinity };
    
    const now = Date.now();
    const hoursSince = Math.max(0, (now - lastTrainedTimestamp) / (1000 * 60 * 60));

    // Recovery kinetics (Larger muscle groups like Quads/Back take longer to recover ~48-72h, small groups ~24-48h)
    const largeMuscles = ['quads', 'hamstrings', 'lats', 'glutes', 'chest'];
    const fullRecoveryHours = largeMuscles.includes(muscle.toLowerCase()) ? 60 : 40;

    let readiness = Math.min(100, Math.round((hoursSince / fullRecoveryHours) * 100));

    let status = 'Recovering';
    if (readiness >= 90) status = 'Optimal';
    else if (readiness >= 65) status = 'Recovered';
    else if (readiness < 40) status = 'Fatigued';

    return {
      readiness,
      status,
      hoursSince: Math.round(hoursSince),
      recommendedIntensity: readiness >= 85 ? '100% (Normal/Heavy)' : readiness >= 65 ? '85% (Moderate)' : 'Active Recovery / Light'
    };
  }

  /**
   * Auto-regulate weight for next set based on RPE (Rating of Perceived Exertion)
   * Target RPE is typically 8 (2 reps in reserve).
   * @param {Number} currentWeight 
   * @param {Number} reps 
   * @param {Number} loggedRPE (1 to 10)
   * @param {Number} targetRPE (default 8)
   */
  static autoRegulateSet(currentWeight, reps, loggedRPE, targetRPE = 8) {
    if (!loggedRPE) return { weight: currentWeight, advice: 'Maintain target' };

    const diff = loggedRPE - targetRPE;
    
    // If diff > 1 (e.g. RPE 9.5 or 10 when aiming for 8), reduce weight by 2.5kg - 5kg
    if (diff >= 1.5) {
      const adjustment = currentWeight > 60 ? -5 : -2.5;
      return {
        weight: Math.max(0, currentWeight + adjustment),
        adjustment,
        advice: `High fatigue detected (RPE ${loggedRPE}). Dropping ${Math.abs(adjustment)}kg to preserve form.`
      };
    } else if (diff <= -1.5) {
      // Under target intensity (RPE 6 when aiming for 8), bump weight
      const adjustment = currentWeight > 60 ? +2.5 : +1.25;
      return {
        weight: currentWeight + adjustment,
        adjustment,
        advice: `High strength reserve (RPE ${loggedRPE}). You can safely add ${adjustment}kg.`
      };
    }

    return {
      weight: currentWeight,
      adjustment: 0,
      advice: `Optimal intensity matched (RPE ${loggedRPE}). Keep this weight.`
    };
  }

  /**
   * Generate an AI Summary Insights for user's workout dashboard
   */
  static generateAthleteBriefing(userState) {
    const workouts = userState?.workouts || [];
    const recentWorkouts = workouts.slice(-7);
    const totalVolume = recentWorkouts.reduce((acc, w) => acc + (w.volume || 0), 0);
    
    return {
      weeklyVolume: Math.round(totalVolume),
      sessionsThisWeek: recentWorkouts.length,
      coachStatus: recentWorkouts.length >= 4 ? 'Peak Momentum' : recentWorkouts.length >= 2 ? 'On Track' : 'Ready to Ignite',
      aiTip: recentWorkouts.length >= 4 
        ? "High training density achieved this week. Focus on hydration and 8+ hours of sleep tonight for maximum hypertrophy."
        : "Consistency is key. Aim for 45 minutes of focused resistance training today."
    };
  }
}

export default HyperPersonalizationEngine;

