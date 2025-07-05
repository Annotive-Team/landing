// Best Practices Checklist for Contributors:
// - All browser-specific or variable logic (window, Math.random, Date.now, etc.) must be inside useEffect/useState, never in render.
// - Never use typeof window !== 'undefined' in render.
// - Always render the same DOM structure on both server and client.
// - If you need a client-only value, use useEffect and state.
// - No invalid HTML nesting.
// - Review this checklist before submitting new components or features.

"use client"

import { useEffect, useRef, useState } from "react"
import emailjs from 'emailjs-com';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useIsMobile } from "@/hooks/use-mobile"
import { X, Menu, ChevronDown } from "lucide-react"

export default function PhralsPlatform() {
  const heroRef = useRef<HTMLElement>(null)
  const iconsRef = useRef<HTMLDivElement>(null)
  const phoneRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLElement>(null)
  const isMobile = useIsMobile()

  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null)

  // State for QR grid pattern
  const [qrPattern, setQrPattern] = useState<string[]>(Array(48).fill("bg-black"));

  useEffect(() => {
    const pattern = Array.from({ length: 48 }).map(() =>
      Math.random() > 0.5 ? "bg-white" : "bg-black"
    );
    setQrPattern(pattern);
  }, []);

  // Scroll-based text highlighting with performance optimization
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight

          // Find the features section
          const featuresSection = document.querySelector('section[class*="bg-[#1a1a1a]"]') as HTMLElement | null
          if (!featuresSection) return

          const sectionRect = featuresSection.getBoundingClientRect()
          const sectionTop = sectionRect.top + scrollY
          const sectionHeight = sectionRect.height

          // Check if we're in the section
          if (scrollY >= sectionTop - windowHeight / 2 && scrollY <= sectionTop + sectionHeight) {
            // Calculate progress through the section
            const progress = (scrollY - sectionTop + windowHeight / 2) / sectionHeight
            const clampedProgress = Math.max(0, Math.min(1, progress))

            // Define text elements and their trigger points
            const textElements = [
              { selector: '[data-scroll-text="line-1"]', start: 0, end: 0.3 },
              { selector: '[data-scroll-text="line-2"]', start: 0.2, end: 0.5 },
              { selector: '[data-scroll-text="description"]', start: 0.4, end: 0.7 },
              { selector: '[data-scroll-text="qr-section"]', start: 0.6, end: 1 },
            ]

            textElements.forEach(({ selector, start, end }) => {
              const element = document.querySelector(selector) as HTMLElement | null
              if (element) {
                const elementProgress = (clampedProgress - start) / (end - start)
                const elementClampedProgress = Math.max(0, Math.min(1, elementProgress))

                if (elementClampedProgress > 0 && elementClampedProgress < 1) {
                  // Highlight state
                  element.style.color = "#ffffff"
                  element.style.opacity = "1"
                } else if (elementClampedProgress >= 1) {
                  // Completed state
                  element.style.color = "#888888"
                  element.style.opacity = "0.7"
                } else {
                  // Default state
                  element.style.color = "#666666"
                  element.style.opacity = "0.5"
                }
              }
            })
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Parallax effects with performance optimization
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Remove parallax for features section on all devices
          if (featuresRef.current) {
            const featuresElem = featuresRef.current as HTMLElement
            featuresElem.style.transform = "none"
            featuresElem.style.opacity = "1"
          }

          // Keep only the parallax effects for hero section
          const scrollY = window.scrollY
          const windowHeight = window.innerHeight
          if (scrollY >= 0) {
            // Hero parallax icons
            if (iconsRef.current) {
              const icons = iconsRef.current.children
              Array.from(icons).forEach((icon, index) => {
                const element = icon as HTMLElement
                const speed = (index % 2 === 0 ? 0.3 : -0.2) * scrollY
                const rotation = scrollY * (index % 2 === 0 ? 0.05 : -0.05)
                element.style.transform = `translate3d(0, ${speed}px, 0) rotate(${rotation}deg)`
              })
            }

            // Hero text fade
            if (heroRef.current) {
              const heroProgress = Math.min(1, scrollY / windowHeight)
              const heroOpacity = Math.max(0, 1 - heroProgress * 0.8)
              const heroContent = heroRef.current.querySelector(".hero-content") as HTMLElement
              if (heroContent) {
                heroContent.style.opacity = heroOpacity.toString()
                heroContent.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`
              }
            }
          }

          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    handleScroll()

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isMobile])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuOpen && !(event.target as Element).closest(".mobile-menu")) {
        setMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [mobileMenuOpen])

  const toggleMobileSubmenu = (menu: string) => {
    setExpandedMobileMenu(expandedMobileMenu === menu ? null : menu)
  }

  return (
    <div className="min-h-screen bg-[#fafafa] font-poppins relative">
      {/* Header */}
      <header className="relative z-50">
        <div
          className={`bg-[#F2F2F2] rounded-md md:rounded-lg mx-2 mt-4 border border-gray-100 relative transition-all duration-300 ease-out ${
            activeMegaMenu ? "pb-8" : ""
          }`}
          onMouseLeave={() => setActiveMegaMenu(null)}
        >
          {/* Top navigation bar - Fixed height */}
          <div className="flex items-center justify-between px-4 md:px-12 py-4 md:py-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <img
                  src="/images/phrals-logo.svg"
                  alt="Phrals"
                  width="115"
                  height="25"
                  className="md:w-[153px] md:h-[34px]"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4 md:space-x-8">
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                <div className="relative">
                  <button
                    className="flex items-center space-x-1 text-[#1a1a1a] hover:text-[#4A90E2] transition-colors py-2"
                    onMouseEnter={() => setActiveMegaMenu("what-we-do")}
                  >
                    <span>what we do</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <button
                    className="flex items-center space-x-1 text-[#1a1a1a] hover:text-[#4A90E2] transition-colors py-2"
                    onMouseEnter={() => setActiveMegaMenu("partner")}
                  >
                    <span>Partner with us</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>

                <div className="relative">
                  <button
                    className="flex items-center space-x-1 text-[#1a1a1a] hover:text-[#4A90E2] transition-colors py-2"
                    onMouseEnter={() => setActiveMegaMenu("resources")}
                  >
                    <span>Resources</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </nav>

              <button
                type="button"
                className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-full px-4 md:px-8 py-2 md:py-3 text-sm md:text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4A90E2] transition"
                onClick={() => window.open('https://cal.com/phrals', '_blank', 'noopener,noreferrer')}
              >
                Book a call
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden flex items-center justify-center w-8 h-8 text-[#1a1a1a]"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Desktop Mega Menu */}
          <div
            className={`px-12 transition-all duration-300 ease-out overflow-hidden ${
              activeMegaMenu ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
            onMouseEnter={() => setActiveMegaMenu(activeMegaMenu)}
            onMouseLeave={() => setActiveMegaMenu(null)}
          >
            {activeMegaMenu === "what-we-do" && (
              <div className="grid md:grid-cols-3 gap-0 min-h-full max-w-5xl mx-auto">
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    For people
                  </h3>
                  <p className="text-[#666] text-base leading-relaxed group-hover:text-[#666] transition-colors">
                    Utilise your space and earn by setting up a scrap dropoff point at your place
                  </p>
                </div>

                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    For businesses
                  </h3>
                  <p className="text-[#666] text-base leading-relaxed group-hover:text-[#666] transition-colors">
                    Leverage your daily business waste with us and turn waste into wealth
                  </p>
                </div>

                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    For environment
                  </h3>
                  <p className="text-[#666] text-base leading-relaxed group-hover:text-[#666] transition-colors">
                    Help reduce waste and create a sustainable future for generations to come
                  </p>
                </div>
              </div>
            )}

            {activeMegaMenu === "partner" && (
              <div className="grid md:grid-cols-3 gap-0 min-h-full max-w-5xl mx-auto">
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    Become a Partner
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Join our network
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Partnership benefits
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Application process
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    For Businesses
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Corporate partnerships
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Bulk waste solutions
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Custom programs
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    Support
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Partner portal
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Training resources
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Contact support
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeMegaMenu === "resources" && (
              <div className="grid md:grid-cols-3 gap-0 min-h-full max-w-5xl mx-auto">
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    Learn
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        How it works
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Recycling guide
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Environmental impact
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10 border-r border-gray-200">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    Support
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Help center
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Contact us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Report an issue
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="hover:bg-[#fef7e0] transition-colors duration-200 cursor-pointer group min-h-full flex flex-col justify-center px-8 py-10">
                  <h3 className="text-xl font-bold text-[#1a1a1a] mb-4 font-bricolage group-hover:text-[#1a1a1a] transition-colors">
                    Community
                  </h3>
                  <ul className="space-y-3 text-[#666]">
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Success stories
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-[#4A90E2] transition-colors">
                        Newsletter
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <div className="mobile-menu fixed right-0 top-0 h-full w-full bg-white shadow-xl transform transition-transform duration-300 ease-out">
              <div className="flex items-center justify-between p-6 border-b">
                <img src="/images/phrals-logo.svg" alt="Phrals" width="115" height="25" />
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* What we do */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-lg font-medium text-[#1a1a1a] py-2"
                    onClick={() => toggleMobileSubmenu("what-we-do")}
                  >
                    What we do
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedMobileMenu === "what-we-do" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedMobileMenu === "what-we-do" && (
                    <div className="mt-3 pl-4 space-y-3">
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        For people
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        For businesses
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        For environment
                      </a>
                    </div>
                  )}
                </div>

                {/* Partner with us */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-lg font-medium text-[#1a1a1a] py-2"
                    onClick={() => toggleMobileSubmenu("partner")}
                  >
                    Partner with us
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedMobileMenu === "partner" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedMobileMenu === "partner" && (
                    <div className="mt-3 pl-4 space-y-3">
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        Become a Partner
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        For Businesses
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        Support
                      </a>
                    </div>
                  )}
                </div>

                {/* Resources */}
                <div>
                  <button
                    className="flex items-center justify-between w-full text-left text-lg font-medium text-[#1a1a1a] py-2"
                    onClick={() => toggleMobileSubmenu("resources")}
                  >
                    Resources
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${expandedMobileMenu === "resources" ? "rotate-180" : ""}`}
                    />
                  </button>
                  {expandedMobileMenu === "resources" && (
                    <div className="mt-3 pl-4 space-y-3">
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        Learn
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        Support
                      </a>
                      <a href="#" className="block text-[#666] hover:text-[#4A90E2] transition-colors">
                        Community
                      </a>
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* Mobile CTA Buttons */}
                <div className="space-y-2">
                  <Button className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] rounded-full py-3">Book a call</Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section ref={heroRef} id="hero-section" className="hero-section relative px-4 md:px-8 py-16 md:py-24 bg-[#f8f9fa] overflow-hidden min-h-[80vh]">
        {/* Floating Icons */}
        <div ref={iconsRef} className="absolute inset-0 pointer-events-none parallax-element">
          {/* Rocketship - top center */}
          <div className="absolute top-20 md:top-32 left-1/2 transform -translate-x-1/2 translate-x-10 md:translate-x-20 text-[#666] opacity-70">
            <img
              src="/images/rocketship.svg"
              alt="Rocketship"
              width="40"
              height="40"
              className="md:w-[60px] md:h-[60px]"
            />
          </div>

          {/* Bird - top right */}
          <div className="absolute top-32 md:top-48 right-16 md:right-32 text-[#666] opacity-70">
            <img src="/images/bird.svg" alt="Bird" width="36" height="36" className="md:w-[54px] md:h-[54px]" />
          </div>

          {/* Pineapple - left */}
          <div className="absolute top-48 md:top-64 left-12 md:left-24 text-[#666] opacity-70">
            <img
              src="/images/pineapple.svg"
              alt="Pineapple"
              width="32"
              height="32"
              className="md:w-[48px] md:h-[48px]"
            />
          </div>

          {/* Hat - top right corner */}
          <div className="absolute top-16 md:top-24 right-24 md:right-48 text-[#666] opacity-70">
            <img src="/images/hat-2.svg" alt="Hat" width="50" height="30" className="md:w-[74px] md:h-[44px]" />
          </div>

          {/* Plant - bottom left */}
          <div className="absolute bottom-20 md:bottom-32 left-24 md:left-48 text-[#666] opacity-70">
            <img src="/images/plant.svg" alt="Plant" width="34" height="34" className="md:w-[51px] md:h-[51px]" />
          </div>

          {/* Bill/Phone - bottom right */}
          <div className="absolute bottom-16 md:bottom-24 right-16 md:right-32 text-[#666] opacity-70">
            <img src="/images/bill2.svg" alt="Bill" width="33" height="43" className="md:w-[49px] md:h-[64px]" />
          </div>
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10 hero-content py-8 md:py-5">
          <div className="inline-block bg-[#e8f5e8] text-[#2d5a2d] px-4 md:px-8 py-3 md:py-4 rounded-full text-xs md:text-sm font-medium border border-[#c8e6c8] mb-8 md:mb-[13px] max-w-xs">
            Join our team of eco warriors and help us create a better world
          </div>

          <h1 className="hero-title text-3xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-[1.1] tracking-tight font-bricolage mb-6 md:mb-6">
            Help us create a better world
            <br />
            and turn waste into wealth
          </h1>

          <p className="hero-subtitle text-base md:text-xl text-[#666] mb-12 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Drop off your recyclables at nearby locations, choose to walk for extra points, and turn your eco-friendly
            actions into real cash or gift cards.
          </p>

          <Button className="bg-[#e8f5e8] text-[#2d5a2d] hover:bg-[#ddf2dd] rounded-full px-6 md:px-10 py-6 md:py-8 text-base md:text-lg font-medium border border-[#c8e6c8] shadow-sm">
            <div className="flex items-center space-x-2 md:space-x-3">
              <img
                src="/images/multieye.svg"
                alt="Multi-eye icon"
                width="24"
                height="18"
                className="md:w-[32px] md:h-[24px]"
              />
              <span>Download Phrals</span>
              <img
                src="/images/download.svg"
                alt="Download icon"
                width="22"
                height="22"
                className="md:w-[30px] md:h-[29px]"
              />
            </div>
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section
        ref={featuresRef}
        id="features-section"
        className="features-section px-4 md:px-6 py-16 md:py-32 bg-[#1a1a1a] text-white relative z-30 md:min-h-screen md:flex md:items-center parallax-element"
      >
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Left Column - Typography */}
            <div className="space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left">
              <div className="space-y-2">
                <p className="text-xs sm:text-sm font-medium tracking-[0.2em] uppercase text-[#888] mb-4 lg:mb-8">
                  NOT EVERYONE MAKES IT IN.
                </p>

                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold leading-[0.9] font-bricolage">
                    <span className="block transition-colors duration-300" data-scroll-text="line-1">
                      all that you deserve.
                    </span>
                    <span className="block text-[#666] transition-colors duration-300" data-scroll-text="line-2">
                      and some more.
                    </span>
                  </h2>

                  <p
                    className="text-sm sm:text-base lg:text-lg xl:text-xl text-[#ccc] leading-relaxed max-w-lg transition-colors duration-300"
                    data-scroll-text="description"
                  >
                    if you're a Phrals member, you're already a step ahead. every experience you unlock takes you higher
                    up the pedestal.
                  </p>
                </div>
              </div>

              {/* QR Code Section */}
              <div
                className="qr-code-section flex items-center justify-center lg:justify-start space-x-3 md:space-x-4 lg:space-x-6 pt-4 lg:pt-8 transition-colors duration-300"
                data-scroll-text="qr-section"
              >
                <div className="qr-code-outer w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 bg-white rounded-lg p-2">
                  <div className="qr-code-inner w-full h-full bg-black rounded flex items-center justify-center">
                    <div className="qr-code-grid grid grid-cols-6 sm:grid-cols-8 gap-px">
                      {qrPattern.map((color, i) => (
                        <div
                          key={i}
                          className={`qr-code-dot w-0.5 h-0.5 sm:w-1 sm:h-1 ${color}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm sm:text-base lg:text-lg font-medium">download</p>
                  <p className="text-sm sm:text-base lg:text-lg font-medium">Phrals</p>
                </div>
              </div>
            </div>

            {/* Right Column - Phone Mockup */}
            <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
              <div className="relative">
                <div className="bg-[#2a2a2a] rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[3rem] border-2 sm:border-3 lg:border-4 border-[#333] w-48 h-[390px] sm:w-64 sm:h-[520px] lg:w-72 lg:h-[580px] xl:w-80 xl:h-[650px] flex flex-col shadow-2xl">
                  {/* Phone screen content */}
                  <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-[#f8f9fa] to-[#f4f4f4] rounded-[1rem] sm:rounded-[1.5rem] lg:rounded-[2.5rem] m-1 sm:m-1.5 lg:m-2 relative overflow-hidden">
                    <span className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-[#2d5a2d]">Coming Soon</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="newsletter-section" className="newsletter-section px-4 md:px-6 py-12 md:py-16 bg-[#e8f5e8] relative z-20 overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center justify-center">
        {/* Background Illustrations - Different composition from hero */}
        <div className="absolute inset-0 pointer-events-none opacity-25">
          {/* Plant - top left corner */}
          <div className="absolute top-6 left-6 md:top-10 md:left-12 text-white">
            <img
              src="/images/plant.svg"
              alt="Plant"
              width="28"
              height="28"
              className="md:w-[42px] md:h-[42px] filter brightness-0 invert"
            />
          </div>

          {/* Hat - top center */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:top-12 text-white">
            <img
              src="/images/hat-2.svg"
              alt="Hat"
              width="40"
              height="24"
              className="md:w-[60px] md:h-[36px] filter brightness-0 invert"
            />
          </div>

          {/* Rocketship - top right */}
          <div className="absolute top-10 right-8 md:top-16 md:right-16 text-white">
            <img
              src="/images/rocketship.svg"
              alt="Rocketship"
              width="30"
              height="30"
              className="md:w-[45px] md:h-[45px] filter brightness-0 invert"
            />
          </div>

          {/* Bill - middle left */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 md:left-8 text-white">
            <img
              src="/images/bill2.svg"
              alt="Bill"
              width="26"
              height="34"
              className="md:w-[39px] md:h-[51px] filter brightness-0 invert"
            />
          </div>

          {/* Bird - middle right */}
          <div className="absolute top-1/2 right-6 transform -translate-y-1/2 md:right-12 text-white">
            <img
              src="/images/bird.svg"
              alt="Bird"
              width="32"
              height="32"
              className="md:w-[48px] md:h-[48px] filter brightness-0 invert"
            />
          </div>

          {/* Pineapple - bottom center */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 translate-x-8 md:bottom-12 text-white">
            <img
              src="/images/pineapple.svg"
              alt="Pineapple"
              width="26"
              height="26"
              className="md:w-[39px] md:h-[39px] filter brightness-0 invert"
            />
          </div>
        </div>

        <div className="newsletter-content max-w-2xl mx-auto text-center flex flex-col items-center justify-center w-full h-full relative z-10">
          <h2 className="newsletter-header text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d5a2d] mb-4 md:mb-6 font-bricolage text-center">
            Get notified when we launch
          </h2>
          <p className="newsletter-paragraph text-base md:text-lg text-[#2d5a2d] mb-8 md:mb-10 leading-relaxed opacity-90 text-center">
            Subscribe to our newsletter and get notified on launch and get sustainability, recycling tips, and exclusive
            rewards straight to your inbox.
          </p>


          <form
            className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-lg mx-auto justify-center items-center w-full"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const emailInput = form.elements.namedItem('user_email') as HTMLInputElement;
              const email = emailInput.value;
              try {
                await emailjs.init('my2mlcCp0hhdB6J6S');
                await emailjs.send('service_d010kpm', 'template_1y0i909', {
                  user_email: email,
                  to_emails: 'chitraksh2705@gmail.com,milindboro004@gmail.com',
                });
                alert('Thank you for subscribing!');
                form.reset();
              } catch (err) {
                alert('There was an error subscribing. Please try again later.');
              }
            }}
          >
            <Input
              type="email"
              name="user_email"
              required
              placeholder="Enter your email address"
              className="flex-1 h-12 md:h-14 px-4 md:px-6 text-sm md:text-base bg-white border-2 border-[#c8e6c8] rounded-full focus:border-[#2d5a2d] focus:ring-0 placeholder:text-[#999] text-[#2d5a2d]"
            />
            <Button type="submit" className="bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] rounded-full px-6 md:px-8 h-12 md:h-14 text-sm md:text-base font-medium whitespace-nowrap border-2 border-[#1a1a1a] hover:border-[#2a2a2a]">
              Subscribe
            </Button>
          </form>

          <p className="text-xs md:text-sm text-[#2d5a2d] opacity-75 mt-4 md:mt-5 text-center">
            Join  eco-warriors already making a difference. Unsubscribe anytime.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#000000] text-white px-4 md:px-6 py-8 md:py-12 relative z-20">
        {/* Top border lines */}
        <div className="absolute top-4 md:top-6 left-0 w-screen space-y-2 md:space-y-3 mb-8 md:mb-16">
          <div className="w-full h-0.5 bg-white"></div>
          <div className="w-full h-0.5 bg-white"></div>
        </div>
        <div className="pt-8 md:pt-16"></div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* Large Phrals text - left-aligned like desktop */}
          <div className="pl-4 max-w-fit mb-10">
            <h2 className="text-[60px] sm:text-[80px] font-bold font-bricolage leading-none">Phrals</h2>
          </div>

          {/* Mobile Footer Content - Two columns in a single row */}
          <div className="grid grid-cols-2 gap-6 mb-10 px-4">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 font-bricolage">About us</h3>
                <ul className="space-y-2 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      The crisis of wastes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Who we are
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      The change
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-3 font-bricolage">What we do</h3>
                <ul className="space-y-2 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      For businesses
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      For individual
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#4A90E2] transition-colors text-xs">
                      For climate impact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Living beings
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-3 font-bricolage">Our structure</h3>
                <ul className="space-y-2 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Hardware
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Software
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-xs">
                      Manpower
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media Icons - Mobile */}
              <div>
                <h3 className="text-sm font-semibold mb-3 font-bricolage">Follow us</h3>
                <div className="flex space-x-3">
                  {/* Instagram */}
                  <a
                    href="#"
                    className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <img src="/images/instagram.svg" alt="Instagram" width="16" height="16" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="#"
                    className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">X (Twitter)</span>
                    <img src="/images/x.svg" alt="X" width="16" height="16" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <img src="/images/linkedin.svg" alt="LinkedIn" width="16" height="16" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="#"
                    className="w-8 h-8 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">YouTube</span>
                    <img src="/images/youtube.svg" alt="YouTube" width="16" height="11" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="max-w-7xl mx-auto">
            {/* Large Phrals text - left-aligned */}
            <div className="mb-16">
              <h2 className="text-[120px] lg:text-[160px] xl:text-[200px] font-bold font-bricolage leading-none">
                Phrals
              </h2>
            </div>

            {/* Desktop Footer Content - Four columns */}
            <div className="grid grid-cols-4 gap-12 mb-16">
              {/* About us */}
              <div>
                <h3 className="text-lg font-semibold mb-6 font-bricolage">About us</h3>
                <ul className="space-y-4 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      The crisis of wastes
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Who we are
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      The change
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* What we do */}
              <div>
                <h3 className="text-lg font-semibold mb-6 font-bricolage">What we do</h3>
                <ul className="space-y-4 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      For businesses
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      For individual
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#4A90E2] transition-colors text-base">
                      For climate impact
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Living beings
                    </a>
                  </li>
                </ul>
              </div>

              {/* Our structure */}
              <div>
                <h3 className="text-lg font-semibold mb-6 font-bricolage">Our structure</h3>
                <ul className="space-y-4 text-[#d9d9d9]">
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Hardware
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Software
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white transition-colors text-base">
                      Manpower
                    </a>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="text-lg font-semibold mb-6 font-bricolage">Follow us</h3>
                <div className="flex space-x-4">
                  {/* Instagram */}
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">Instagram</span>
                    <img src="/images/instagram.svg" alt="Instagram" width="20" height="20" />
                  </a>

                  {/* X (Twitter) */}
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">X (Twitter)</span>
                    <img src="/images/x.svg" alt="X" width="20" height="20" />
                  </a>

                  {/* LinkedIn */}
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">LinkedIn</span>
                    <img src="/images/linkedin.svg" alt="LinkedIn" width="20" height="20" />
                  </a>

                  {/* YouTube */}
                  <a
                    href="#"
                    className="w-12 h-12 bg-[#333333] rounded-full flex items-center justify-center hover:bg-[#444444] transition-colors"
                  >
                    <span className="sr-only">YouTube</span>
                    <img src="/images/youtube.svg" alt="YouTube" width="20" height="14" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom section with copyright */}
            <div className="border-t border-[#333333] pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-[#888] text-sm">© 2024 Phrals. All rights reserved.</p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">
                    Terms of Service
                  </a>
                  <a href="#" className="text-[#888] hover:text-white transition-colors text-sm">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
