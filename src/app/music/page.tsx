"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Video, Play, MapPin, ExternalLink, Mail, Award, Star, Heart, Share2, X } from "lucide-react";

// --- Interfaces ---
interface VideoItem {
  id: string;
  title: string;
  videoId: string;
  category?: string;
  published: boolean;
  coverImageUrl?: string;
  description?: string;
}

interface Collaboration {
  name: string;
  role: string;
  description: string;
  link: string;
  image: string;
}

interface Achievement {
  title: string;
  description: string;
  year: string;
  icon: string;
}

const ITEMS_PER_PAGE = 9;

// --- Helper Components ---
function VideoCard({ video, onClick }: { video: VideoItem; onClick: (video: VideoItem) => void }) {
  const imageUrl = video.coverImageUrl || `https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`;
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className={`bg-charcoal-dark rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col cursor-pointer ${
          isHovered ? 'transform scale-105 border-fantasy-gold/50' : 'border-transparent'
      }`}>
        <div className="relative" onClick={() => onClick(video)}>
          <img
            src={imageUrl}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
              isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <Button
              size="lg"
              className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-16 h-16 pointer-events-none"
            >
              <Play className="w-8 h-8" />
            </Button>
          </div>
        </div>
        <CardContent className="p-6 flex-grow flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">{video.title}</h3>
          <p className="text-fantasy-gold text-sm mb-2">{video.category || "Music Video"}</p>
          <div className="flex items-center justify-start space-x-2 mt-auto border-t border-fantasy-gold/10 pt-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setLiked(!liked)} 
              className={`p-2 ${liked ? 'text-red-500' : 'text-fantasy-gold'}`}>
              <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="text-fantasy-gold p-2">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function VideoModal({ video, onClose }: { video: VideoItem | null; onClose: () => void }) {
  if (!video) return null;

  const url = `https://www.youtube.com/embed/${video.videoId}?autoplay=1`;

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 25 } },
    exit: { opacity: 0, scale: 0.95 }
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
      }}
      onClick={onClose}
    >
      <motion.div
        className="relative w-full max-w-4xl p-4 bg-charcoal-dark border border-fantasy-gold/20 rounded-lg shadow-2xl"
        variants={modalVariants}
        onClick={e => e.stopPropagation()}
      >
        <Button size="icon" variant="ghost" className="absolute top-2 right-2 text-white/50 hover:text-white" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
        <div className="aspect-video w-full mb-4 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white">{video.title}</h3>
          <p className="text-sm text-text-muted mt-2">{video.description || "No description available."}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Static Data from About Page ---
const collaborations: Collaboration[] = [
  {
    name: "Diane Allen",
    role: "Violin Virtuoso",
    description: "Collaborated on multiple orchestral projects for live keynote performances in the United States, creating powerful musical experiences that have deeply moved audiences.",
    link: "https://dianeallen.com/",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop"
  },
  {
    name: "GEMAWAN KISAS",
    role: "Cultural Ensemble",
    description: "Gema Gamelan Waqafan (GEMAWAN) from Kolej Islam Sultan Alam Shah (KISAS). Collaboration includes training the ensemble and composing original modern gamelan pieces.",
    link: "http://www.youtube.com/@gemawankisas4271",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop"
  }
];

const achievements: Achievement[] = [
  {
    title: "1st Prize – National Gamelan Competition (HKSBP)",
    description: "Awarded for outstanding composition and performance in the prestigious national competition",
    year: "2023 & 2024",
    icon: "🏆"
  },
  {
    title: "1st Place – Ensemble of Gamelan Competition, UTP",
    description: "Recognized as the best gamelan ensemble in the university competition",
    year: "2023",
    icon: "🥇"
  },
  {
    title: "Featured in Ensemble of Gamelan Performance, UTP",
    description: "Selected to showcase original compositions at the university's premier gamelan event",
    year: "2025",
    icon: "⭐"
  },
  {
    title: "International Collaborations",
    description: "Successful partnerships with renowned international artists and performers",
    year: "2023-2024",
    icon: "🤝"
  },
  {
    title: "Growing Global Audience on YouTube",
    description: "Expanding international reach with increasing subscribers and engagement",
    year: "Ongoing",
    icon: "📈"
  },
  {
    title: "Music Licensed for Media, Games, and Online Creators",
    description: "Compositions featured in various media productions and by content creators worldwide",
    year: "Ongoing",
    icon: "🎵"
  }
];

// --- Main Page Component ---
export default function PortfolioPage() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [visibleVideoCount, setVisibleVideoCount] = useState(ITEMS_PER_PAGE);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setIsLoading(true);
      try {
        const videosRes = await fetch('/api/videos?published=true');
        if (!videosRes.ok) throw new Error('Failed to fetch videos');
        const videosData: VideoItem[] = await videosRes.json();
        setVideos(videosData);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const handleCardClick = (video: VideoItem) => {
    setSelectedVideo(video);
  };

  const handleCloseModal = () => {
    setSelectedVideo(null);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setVisibleVideoCount(ITEMS_PER_PAGE); // Reset count on tab change
  };
  
  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const filteredVideos = activeTab === 'all'
    ? videos
    : videos.filter(video => video.category?.toLowerCase() === activeTab.toLowerCase());

  // Build category list dynamically from fetched videos (preserve original casing)
  const categoryList = [
    'All',
    ...Array.from(new Set(videos.map(v => v.category?.trim()).filter(Boolean)))
  ];

  return (
    <div className="min-h-screen bg-deep-black text-text-white">

      {/* Hero Section */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-b from-charcoal-dark to-deep-black relative overflow-hidden"
        initial="hidden" animate="visible" variants={staggerContainer}
      >
        <div className="hero-bg absolute inset-0"></div>
        <div className="floating-orbs absolute inset-0"></div>
        <div className="floating-notes absolute inset-0"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent" variants={fadeInUp}>
            Music Portfolio
          </motion.h1>
          <motion.p className="text-xl text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
            Explore my compositions and music videos.
          </motion.p>
        </div>
      </motion.section>
      
      {/* Music Video Portfolio Section */}
      <section className="py-0 px-6 bg-deep-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoryList.map((tab) => {
              const tabKey = tab.toLowerCase();
              return (
                <Button
                  key={tab}
                  variant={activeTab === tabKey ? "default" : "outline"}
                  onClick={() => handleTabChange(tabKey)}
                  className={`capitalize ${
                    activeTab === tabKey
                      ? 'bg-fantasy-gold text-deep-black'
                      : 'border-fantasy-gold/30 text-fantasy-gold hover:bg-fantasy-gold/10'
                  }`}
                >
                  {tab}
                </Button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="text-center text-text-muted py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fantasy-gold mx-auto"></div>
              <p className="mt-4">Loading videos...</p>
            </div>
          ) : filteredVideos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVideos.slice(0, visibleVideoCount).map((video) => (
                  <VideoCard key={video.id} video={video} onClick={handleCardClick} />
                ))}
              </div>
              
              {visibleVideoCount < filteredVideos.length && (
                <div className="text-center mt-12">
                  <Button size="lg" className="btn-gold" onClick={() => setVisibleVideoCount(prev => prev + ITEMS_PER_PAGE)}>
                    Load More Videos
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-text-muted py-10">
              <p>No published videos found for this category.</p>
            </div>
          )}
        </div>
      </section>
      
      <div className="section-divider"><div className="divider-content">♪ ◊ ♫</div><div className="divider-line"></div></div>

      {/* Collaborations Section */}
      <motion.section
        className="py-20 px-6 bg-charcoal-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-4">Collaborations</h2>
            <p className="text-lg text-text-muted">
              Working with talented artists and ensembles to create extraordinary music
            </p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 gap-8" variants={staggerContainer}>
            {collaborations.map((collab, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-deep-black border-fantasy-gold/20 hover:border-fantasy-gold/40 transition-all h-full">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-fantasy-gold/10 to-purple-500/10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={collab.image} alt={collab.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl">{collab.name}</CardTitle>
                        <CardDescription className="text-fantasy-gold">{collab.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted mb-6 leading-relaxed">{collab.description}</p>
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

      {/* Achievements Section */}
      <motion.section
        className="py-20 px-6 bg-deep-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold mb-4">Achievements</h2>
            <p className="text-lg text-text-muted">
              Recognition and awards received throughout my musical journey
            </p>
          </motion.div>
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
            {achievements.map((achievement, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20 text-center hover:border-fantasy-gold/40 transition-colors h-full">
                  <CardHeader>
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <CardTitle className="text-lg">{achievement.title}</CardTitle>
                    <CardDescription className="text-fantasy-gold">
                      {achievement.year}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted text-sm">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
      
      <div className="section-divider"><div className="divider-content">♫ ⟡ ♪</div><div className="divider-line"></div></div>

      {/* Contact CTA */}
      <motion.section
        className="py-20 px-6 bg-charcoal-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 className="text-4xl font-bold mb-6" variants={fadeInUp}>Let's Create Together</motion.h2>
          <motion.p className="text-lg text-text-muted mb-8" variants={fadeInUp}>
            Whether you're looking for custom compositions, collaboration opportunities, or cultural consultation, I'd love to hear from you. Let's create something extraordinary together.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Button size="lg" className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90" asChild>
                <a href="/contact">
                    <Mail className="w-5 h-5 mr-2" />
                    Get in Touch
                </a>
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* The video modal component, which will be rendered conditionally */}
      <VideoModal video={selectedVideo} onClose={handleCloseModal} />
    </div>
  );
}