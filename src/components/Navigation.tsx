"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Music, User, Mail } from "lucide-react";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Music", href: "/music", icon: Music },
  { name: "About", href: "/about", icon: User },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <motion.nav
      className="navbar fixed top-0 left-0 w-full py-4 px-6 shadow-md bg-charcoal-dark/90 backdrop-blur-md -webkit-backdrop-filter: blur(20px) z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo/Brand */}
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link href="/" className="text-2xl font-bold text-fantasy-gold font-cinzel">
            Fahmie Farhan
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="nav-menu hidden md:flex space-x-8">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href}
                  className={`nav-link relative text-text-white hover:text-fantasy-gold transition-colors ${
                    isActive ? "text-fantasy-gold" : ""
                  }`}
                >
                  {item.name}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="text-fantasy-gold hover:text-fantasy-gold"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className="nav-menu md:hidden fixed top-20 left-0 w-full h-[calc(100vh-5rem)] bg-charcoal-dark/95 backdrop-blur-md -webkit-backdrop-filter: blur(20px) flex flex-col py-6 transition-all duration-300"
        initial={{ left: "-100%" }}
        animate={{ left: isOpen ? "0" : "-100%" }}
      >
        <div className="flex flex-col space-y-6 px-6">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isOpen ? 1 : 0,
                  x: isOpen ? 0 : -20
                }}
                transition={{ delay: isOpen ? index * 0.1 : 0 }}
              >
                <Link
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-md text-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "text-fantasy-gold bg-fantasy-gold/10"
                      : "text-text-white hover:text-fantasy-gold hover:bg-fantasy-gold/5"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </motion.nav>
  );
}