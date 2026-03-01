import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Shield, BarChart3 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-24 pb-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 z-0">
            <div className="absolute top-0 right-0 w-1/2 h-[600px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-[600px] bg-blue-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              Introducing Mr DocGen Reports 2.0
            </motion.div>
            
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-5xl md:text-7xl font-extrabold text-foreground tracking-tight max-w-4xl mx-auto leading-tight"
            >
              Professional Insights, <br/>
              <span className="text-gradient">Generated in Seconds.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Transform your raw data into board-ready reports automatically. Save hours of manual compilation and focus on what matters: the strategy.
            </motion.p>
            
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/login">
                <Button size="lg" className="rounded-full px-8 h-14 text-base shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all">
                  Start Creating Reports
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base hover:bg-secondary transition-colors">
                View Live Demo
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to report better</h2>
              <p className="text-muted-foreground text-lg">Powerful features wrapped in a beautifully simple interface designed for modern teams.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: "Lightning Fast", desc: "Generate comprehensive documents instantly without the wait." },
                { icon: Shield, title: "Enterprise Security", desc: "Bank-grade encryption ensures your strategic data remains yours alone." },
                { icon: BarChart3, title: "Actionable Insights", desc: "Don't just get data, get clear strategic recommendations." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-card p-8 rounded-2xl border shadow-lg shadow-black/5 hover-elevate"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
              <p className="text-muted-foreground text-lg">Choose the perfect plan for your team's reporting needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                { name: "Basic", price: "$29", desc: "Perfect for individuals and small teams.", features: ["50 Reports/month", "Standard Templates", "Email Support", "7-day History"] },
                { name: "Pro", price: "$99", desc: "For growing organizations needing more power.", features: ["Unlimited Reports", "Custom Branding", "Priority Support", "Unlimited History", "Advanced Analytics"], popular: true },
                { name: "Enterprise", price: "Custom", desc: "Dedicated solutions for large enterprises.", features: ["Everything in Pro", "Dedicated Account Manager", "SSO/SAML", "Custom Integrations", "SLA Guarantee"] }
              ].map((plan, i) => (
                <motion.div 
                  key={i}
                  initial={{ y: 30, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className={`bg-card rounded-3xl p-8 border relative flex flex-col ${plan.popular ? 'shadow-2xl shadow-primary/10 ring-2 ring-primary scale-105 z-10' : 'shadow-lg hover-elevate'}`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-muted-foreground mb-6 h-12">{plan.desc}</p>
                  <div className="mb-6">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    {plan.price !== "Custom" && <span className="text-muted-foreground">/mo</span>}
                  </div>
                  
                  <ul className="space-y-4 mb-8 flex-1">
                    {plan.features.map((feat, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-foreground font-medium">{feat}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    variant={plan.popular ? "default" : "outline"} 
                    className="w-full rounded-xl py-6 text-base"
                  >
                    {plan.price === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
