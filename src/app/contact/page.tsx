"use client";

import { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Send, Youtube, Instagram, Music } from "lucide-react";

// --- Interfaces ---
interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
}

interface ContactSectionProps {
  showPiano?: boolean;
  showTitle?: boolean;
}

export default function ContactSection({ showPiano = false, showTitle = false }: ContactSectionProps) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  // Fetch social links when the component mounts
  useEffect(() => {
    const fetchSocialLinks = async () => {
      try {
        const res = await fetch('/api/social-links');
        if (res.ok) {
          const data = await res.json();
          setSocialLinks(data);
        }
      } catch (error) {
        console.error("Failed to fetch social links:", error);
      }
    };
    fetchSocialLinks();
  }, []);

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
        const errorData = await response.json();
        alert(`Failed to send message: ${errorData.message || 'Please try again later.'}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <motion.section 
      className="py-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
    >
      <div className="max-w-7xl mx-auto">
        {showTitle && (
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-xl text-text-muted max-w-2xl mx-auto">
                    Interested in collaborating or licensing music? I'd love to hear from you!
                </p>
            </div>
        )}
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

            {/* --- SOCIAL LINKS SECTION ADDED BACK --- */}
            <div className="mt-8">
              <h4 className="text-lg font-semibold mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                {socialLinks.map((social) => {
                  const IconComponent = ({
                    "Youtube": Youtube,
                    "Instagram": Instagram,
                    "Music": Music,
                  } as any)[social.icon];

                  if (!IconComponent) return null;

                  return (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-12 h-12 bg-deep-black rounded-full flex items-center justify-center text-fantasy-gold hover:bg-fantasy-gold hover:text-deep-black transition-colors border border-fantasy-gold/20"
                    >
                      <IconComponent className="w-6 h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp}>
            <Card className="bg-charcoal-dark/90 backdrop-blur-sm border-fantasy-gold/30">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-text-muted mb-2">Name</Label>
                    <Input
                      type="text" id="name" name="name"
                      value={formData.name} onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors"
                      placeholder="Your name" required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-text-muted mb-2">Email</Label>
                    <Input
                      type="email" id="email" name="email"
                      value={formData.email} onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors"
                      placeholder="your@email.com" required
                    />
                  </div>
                  <div>
                    <Label htmlFor="subject" className="block text-sm font-medium text-text-muted mb-2">Subject</Label>
                    <Input
                      type="text" id="subject" name="subject"
                      value={formData.subject} onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors"
                      placeholder="What's this about?" required
                    />
                  </div>
                  <div>
                    <Label htmlFor="message" className="block text-sm font-medium text-text-muted mb-2">Message</Label>
                    <Textarea
                      id="message" name="message"
                      value={formData.message} onChange={handleInputChange}
                      rows={5}
                      className="w-full px-4 py-3 bg-deep-black border border-fantasy-gold/30 rounded-lg focus:outline-none focus:border-fantasy-gold text-white transition-colors resize-none"
                      placeholder="Your message..." required
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button type="submit" size="lg" className="w-full btn-gold px-6 py-3 rounded-md flex items-center justify-center" disabled={isSubmitting}>
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
        </div>
      </div>
       {showPiano && (
            <div className="absolute bottom-0 left-0 w-full h-48 opacity-10">
                {/* Placeholder for piano animation */}
            </div>
       )}
    </motion.section>
  );
}