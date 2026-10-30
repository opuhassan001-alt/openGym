/* opengym-api — Central Gym Branch Leaderboard & Gamification Engine */

const LEADERBOARD_RANKS = [
  { rank: 1, name: 'Marcus V.', tier: 'Titan Athlete', volumeKg: 148500, streak: 42, branch: 'OpenGym Downtown' },
  { rank: 2, name: 'Elena R.', tier: 'Apex Athlete', volumeKg: 132400, streak: 35, branch: 'OpenGym Uptown' },
  { rank: 3, name: 'Devon K.', tier: 'Apex Athlete', volumeKg: 121800, streak: 28, branch: 'OpenGym Downtown' },
  { rank: 4, name: 'Aisha M.', tier: 'Pro Athlete', volumeKg: 98700, streak: 21, branch: 'OpenGym Westside' },
  { rank: 5, name: 'Carlos D.', tier: 'Pro Athlete', volumeKg: 89400, streak: 19, branch: 'OpenGym Downtown' }
];

export function leaderboardRoutes({ json, readBody }) {
  return {
    'GET /api/leaderboard': (req, res) => {
      json(res, 200, {
        ok: true,
        season: 'October 2026 Season Finale',
        daysRemaining: 1,
        totalAthletesRanked: 148,
        leaderboard: LEADERBOARD_RANKS
      });
    },
    'POST /api/gamification/claim': async (req, res) => {
      const body = await readBody(req);
      const { trophyId = 'trophy_streak_30' } = body || {};
      json(res, 200, { ok: true, claimedTrophy: trophyId, pointsAwarded: 500, currentTier: 'Titan Athlete' });
    }
  };
}

