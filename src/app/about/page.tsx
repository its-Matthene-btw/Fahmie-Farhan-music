"use client";

import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Music, MapPin, ExternalLink, Mail, Award, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";

// --- Interfaces ---
interface Testimonial {
  id: string;
  name: string;
  role?: string;
  content: string;
  avatar?: string;
}

// --- Hardcoded Static Data ---
const collaborations = [
  {
    id: "1",
    name: "Diane Allen",
    role: "Violin Virtuoso",
    description: "Collaborated on multiple orchestral projects for live keynote performances in the United States, creating powerful musical experiences that have deeply moved audiences.",
    link: "https://dianeallen.com/",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    id: "2",
    name: "GEMAWAN KISAS",
    role: "Cultural Ensemble",
    description: "Gema Gamelan Waqafan (GEMAWAN) from Kolej Islam Sultan Alam Shah (KISAS). Collaboration includes training the ensemble and composing original modern gamelan pieces.",
    link: "#",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop"
  }
];

const achievements = [
  {
    id: "1",
    title: "1st Prize – National Gamelan Competition (HKSBP)",
    description: "Awarded for outstanding composition and performance in the prestigious national competition.",
    year: "2023 & 2024",
    icon: "🏆"
  },
  {
    id: "2",
    title: "1st Place – Ensemble of Gamelan Competition, UTP",
    description: "Recognized as the best gamelan ensemble in the university competition.",
    year: "2023",
    icon: "🥇"
  },
  {
    id: "3",
    title: "Featured in Ensemble of Gamelan Performance, UTP",
    description: "Selected to showcase original compositions at the university's premier gamelan event.",
    year: "2025",
    icon: "⭐"
  },
];

export default function AboutPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      setIsLoading(true);
      try {
        const testimonialsRes = await fetch('/api/testimonials?published=true');
        const testimonialsData = await testimonialsRes.json();
        setTestimonials(testimonialsData);
      } catch (error) {
        console.error("Failed to fetch testimonials:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-deep-black text-text-white">
      {/* Header */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-b from-charcoal-dark to-deep-black relative overflow-hidden"
        initial="hidden" animate="visible" variants={staggerContainer}
      >
        <div className="hero-bg absolute inset-0"></div>
        <div className="floating-orbs absolute inset-0"></div>
        <div className="floating-notes absolute inset-0"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent" variants={fadeInUp}>
            About Me
          </motion.h1>
          <motion.p className="text-xl text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
            Discover the journey of a Malaysian composer who bridges cultural heritage with contemporary musical innovation.
          </motion.p>
        </div>
      </motion.section>

      {/* Full Bio */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-12 items-start">
            <motion.div className="lg:col-span-1" variants={fadeInUp}>
              <div className="aspect-square bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 rounded-2xl mb-6 overflow-hidden shadow-2xl">
                <img
                  src="/profile-image.png"
                  alt="Fahmie Farhan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center text-text-muted">
                  <MapPin className="w-4 h-4 mr-2 text-fantasy-gold" />
                  Malaysia
                </div>
                <div className="flex items-center justify-center text-text-muted">
                  <Music className="w-4 h-4 mr-2 text-fantasy-gold" />
                  Composer & Producer
                </div>
              </div>
            </motion.div>
            <motion.div className="lg:col-span-2 space-y-8" variants={staggerContainer}>
              <motion.div variants={fadeInUp}>
                <h2 className="text-3xl font-bold mb-4">Fahmie Farhan Ariffin</h2>
                <div className="text-lg text-text-muted leading-relaxed space-y-4">
                  <p>
                    Fahmie Farhan Ariffin is a Malaysia-based composer and music producer known for his orchestral hybrid compositions, drawing inspiration from acclaimed Japanese anime composers including Hiroyuki Sawano, Kohta Yamamoto, and Yasuharu Takanashi. His music blends sweeping orchestral arrangements with modern cinematic energy, delivering powerful emotional impact.
                  </p>
                  <p>
                    His portfolio covers both international collaborations and competitive music performances. He has arranged and composed orchestral works for live keynote events in the United States, including multiple projects with violinist Diane Allen, whose audiences have been deeply moved by his music.
                  </p>
                </div>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 text-fantasy-gold">Traditional Excellence</h3>
                <p className="text-text-muted leading-relaxed mb-4">
                  In the realm of traditional ensemble performance, Fahmie collaborates with Gema Gamelan Waqafan (GEMAWAN), the gamelan group from Kolej Islam Sultan Alam Shah (KISAS). He trains the ensemble and composes original modern gamelan pieces, leading the group to multiple top awards — including 1st Prize in the SBP Gamelan Competition in both 2023 and 2024.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp}>
                <h3 className="text-2xl font-bold mb-4 text-fantasy-gold">Digital Presence</h3>
                <p className="text-text-muted leading-relaxed">
                  Fahmie is also active on YouTube, where he shares his original works with a growing international audience, and on stock music platforms where his compositions are licensed for use in films, games, and online content. His focus is always on creating music that elevates the stories it accompanies.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <div className="section-divider"><div className="divider-content">♫ ⟡ ♪</div><div className="divider-line"></div></div>

      {/* COLLABORATIONS */}
      <motion.section 
        className="py-20 px-6 bg-charcoal-dark"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <div className="flex items-center justify-center mb-4"><Users className="w-8 h-8 text-fantasy-gold mr-3" /><h2 className="text-4xl font-bold">Collaborations</h2></div>
            <p className="text-lg text-text-muted">Working with talented artists and ensembles to create extraordinary music.</p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerContainer}>
            {collaborations.map((collab) => (
              <motion.div key={collab.id} variants={fadeInUp}>
                <Card className="bg-deep-black border-fantasy-gold/20 hover:border-fantasy-gold/40 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 rounded-lg overflow-hidden flex-shrink-0">
                        {collab.image && <img src={collab.image} alt={collab.name} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{collab.name}</CardTitle>
                        {collab.role && <CardDescription className="text-fantasy-gold">{collab.role}</CardDescription>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {collab.description && <p className="text-text-muted mb-6 leading-relaxed">{collab.description}</p>}
                    {collab.link && collab.link !== "#" && (
                      <Button variant="outline" className="w-full border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black" asChild>
                        <a href={collab.link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Visit {collab.name}
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      <div className="section-divider"><div className="divider-content">♪ ◊ ♫</div><div className="divider-line"></div></div>

      {/* Achievements */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
             <div className="flex items-center justify-center mb-4"><Award className="w-8 h-8 text-fantasy-gold mr-3" /><h2 className="text-4xl font-bold">Achievements</h2></div>
            <p className="text-lg text-text-muted">Recognition and awards received throughout my musical journey.</p>
          </motion.div>
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
              {achievements.map((achievement) => {
                const IconComponent = ({ "🏆": Award, "🥇": Award, "⭐": Star }[achievement.icon || ""] || Award);
                return (
                  <motion.div key={achievement.id} variants={fadeInUp}>
                    <Card className="bg-charcoal-dark border-fantasy-gold/20 text-center hover:border-fantasy-gold/40 transition-colors h-full">
                      <CardHeader>
                        <div className="text-4xl mb-4"><IconComponent className="w-10 h-10 mx-auto text-fantasy-gold" /></div>
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        {achievement.year && <CardDescription className="text-fantasy-gold">{achievement.year}</CardDescription>}
                      </CardHeader>
                      <CardContent>
                        {achievement.description && <p className="text-text-muted text-sm">{achievement.description}</p>}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
        </div>
      </motion.section>

      <div className="section-divider"><div className="divider-content">♫ ⟡ ♪</div><div className="divider-line"></div></div>

      {/* Testimonials Section */}
      <motion.section 
        className="py-20 px-6 bg-charcoal-dark"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-4">What People Say</h2>
            <p className="text-lg text-text-muted">Hear from those who have experienced my music and collaborations.</p>
          </motion.div>
          {isLoading ? (
            <div className="text-center text-text-muted">Loading testimonials...</div>
          ) : testimonials.length > 0 ? (
            <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
              {testimonials.map((testimonial) => (
                <motion.div key={testimonial.id} variants={fadeInUp}>
                  <Card className="bg-deep-black border-fantasy-gold/20 hover:border-fantasy-gold/40 transition-all h-full flex flex-col">
                    <CardHeader className="flex-shrink-0">
                      <div className="flex items-center space-x-4">
                        {testimonial.avatar && (
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                            <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-xl">{testimonial.name}</CardTitle>
                          {testimonial.role && <CardDescription className="text-fantasy-gold">{testimonial.role}</CardDescription>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-text-muted leading-relaxed">"{testimonial.content}"</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.p variants={fadeInUp} className="text-center text-text-muted">No testimonials available yet.</motion.p>
          )}
        </div>
      </motion.section>

      {/* Contact CTA */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }} variants={fadeInUp}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="text-4xl font-bold mb-6" variants={fadeInUp}>Let's Create Together</motion.h2>
          <motion.p className="text-lg text-text-muted mb-8" variants={fadeInUp}>
            Whether you're looking for custom compositions, collaboration opportunities, or cultural consultation, I'd love to hear from you. Let's create something extraordinary together.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button size="lg" className="btn-gold" asChild>
                <a href="/contact">
                    <Mail className="w-5 h-5 mr-2" />
                    Get in Touch
                </a>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}