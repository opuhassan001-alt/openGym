/**
 * GamificationEngine — Athlete Level, XP calculus, Milestones & Quests
 */

export class GamificationEngine {
  static RANKS = [
    { level: 1, title: 'Iron Novice', minXP: 0, badge: '🌱' },
    { level: 2, title: 'Bronze Lifter', minXP: 500, badge: '🥉' },
    { level: 3, title: 'Silver Grinder', minXP: 1500, badge: '🥈' },
    { level: 4, title: 'Gold Performer', minXP: 3500, badge: '🥇' },
    { level: 5, title: 'Platinum Beast', minXP: 7000, badge: '💎' },
    { level: 6, title: 'Diamond Titan', minXP: 12000, badge: '⚡' },
    { level: 7, title: 'Olympian Warrior', minXP: 20000, badge: '👑' },
    { level: 8, title: 'Apex God of Iron', minXP: 35000, badge: '🔥' }
  ];

  static BADGES = [
    { id: 'first_blood', name: 'First Blood', desc: 'Completed your very first logged workout', icon: '⚔️', xp: 100 },
    { id: 'century_club', name: '100 Workouts Club', desc: 'Reached 100 verified training sessions', icon: '💯', xp: 1000 },
    { id: 'tonnage_king', name: 'Tonnage Titan', desc: 'Moved over 10,000 kg volume in a single session', icon: '🐘', xp: 500 },
    { id: 'streak_warrior', name: 'Streak Warrior', desc: 'Maintained a 4-week active workout consistency streak', icon: '🔥', xp: 400 },
    { id: 'night_owl', name: 'Night Owl Lifter', desc: 'Completed a workout session after 9:00 PM', icon: '🦉', xp: 150 },
    { id: 'early_bird', name: 'Dawn Crusher', desc: 'Completed a morning workout session before 7:00 AM', icon: '🌅', xp: 150 }
  ];

  /**
   * Calculate User XP and Rank from state
   */
  static calculateProfile(userState) {
    const workouts = userState?.workouts || [];
    const totalVolume = workouts.reduce((acc, w) => acc + (w.vol || 0), 0);
    const sessionCount = workouts.length;

    // 1 XP per 10 kg moved + 50 XP per workout completed
    const baseXP = Math.round(totalVolume / 10) + (sessionCount * 50);
    const totalXP = Math.max(120, baseXP); // baseline starting XP

    let currentRank = this.RANKS[0];
    let nextRank = this.RANKS[1];

    for (let i = 0; i < this.RANKS.length; i++) {
      if (totalXP >= this.RANKS[i].minXP) {
        currentRank = this.RANKS[i];
        nextRank = this.RANKS[i + 1] || null;
      }
    }

    const currentLevelMin = currentRank.minXP;
    const nextLevelMin = nextRank ? nextRank.minXP : currentRank.minXP * 1.5;
    const progressPct = nextRank ? Math.min(100, Math.round(((totalXP - currentLevelMin) / (nextLevelMin - currentLevelMin)) * 100)) : 100;

    return {
      totalXP,
      currentRank,
      nextRank,
      progressPct,
      xpNeeded: nextRank ? nextRank.minXP - totalXP : 0,
      totalVolume: Math.round(totalVolume),
      sessionCount
    };
  }
}

export default GamificationEngine;

