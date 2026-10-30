/**
 * Smart Voice Coach Engine for openGym Enterprise
 * Provides hands-free audio cues for workouts, rest timers, and form reminders.
 * Designed for Gym / High-Intensity training environments.
 */

class VoiceCoach {
  constructor() {
    this.enabled = true;
    this.voice = null;
    this.pitch = 1.0;
    this.rate = 1.05; // Slightly faster for athletic snappy cues
    this.volume = 1.0;
    this.isMuted = false;
    this.init();
  }

  init() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const loadVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Look for modern clear English voices (Google US, Samantha, Daniel, etc.)
        this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Daniel'))) || voices.find(v => v.lang.startsWith('en')) || voices[0];
      };
      loadVoice();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoice;
      }
    }
  }

  speak(phrase, priority = false) {
    if (!this.enabled || this.isMuted || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return;
    }

    if (priority) {
      window.speechSynthesis.cancel(); // Cancel any ongoing cue for urgent alerts
    }

    const utterance = new SpeechSynthesisUtterance(phrase);
    if (this.voice) utterance.voice = this.voice;
    utterance.pitch = this.pitch;
    utterance.rate = this.rate;
    utterance.volume = this.volume;

    window.speechSynthesis.speak(utterance);
  }

  // Preset athletic cues
  cueSetComplete(setNum, nextWeight = null, nextReps = null) {
    if (nextWeight && nextReps) {
      this.speak(`Set ${setNum} done! Next set: ${nextWeight} kilos for ${nextReps} reps. Rest now.`);
    } else {
      this.speak(`Set ${setNum} completed. Start your rest.`);
    }
  }

  cueRestWarning(secondsRemaining) {
    if (secondsRemaining === 15) {
      this.speak(`15 seconds remaining. Get ready.`);
    } else if (secondsRemaining === 5) {
      this.speak(`5, 4, 3, 2, 1, lift!`, true);
    }
  }

  cueNextExercise(name) {
    this.speak(`Moving to: ${name}. Lock in!`);
  }

  cuePersonalRecord(exercise, weight) {
    this.speak(`New personal record on ${exercise}! ${weight} kilos crushed!`, true);
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    return this.isMuted;
  }
}

export const voiceCoach = new VoiceCoach();
export default voiceCoach;

