"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Music,
    Mail,
    Youtube,
    Instagram,
    User,
    Phone,
    MapPin,
    Send,
    Play,
    Pause,
    Volume2,
    VolumeX,
    Heart,
    Share2,
    Award,
    Star,
    Headphones,
} from "lucide-react";

// Interfaces for data types
interface SocialLink {
    id: string;
    name: string;
    url: string;
    icon: string;
}

interface Stat {
    id: string;
    label: string;
    value: string;
    icon: string;
}

interface MusicTrack {
    id: string;
    title: string;
    artist?: string;
    duration?: string;
    category?: string;
    description?: string;
    audioUrl?: string;
    coverImageUrl?: string;
    plays?: string;
    likes?: number;
    featured?: boolean;
}

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    avatar?: string;
}

const iconComponents: { [key: string]: React.FC<any> } = {
    Music,
    User,
    Award,
    Headphones,
    Youtube,
    Instagram,
};

// Hardcoded stats data based on the provided image
const statsData = [
    { value: "150+", label: "Compositions", icon: Music },
    { value: "200+", label: "Happy Clients", icon: User },
    { value: "10+", label: "Years Experience", icon: Award },
    { value: "5M+", label: "Global Plays", icon: Headphones },
];

export default function Home() {
    const orbsRef = useRef<HTMLDivElement>(null);
    const notesRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    // Fetched Data State
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [allMusicTracks, setAllMusicTracks] = useState<MusicTrack[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // UI State
    const [hoveredMusicCard, setHoveredMusicCard] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');

    // Audio Player State
    const [featuredMusicTrack, setFeaturedMusicTrack] = useState<MusicTrack | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const [likedTracks, setLikedTracks] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    socialLinksRes,
                    testimonialsRes,
                    musicTracksRes,
                ] = await Promise.all([
                    fetch('/api/social-links'),
                    fetch('/api/testimonials'),
                    fetch('/api/music-tracks?published=true'),
                ]);

                const socialLinksData: SocialLink[] = await socialLinksRes.json();
                const testimonialsData: Testimonial[] = await testimonialsRes.json();
                const musicTracksData: MusicTrack[] = await musicTracksRes.json();

                setSocialLinks(socialLinksData);
                setTestimonials(testimonialsData);
                setAllMusicTracks(musicTracksData); 

                if (musicTracksData.length > 0) {
                    const featuredTracks = musicTracksData.filter(track => track.featured);
                    if (featuredTracks.length > 0) {
                        const randomIndex = Math.floor(Math.random() * featuredTracks.length);
                        setFeaturedMusicTrack(featuredTracks[randomIndex]);
                    } else {
                        const randomIndex = Math.floor(Math.random() * musicTracksData.length);
                        setFeaturedMusicTrack(musicTracksData[randomIndex]);
                    }
                }

            } catch (error) {
                console.error("Failed to fetch data for landing page:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const setAudioData = () => { setAudioDuration(audio.duration); setAudioProgress(audio.currentTime); };
        const setAudioTime = () => setAudioProgress(audio.currentTime);
        audio.addEventListener('loadeddata', setAudioData);
        audio.addEventListener('timeupdate', setAudioTime);
        audio.addEventListener('ended', () => setAudioPlaying(false));
        return () => {
            audio.removeEventListener('loadeddata', setAudioData);
            audio.removeEventListener('timeupdate', setAudioTime);
            audio.removeEventListener('ended', () => setAudioPlaying(false));
        };
    }, [featuredMusicTrack]);

    // Initialize animated background elements from the first file's hero
    useEffect(() => {
        // Create floating orbs
        if (orbsRef.current) {
            // Clear existing orbs to prevent duplication on re-renders
            orbsRef.current.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const orb = document.createElement("div");
                orb.className = "orb";
                const size = Math.random() * 100 + 50;
                orb.style.width = `${size}px`;
                orb.style.height = `${size}px`;
                orb.style.left = `${Math.random() * 90}%`;
                orb.style.top = `${Math.random() * 90}%`;
                orb.style.animationDuration = `${Math.random() * 15 + 10}s`;
                orb.style.animationDelay = `${Math.random() * 5}s`;
                orbsRef.current.appendChild(orb);
            }
        }

        // Create floating notes
        if (notesRef.current) {
            // Clear existing notes
            notesRef.current.innerHTML = '';
            const noteChars = ["♪", "♫", "♬", "♩"];
            for (let i = 0; i < 6; i++) {
                const note = document.createElement("div");
                note.className = "music-note";
                note.textContent = noteChars[Math.floor(Math.random() * noteChars.length)];
                note.style.left = `${Math.random() * 100}%`;
                note.style.animationDuration = `${Math.random() * 10 + 20}s`;
                note.style.animationDelay = `${Math.random() * 10}s`;
                notesRef.current.appendChild(note);
            }
        }
    }, []);

    const playTrackFromPortfolio = (track: MusicTrack) => {
        setFeaturedMusicTrack(track);
        setAudioPlaying(true);
        setTimeout(() => {
            audioRef.current?.play();
            document.getElementById('music-player')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
    };

    const toggleLike = (trackId: string) => {
        setLikedTracks(prev => 
            prev.includes(trackId) 
            ? prev.filter(id => id !== trackId)
            : [...prev, trackId]
        );
    };

    const filteredTracks = activeTab === 'all'
        ? allMusicTracks
        : allMusicTracks.filter(track => track.category?.toLowerCase().includes(activeTab.toLowerCase()));

    const toggleAudioPlay = () => {
        const audio = audioRef.current;
        if (audio) {
            if (audioPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setAudioPlaying(!audioPlaying);
        }
    };
    
    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/contact-submissions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert("Thank you for your message! I'll get back to you soon.");
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                alert("Failed to send message. Please try again later.");
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("Failed to send message. Please try again later.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-deep-black text-text-white">
            {/* --- HERO SECTION --- */}
            <section id="home" className="relative min-h-screen flex items-center justify-center pt-20 pb-20 px-6 overflow-hidden">
                <div className="hero-bg"></div>
                <div className="floating-orbs" ref={orbsRef}></div>
                <div className="floating-notes" ref={notesRef}></div>
                
                <div className="relative z-10 max-w-7xl mx-auto text-center">
                    <motion.h1 
                        className="text-4xl md:text-6xl font-bold mb-6 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-fantasy-gold">Fahmie Farhan</span>
                    </motion.h1>
                    <motion.h2 
                        className="text-2xl md:text-4xl font-bold mb-6 text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Epic Orchestral & Malay Gamelan Composer
                    </motion.h2>
                    <motion.p 
                        className="text-lg md:text-xl text-text-muted mb-8 max-w-3xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        Crafting cinematic soundscapes that blend epic orchestral arrangements with the rich cultural heritage of Malay gamelan music. 
                        <span className="text-fantasy-gold"> Experience the fusion of tradition and innovation.</span>
                    </motion.p>
                    
                    <motion.div className="flex justify-center space-x-4 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                    >
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                           <a href="#music-portfolio">
                             <Button size="lg" className="btn-gold px-6 py-3 rounded-md flex items-center">
                                <span className="mr-2">⟡</span> Explore Works
                             </Button>
                           </a>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a href="#contact">
                              <Button variant="outline" size="lg" className="btn-outline-gold px-6 py-3 rounded-md flex items-center border-2">
                                <span className="mr-2">✉</span> Contact Me
                              </Button>
                            </a>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex justify-center space-x-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                    >
                        {socialLinks.map((social, index) => {
                           const Icon = iconComponents[social.icon];
                           if (!Icon) return null;
                           return (
                                <motion.a
                                    key={social.id}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group transform transition-all duration-300 hover:scale-110"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 + index * 0.1 }}
                                >
                                    <div className="w-16 h-16 bg-charcoal-dark rounded-full flex items-center justify-center text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black transition-all duration-300 shadow-lg hover:shadow-fantasy-gold/20">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <p className="text-xs text-text-muted mt-2 group-hover:text-fantasy-gold transition-colors">
                                        {social.name}
                                    </p>
                                </motion.a>
                            );
                        })}
                    </motion.div>

                    <motion.div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8 text-sm"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                    >
                        <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-fantasy-gold" />
                            <span className="text-text-muted">contact@fahmiefarhan.com</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-fantasy-gold" />
                            <span className="text-text-muted">+60 11-31377753</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <MapPin className="w-4 h-4 text-fantasy-gold" />
                            <span className="text-text-muted">Malaysia</span>
                        </div>
                    </motion.div>

                    {/* UPDATED STATS SECTION */}
<motion.div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8, delay: 1.4 }}
>
    {statsData.map((stat, index) => (
        <motion.div
            key={stat.label}
            className="text-center p-4 bg-charcoal-dark/50 rounded-lg backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 + index * 0.1 }}
        >
            <stat.icon className="w-8 h-8 text-fantasy-gold mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-text-muted">{stat.label}</div>
        </motion.div>
    ))}
</motion.div>
                </div>
            </section>
            
            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

            {/* --- FEATURED MUSIC TRACK SECTION --- */}
            <section id="music-player" className="py-20 px-6 bg-charcoal-dark scroll-mt-20">
                 <div className="max-w-7xl mx-auto">
                     <div className="text-center mb-12">
                         <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Music Track</h2>
                         <p className="text-xl text-text-muted max-w-2xl mx-auto">Discover a featured track from my collection. Select any song from the portfolio below to play it here.</p>
                     </div>
                     {featuredMusicTrack ? (
                         <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                             <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden">
                                 <CardContent className="p-8">
                                     <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                         <div className="relative group w-48 h-48 flex-shrink-0">
                                             <img
                                                 src={featuredMusicTrack.coverImageUrl || "https://via.placeholder.com/400"}
                                                 alt={featuredMusicTrack.title}
                                                 className="w-full h-full object-cover rounded-lg"
                                             />
                                             <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                                                 <Button
                                                     size="lg"
                                                     onClick={toggleAudioPlay}
                                                     className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-16 h-16 flex items-center justify-center"
                                                 >
                                                     {audioPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                                 </Button>
                                             </div>
                                         </div>
                                         <div className="flex-1 text-center md:text-left w-full">
                                             <h3 className="text-2xl font-bold text-white mb-2">{featuredMusicTrack.title}</h3>
                                             <p className="text-lg text-text-muted mb-2">{featuredMusicTrack.category}</p>
                                             <p className="text-sm text-text-muted mb-4">{featuredMusicTrack.description}</p>
                                             <audio ref={audioRef} src={featuredMusicTrack.audioUrl} preload="metadata"></audio>
                                             <div className="mb-4">
                                                 <input
                                                     type="range"
                                                     min="0"
                                                     max="100"
                                                     value={audioProgress && audioDuration ? (audioProgress / audioDuration) * 100 : 0}
                                                     className="w-full h-2 bg-deep-black rounded-lg appearance-none cursor-pointer range-lg thumb-gold"
                                                 />
                                                 <div className="flex justify-between text-sm text-text-muted mt-1">
                                                     <span>{formatTime(audioProgress)}</span>
                                                     <span>{formatTime(audioDuration)}</span>
                                                 </div>
                                             </div>
                                             <div className="flex items-center justify-center md:justify-start space-x-4 mb-4">
                                                 <Button size="sm" onClick={toggleAudioPlay} className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90">
                                                     {audioPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                                                 </Button>
                                                 <Button
                                                     variant="ghost" size="sm"
                                                     onClick={() => {
                                                         if (audioRef.current) {
                                                             const newMutedState = !isMuted;
                                                             audioRef.current.muted = newMutedState;
                                                             setIsMuted(newMutedState);
                                                         }
                                                     }}
                                                     className="text-fantasy-gold hover:text-white"
                                                 >
                                                     {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                                                 </Button>
                                             </div>
                                             <div className="flex items-center justify-center md:justify-start space-x-6 text-sm text-text-muted">
                                                 <div className="flex items-center space-x-1 cursor-pointer hover:text-fantasy-gold" onClick={() => toggleLike(featuredMusicTrack.id)}>
                                                     <Heart className={`w-4 h-4 ${likedTracks.includes(featuredMusicTrack.id) ? 'text-red-500 fill-current' : ''}`} />
                                                     <span>Like</span>
                                                 </div>
                                                 <div className="flex items-center space-x-1 cursor-pointer hover:text-fantasy-gold">
                                                     <Share2 className="w-4 h-4" />
                                                     <span>Share</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 </CardContent>
                             </Card>
                         </motion.div>
                     ) : ( <div className="text-center text-text-muted">Loading featured music...</div> )}
                 </div>
             </section>

            <div className="section-divider"><div className="divider-content">♫ ♪ ♫</div><div className="divider-line"></div></div>

            {/* --- MUSIC PORTFOLIO SECTION --- */}
            <section id="music-portfolio" className="py-20 px-6 bg-deep-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Music Portfolio</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Explore my diverse collection of compositions spanning multiple genres and styles.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {['all', 'Orchestral', 'Gamelan', 'Cinematic', 'Ambient'].map((tab) => (
                            <Button
                                key={tab}
                                variant={activeTab === tab ? "default" : "outline"}
                                onClick={() => setActiveTab(tab)}
                                className={`capitalize ${
                                    activeTab === tab 
                                    ? 'bg-fantasy-gold text-deep-black' 
                                    : 'border-fantasy-gold/30 text-fantasy-gold hover:bg-fantasy-gold/10'
                                }`}
                            >
                                {tab}
                            </Button>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredTracks.map((track, index) => (
                            <motion.div
                                key={track.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                onMouseEnter={() => setHoveredMusicCard(track.id)}
                                onMouseLeave={() => setHoveredMusicCard(null)}
                            >
                                <Card className={`music-card bg-charcoal-dark rounded-lg overflow-hidden transition-all duration-300 h-full flex flex-col ${
                                    hoveredMusicCard === track.id ? 'transform scale-105 border-fantasy-gold/50' : 'border-transparent'
                                }`}>
                                    <div className="relative">
                                        <img src={track.coverImageUrl || `https://via.placeholder.com/400x400`} 
                                            alt={track.title} 
                                            className="w-full h-48 object-cover" />
                                        <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                                            hoveredMusicCard === track.id ? 'opacity-100' : 'opacity-0'
                                        }`}>
                                            <Button 
                                                size="lg"
                                                className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-16 h-16"
                                                onClick={() => playTrackFromPortfolio(track)}
                                            >
                                                <Play className="w-8 h-8" />
                                            </Button>
                                        </div>
                                    </div>
                                    <CardContent className="p-6 flex-grow flex flex-col">
                                        <h3 className="text-xl font-bold text-white mb-2">{track.title}</h3>
                                        <p className="text-fantasy-gold text-sm mb-2">{track.category}</p>
                                        <div className="flex items-center justify-between text-sm text-text-muted mt-auto">
                                            <div className="flex items-center space-x-4">
                                                {track.plays && <span className="flex items-center space-x-1"><Play className="w-4 h-4" /><span>{track.plays}</span></span>}
                                                {track.likes && <span className="flex items-center space-x-1"><Heart className="w-4 h-4" /><span>{track.likes}</span></span>}
                                            </div>
                                            {track.duration && <span>{track.duration}</span>}
                                        </div>
                                        <div className="flex items-center justify-start space-x-2 mt-4 border-t border-fantasy-gold/10 pt-4">
                                            <Button variant="ghost" size="sm" onClick={() => toggleLike(track.id)} className={`p-2 ${likedTracks.includes(track.id) ? 'text-red-500' : 'text-fantasy-gold'}`}>
                                                <Heart className={`w-5 h-5 ${likedTracks.includes(track.id) ? 'fill-current' : ''}`} />
                                            </Button>
                                            <Button variant="ghost" size="sm" className="text-fantasy-gold p-2">
                                                <Share2 className="w-5 h-5" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                    {allMusicTracks.length === 0 && (
                        <div className="text-center text-text-muted pt-8">Loading music portfolio...</div>
                     )}
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>
            
            {/* --- ABOUT SECTION --- */}
            <section className="py-20 px-6 bg-charcoal-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">About the Composer</h2>
                            <p className="text-lg text-text-muted mb-4">
                                Fahmie Farhan is a Malaysian composer who specializes in creating epic orchestral music and modern interpretations of traditional Malay gamelan.
                            </p>
                            <p className="text-lg text-text-muted mb-4">
                                His work spans from cinematic stock music for films, games, and media projects to cultural compositions that preserve and innovate upon Malaysia's rich musical heritage.
                            </p>
                            <p className="text-lg text-text-muted mb-6">
                                With a unique blend of Western orchestral techniques and traditional Malay instruments, Fahmie creates immersive soundscapes that transport listeners to different worlds and emotions.
                            </p>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    <Award className="w-8 h-8 text-fantasy-gold" />
                                    <div>
                                        <div className="font-semibold">Award Winning</div>
                                        <div className="text-sm text-text-muted">Multiple compositions</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <Star className="w-8 h-8 text-fantasy-gold" />
                                    <div>
                                        <div className="font-semibold">Top Rated</div>
                                        <div className="text-sm text-text-muted">5-star reviews</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <div className="relative mx-auto max-w-md">
                                <img src="https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=600&h=400&fit=crop" 
                                    alt="Composer at work" 
                                    className="w-full rounded-xl shadow-xl" />
                                <div className="absolute inset-0 bg-gradient-to-t from-fantasy-gold/20 to-transparent rounded-xl"></div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

            {/* --- TESTIMONIALS SECTION --- */}
            <section className="py-20 px-6 bg-deep-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Hear from clients and collaborators who have experienced the magic of my compositions.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                            >
                                <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 h-full">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex items-center mb-4">
                                            {testimonial.avatar && (
                                                <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                                            )}
                                            <div>
                                                <h4 className="font-semibold text-white">{testimonial.name}</h4>
                                                {testimonial.role && <p className="text-sm text-fantasy-gold">{testimonial.role}</p>}
                                            </div>
                                        </div>
                                        <p className="text-text-muted flex-grow">"{testimonial.content}"</p>
                                        <div className="flex mt-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-fantasy-gold fill-current" />
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <div className="section-divider"><div className="divider-content">♪ ♫ ♪</div><div className="divider-line"></div></div>

            {/* --- CONTACT SECTION --- */}
            <section id="contact" className="py-20 px-6">
                <motion.div 
                    className="max-w-7xl mx-auto"
                    initial="hidden" 
                    whileInView="visible" 
                    viewport={{ once: true, amount: 0.1 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Interested in collaborating on a project or licensing music? I'd love to hear from you!
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div>
                            <h3 className="text-3xl font-bold mb-6 text-fantasy-gold">Let's Connect</h3>
                            <p className="text-lg text-text-muted mb-8">
                                Whether you're looking for custom compositions, music licensing, or just want to discuss musical ideas, I'm here to help bring your vision to life.
                            </p>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-fantasy-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6 text-fantasy-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Email</h4>
                                        <p className="text-text-muted">contact@fahmiefarhan.com</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-fantasy-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6 text-fantasy-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Phone</h4>
                                        <p className="text-text-muted">+60 11-31377753</p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4">
                                    <div className="w-12 h-12 bg-fantasy-gold/10 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6 text-fantasy-gold" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold mb-1">Location</h4>
                                        <p className="text-text-muted">Malaysia</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        <motion.div>
                            <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30">
                                <CardContent className="p-8">
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <Label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Name</Label>
                                            <Input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors" placeholder="Your name" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</Label>
                                            <Input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors" placeholder="your@email.com" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-2">Subject</Label>
                                            <Input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors" placeholder="What's this about?" required />
                                        </div>
                                        <div>
                                            <Label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Message</Label>
                                            <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} rows={5} className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors resize-none" placeholder="Your message..." required />
                                        </div>
                                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                            <Button type="submit" size="lg" className="w-full btn-gold px-6 py-3 rounded-md flex items-center justify-center" disabled={isSubmitting}>
                                                {isSubmitting ? (
                                                    <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>Sending...</>
                                                ) : (
                                                    <><Send className="w-5 h-5 mr-2" />Send Message</>
                                                )}
                                            </Button>
                                        </motion.div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}