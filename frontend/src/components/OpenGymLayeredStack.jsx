import { useState, useRef } from "react";
import { 
  Activity, 
  Cpu, 
  Dumbbell, 
  Timer, 
  Flame, 
  QrCode, 
  Trophy, 
  ShieldCheck, 
  ArrowUpRight,
  Layers,
  LayoutGrid,
  Sparkles
} from "lucide-react";
import { LayeredStack } from "./ui/layered-stack.jsx";
import "./OpenGymLayeredStack.css";

const FEATURES = [
  {
    id: "muscle-map",
    badge: "ANATOMY",
    status: "BIOMECHANICS",
    title: "3D Muscle Kinetics",
    desc: "Targeted biomechanics, fatigue heatmaps, and kinetic tracking across 14 major muscle groups.",
    chip: "Anterior & Posterior",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
    action: "Explore Anatomy",
  },
  {
    id: "ai-generator",
    badge: "PROGRAMMING",
    status: "CUSTOM SPLIT",
    title: "Workout Generator",
    desc: "Periodized workout sessions calibrated to your training history, recovery state, and gym gear.",
    chip: "Targeted Volume & Splits",
    icon: Cpu,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    action: "Generate Circuit",
  },
  {
    id: "plate-math",
    badge: "BARBELL",
    status: "OLYMPIC 20KG",
    title: "Olympic Plate Math",
    desc: "Collar-to-collar barbell loading breakdown and automated 1RM pyramid progression calculator.",
    chip: "Olympic & Power Racks",
    icon: Dumbbell,
    image: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&q=80&w=800",
    action: "Calculate Barbell",
  },
  {
    id: "interval-timer",
    badge: "PROTOCOLS",
    status: "AUDIO CUES",
    title: "Interval Timer Suite",
    desc: "High-precision Tabata (20/10), EMOM, and AMRAP training protocols with custom acoustic cues.",
    chip: "Tabata · EMOM · AMRAP",
    icon: Timer,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?auto=format&fit=crop&q=80&w=800",
    action: "Launch Suite",
  },
  {
    id: "macro-fuel",
    badge: "NUTRITION",
    status: "METABOLIC",
    title: "Macro & Fuel Matrix",
    desc: "Targeted caloric, protein, and hydration allocation balanced against daily training volume.",
    chip: "2,450 kcal · 175g P · 3L H2O",
    icon: Flame,
    image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800",
    action: "Sync Nutrition",
  },
  {
    id: "turnstile-pass",
    badge: "ACCESS",
    status: "24/7 PASS",
    title: "Turnstile QR Pass",
    desc: "Digital gym entry badge and real-time training facility floor capacity telemetry.",
    chip: "Instant Mobile Auth",
    icon: QrCode,
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    action: "Display QR",
  },
  {
    id: "leaderboard",
    badge: "COMMUNITY",
    status: "RANKINGS",
    title: "Athlete Arena Ranks",
    desc: "Branch leaderboards, verified volume streaks, and 8 prestigious athlete tier trophies.",
    chip: "City Rank #4 · Diamond Tier",
    icon: Trophy,
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800",
    action: "View Standings",
  },
  {
    id: "instant-pass",
    badge: "MEMBERSHIP",
    status: "TRANSPARENT",
    title: "Training Passes",
    desc: "Transparent zero-commitment athletic passes with instant digital activation & guest access.",
    chip: "Instant Activation",
    icon: ShieldCheck,
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=800",
    action: "Activate Pass",
  },
];

export default function OpenGymLayeredStack({
  onOpenMuscles,
  onOpenAIGenerator,
  onOpenPyramid,
  onOpenInterval,
  onOpenMacro,
  onOpenCheckin,
  onOpenLeaderboard,
  onOpenPlan,
}) {
  const [isDeckStacked, setIsDeckStacked] = useState(true);
  const stackRef = useRef(null);

  const handleCardClick = (id) => {
    switch (id) {
      case "muscle-map": {
        const el = document.getElementById("interactive-muscle-map");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else {
          onOpenMuscles?.();
        }
        break;
      }
      case "ai-generator":
        onOpenAIGenerator?.();
        break;
      case "plate-math":
        onOpenPyramid?.();
        break;
      case "interval-timer":
        onOpenInterval?.();
        break;
      case "macro-fuel":
        onOpenMacro?.();
        break;
      case "turnstile-pass":
        onOpenCheckin?.();
        break;
      case "leaderboard":
        onOpenLeaderboard?.();
        break;
      case "instant-pass":
        onOpenPlan?.();
        break;
      default:
        break;
    }
  };

  return (
    <section className="og-layered-stack-section" aria-label="openGym Core Engine Stack">
      <div className="og-layered-stack-container">
        {/* Header */}
        <div className="og-ls-header">
          <div className="og-ls-tag">
            <span className="og-ls-tag-dot" />
            <span>Training Suite · 8 Core Engines</span>
          </div>
          
          <h2 className="og-ls-title">
            Hover to Unfurl. <span className="og-ls-title-highlight">Stack to Focus.</span>
          </h2>

          <p className="og-ls-subtitle">
            Explore our 8 athletic training engines. Hover your cursor over the stack to fan out the deck, or select any engine to launch.
          </p>

          <div className="og-ls-controls">
            <span className="og-ls-mode-btn active">
              <Sparkles size={14} style={{ color: "#E8EFF5" }} />
              Hover to Fan Out · Move away to Stack
            </span>
          </div>
        </div>

        {/* GSAP LayeredStack Container */}
        <div className="og-ls-stack-wrapper">
          <LayeredStack 
            className="og-layered-stack-grid"
            onStackChange={setIsDeckStacked}
          >
            {FEATURES.map((feat) => {
              const IconComp = feat.icon;
              return (
                <div
                  key={feat.id}
                  className="og-ls-card"
                  onClick={() => handleCardClick(feat.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      handleCardClick(feat.id);
                    }
                  }}
                  aria-label={`${feat.title}: ${feat.desc}`}
                >
                  {/* Photo Layer */}
                  <img
                    src={feat.image}
                    alt={feat.title}
                    className="og-ls-card-bg"
                    loading="lazy"
                  />

                  {/* UNIQ French Blue Glass Overlay */}
                  <div className="og-ls-card-overlay" />

                  {/* Foreground Content Face */}
                  <div className="og-ls-card-content">
                    {/* Top Row: Badge & Status */}
                    <div className="og-ls-card-top">
                      <span className="og-ls-card-badge">{feat.badge}</span>
                      <div className="og-ls-card-status">
                        <span className="og-ls-card-status-dot" />
                        <span>{feat.status}</span>
                      </div>
                    </div>

                    {/* Middle Body */}
                    <div className="og-ls-card-body">
                      <div className="og-ls-card-icon-wrap">
                        <IconComp size={20} />
                      </div>
                      <h3 className="og-ls-card-title">{feat.title}</h3>
                      <p className="og-ls-card-desc">{feat.desc}</p>
                      <div className="og-ls-card-chip">
                        <span>{feat.chip}</span>
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="og-ls-card-footer">
                      <span className="og-ls-card-action">
                        {feat.action}
                      </span>
                      <ArrowUpRight className="og-ls-card-launch-icon" />
                    </div>
                  </div>
                </div>
              );
            })}
          </LayeredStack>
        </div>
      </div>
    </section>
  );
}

