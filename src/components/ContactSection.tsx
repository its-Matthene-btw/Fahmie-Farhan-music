"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Send, ExternalLink } from "lucide-react";
import InteractivePiano from "@/components/InteractivePiano";

interface ContactSectionProps {
  className?: string;
  showPiano?: boolean;
  showTitle?: boolean;
}

export default function ContactSection({ className = "", showPiano = false, showTitle = true }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    phone: "",
    company: ""
  });
  const [lastPlayedNote, setLastPlayedNote] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert("Thank you for your message! I'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "", phone: "", company: "" });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlayNote = (note: string) => {
    setLastPlayedNote(note);
  };

  const socialLinks = [
    {
      name: "YouTube",
      url: "https://www.youtube.com/@FahmieFarhanMusic",
      icon: "▶",
      color: "red"
    },
    {
      name: "SoundCloud",
      url: "https://soundcloud.com/fahmiefarhanmusic",
      icon: "♪",
      color: "orange"
    },
    {
      name: "Spotify",
      url: "https://open.spotify.com/artist/yourartistid",
      icon: "🎵",
      color: "green"
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/fahmiefarhanmusic/",
      icon: "📷",
      color: "pink"
    }
  ];

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
    <div className={`contact-section ${className}`}>
      {/* Interactive Piano Section */}
      {showPiano && (
        <motion.section 
          className="py-16 px-6 bg-charcoal-dark"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-3xl font-bold mb-4 text-fantasy-gold">Musical Connection</h2>
              <p className="text-lg text-text-muted">
                Play a note before reaching out - let the music bridge our connection
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp}>
              <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30 overflow-hidden shadow-2xl">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <p className="text-lg text-fantasy-gold font-semibold mb-2">
                        {lastPlayedNote ? `Last played: ${lastPlayedNote}` : "Play a note to start the conversation"}
                      </p>
                      <p className="text-sm text-text-muted">
                        Every message begins with a musical connection
                      </p>
                    </div>
                    <InteractivePiano onPlayNote={handlePlayNote} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Contact Form */}
      <motion.section 
        className="py-20 px-6 bg-deep-black"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <div className="max-w-4xl mx-auto">
          {showTitle && (
            <motion.div className="text-center mb-12" variants={fadeInUp}>
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-fantasy-gold via-yellow-400 to-fantasy-gold bg-clip-text text-transparent">
                Contact
              </h2>
              <p className="text-xl text-text-muted max-w-3xl mx-auto">
                Let's discuss your next project or collaboration opportunities. 
                I'm always excited to work with creative minds and bring musical visions to life.
              </p>
            </motion.div>
          )}

          <motion.div className="grid lg:grid-cols-2 gap-12" variants={staggerContainer}>
            {/* Contact Form */}
            <motion.div variants={fadeInUp}>
              <Card className="bg-charcoal-dark border-fantasy-gold/20">
                <CardHeader>
                  <CardTitle className="text-2xl">Send a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and I'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name *
                      </label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                        placeholder="John Doe"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address *
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                        placeholder="john@example.com"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <Input
                        id="subject"
                        type="text"
                        value={formData.subject}
                        onChange={(e) => handleInputChange("subject", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                        placeholder="Enter your subject..."
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>

                    <div>
                      <label htmlFor="company" className="block text-sm font-medium mb-2">
                        Company
                      </label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => handleInputChange("company", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted"
                        placeholder="Your company name"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="bg-deep-black border-fantasy-gold/20 text-text-white placeholder:text-text-muted min-h-[120px]"
                        placeholder="Tell me about your project or inquiry..."
                        required
                      />
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        type="submit" 
                        size="lg"
                        className="w-full bg-fantasy-gold text-deep-black hover:bg-fantasy-gold/90"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-5 h-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div className="space-y-6" variants={staggerContainer}>
              {/* Direct Contact */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20">
                  <CardHeader>
                    <CardTitle className="text-xl">Direct Contact</CardTitle>
                    <CardDescription>
                      Reach out directly through these channels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-fantasy-gold/20 rounded-full flex items-center justify-center">
                        <Mail className="w-6 h-6 text-fantasy-gold" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-text-muted">fahmiefarhan69@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-fantasy-gold/20 rounded-full flex items-center justify-center">
                        <Phone className="w-6 h-6 text-fantasy-gold" />
                      </div>
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-text-muted">+60 11-31377753</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Social Media */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20">
                  <CardHeader>
                    <CardTitle className="text-xl">Follow Me</CardTitle>
                    <CardDescription>
                      Connect with me on social media platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {socialLinks.map((social, index) => (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-deep-black rounded-lg hover:bg-fantasy-gold/10 transition-colors group"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 bg-${social.color}-600/20 rounded-full flex items-center justify-center`}>
                              <span className={`text-${social.color}-600 font-bold`}>{social.icon}</span>
                            </div>
                            <div>
                              <p className="font-medium">{social.name}</p>
                              <p className="text-sm text-text-muted">Follow @{social.name.toLowerCase().replace(' ', '')}</p>
                            </div>
                          </div>
                          <ExternalLink className="w-4 h-4 text-fantasy-gold group-hover:text-fantasy-gold" />
                        </motion.a>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Response Time */}
              <motion.div variants={fadeInUp}>
                <Card className="bg-charcoal-dark border-fantasy-gold/20">
                  <CardHeader>
                    <CardTitle className="text-xl">Response Time</CardTitle>
                    <CardDescription>
                      When you can expect to hear back from me
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Email Inquiries</span>
                        <span className="text-fantasy-gold">24-48 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Project Quotes</span>
                        <span className="text-fantasy-gold">2-3 business days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}