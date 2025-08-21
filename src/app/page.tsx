"use client";

import { useState, useEffect, useRef } from "react";
import { motion, Variants } from "framer-motion";
import YouTube from 'react-youtube';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import InteractivePiano from "@/components/InteractivePiano"; 
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
    Download,
    Award,
    Star,
    Headphones
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
    category?: string;
    description?: string;
    status: string;
    published: boolean;
    featured: boolean;
    audioUrl?: string;
    coverImageUrl?: string;
    fileSize?: string;
}

interface Video {
    id: string;
    title: string;
    videoId?: string;
    videoFileUrl?: string;
    category?: string;
    description?: string;
    published: boolean;
    featured: boolean;
}

interface Testimonial {
    id: string;
    name: string;
    role?: string;
    content: string;
    avatar?: string;
}

export default function Home() {
    const orbsRef = useRef<HTMLDivElement>(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isMuted, setIsMuted] = useState(false);
    const [likedTracks, setLikedTracks] = useState<string[]>([]);

    // State variables for fetched data
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [stats, setStats] = useState<Stat[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // State for featured music and videos
    const [featuredMusicTrack, setFeaturedMusicTrack] = useState<MusicTrack | null>(null);
    const [featuredVideos, setFeaturedVideos] = useState<Video[]>([]);

    // Audio Player State
    const audioRef = useRef<HTMLAudioElement>(null);
    const [audioPlaying, setAudioPlaying] = useState(false);
    const [audioProgress, setAudioProgress] = useState(0);
    const [audioDuration, setAudioDuration] = useState(0);

    // Fetch data on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    socialLinksRes,
                    statsRes,
                    testimonialsRes,
                    musicTracksRes,
                    videosRes,
                ] = await Promise.all([
                    fetch('/api/social-links'),
                    fetch('/api/stats'),
                    fetch('/api/testimonials'),
                    fetch('/api/music-tracks?published=true&featured=true'),
                    fetch('/api/videos?published=true&featured=true'),
                ]);

                const socialLinksData = await socialLinksRes.json();
                const statsData = await statsRes.json();
                const testimonialsData = await testimonialsRes.json();
                const musicTracksData: MusicTrack[] = await musicTracksRes.json();
                const videosData: Video[] = await videosRes.json();

                setSocialLinks(socialLinksData);
                setStats(statsData);
                setTestimonials(testimonialsData);

                if (musicTracksData.length > 0) {
                    const randomIndex = Math.floor(Math.random() * musicTracksData.length);
                    setFeaturedMusicTrack(musicTracksData[randomIndex]);
                }

                setFeaturedVideos(videosData);

            } catch (error) {
                console.error("Failed to fetch data for landing page:", error);
            }
        };

        fetchData();
    }, []);

    // Audio Player Logic
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const setAudioData = () => {
            setAudioDuration(audio.duration);
            setAudioProgress(audio.currentTime);
        };

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

    const handleAudioProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const audio = audioRef.current;
        if (audio) {
            const newTime = (audio.duration / 100) * parseInt(e.target.value);
            audio.currentTime = newTime;
            setAudioProgress(newTime);
        }
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

    const formatTime = (seconds: number) => {
        if (isNaN(seconds) || seconds === 0) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const onPlayerReady = (event: { target: any }) => {
        console.log("YouTube player is ready:", event.target);
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
    };

    const fadeInUp: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div className="min-h-screen bg-deep-black text-text-white">
            <section id="home" className="relative min-h-screen flex items-center pt-20 pb-20 px-6 overflow-hidden">
                <div className="hero-bg"></div>
                <div className="floating-orbs" ref={orbsRef}></div>
                
                <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
                    
                    <div className="text-left">
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
                            className="text-lg md:text-xl text-text-muted mb-8 max-w-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            Crafting cinematic soundscapes that blend epic orchestral arrangements with the rich cultural heritage of Malay gamelan music. 
                            <span className="text-fantasy-gold">Experience the fusion of tradition and innovation.</span>
                        </motion.p>
                        
                        <motion.div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <a href="#contact">
                                    <Button size="lg" className="btn-gold px-6 py-3 rounded-md flex items-center">
                                        <span className="mr-2">⟡</span> Reach Out
                                    </Button>
                                </a>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                            <a href="#music">
                                    <Button variant="outline" size="lg" className="btn-outline-gold px-6 py-3 rounded-md flex items-center border-2">
                                        <span className="mr-2">♫</span> Listen
                                    </Button>
                                </a>
                            </motion.div>
                        </motion.div>

                        <motion.div className="flex justify-start space-x-6 mb-12"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            {socialLinks.map((social, index) => {
                                const IconComponent = ({
                                    "Youtube": Youtube, "Instagram": Instagram, "Music": Music,
                                } as any)[social.icon];

                                if (!IconComponent) return null;
                                return (
                                    <motion.a key={social.id} href={social.url} target="_blank" rel="noopener noreferrer" className="group transform transition-all duration-300 hover:scale-110 text-center" whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + index * 0.1 }}>
                                        <div className="w-16 h-16 bg-charcoal-dark rounded-full flex items-center justify-center text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black transition-all duration-300 shadow-lg hover:shadow-fantasy-gold/20">
                                            <IconComponent className="w-8 h-8" />
                                        </div>
                                        <p className="text-xs text-text-muted mt-2 group-hover:text-fantasy-gold transition-colors">{social.name}</p>
                                    </motion.a>
                                );
                            })}
                        </motion.div>
                    </div>

                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9 }}
                         animate={{ opacity: 1, scale: 1 }}
                         transition={{ duration: 0.8, delay: 0.5 }}
                         className="hidden lg:block"
                    >
                        <InteractivePiano />
                    </motion.div>
                </div>
            </section>
            
            <div className="section-divider">
                 <div className="divider-content">♪ ♫ ♪</div>
                 <div className="divider-line"></div>
            </div>

            <section id="music" className="py-20 px-6 bg-charcoal-dark">
                 <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Music Track</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">Discover a randomly selected featured track from my collection.</p>
                    </div>
                    {featuredMusicTrack ? (
                        <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
                            <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden">
                                <CardContent className="p-8">
                                    <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
                                        <div className="relative group w-full md:w-1/2 aspect-square rounded-lg overflow-hidden">
                                            <img
                                                src={featuredMusicTrack.coverImageUrl || "https://via.placeholder.com/400"}
                                                alt={featuredMusicTrack.title}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Button
                                                    size="lg"
                                                    onClick={toggleAudioPlay}
                                                    className="bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90 rounded-full w-16 h-16 flex items-center justify-center"
                                                >
                                                    {audioPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex-1 text-center md:text-left">
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
                                                    onChange={handleAudioProgressChange}
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
                                                    variant="ghost"
                                                    size="sm"
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
                                                <div className="flex items-center space-x-1 cursor-pointer hover:text-fantasy-gold" onClick={() => setLikedTracks(prev => prev.includes(featuredMusicTrack.id) ? prev.filter(id => id !== featuredMusicTrack.id) : [...prev, featuredMusicTrack.id])}>
                                                    <Heart className={`w-4 h-4 ${likedTracks.includes(featuredMusicTrack.id) ? 'text-red-500 fill-current' : ''}`} />
                                                    <span>Like</span>
                                                </div>
                                                <div className="flex items-center space-x-1 cursor-pointer hover:text-fantasy-gold">
                                                    <Share2 className="w-4 h-4" />
                                                    <span>Share</span>
                                                </div>
                                                {featuredMusicTrack.audioUrl && (
                                                    <a href={featuredMusicTrack.audioUrl} download className="flex items-center space-x-1 text-text-muted hover:text-fantasy-gold">
                                                        <Download className="w-4 h-4" />
                                                        <span>Download</span>
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ) : ( <div className="text-center text-text-muted">Loading featured music...</div> )}
                </div>
            </section>
            
            <div className="section-divider">
                <div className="divider-content">♪ ♫ ♪</div>
                <div className="divider-line"></div>
            </div>

            <section className="py-20 px-6 bg-deep-black">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured YouTube Videos</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">Explore a selection of my featured video content.</p>
                    </div>
                    {featuredVideos.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {featuredVideos.map((video) => (
                                <motion.div
                                    key={video.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6 }}
                                >
                                    <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden h-full">
                                        <CardContent className="p-4">
                                            {video.videoId ? (
                                                <div className="relative aspect-video w-full mb-4">
                                                    <YouTube
                                                        videoId={video.videoId}
                                                        className="absolute top-0 left-0 w-full h-full"
                                                        iframeClassName="w-full h-full rounded-lg"
                                                        opts={{
                                                            height: '100%',
                                                            width: '100%',
                                                            playerVars: { autoplay: 0, controls: 1, },
                                                        }}
                                                        onReady={onPlayerReady}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="relative aspect-video w-full mb-4 bg-gray-700 rounded-lg flex items-center justify-center text-text-muted">
                                                    No Video Available
                                                </div>
                                            )}
                                            <h3 className="text-lg font-bold text-white mb-1">{video.title}</h3>
                                            <p className="text-sm text-text-muted">{video.category}</p>
                                            <p className="text-xs text-text-muted mt-2">{video.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-text-muted">No featured videos available.</div>
                    )}
                </div>
            </section>
            
            <div className="section-divider">
                <div className="divider-content">♪ ♫ ♪</div>
                <div className="divider-line"></div>
            </div>

            <section className="py-20 px-6 bg-charcoal-dark">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What People Say</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Hear from clients and collaborators who have experienced the magic of Fahmie's compositions.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
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

            <div className="section-divider">
                <div className="divider-content">♪ ♫ ♪</div>
                <div className="divider-line"></div>
            </div>

            <motion.section 
                id="contact"
                className="py-20 px-6"
                initial="hidden" 
                whileInView="visible" 
                viewport={{ once: true, amount: 0.1 }} 
                variants={staggerContainer}
            >
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                        <p className="text-xl text-text-muted max-w-2xl mx-auto">
                            Interested in collaborating on a project or licensing music? I'd love to hear from you!
                        </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <motion.div variants={fadeInUp}>
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
                        <motion.div variants={fadeInUp}>
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
                </div>
            </motion.section>
        </div>
    );
}