
import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, ShieldCheck, Zap, TrendingUp, FileText, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ModeToggle } from "@/components/mode-toggle";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">

            {/* Navigation */}
            <nav className="border-b border-border/40 backdrop-blur-md fixed top-0 w-full z-50 bg-background/50">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <code className="text-primary">FA</code>
                        </div>
                        <span>Fin-Analysis</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
                            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
                            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
                        </div>
                        <div className="flex items-center gap-2">
                            <ModeToggle />
                            <Link to="/login">
                                <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">Log in</Button>
                            </Link>
                            <Link to="/signup">
                                <Button size="sm" className="shadow-lg shadow-primary/20">Get Started</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 pt-16">

                {/* Hero Section */}
                <section className="relative py-24 lg:py-32 overflow-hidden flex items-center justify-center min-h-[80vh]">
                    <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,black)] -z-10" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full opacity-50" />

                    <div className="container mx-auto px-4 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                            className="max-w-3xl mx-auto"
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary border border-secondary/50 mb-8 text-xs font-semibold uppercase tracking-wider text-secondary-foreground shadow-sm">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                AI-Powered Financial Intelligence
                            </div>

                            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
                                Financial Integrity, <br />
                                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Verified.</span>
                            </h1>

                            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
                                Detect anomalies, fraud, and irregularities in your financial data instantly using advanced forensics and machine learning.
                            </p>

                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/signup">
                                    <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all">
                                        Start Analyzing Free
                                        <ArrowRight className="ml-2 size-5" />
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Brief Features - Neat & Attractive */}
                <section id="features" className="py-24 border-t border-border/50 bg-secondary/5">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">What We Offer</h2>
                            <p className="text-muted-foreground">Comprehensive tools to secure your financial data and uncover hidden insights.</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    icon: BarChart3,
                                    title: "Benford's Law",
                                    description: "Mathematical validation of data integrity."
                                },
                                {
                                    icon: ShieldCheck,
                                    title: "Anomaly Detection",
                                    description: "Auto-flag suspicious transactions & outliers."
                                },
                                {
                                    icon: Zap,
                                    title: "Instant Insights",
                                    description: "AI-generated risk reports in seconds."
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Trend Analysis",
                                    description: "Visualize spending patterns over time."
                                },
                                {
                                    icon: FileText,
                                    title: "Export PDF Reports",
                                    description: "Download professional reports for your records."
                                },
                                {
                                    icon: History,
                                    title: "Secure History",
                                    description: "Access and review your past analyses anytime."
                                }
                            ].map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="flex flex-col items-center text-center space-y-4"
                                >
                                    <div className="size-16 rounded-2xl bg-background border border-border shadow-sm flex items-center justify-center text-primary">
                                        <feature.icon className="size-8" />
                                    </div>
                                    <h3 className="text-xl font-bold">{feature.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed max-w-xs">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works Section */}
                <section id="how-it-works" className="py-24 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16 max-w-2xl mx-auto">
                            <h2 className="text-3xl font-bold tracking-tight mb-4">Simple, Powerful Workflow</h2>
                            <p className="text-muted-foreground">From raw data to actionable insights in three simple steps.</p>
                        </div>

                        <div className="relative grid md:grid-cols-3 gap-8">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-border -z-10 hidden md:block" />

                            {[1, 2, 3].map((step) => (
                                <div key={step} className="bg-background border border-border/50 p-8 rounded-2xl relative shadow-sm">
                                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 size-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl ring-4 ring-background">
                                        {step}
                                    </div>
                                    <h3 className="text-xl font-semibold mt-4 mb-2 text-center">
                                        {step === 1 ? "Upload Data" : step === 2 ? "AI Analysis" : "View Intelligence"}
                                    </h3>
                                    <p className="text-center text-muted-foreground text-sm">
                                        {step === 1 ? "Drag & drop your CSV or Excel files securely." :
                                            step === 2 ? "Our engine checks for fraud using Benford's Law." :
                                                "Get a detailed dashboard with trends and flagged risks."}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>

            <footer className="py-6 border-t border-border bg-background">
                <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                    <p>© 2026 Fin-Analysis. Built for security.</p>
                </div>
            </footer>
        </div>
    );
}
