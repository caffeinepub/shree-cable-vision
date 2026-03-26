import {
  Award,
  CheckCircle,
  ChevronRight,
  Clock,
  Globe,
  Heart,
  Mail,
  MapPin,
  Menu,
  Monitor,
  Network,
  Package,
  Phone,
  Radio,
  Shield,
  Signal,
  Sparkles,
  Star,
  TrendingUp,
  Tv,
  Users,
  Wifi,
  X,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

// ── Scroll Reveal Hook ──────────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -50px 0px" },
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale",
    );
    for (const el of elements) {
      observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);
}

// ── Active Section Hook ─────────────────────────────────────────────────────
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { threshold: 0.35 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [ids]);

  return active;
}

// ── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({
  target,
  suffix = "+",
  duration = 2000,
}: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const step = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - (1 - progress) ** 3;
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

// ── Section Title with Gradient Underline ───────────────────────────────────
function SectionTitle({
  badge,
  badgeIcon: BadgeIcon,
  title,
  highlight,
  subtitle,
  dark = true,
}: {
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  highlight: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <div className="text-center mb-14 reveal">
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 border ${
          dark
            ? "bg-blue-600/20 border-blue-500/30 text-blue-300"
            : "bg-blue-600/15 border-blue-500/25 text-blue-700"
        }`}
      >
        <BadgeIcon size={14} /> {badge}
      </div>
      <div className="pb-6">
        <h2
          className={`font-display font-bold text-3xl sm:text-4xl lg:text-5xl mb-2 section-title-accent ${
            dark ? "text-white" : "text-navy-900"
          }`}
        >
          {title} <span className="gradient-text">{highlight}</span>
        </h2>
      </div>
      <p
        className={`text-lg max-w-2xl mx-auto ${
          dark ? "text-blue-200" : "text-blue-800"
        }`}
      >
        {subtitle}
      </p>
    </div>
  );
}

// ── Navbar ───────────────────────────────────────────────────────────────────
const NAV_SECTION_IDS = [
  "home",
  "partners",
  "offers",
  "plans",
  "achievements",
  "services",
  "contact",
];

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useActiveSection(NAV_SECTION_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const links = [
    { label: "Home", id: "home" },
    { label: "Partners", id: "partners" },
    { label: "Offers", id: "offers" },
    { label: "Plans", id: "plans" },
    { label: "Achievements", id: "achievements" },
    { label: "Services", id: "services" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 animate-nav transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo + Name */}
          <button
            type="button"
            className="flex items-center gap-3 cursor-pointer bg-transparent border-0 p-0 text-left"
            onClick={() => scrollTo("home")}
            data-ocid="nav.link"
          >
            <div
              className="flex-shrink-0 w-11 h-11 rounded-full overflow-hidden bg-white flex items-center justify-center"
              style={{
                boxShadow:
                  "0 0 0 2px rgba(29,106,255,0.5), 0 0 12px rgba(29,106,255,0.3)",
              }}
            >
              <img
                src="/assets/uploads/image-019d23cd-7729-7348-b7cf-ae0212b58bf5-1.png"
                alt="Shree Cable Vision Logo"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
            <div className="hidden sm:block">
              <div className="text-white font-display font-bold text-base leading-tight">
                Shree Cable Vision
              </div>
              <div className="text-blue-400 text-xs">
                High-Speed Internet & Cable
              </div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                data-ocid="nav.link"
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeSection === link.id
                    ? "nav-link-active text-blue-400"
                    : "text-blue-200 hover:text-white hover:bg-white/8"
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              data-ocid="nav.primary_button"
              className="ml-3 px-5 py-2 btn-gradient text-white text-sm font-semibold rounded-full"
            >
              Get Connected
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-white hover:text-blue-300 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div
            className="lg:hidden mobile-menu-enter pb-4 border-t border-blue-500/20 mt-1"
            style={{ background: "rgba(5, 13, 46, 0.97)" }}
          >
            {links.map((link) => (
              <button
                key={link.id}
                type="button"
                onClick={() => scrollTo(link.id)}
                className={`block w-full text-left px-6 py-3 text-sm font-medium transition-colors ${
                  activeSection === link.id
                    ? "text-blue-400 bg-blue-500/10"
                    : "text-blue-100 hover:text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </button>
            ))}
            <div className="px-6 pt-2">
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                className="w-full py-2.5 btn-gradient text-white text-sm font-semibold rounded-full"
              >
                Get Connection Now
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse 80% 60% at 50% -20%, #1a3a8a 0%, #0a1640 40%, #050d2e 70%)",
      }}
    >
      {/* Mesh gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 80% 50%, rgba(29,106,255,0.12) 0%, transparent 60%), radial-gradient(ellipse 50% 60% at 20% 80%, rgba(14,165,233,0.08) 0%, transparent 50%)",
        }}
      />

      {/* Animated Blobs */}
      <div
        className="blob animate-blob"
        style={{
          width: 600,
          height: 600,
          background: "#1e40af",
          top: "5%",
          left: "-15%",
        }}
      />
      <div
        className="blob animate-blob2"
        style={{
          width: 450,
          height: 450,
          background: "#1d6aff",
          bottom: "5%",
          right: "-8%",
          animationDelay: "2s",
        }}
      />
      <div
        className="blob animate-blob3"
        style={{
          width: 350,
          height: 350,
          background: "#0284c7",
          top: "40%",
          left: "55%",
          animationDelay: "4s",
        }}
      />

      {/* Glowing orb behind headline */}
      <div
        className="hero-glow-orb"
        style={{
          width: 700,
          height: 400,
          background:
            "radial-gradient(ellipse, rgba(29,106,255,0.22) 0%, transparent 70%)",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 0.8,
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge */}
          <div className="animate-fade-in-up hero-1 inline-flex items-center gap-2 px-5 py-2 rounded-full border border-blue-400/30 bg-blue-500/10 text-blue-300 text-sm font-medium mb-8">
            <Sparkles size={14} className="text-blue-400" />
            Trusted by 5000+ Customers across Tamil Nadu & Kerala
          </div>

          {/* Headline — large & bold */}
          <h1
            className="animate-fade-in-up hero-2 font-display font-bold leading-[1.05] mb-6 tracking-tight"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            <span className="text-white">High-Speed Internet &</span>
            <br />
            <span className="gradient-text">Reliable Cable</span>
            <span className="text-white"> Services</span>
          </h1>

          {/* Subheading */}
          <p className="animate-fade-in-up hero-3 text-blue-200 text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto mb-4 leading-relaxed">
            Connecting Tamil Nadu & Kerala with Fast, Affordable & Unlimited
            Plans
          </p>

          {/* Founder */}
          <p className="animate-fade-in-up hero-3 text-blue-300/80 text-sm sm:text-base mb-10">
            Founded by{" "}
            <span className="text-blue-200 font-semibold border-b border-blue-400/50">
              Shanmugharaj N
            </span>{" "}
            | Founder & CEO, Shree Cable Vision
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up hero-4 flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <button
              type="button"
              onClick={() => scrollTo("contact")}
              data-ocid="hero.primary_button"
              className="btn-gradient px-10 py-4 text-white font-bold text-lg rounded-full flex items-center justify-center gap-2"
            >
              Get Connection Now <ChevronRight size={20} />
            </button>
            <button
              type="button"
              onClick={() => scrollTo("plans")}
              data-ocid="hero.secondary_button"
              className="btn-outline-glow px-10 py-4 border-2 border-blue-500/70 text-white font-bold text-lg rounded-full flex items-center justify-center gap-2 bg-transparent"
            >
              View Plans <Zap size={20} />
            </button>
          </div>

          {/* Trusted by strip */}
          <div className="animate-fade-in-up hero-4 flex items-center justify-center gap-3 mb-16 flex-wrap">
            <span className="text-blue-400/70 text-xs uppercase tracking-widest font-semibold">
              Trusted Networks
            </span>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {["BSNL", "TIC", "Railwire", "Megnet", "KFON", "Skyplay"].map(
                (name) => (
                  <span
                    key={name}
                    className="px-3 py-1 rounded-full bg-white/5 border border-blue-500/20 text-blue-300 text-xs font-semibold"
                  >
                    {name}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="animate-fade-in-up hero-5 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { icon: Wifi, value: 4000, label: "Internet Customers" },
              { icon: Tv, value: 1000, label: "Cable TV Customers" },
              { icon: Network, value: 50, label: "LCOs" },
              { icon: Users, value: 9, label: "Skilled Staff" },
            ].map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="bg-white/5 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-4 hover:bg-blue-600/15 hover:border-blue-500/40 transition-colors"
              >
                <Icon size={24} className="text-blue-400 mx-auto mb-2" />
                <div className="text-3xl font-bold font-display text-white">
                  <AnimatedCounter target={value} />
                </div>
                <div className="text-blue-300 text-sm mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ── Partners ─────────────────────────────────────────────────────────────────
function Partners() {
  const broadband = [
    { name: "BSNL", icon: Signal },
    { name: "TIC", icon: Network },
    { name: "Megnet", icon: Globe },
    { name: "Railwire", icon: Zap },
    { name: "Fiber Flow", icon: Wifi },
    { name: "Kovai Fiber", icon: Signal },
    { name: "Skyplay", icon: Globe },
    { name: "KFON", icon: Network, tag: "Kerala Partner" },
    { name: "KCCL", icon: Shield, tag: "Kerala Partner" },
  ];

  const cableTV = [
    { name: "KCCL", desc: "Cable TV Partner – Kerala", icon: Tv },
    {
      name: "TCCL",
      desc: "Cable TV Partner – Tamil Nadu",
      icon: Tv,
      contact: "9443406721",
    },
  ];

  // Duplicate for seamless marquee
  const marqueeItems = [...broadband, ...broadband];

  return (
    <section id="partners" className="py-20 section-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Trusted Network Partners"
          badgeIcon={Shield}
          title="Our"
          highlight="Partners"
          subtitle="We work with India's most reliable network providers to deliver flexible, high-quality connectivity to every home."
          dark={false}
        />

        {/* Broadband Partners — Marquee */}
        <div className="mb-12">
          <h3
            className="font-semibold text-lg mb-6 flex items-center gap-2 reveal"
            style={{ color: "#1e4fc2" }}
          >
            <Wifi size={20} style={{ color: "#1d6aff" }} /> Broadband & Network
            Partners
          </h3>
          <div className="marquee-container">
            <div className="marquee-track animate-marquee">
              {marqueeItems.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="partner-card flex-shrink-0 w-36 bg-white border border-blue-200 rounded-2xl p-4 text-center cursor-default shadow-sm"
                >
                  <div className="w-11 h-11 rounded-full mx-auto mb-2 flex items-center justify-center bg-blue-50 border border-blue-200">
                    <p.icon size={20} style={{ color: "#1d6aff" }} />
                  </div>
                  <div
                    className="font-bold text-sm"
                    style={{ color: "#0a1628" }}
                  >
                    {p.name}
                  </div>
                  {p.tag && (
                    <span className="inline-block mt-1 px-2 py-0.5 bg-blue-100 border border-blue-300 text-blue-700 text-xs rounded-full">
                      {p.tag}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cable TV Partners */}
        <div>
          <h3
            className="font-semibold text-lg mb-6 flex items-center gap-2 reveal"
            style={{ color: "#1e4fc2" }}
          >
            <Tv size={20} style={{ color: "#1d6aff" }} /> Cable TV Partners
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {cableTV.map((p, i) => (
              <div
                key={p.name}
                className={`partner-card reveal stagger-${i + 1} bg-white border border-blue-200 rounded-2xl p-6 shadow-sm`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-50 border border-blue-200">
                    <p.icon size={26} style={{ color: "#1d6aff" }} />
                  </div>
                  <div>
                    <div
                      className="font-bold text-lg"
                      style={{ color: "#0a1628" }}
                    >
                      {p.name}
                    </div>
                    <div className="text-sm" style={{ color: "#1e4fc2" }}>
                      {p.desc}
                    </div>
                  </div>
                </div>
                {p.contact && (
                  <div
                    className="flex items-center gap-2 text-sm"
                    style={{ color: "#1e4fc2" }}
                  >
                    <Phone size={14} style={{ color: "#1d6aff" }} />
                    <span>
                      Cable TN Contact:{" "}
                      <span
                        className="font-semibold"
                        style={{ color: "#0a1628" }}
                      >
                        {p.contact}
                      </span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Exclusive Deals ──────────────────────────────────────────────────────────
function ExclusiveDeals() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="offers" className="py-20 deals-bg relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-blue-500/5 -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-blue-500/5 translate-y-1/2 -translate-x-1/2" />
      {/* Hero glow orb */}
      <div
        className="hero-glow-orb"
        style={{
          width: 600,
          height: 300,
          background:
            "radial-gradient(ellipse, rgba(29,106,255,0.15) 0%, transparent 70%)",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/15 text-blue-200 text-sm font-semibold mb-4 border border-blue-400/30">
            <Star size={14} className="fill-blue-400 text-blue-400" /> Limited
            Time Offers
          </div>
          <div className="pb-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-2 section-title-accent">
              Exclusive Deals & <span className="gradient-text">Offers</span>
            </h2>
          </div>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto">
            Exciting offers available for a limited time – contact us now to
            know more!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            {
              icon: Zap,
              title: "Free Network Switch",
              desc: "Customers can easily switch to other networks without any extra cost. No hidden charges, no hassle!",
              highlight: true,
            },
            {
              icon: Star,
              title: "Special Date Offers",
              desc: "Exciting promotional deals available on festivals, special occasions, and selected dates. Stay connected for exclusive discounts!",
              highlight: false,
            },
            {
              icon: Heart,
              title: "Contact Us for Latest Deals",
              desc: "Call us today to get the latest offers tailored to your needs. Our team is ready to find the best plan for you!",
              highlight: false,
            },
          ].map(({ icon: Icon, title, desc, highlight }, i) => (
            <div
              key={title}
              className={`reveal stagger-${i + 1} rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 ${
                highlight
                  ? "bg-blue-600/25 border-2 border-blue-400/60 shadow-[0_8px_30px_rgba(29,106,255,0.3)]"
                  : "bg-white/6 border border-blue-500/20"
              }`}
            >
              <div
                className={`w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                  highlight
                    ? "bg-blue-500/30 border-2 border-blue-400/50"
                    : "bg-white/10"
                }`}
              >
                <Icon size={30} className="text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-white">{title}</h3>
              <p className="text-blue-200 text-sm leading-relaxed">{desc}</p>
              {highlight && (
                <span className="inline-block mt-3 px-3 py-1 bg-blue-500/30 text-blue-200 text-xs font-semibold rounded-full border border-blue-400/40">
                  ✓ Zero Extra Cost
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="text-center reveal">
          <button
            type="button"
            onClick={() => scrollTo("contact")}
            data-ocid="offers.primary_button"
            className="btn-gradient px-8 py-4 text-white font-bold text-lg rounded-full"
          >
            Contact Us for Offers
          </button>
        </div>
      </div>
    </section>
  );
}

// ── Plans ─────────────────────────────────────────────────────────────────────
const plans = [
  {
    speed: "20 Mbps",
    price: 299,
    popular: false,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "HD Streaming",
      "Basic Support",
    ],
  },
  {
    speed: "50 Mbps",
    price: 425,
    popular: false,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "OTT Access",
      "HD Streaming",
      "Standard Support",
    ],
  },
  {
    speed: "100 Mbps",
    price: 599,
    popular: true,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "OTT Access",
      "IPTV",
      "HD Streaming",
      "Priority Support",
    ],
  },
  {
    speed: "150 Mbps",
    price: 666,
    popular: false,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "OTT Access",
      "IPTV",
      "HD Streaming",
      "Priority Support",
    ],
  },
  {
    speed: "200 Mbps",
    price: 999,
    popular: false,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "OTT Access",
      "IPTV",
      "HD Streaming",
      "Priority Support",
      "Dedicated Line",
    ],
  },
  {
    speed: "300 Mbps",
    price: 1299,
    popular: false,
    features: [
      "Unlimited Data",
      "Voice Calls",
      "OTT Access",
      "IPTV",
      "HD Streaming",
      "Priority Support",
      "Dedicated Line",
    ],
  },
];

function Plans() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="plans" className="py-20 section-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="Flexible Plans"
          badgeIcon={Zap}
          title="Flexible Plans for"
          highlight="Every Need"
          subtitle="Choose the perfect internet plan. All plans include unlimited data with no FUP limits."
          dark={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {plans.map((plan, i) => (
            <div
              key={plan.speed}
              data-ocid={`plans.item.${i + 1}`}
              className={`plan-card reveal stagger-${(i % 3) + 1} relative rounded-2xl p-6 border ${
                plan.popular
                  ? "plan-card-popular border-blue-500 bg-blue-600/20"
                  : "border-blue-200 bg-white shadow-sm"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 popular-badge text-white text-xs font-bold rounded-full whitespace-nowrap">
                  ⭐ Most Popular
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div
                    className={`text-sm font-medium ${plan.popular ? "text-blue-300" : ""}`}
                    style={{ color: plan.popular ? undefined : "#1e4fc2" }}
                  >
                    Speed
                  </div>
                  <div
                    className={`font-display font-bold text-2xl ${plan.popular ? "text-white" : ""}`}
                    style={{ color: plan.popular ? undefined : "#0a1628" }}
                  >
                    {plan.speed}
                  </div>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-600/20 border border-blue-500/40">
                  <Wifi size={22} className="text-blue-400" />
                </div>
              </div>
              <div className="mb-5">
                <span
                  className={`text-4xl font-display font-bold ${plan.popular ? "text-white" : ""}`}
                  style={{ color: plan.popular ? undefined : "#0a1628" }}
                >
                  ₹{plan.price}
                </span>
                <span
                  className={`text-sm ml-1 ${plan.popular ? "text-blue-300" : ""}`}
                  style={{ color: plan.popular ? undefined : "#1e4fc2" }}
                >
                  /month
                </span>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className={`flex items-center gap-2 text-sm ${plan.popular ? "text-blue-200" : ""}`}
                    style={{ color: plan.popular ? undefined : "#1e3a5f" }}
                  >
                    <CheckCircle
                      size={15}
                      className="text-blue-400 flex-shrink-0"
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={() => scrollTo("contact")}
                data-ocid="plans.primary_button"
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  plan.popular
                    ? "btn-gradient text-white"
                    : "border-2 border-blue-500 text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
                }`}
              >
                Get This Plan
              </button>
            </div>
          ))}
        </div>

        <p
          className="text-center text-sm mb-12 reveal"
          style={{ color: "#1e4fc2" }}
        >
          * Pricing may vary based on provider and location. 18% GST applicable
          on all plans.
        </p>

        {/* Pricing Chart — shown exactly once */}
        <div className="reveal">
          <h3
            className="text-center font-bold text-xl mb-6"
            style={{ color: "#0a1628" }}
          >
            Detailed Pricing Chart
          </h3>
          <div className="flex justify-center">
            <img
              src="/assets/uploads/image-019d2593-7c9b-76b6-9a4b-d9c8a62422e5-1.png"
              alt="Pricing chart"
              className="max-w-2xl w-full rounded-xl border border-blue-200 object-contain bg-white shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Achievements ─────────────────────────────────────────────────────────────
function Achievements() {
  const awards = [
    {
      icon: Award,
      title: "BSNL 25th Year Silver Jubilee Best LCO Award",
      year: "2025",
      desc: "Recognized as the Best Local Cable Operator during BSNL's prestigious 25th Silver Jubilee celebration.",
    },
    {
      icon: TrendingUp,
      title: "Best Performer in FTTH Segment",
      year: "2023–2024",
      desc: "Top performer in the Fiber-to-the-Home segment, Pollachi SDCA, awarded by BSNL.",
    },
    {
      icon: Star,
      title: "Best Performance in Cluster Mission Mode Provisioning",
      year: "2023–24",
      desc: "BSNL award for outstanding cluster mission mode provisioning at Pollachi SDCA.",
    },
    {
      icon: Globe,
      title: "Top Connect Provider in Coimbatore OD",
      year: "2023–24",
      desc: "Recognized as the leading connectivity provider in the Coimbatore Optical Distribution zone.",
    },
  ];

  return (
    <section
      id="achievements"
      className="py-20 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #050d2e 0%, #0f1a0a 50%, #050d2e 100%)",
      }}
    >
      <div
        className="blob"
        style={{
          width: 450,
          height: 450,
          background: "#f59e0b",
          top: "15%",
          right: "-8%",
          opacity: 0.07,
        }}
      />
      <div
        className="blob"
        style={{
          width: 350,
          height: 350,
          background: "#fcd34d",
          bottom: "5%",
          left: "-5%",
          opacity: 0.05,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/15 border border-yellow-400/40 text-yellow-300 text-sm font-semibold mb-4">
            <Award size={14} className="text-yellow-400" /> Award-Winning
            Service
          </div>
          <div className="pb-6">
            <h2
              className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-2 section-title-accent"
              style={
                {
                  "--tw-section-accent-color": "#f59e0b",
                } as React.CSSProperties
              }
            >
              Our <span className="gold-text">Achievements</span>
            </h2>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            Recognized by India's top telecom authorities for excellence,
            performance, and service quality.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {awards.map((award, i) => (
            <div
              key={award.title}
              data-ocid={`achievements.item.${i + 1}`}
              className={`achievement-card reveal stagger-${i + 1} rounded-2xl p-6 border border-yellow-400/15 bg-yellow-400/5`}
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-yellow-400/15 border-2 border-yellow-400/40">
                  <award.icon size={28} className="text-yellow-400" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-yellow-400 font-bold text-lg leading-tight">
                      {award.year}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-yellow-400/15 text-yellow-300 text-xs border border-yellow-400/30">
                      BSNL Award
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-base mb-2 leading-snug">
                    {award.title}
                  </h3>
                  <p className="text-blue-200 text-sm leading-relaxed">
                    {award.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center reveal">
          <div className="inline-flex items-center gap-3 bg-yellow-400/10 border border-yellow-400/30 rounded-2xl px-8 py-4">
            <Award size={24} className="text-yellow-400" />
            <span className="text-yellow-300 font-semibold">
              BSNL Certified & Award-Winning LCO — Shree Cable Vision
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Services ──────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon: Wifi,
      title: "High-Speed Broadband Internet",
      desc: "Stable, fast, and reliable internet for homes and businesses. Enjoy uninterrupted connectivity with the best in-class technology.",
      badge: null,
    },
    {
      icon: Tv,
      title: "Cable TV Services",
      desc: "Quality channels with clear picture and affordable cable connection. Available in Kinathukadavu, Pollachi, and Kozhinjampara (Kerala). Plans from ₹250.",
      badge: "From ₹250",
    },
    {
      icon: Monitor,
      title: "IPTV Services",
      desc: "Advanced digital entertainment and live streaming. Watch your favourite channels in HD on any device, anytime.",
      badge: null,
    },
    {
      icon: Globe,
      title: "OTT Services",
      desc: "Modern entertainment access to popular OTT platforms for streaming convenience. Enjoy the best content on demand.",
      badge: null,
    },
    {
      icon: Package,
      title: "Combo Plans",
      desc: "All-in-one packages combining Internet + Cable TV + IPTV + OTT for maximum value at the best price. One connection, unlimited entertainment.",
      badge: "Best Value",
    },
  ];

  return (
    <section id="services" className="py-20 section-mid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          badge="What We Offer"
          badgeIcon={Globe}
          title="Our"
          highlight="Services"
          subtitle="Comprehensive digital connectivity solutions for homes and businesses across Tamil Nadu and Kerala."
          dark={false}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((s, i) => (
            <div
              key={s.title}
              data-ocid={`services.item.${i + 1}`}
              className={`service-card reveal stagger-${(i % 3) + 1} relative rounded-2xl p-6 bg-white border border-blue-100 cursor-default shadow-sm`}
            >
              {s.badge && (
                <span
                  className="absolute top-4 right-4 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 border border-blue-300"
                  style={{ color: "#1e4fc2" }}
                >
                  {s.badge}
                </span>
              )}
              <div className="w-14 h-14 rounded-2xl mb-4 flex items-center justify-center bg-blue-50 border border-blue-200">
                <s.icon size={28} style={{ color: "#1d6aff" }} />
              </div>
              <h3
                className="font-bold text-lg mb-3"
                style={{ color: "#0a1628" }}
              >
                {s.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "#1e3a5f" }}
              >
                {s.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="reveal bg-white border border-blue-200 rounded-2xl p-6 text-center shadow-sm">
          <div
            className="flex items-center justify-center gap-2 mb-2"
            style={{ color: "#1e4fc2" }}
          >
            <MapPin size={16} style={{ color: "#1d6aff" }} />
            <span className="font-semibold">Cable TV Service Areas</span>
          </div>
          <p className="font-bold text-lg" style={{ color: "#0a1628" }}>
            Kinathukadavu · Pollachi · Kozhinjampara, Kerala
          </p>
          <p className="text-sm mt-1" style={{ color: "#1e4fc2" }}>
            Cable TV plans start from just ₹250/month
          </p>
        </div>
      </div>
    </section>
  );
}

// ── Contact ───────────────────────────────────────────────────────────────────
function Contact() {
  return (
    <section id="contact" className="py-20 section-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 reveal">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-medium mb-4">
            <Phone size={14} /> Reach Us
          </div>
          <div className="pb-6">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-2 section-title-accent">
              Get in <span className="gradient-text">Touch</span>
            </h2>
          </div>
          <p className="text-blue-200 text-lg max-w-2xl mx-auto">
            We're here to help. Reach out for new connections, plan upgrades, or
            any support queries.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Contact Info */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Email */}
            <div className="reveal reveal-left bg-blue-950/40 border border-blue-700/40 rounded-2xl p-6 flex items-start gap-4 hover:border-blue-500/60 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <Mail size={22} className="text-blue-400" />
              </div>
              <div>
                <div className="text-blue-300 text-sm font-medium mb-1">
                  Email
                </div>
                <a
                  href="mailto:shreecablevision96@gmail.com"
                  className="text-white font-semibold text-sm hover:text-blue-300 transition-colors break-all"
                  data-ocid="contact.link"
                >
                  shreecablevision96@gmail.com
                </a>
              </div>
            </div>

            {/* Phone 1 */}
            <div className="reveal reveal-left stagger-1 bg-blue-950/40 border border-blue-700/40 rounded-2xl p-6 flex items-start gap-4 hover:border-blue-500/60 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <Phone size={22} className="text-blue-400" />
              </div>
              <div>
                <div className="text-blue-300 text-sm font-medium mb-1">
                  Phone 1
                </div>
                <a
                  href="tel:+919597726668"
                  className="text-white font-semibold hover:text-blue-300 transition-colors"
                  data-ocid="contact.link"
                >
                  +91 95977 26668
                </a>
              </div>
            </div>

            {/* Phone 2 — Important */}
            <div
              className="reveal reveal-left stagger-2 bg-blue-950/40 border border-blue-500/40 rounded-2xl p-6 flex items-start gap-4 hover:border-blue-500/60 transition-colors"
              style={{ boxShadow: "0 0 0 1px rgba(29,106,255,0.25)" }}
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/30 border border-blue-400/50 flex items-center justify-center flex-shrink-0">
                <Phone size={22} className="text-blue-300" />
              </div>
              <div>
                <div className="text-blue-300 text-sm font-medium mb-1 flex items-center gap-1">
                  Phone 2{" "}
                  <span className="text-blue-200 text-xs font-bold bg-blue-600/30 px-1.5 py-0.5 rounded">
                    Important
                  </span>
                </div>
                <a
                  href="tel:+919095748780"
                  className="text-white font-semibold hover:text-blue-300 transition-colors"
                  data-ocid="contact.link"
                >
                  +91 90957 48780
                </a>
              </div>
            </div>

            {/* Phone 3 */}
            <div className="reveal reveal-left stagger-3 bg-blue-950/40 border border-blue-700/40 rounded-2xl p-6 flex items-start gap-4 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <Phone size={22} className="text-blue-400" />
              </div>
              <div>
                <div className="text-blue-300 text-sm font-medium mb-1">
                  Phone 3
                </div>
                <a
                  href="tel:+919789618629"
                  className="text-white font-semibold hover:text-blue-300 transition-colors"
                  data-ocid="contact.link"
                >
                  +91 97896 18629
                </a>
              </div>
            </div>
          </div>

          {/* Hours + Areas */}
          <div className="space-y-5">
            {/* Hours */}
            <div className="reveal reveal-right bg-blue-950/40 border border-blue-700/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                  <Clock size={20} className="text-blue-400" />
                </div>
                <div className="text-white font-bold">Office Hours</div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-blue-200">
                  <span>Mon – Sat</span>
                  <span className="text-white font-semibold">
                    9:00 AM – 6:00 PM
                  </span>
                </div>
                <div className="flex justify-between text-blue-200">
                  <span>Sunday</span>
                  <span className="text-blue-300 font-semibold">Holiday</span>
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2 text-blue-300 text-xs">
                  <CheckCircle size={13} /> Emergency support available if
                  needed
                </div>
              </div>
            </div>

            {/* Service Areas */}
            <div className="reveal reveal-right stagger-2 bg-blue-950/40 border border-blue-700/40 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                  <MapPin size={20} className="text-blue-400" />
                </div>
                <div className="text-white font-bold">Service Areas</div>
              </div>
              <ul className="space-y-2">
                {[
                  "Pollachi Town & Surroundings",
                  "Kinathukadavu Town & Surroundings",
                  "Kozhinjampara, Kerala",
                  "Top Slip Hill Area",
                ].map((area) => (
                  <li
                    key={area}
                    className="flex items-center gap-2 text-blue-200 text-sm"
                  >
                    <CheckCircle
                      size={13}
                      className="text-blue-400 flex-shrink-0"
                    />
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="footer-gradient-top" style={{ background: "#030b1e" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-12 h-12 rounded-full overflow-hidden bg-white flex-shrink-0"
                style={{
                  boxShadow:
                    "0 0 0 2px rgba(29,106,255,0.5), 0 0 12px rgba(29,106,255,0.3)",
                }}
              >
                <img
                  src="/assets/uploads/image-019d23cd-7729-7348-b7cf-ae0212b58bf5-1.png"
                  alt="Shree Cable Vision"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
              <div>
                <div className="text-white font-display font-bold text-xl">
                  Shree Cable Vision
                </div>
                <div className="text-blue-400 text-xs">
                  High-Speed Internet & Reliable Cable Services
                </div>
              </div>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed mb-4 max-w-md">
              Shree Cable Vision – Connecting Tamil Nadu & Kerala with fast,
              affordable, and unlimited internet and cable services. Founded by
              Shanmugharaj N.
            </p>
            <div className="flex flex-col gap-1 text-sm">
              <a
                href="mailto:shreecablevision96@gmail.com"
                className="text-blue-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Mail size={14} /> shreecablevision96@gmail.com
              </a>
              <a
                href="tel:+919597726668"
                className="text-blue-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Phone size={14} /> +91 95977 26668
              </a>
              <a
                href="tel:+919095748780"
                className="text-blue-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <Phone size={14} /> +91 90957 48780
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Home", id: "home" },
                { label: "Our Partners", id: "partners" },
                { label: "Offers", id: "offers" },
                { label: "Plans", id: "plans" },
                { label: "Achievements", id: "achievements" },
                { label: "Services", id: "services" },
                { label: "Contact", id: "contact" },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    onClick={() => scrollTo(link.id)}
                    className="text-blue-300 hover:text-white transition-colors text-sm flex items-center gap-1"
                  >
                    <ChevronRight size={12} /> {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h3 className="text-white font-bold mb-5 text-sm uppercase tracking-wider">
              Service Areas
            </h3>
            <ul className="space-y-2">
              {[
                "Pollachi Town",
                "Kinathukadavu Town",
                "Kozhinjampara, Kerala",
                "Top Slip Hill Area",
              ].map((a) => (
                <li
                  key={a}
                  className="text-blue-300 text-sm flex items-start gap-1"
                >
                  <MapPin
                    size={13}
                    className="text-blue-400 flex-shrink-0 mt-0.5"
                  />{" "}
                  {a}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <h4 className="text-white font-semibold text-sm mb-2">
                Cable Available In
              </h4>
              <p className="text-blue-300 text-xs">
                Kinathukadavu · Pollachi · Kozhinjampara
              </p>
              <p className="text-blue-300 text-xs mt-1">
                Plans from ₹250/month
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-blue-400 text-sm text-center sm:text-left">
            © {year} Shree Cable Vision. Founded by{" "}
            <span className="text-white">Shanmugharaj N</span>. All rights
            reserved.
          </p>
          <p className="text-blue-400 text-xs text-center">
            © {year}. Built with{" "}
            <Heart size={12} className="inline text-blue-400" /> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:text-white transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  useScrollReveal();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Partners />
        <ExclusiveDeals />
        <Plans />
        <Achievements />
        <Services />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
