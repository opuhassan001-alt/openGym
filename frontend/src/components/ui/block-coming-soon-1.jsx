"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

// shadcn
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// third-party
import { motion } from "framer-motion";

// assets
import { Bell, Flame, Activity, Zap, CheckCircle2, ChevronRight } from "lucide-react";
import "./block-coming-soon-1.css";

// ------------------------------ | ATHLETIC ENTERPRISE SHOWCASE (block-coming-soon-1) | ------------------------------ //

export default function ComingSoon1({ onOpenMacro, onOpenInterval, onOpenAI }) {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const nav = useNavigate();

  const handleNotify = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setTimeout(() => setSubscribed(false), 4000);
      setEmail("");
    }
  };

  return (
    <section className="coming-soon-showcase-section">
      <div className="showcase-container">
        {/* Left Column: Brand Pitch, Features Hook & Actions */}
        <div className="showcase-left-col">
          <div className="badge-tag">
            <span className="live-dot" />
            <p className="badge-text">
              ENTERPRISE ATHLETE EDITION
            </p>
          </div>

          <h1 className="showcase-heading">
            <span className="accent-glow-text">OPENGYM PRO</span> — Next-Gen AI Athletic Performance
          </h1>

          <p className="showcase-lead-p">
            Unleashing the full potential of elite resistance training: Macro Fuel Kinetics, Specialized Interval Clocks, Barbell Pyramid Math, and Real-Time Adaptive AI Coaching.
          </p>

          {/* Quick Action Matrix (Synced to App Engines) */}
          <div className="feature-action-capsules">
            <button 
              className="action-capsule"
              onClick={onOpenMacro}
            >
              <Flame className="action-icon text-lime" />
              <span>Macro Matrix</span>
            </button>
            <button 
              className="action-capsule"
              onClick={onOpenInterval}
            >
              <Activity className="action-icon text-cyan" />
              <span>Interval Clocks</span>
            </button>
            <button 
              className="action-capsule"
              onClick={onOpenAI}
            >
              <Zap className="action-icon text-orange" />
              <span>AI Workout</span>
            </button>
          </div>

          {/* Notify / Invite Form */}
          <form onSubmit={handleNotify} className="notify-form-wrapper">
            <Input
              type="email"
              placeholder="Enter email for Pro Athletic Beta"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="notify-input"
            />
            <Button type="submit" className="notify-btn">
              <Bell className="notify-bell-icon" />
              <span>{subscribed ? "Subscribed!" : "Notify Me"}</span>
            </Button>
          </form>

          {subscribed && (
            <div className="subscribed-banner">
              <CheckCircle2 className="size-4" />
              <span>VIP early access pass reserved for your profile!</span>
            </div>
          )}

          {/* Direct Website Quick Links */}
          <div className="bottom-social-cluster">
            <Button 
              variant="outline" 
              className="cluster-btn"
              onClick={() => nav('/workout')}
            >
              <span>Quick Workout</span>
              <ChevronRight className="size-4" />
            </Button>
            <Button 
              variant="outline" 
              className="cluster-btn"
              onClick={() => nav('/library')}
            >
              <span>5,600+ Exercises</span>
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        {/* Right Column: Dynamic Dual Infinite Scroll Rails (Unsplash Fitness Athletes) */}
        <div className="showcase-right-col">
          <div className="infinite-rails-container">
            {/* Rail 1: Downward / Upward loop */}
            <div className="rail-track">
              <motion.div
                animate={{ y: ["0%", "-50%"] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                }}
                className="rail-inner-stream"
              >
                <div className="stream-card" onClick={onOpenMacro}>
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
                    alt="Strength Athlete 1"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">Macro Kinetics</span>
                    <span className="stream-sub">Precision Nutrition</span>
                  </div>
                </div>

                <div className="stream-card" onClick={onOpenInterval}>
                  <img
                    src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=600&q=80"
                    alt="Interval Training"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">HIIT & Tabata</span>
                    <span className="stream-sub">Audio Flash Timer</span>
                  </div>
                </div>

                {/* Duplicate for seamless infinite loop */}
                <div className="stream-card" onClick={onOpenMacro}>
                  <img
                    src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80"
                    alt="Strength Athlete 1 loop"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">Macro Kinetics</span>
                    <span className="stream-sub">Precision Nutrition</span>
                  </div>
                </div>

                <div className="stream-card" onClick={onOpenInterval}>
                  <img
                    src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=600&q=80"
                    alt="Interval Training loop"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">HIIT & Tabata</span>
                    <span className="stream-sub">Audio Flash Timer</span>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Rail 2: Inverse loop */}
            <div className="rail-track">
              <motion.div
                animate={{ y: ["-50%", "0%"] }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 25,
                  ease: "linear",
                }}
                className="rail-inner-stream"
              >
                <div className="stream-card" onClick={onOpenAI}>
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
                    alt="Barbell Warmup"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">AI Workout Builder</span>
                    <span className="stream-sub">20-Min Instant Circuit</span>
                  </div>
                </div>

                <div className="stream-card" onClick={() => nav('/stats')}>
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
                    alt="Gym Performance"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">1RM Progression</span>
                    <span className="stream-sub">Fatigue Biometrics</span>
                  </div>
                </div>

                {/* Duplicate for seamless infinite loop */}
                <div className="stream-card" onClick={onOpenAI}>
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80"
                    alt="Barbell Warmup loop"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">AI Workout Builder</span>
                    <span className="stream-sub">20-Min Instant Circuit</span>
                  </div>
                </div>

                <div className="stream-card" onClick={() => nav('/stats')}>
                  <img
                    src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80"
                    alt="Gym Performance loop"
                    className="stream-card-img"
                  />
                  <div className="stream-overlay">
                    <span className="stream-tag">1RM Progression</span>
                    <span className="stream-sub">Fatigue Biometrics</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

