"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Award, Trophy, Star, Calendar, ExternalLink, Download, Music, Users, Youtube } from "lucide-react";

interface MusicTrack {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  year?: string;
  category?: string;
  audioUrl?: string;
  audioFile?: string;
  fileSize?: string;
  featured: boolean;
  published: boolean;
}

interface Video {
  id: string;
  title: string;
  videoId: string;
  category?: string;
  views?: string;
  published: boolean;
  featured: boolean;
}

const achievements = [
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
    title: "Collaborations with International Keynote Performers",
    description: "Successful partnerships with renowned international artists including Diane Allen",
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

export default function ProjectsPage() {
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    const fetchMusicTracks = async () => {
      try {
        const response = await fetch('/api/music-tracks');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMusicTracks(data);
      } catch (error) {
        console.error("Failed to fetch music tracks:", error);
      }
    };

    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/videos');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVideos(data);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      }
    };

    fetchMusicTracks();
    fetchVideos();
  }, []);

  const musicArrangementProjects = musicTracks.filter(track => track.category === "Orchestral Arrangement");
  const originalGamelanCompositions = musicTracks.filter(track => track.category === "Original Gamelan Composition");

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
    <div className="min-h-screen bg-deep-black text-text-white">
      {/* Global Animated Background */}
      <div className="particles-container"></div>
      
      {/* Header */}
      <motion.section 
        className="py-20 px-6 bg-gradient-to-b from-charcoal-dark to-deep-black relative overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <div className="hero-bg absolute inset-0"></div>
        <div className="floating-orbs absolute inset-0"></div>
        <div className="floating-notes absolute inset-0"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div variants={fadeInUp}>
            <div className="mx-auto mb-6"></div>
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent"
            variants={fadeInUp}
          >
            Projects
          </motion.h1>
          <motion.p 
            className="text-xl text-text-muted max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Explore my portfolio of original compositions, orchestral arrangements, and award-winning gamelan works. 
            All audio files are available for download and licensing.
          </motion.p>
        </div>
      </motion.section>



      {/* Music Arrangement Projects */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <div className="flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-fantasy-gold mr-3" />
              <h2 className="text-4xl font-bold">Music Arrangement Projects (Orchestral)</h2>
            </div>
            <motion.p className="text-lg text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
              Professional orchestral arrangements created for live performances and special events
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={staggerContainer}>
            {musicArrangementProjects.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20 overflow-hidden hover:border-fantasy-gold/40 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 text-fantasy-gold">{project.title}</CardTitle>
                        <CardDescription className="text-lg mb-3">{project.subtitle}</CardDescription>
                        <div className="flex items-center space-x-4 text-text-muted">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {project.year}
                          </div>
                          <Badge variant="secondary" className="bg-fantasy-gold/20 text-fantasy-gold">
                            {project.category}
                          </Badge>
                        </div>
                      </div>
                      {project.featured && <Trophy className="w-8 h-8 text-fantasy-gold" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted mb-6 leading-relaxed">{project.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {project.fileSize && (
                        <div className="flex items-center text-sm text-text-muted">
                          <span className="font-semibold mr-2">File Size:</span>
                          {project.fileSize}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {project.audioFile && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90" asChild>
                            <a href={project.audioFile} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download Audio
                            </a>
                          </Button>
                        </motion.div>
                      )}
                      {project.audioUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black" asChild>
                            <a href={project.audioUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Listen Preview
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section Divider */}
      <motion.div 
        className="section-divider"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="divider-content">♫ ⟡ ♪</div>
        <div className="divider-line"></div>
      </motion.div>

      {/* Original Gamelan Compositions */}
      <motion.section 
        className="py-20 px-6 bg-charcoal-dark"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <div className="flex items-center justify-center mb-4">
              <Users className="w-8 h-8 text-fantasy-gold mr-3" />
              <h2 className="text-4xl font-bold">Original Gamelan Composition</h2>
            </div>
            <motion.p className="text-lg text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
              Award-winning contemporary gamelan compositions that honor tradition while embracing innovation
            </p>
          </motion.div>

          <motion.div className="space-y-8" variants={staggerContainer}>
            {originalGamelanCompositions.map((project) => (
              <motion.div key={project.id} variants={fadeInUp}>
                <Card className="bg-deep-black border-fantasy-gold/20 overflow-hidden hover:border-fantasy-gold/40 transition-all">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2 text-fantasy-gold">{project.title}</CardTitle>
                        <CardDescription className="text-lg mb-3">{project.subtitle}</CardDescription>
                        <div className="flex items-center space-x-4 text-text-muted">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {project.year}
                          </div>
                          <Badge variant="secondary" className="bg-fantasy-gold/20 text-fantasy-gold">
                            {project.category}
                          </Badge>
                        </div>
                      </div>
                      {project.featured && <Trophy className="w-8 h-8 text-fantasy-gold" />}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted mb-6 leading-relaxed">{project.description}</p>
                    
                    {/* Assuming achievements are part of the description or a separate field in the CMS */}
                    {/* For now, just displaying a placeholder if achievements are not directly from CMS */}
                    {/* You might need to adjust this based on how achievements are stored in your CMS */}
                    {/* For example, if achievements are a separate array in the MusicTrack model, you'd map over it here */}
                    {/* {project.achievements && (
                      <div className="mb-6">
                        <h4 className="font-semibold mb-3 text-fantasy-gold">Achievements:</h4>
                        <div className="flex flex-wrap gap-2">
                          {project.achievements.map((achievement, index) => (
                            <Badge key={index} variant="outline" className="border-fantasy-gold/20 text-fantasy-gold">
                              <Star className="w-3 h-3 mr-1" />
                              {achievement}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )} */}
                    
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                      {project.fileSize && (
                        <div className="flex items-center text-sm text-text-muted">
                          <span className="font-semibold mr-2">File Size:</span>
                          {project.fileSize}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3">
                      {project.audioFile && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90" asChild>
                            <a href={project.audioFile} download>
                              <Download className="w-4 h-4 mr-2" />
                              Download Audio
                            </a>
                          </Button>
                        </motion.div>
                      )}
                      {project.audioUrl && (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="outline" className="border-fantasy-gold/20 text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black" asChild>
                            <a href={project.audioUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Listen Preview
                            </a>
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Section Divider */}
      <motion.div 
        className="section-divider"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="divider-content">🏆 ⭐ 🎵</div>
        <div className="divider-line"></div>
      </motion.div>

      {/* YouTube Videos Section */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <div className="flex items-center justify-center mb-4">
              <Youtube className="w-8 h-8 text-fantasy-gold mr-3" />
              <h2 className="text-4xl font-bold">YouTube Videos</h2>
            </div>
            <motion.p className="text-lg text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
              Check out my latest videos and musical content on YouTube
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer}>
            {videos.map((video) => (
              <motion.div key={video.id} variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20 overflow-hidden hover:border-fantasy-gold/40 transition-all h-full">
                  <CardHeader>
                    <CardTitle className="text-xl mb-2 text-fantasy-gold">{video.title}</CardTitle>
                    {video.category && <CardDescription className="text-lg mb-3">{video.category}</CardDescription>}
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video mb-4">
                      <iframe
                        className="w-full h-full rounded-lg"
                        src={`https://www.youtube.com/embed/${video.videoId}`}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    {video.views && (
                      <p className="text-sm text-text-muted mb-4">Views: {video.views}</p>
                    )}
                    <Button asChild className="w-full bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90">
                      <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Watch on YouTube
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
          {videos.length === 0 && (
            <motion.div variants={fadeInUp} className="text-center text-text-muted mt-8">
              No videos available yet.
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* Section Divider */}
      <motion.div 
        className="section-divider"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="divider-content">🏆 ⭐ 🎵</div>
        <div className="divider-line"></div>
      </motion.div>

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
            <div className="flex items-center justify-center mb-4">
              <Award className="w-8 h-8 text-fantasy-gold mr-3" />
              <h2 className="text-4xl font-bold">Achievements & Recognition</h2>
            </div>
            <motion.p className="text-lg text-text-muted max-w-3xl mx-auto" variants={fadeInUp}>
              Celebrating milestones and recognition in the world of music composition and performance
            </p>
          </motion.div>

          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" variants={staggerContainer}>
            {achievements.map((achievement, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20 hover:border-fantasy-gold/40 transition-all h-full">
                  <CardHeader className="text-center">
                    <div className="text-4xl mb-4">{achievement.icon}</div>
                    <CardTitle className="text-xl text-fantasy-gold">{achievement.title}</CardTitle>
                    <CardDescription className="text-sm text-fantasy-gold/80">{achievement.year}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-text-muted text-sm leading-relaxed">{achievement.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
