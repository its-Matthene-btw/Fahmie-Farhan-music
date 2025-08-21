"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Video, Play, Pause, Download } from "lucide-react";

// --- Interfaces ---
interface MusicTrack {
  id: string;
  title: string;
  category?: string;
  audioUrl?: string;
  coverImageUrl?: string;
  published: boolean;
}

interface Video {
  id: string;
  title: string;
  videoId?: string;
  category?: string;
  published: boolean;
}

const ITEMS_PER_PAGE = 9;

// --- Helper Function ---
const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Music Card Component ---
function MusicCard({ track, isPlaying, onPlayPause }: { track: MusicTrack; isPlaying: boolean; onPlayPause: (track: MusicTrack) => void; }) {
  return (
    <Card className="bg-charcoal-dark border-fantasy-gold/20 overflow-hidden group h-full flex flex-col">
      <div className="relative aspect-square">
        <img src={track.coverImageUrl || '/placeholder-cover.png'} alt={track.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="lg"
            className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-20 h-20"
            onClick={() => onPlayPause(track)}
          >
            {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 truncate">{track.title}</h3>
          <Badge variant="secondary" className="bg-fantasy-gold/20 text-fantasy-gold">{track.category}</Badge>
        </div>
        {track.audioUrl && (
          <a href={track.audioUrl} download className="mt-4 text-sm flex items-center text-text-muted hover:text-fantasy-gold transition-colors w-fit">
            <Download className="w-4 h-4 mr-2" />
            Download
          </a>
        )}
      </CardContent>
    </Card>
  );
}


// --- Main Page Component ---
export default function MusicPage() {
  const [musicTracks, setMusicTracks] = useState<MusicTrack[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true); // State to track loading
  
  const [visibleMusicCount, setVisibleMusicCount] = useState(ITEMS_PER_PAGE);
  const [visibleVideoCount, setVisibleVideoCount] = useState(ITEMS_PER_PAGE);

  // Audio Player State
  const [playingTrack, setPlayingTrack] = useState<MusicTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        const [musicRes, videosRes] = await Promise.all([
          fetch('/api/music-tracks?published=true'),
          fetch('/api/videos?published=true')
        ]);
        
        if (!musicRes.ok || !videosRes.ok) throw new Error('Failed to fetch data');

        const musicData = await musicRes.json();
        const videosData = await videosRes.json();
        
        setMusicTracks(musicData);
        setVideos(videosData);
      } catch (error) {
        console.error("Failed to fetch portfolio data:", error);
      } finally {
        setIsLoading(false); // Finish loading
      }
    };
    fetchData();
  }, []);
  
  // Audio player event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setProgress(audio.currentTime);
    const handleLoadedData = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      setPlayingTrack(null);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);
  
  // Main play/pause logic
  const handlePlayPause = (track: MusicTrack) => {
    const audio = audioRef.current;
    if (!audio || !track.audioUrl) return;

    if (playingTrack?.id === track.id) {
      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    } else {
      setPlayingTrack(track);
      audio.src = track.audioUrl;
      audio.play();
      setIsPlaying(true);
    }
  };

  // Animation variants
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
      <audio ref={audioRef} />

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
            Explore my portfolio of original compositions, orchestral arrangements, and award-winning gamelan works.
          </motion.p>
        </div>
      </motion.section>

      <section className="py-20 px-6 bg-deep-black">
        <div className="max-w-7xl mx-auto">
          <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}>
            <div className="flex items-center justify-center mb-4">
              <Music className="w-8 h-8 text-fantasy-gold mr-3" />
              <h2 className="text-4xl font-bold">Explore My Music</h2>
            </div>
          </motion.div>

          {playingTrack && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="sticky bottom-4 z-50 max-w-4xl mx-auto"
            >
              <Card className="bg-charcoal-dark/90 backdrop-blur-md border border-fantasy-gold/30 p-4">
                <div className="flex items-center space-x-4">
                  <img src={playingTrack.coverImageUrl || '/placeholder-cover.png'} alt={playingTrack.title} className="w-16 h-16 rounded-md object-cover" />
                  <div className="flex-1">
                    <h4 className="font-bold text-white truncate">{playingTrack.title}</h4>
                    <p className="text-sm text-text-muted">{playingTrack.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-text-muted">{formatTime(progress)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={progress}
                        onChange={(e) => { if(audioRef.current) audioRef.current.currentTime = Number(e.target.value) }}
                        className="w-full h-1 bg-deep-black rounded-lg appearance-none cursor-pointer range-sm thumb-gold"
                      />
                      <span className="text-xs text-text-muted">{formatTime(duration)}</span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-12 h-12 flex-shrink-0"
                    onClick={() => handlePlayPause(playingTrack)}
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Conditional Rendering Logic for Music Grid */}
          {isLoading ? (
            <div className="text-center text-text-muted py-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fantasy-gold mx-auto"></div>
                <p className="mt-4">Loading Music...</p>
            </div>
          ) : musicTracks.length > 0 ? (
            <>
              <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                {musicTracks.slice(0, visibleMusicCount).map((track) => (
                  <motion.div key={track.id} variants={fadeInUp}>
                    <MusicCard 
                      track={track}
                      isPlaying={isPlaying && playingTrack?.id === track.id}
                      onPlayPause={handlePlayPause}
                    />
                  </motion.div>
                ))}
              </motion.div>
              {visibleMusicCount < musicTracks.length && (
                <div className="text-center mt-12">
                  <Button size="lg" className="btn-gold" onClick={() => setVisibleMusicCount(prev => prev + ITEMS_PER_PAGE)}>
                    Load More Music
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-text-muted py-10">
              <p>No published music tracks found at the moment. Please check back later!</p>
            </div>
          )}
        </div>
      </section>

      <div className="section-divider">
        <div className="divider-content">♫ ⟡ ♪</div>
        <div className="divider-line"></div>
      </div>
      
      {/* Videos Section */}
      <section className="py-20 px-6 bg-charcoal-dark">
        <div className="max-w-7xl mx-auto">
            <motion.div className="text-center mb-12" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.5 }} variants={fadeInUp}>
                <div className="flex items-center justify-center mb-4">
                <Video className="w-8 h-8 text-fantasy-gold mr-3" />
                <h2 className="text-4xl font-bold">Music Videos</h2>
                </div>
            </motion.div>

            {/* Conditional Rendering Logic for Video Grid */}
            {isLoading ? (
                <div className="text-center text-text-muted">Loading videos...</div>
            ) : videos.length > 0 ? (
                <>
                    <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {videos.slice(0, visibleVideoCount).map((video) => (
                        <motion.div key={video.id} variants={fadeInUp}>
                            <Card className="bg-charcoal-dark border-fantasy-gold/20 overflow-hidden group h-full flex flex-col">
                            <div className="relative aspect-video">
                                <img src={`https://i.ytimg.com/vi/${video.videoId}/hqdefault.jpg`} alt={video.title} className="w-full h-full object-cover" />
                                <a href={`https://www.youtube.com/watch?v=${video.videoId}`} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-red-600 text-white rounded-full w-20 h-20 flex items-center justify-center">
                                    <Play className="w-10 h-10" />
                                </div>
                                </a>
                            </div>
                            <CardContent className="p-4 flex-grow">
                                <h3 className="text-xl font-bold text-white mb-1 truncate">{video.title}</h3>
                                <Badge variant="secondary" className="bg-red-600/30 text-red-400">{video.category}</Badge>
                            </CardContent>
                            </Card>
                        </motion.div>
                        ))}
                    </motion.div>
                    
                    {visibleVideoCount < videos.length && (
                        <div className="text-center mt-12">
                        <Button size="lg" className="btn-gold" onClick={() => setVisibleVideoCount(prev => prev + ITEMS_PER_PAGE)}>
                            Load More Videos
                        </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center text-text-muted py-10">
                    <p>No published videos found at the moment. Please check back later!</p>
                </div>
            )}
        </div>
      </section>
    </div>
  );
}