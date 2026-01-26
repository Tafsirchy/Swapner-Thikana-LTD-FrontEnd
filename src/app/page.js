import { ThemeToggle } from "@/components/theme-toggle";
import { Building2, MapPin, TrendingUp, Award, Users, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Premium Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* Logo - Gold Building on Dark */}
            <div className="flex items-center gap-3">
              <div className="relative">
                {/* Gold Building Icon with Glow */}
                <div className="absolute inset-0 bg-primary blur-xl opacity-30 animate-glow-pulse"></div>
                <Building2 className="h-10 w-10 text-primary relative z-10" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="text-foreground">Swapner</span>{" "}
                  <span className="text-gradient-gold">Thikana</span>
                </h1>
                <p className="text-xs text-muted-foreground tracking-wider">PREMIUM REAL ESTATE</p>
              </div>
            </div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Properties</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Projects</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">About</a>
              <a href="#" className="text-foreground hover:text-primary transition-colors font-medium">Contact</a>
            </nav>
            
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <button className="btn btn-primary hidden md:inline-flex">
                List Property
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Luxury Premium */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        {/* Background Gradient Overlay */}
        <div className="absolute inset-0 gradient-hero opacity-50"></div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
            {/* Main Headline with Gradient */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-gold mb-4">
                <Award className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Award-Winning Developer</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Your Dream Home
                <br />
                <span className="text-gradient-luxury">Awaits You</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Discover premium properties and luxury developments across Bangladesh with Swapner Thikana Ltd
              </p>
            </div>

            {/* Search Bar - Premium Glass Design */}
            <div className="max-w-3xl mx-auto">
              <div className="glass rounded-2xl p-3 shadow-luxury">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
                    <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Location (e.g., Dhaka, Uttara, Gulshan)"
                      className="flex-1 bg-transparent border-none outline-none text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                  <button className="btn btn-primary px-8 hover-scale">
                    <MapPin className="h-5 w-5" />
                    Search Properties
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground mt-1">Properties</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-secondary">50+</div>
                <div className="text-sm text-muted-foreground mt-1">Projects</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-accent">15+</div>
                <div className="text-sm text-muted-foreground mt-1">Years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">5K+</div>
                <div className="text-sm text-muted-foreground mt-1">Happy Clients</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-slide-in-up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">Swapner Thikana</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Bangladesh's most trusted real estate development company
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <div className="card-luxury group">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                <Building2 className="h-8 w-8 text-primary group-hover:text-primary-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Premium Properties</h3>
              <p className="text-muted-foreground leading-relaxed">
                Handpicked luxury apartments, houses, and commercial spaces in prime locations across Bangladesh.
              </p>
              <div className="mt-6 flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                <span className="font-medium">Explore Listings</span>
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="card-luxury group">
              <div className="h-16 w-16 rounded-2xl bg-secondary/10 flex items-center justify-center mb-6 group-hover:bg-secondary group-hover:scale-110 transition-all duration-300">
                <TrendingUp className="h-8 w-8 text-secondary group-hover:text-secondary-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Smart Investment</h3>
              <p className="text-muted-foreground leading-relaxed">
                Expert guidance and market insights to help you make informed real estate investment decisions.
              </p>
              <div className="mt-6 flex items-center gap-2 text-secondary group-hover:gap-3 transition-all">
                <span className="font-medium">Learn More</span>
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="card-luxury group">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
                <Users className="h-8 w-8 text-accent group-hover:text-accent-foreground transition-colors" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Trusted Service</h3>
              <p className="text-muted-foreground leading-relaxed">
                15+ years of excellence, 5000+ satisfied clients, and award-winning customer service.
              </p>
              <div className="mt-6 flex items-center gap-2 text-accent group-hover:gap-3 transition-all">
                <span className="font-medium">Read Reviews</span>
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Color Showcase */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="card-luxury max-w-4xl mx-auto">
            <h3 className="text-3xl font-bold mb-8 text-center">
              Swapner Thikana Ltd <span className="text-primary">Luxury Brand Palette</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Primary Gold */}
              <div className="text-center space-y-4">
                <div className="h-32 rounded-2xl bg-primary shadow-gold transition-all hover:scale-105"></div>
                <div>
                  <p className="font-semibold text-lg">Luxury Gold</p>
                  <p className="text-sm text-muted-foreground">#F59E0B</p>
                  <p className="text-xs text-muted-foreground mt-2">Premium • Highlights • Trust</p>
                </div>
              </div>

              {/* Secondary Emerald */}
              <div className="text-center space-y-4">
                <div className="h-32 rounded-2xl bg-secondary shadow-emerald transition-all hover:scale-105"></div>
                <div>
                  <p className="font-semibold text-lg">Emerald Green</p>
                  <p className="text-sm text-muted-foreground">#059669</p>
                  <p className="text-xs text-muted-foreground mt-2">Growth • Success • Luxury</p>
                </div>
              </div>

              {/* Accent Royal */}
              <div className="text-center space-y-4">
                <div className="h-32 rounded-2xl bg-accent shadow-luxury transition-all hover:scale-105"></div>
                <div>
                  <p className="font-semibold text-lg">Royal Blue</p>
                  <p className="text-sm text-muted-foreground">#2563EB</p>
                  <p className="text-xs text-muted-foreground mt-2">Innovation • Information • Tech</p>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-center text-muted-foreground flex items-center justify-center gap-2">
                <Building2 className="h-5 w-5 text-primary" />
                Toggle dark mode using the button above to experience the premium luxury theme
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-4 bg-card">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold">Swapner Thikana</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Bangladesh's premier real estate development company. Building dreams since 2009.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Properties</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Projects</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">About Us</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Contact</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <div className="space-y-2">
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Buy Property</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Sell Property</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Rent Property</a>
                <a href="#" className="block text-sm text-muted-foreground hover:text-secondary transition-colors">Investment</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Dhaka, Bangladesh</p>
                <p>+880 1XXX-XXXXXX</p>
                <p>info@swapnerthikana.com</p>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border text-center text-sm text-muted-foreground">
            <p>© 2026 Swapner Thikana Ltd. All rights reserved. | Premium Real Estate Development</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
