"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";


export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login with specific credentials
    setTimeout(() => {
      // Validate specific credentials
      if (formData.email === "admin@fahmiefarhan.com" && formData.password === "Zxcvbnm@123") {
        localStorage.setItem('isAdminLoggedIn', 'true');
        localStorage.setItem('adminUser', JSON.stringify({
          email: formData.email,
          name: 'Admin User'
        }));
        window.location.href = '/admin';
      } else {
        alert('Invalid credentials. Please use the correct admin email and password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Initialize animated background elements
  useEffect(() => {
    // Create particles
    const particlesContainer = document.querySelector('.particles-container');
    if (particlesContainer) {
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.width = `${Math.random() * 3 + 1}px`;
        particle.style.height = particle.style.width;
        particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particlesContainer.appendChild(particle);
      }
    }

    // Create floating orbs
    const orbsContainer = document.querySelector('.floating-orbs');
    if (orbsContainer) {
      for (let i = 0; i < 5; i++) {
        const orb = document.createElement("div");
        orb.className = "orb";
        const size = Math.random() * 80 + 40;
        orb.style.width = `${size}px`;
        orb.style.height = `${size}px`;
        orb.style.left = `${Math.random() * 90}%`;
        orb.style.top = `${Math.random() * 90}%`;
        orb.style.animationDuration = `${Math.random() * 10 + 10}s`;
        orb.style.animationDelay = `${Math.random() * 5}s`;
        orbsContainer.appendChild(orb);
      }
    }

    // Create floating notes
    const notesContainer = document.querySelector('.floating-notes');
    if (notesContainer) {
      const noteChars = ["♪", "♫", "♬", "♩"];
      for (let i = 0; i < 10; i++) {
        const note = document.createElement("div");
        note.className = "music-note";
        note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
        note.style.left = `${Math.random() * 100}%`;
        note.style.animationDuration = `${Math.random() * 10 + 20}s`;
        note.style.animationDelay = `${Math.random() * 10}s`;
        notesContainer.appendChild(note);
      }
    }
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-text-white flex items-center justify-center">
      {/* Global Animated Background */}
      <div className="particles-container"></div>
      <div className="hero-bg absolute inset-0"></div>
      <div className="floating-orbs absolute inset-0"></div>
      <div className="floating-notes absolute inset-0"></div>
      
      <motion.div 
        className="relative z-10 w-full max-w-md mx-6"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <motion.div className="text-center mb-8" variants={fadeInUp}>
          <div className="w-20 h-20 mx-auto mb-4">
            <div></div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent">
            Admin Login
          </h1>
          <p className="text-text-muted mt-2">
            Sign in to access the admin dashboard
          </p>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-fantasy-gold">Welcome Back</CardTitle>
              <CardDescription>
                Enter your credentials to access the admin panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-text-white">Email Address</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-text-muted" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted pl-10"
                      placeholder="admin@example.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-text-white">Password</Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-text-muted" />
                    </div>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted pl-10 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-text-muted hover:text-fantasy-gold" />
                      ) : (
                        <Eye className="h-5 w-5 text-text-muted hover:text-fantasy-gold" />
                      )}
                    </button>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    size="lg"
                    className="w-full bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-text-muted">
                  Use admin credentials: admin@fahmiefarhan.com / Zxcvbnm@123
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}