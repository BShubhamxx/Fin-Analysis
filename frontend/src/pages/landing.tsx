import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    BarChart3,
    Check,
    ChevronDown,
    CircleDollarSign,
    FileSearch,
    LockKeyhole,
    Menu,
    MoveUpRight,
    ScanSearch,
    ShieldCheck,
    Sparkles,
    TrendingUp,
    Upload,
    X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import Logo from "@/assets/logo.svg";

const features = [
    { number: "01", icon: ScanSearch, title: "Find the signal", description: "Surface anomalies, duplicate payments, and unusual patterns before they become expensive surprises." },
    { number: "02", icon: ShieldCheck, title: "Validate with confidence", description: "Use Benford's Law and forensic checks to separate a messy ledger from a risky one." },
    { number: "03", icon: Sparkles, title: "Move from data to decision", description: "Get an explainable risk summary and the next best action in seconds, not spreadsheets of guesswork." },
];

const workflow = [
    { number: "01", title: "Upload your data", description: "Drop in a CSV or Excel export. Your original file stays untouched." },
    { number: "02", title: "Run the checks", description: "Our analysis engine scans transactions for integrity, outliers, and risk." },
    { number: "03", title: "Act with clarity", description: "Review a focused dashboard, then export a report your team can trust." },
];

function SignalBars() {
    const bars = [30, 48, 40, 68, 54, 78, 66, 86, 72, 92, 83, 96, 89, 100];
    return (
        <div className="flex h-24 items-end gap-1.5" aria-label="Integrity trend rising">
            {bars.map((height, index) => (
                <motion.span key={`bar-${index}`} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ delay: index * 0.045, duration: 0.5, ease: "easeOut" }} className={`w-full rounded-t-sm ${index > 9 ? "bg-[#9af36f]" : "bg-white/20"}`} />
            ))}
        </div>
    );
}

function AnalysisPreview() {
    return (
        <div className="analysis-preview relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b0c0d] text-left shadow-2xl shadow-black/40">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#9af36f] to-transparent opacity-70" />
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40"><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#9af36f] shadow-[0_0_10px_#9af36f]" /> analysis / live</span><span>fin-analysis_01</span></div>
            <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.05fr_.95fr]">
                <div>
                    <div className="mb-7 flex items-start justify-between"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">Integrity score</p><p className="mt-2 text-5xl font-light tracking-[-0.08em] text-white sm:text-6xl">94.8<span className="ml-1 text-2xl text-[#9af36f]">%</span></p></div><div className="rounded-full border border-[#9af36f]/30 bg-[#9af36f]/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[#baff9a]">low risk</div></div>
                    <SignalBars />
                    <div className="mt-3 flex justify-between font-mono text-[9px] uppercase tracking-widest text-white/25"><span>Jan</span><span>Jun</span><span>Dec</span></div>
                </div>
                <div className="grid grid-cols-2 gap-2 self-end">{[["32,418", "rows scanned", "text-white"], ["126", "flags found", "text-[#ffb86b]"], ["$2.4M", "value reviewed", "text-white"], ["18 sec", "time to insight", "text-[#9af36f]"]].map(([value, label, color]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.035] p-4"><p className={`font-mono text-xl tracking-[-0.06em] ${color}`}>{value}</p><p className="mt-2 font-mono text-[9px] uppercase tracking-wider text-white/35">{label}</p></div>)}</div>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 bg-white/[0.025] px-5 py-3 font-mono text-[10px] text-white/40"><span className="flex items-center gap-2"><Check className="size-3 text-[#9af36f]" /> benford check passed</span><span className="flex items-center gap-2"><Check className="size-3 text-[#9af36f]" /> duplicate scan passed</span><span className="flex items-center gap-2"><span className="size-1.5 rounded-full bg-[#ffb86b]" /> 4 items need review</span></div>
        </div>
    );
}

export default function LandingPage() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="landing-page min-h-screen overflow-x-hidden bg-[#050505] font-sans text-[#f4f4f0] selection:bg-[#9af36f]/30 selection:text-white">
            <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#050505]/75 backdrop-blur-xl">
                <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-6 lg:px-10">
                    <Link to="/" className="flex items-center gap-3" aria-label="Fin-Analysis home"><img src={Logo} alt="" className="size-8" /><span className="text-sm font-semibold tracking-[0.16em] text-white">FIN<span className="text-white/35">/</span>ANALYSIS</span></Link>
                    <div className="hidden items-center gap-9 md:flex"><a href="#features" className="nav-link">our approach</a><a href="#workflow" className="nav-link">workflow</a><a href="#features" className="nav-link">features</a><a href="#about" className="nav-link">about</a></div>
                    <div className="flex items-center gap-2 sm:gap-3"><ModeToggle /><Link to="/login" className="hidden text-xs font-medium text-white/65 transition-colors hover:text-white sm:block">log in</Link><Link to="/signup" className="hidden sm:block"><Button className="h-9 rounded-none bg-[#f4f4f0] px-4 text-[11px] font-semibold uppercase tracking-wider text-black hover:bg-[#9af36f]">get started <ArrowUpRight className="ml-2 size-3.5" /></Button></Link><button type="button" className="ml-1 rounded-full p-2 text-white/70 md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? "Close menu" : "Open menu"}>{menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}</button></div>
                </div>
                {menuOpen && <div className="border-t border-white/10 bg-[#080909] px-6 py-5 md:hidden"><div className="flex flex-col gap-5 text-sm text-white/65"><a href="#features" onClick={() => setMenuOpen(false)}>our approach</a><a href="#workflow" onClick={() => setMenuOpen(false)}>workflow</a><a href="#about" onClick={() => setMenuOpen(false)}>about</a><Link to="/signup" className="text-[#9af36f]">get started <ArrowUpRight className="inline size-3.5" /></Link></div></div>}
            </nav>

            <main>
                <section className="landing-hero relative flex min-h-[780px] items-center overflow-hidden px-6 pb-20 pt-36 lg:min-h-[900px] lg:px-10 lg:pt-44">
                    <div className="landing-grid absolute inset-0 opacity-60" /><div className="hero-glow hero-glow-blue absolute left-1/2 top-[27%] size-[520px] -translate-x-1/2 rounded-full" /><div className="hero-orbit absolute left-1/2 top-[28%] size-[360px] -translate-x-1/2 rounded-full border border-[#72a2ff]/20" /><div className="hero-orbit hero-orbit-delayed absolute left-1/2 top-[28%] size-[500px] -translate-x-1/2 rounded-full border border-[#9af36f]/10" />
                    <div className="absolute left-[10%] top-[30%] hidden font-mono text-[10px] leading-5 text-[#9af36f]/45 lg:block">risk_score = 0.052<br />confidence = 94.8%</div><div className="absolute right-[9%] top-[42%] hidden font-mono text-[10px] leading-5 text-[#72a2ff]/45 lg:block">scan(ledger)<br />-&gt; anomalies: 04</div>
                    <div className="relative z-10 mx-auto w-full max-w-[1320px] text-center"><motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}><div className="mb-8 inline-flex items-center gap-2 border border-[#9af36f]/25 bg-[#9af36f]/[0.06] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#baff9a]"><span className="size-1.5 rounded-full bg-[#9af36f] shadow-[0_0_12px_#9af36f]" /> financial intelligence / now online</div><h1 className="mx-auto max-w-[1100px] text-[clamp(3.6rem,9vw,8.8rem)] font-light leading-[.86] tracking-[-0.09em] text-white">Clarity that moves<br /><span className="text-white/35">at the speed of</span><br /><span className="text-[#9af36f]">your data.</span></h1><p className="mx-auto mt-9 max-w-xl text-base leading-7 text-white/55 sm:text-lg">Automated financial forensics for teams who need to know what changed, what matters, and what to do next.</p><div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"><Link to="/signup"><Button className="h-12 rounded-none bg-[#f4f4f0] px-6 text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#9af36f]">start analyzing free <ArrowUpRight className="ml-2 size-4" /></Button></Link><a href="#workflow" className="flex h-12 items-center gap-2 px-5 text-xs font-semibold uppercase tracking-wider text-white/65 transition-colors hover:text-white">see how it works <ChevronDown className="size-4" /></a></div></motion.div><motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .25, duration: .8 }} className="mx-auto mt-20 max-w-[980px] text-left lg:mt-24"><AnalysisPreview /></motion.div></div>
                </section>

                <div className="overflow-hidden border-y border-white/[0.08] bg-[#080909] py-4"><div className="ticker flex min-w-max items-center gap-10 font-mono text-[10px] uppercase tracking-[0.28em] text-white/30"><span>benford's law</span><span className="text-[#9af36f]">✳</span><span>anomaly detection</span><span className="text-[#72a2ff]">✳</span><span>forensic reporting</span><span className="text-[#9af36f]">✳</span><span>trend intelligence</span><span className="text-[#72a2ff]">✳</span><span>benford's law</span><span className="text-[#9af36f]">✳</span><span>anomaly detection</span></div></div>

                <section id="features" className="mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-40"><div className="grid gap-16 lg:grid-cols-[.85fr_1.15fr] lg:gap-24"><div className="lg:sticky lg:top-32 lg:h-fit"><p className="eyebrow">/ our approach</p><h2 className="mt-6 max-w-lg text-5xl font-light leading-[.96] tracking-[-0.07em] sm:text-6xl">A better read on <span className="text-white/35">financial risk.</span></h2><p className="mt-7 max-w-md text-base leading-7 text-white/50">Fin-Analysis turns raw transaction data into a clear, defensible point of view. Every scan is built to give you less noise and more signal.</p><div className="mt-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35"><span className="size-2 rounded-full bg-[#9af36f]" /> engineered for clarity</div></div><div className="divide-y divide-white/10 border-y border-white/10">{features.map((feature) => <motion.div key={feature.number} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} className="group grid gap-5 py-8 sm:grid-cols-[70px_1fr_60px] sm:items-start sm:gap-8 sm:py-12"><span className="font-mono text-[11px] text-[#9af36f]">{feature.number}</span><div><div className="mb-4 flex items-center gap-3"><feature.icon className="size-5 text-[#9af36f]" strokeWidth={1.5} /><h3 className="text-2xl font-light tracking-[-0.04em] text-white">{feature.title}</h3></div><p className="max-w-lg text-sm leading-6 text-white/45">{feature.description}</p></div><MoveUpRight className="hidden size-5 text-white/20 transition-all group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#9af36f] sm:block" /></motion.div>)}</div></div></section>

                <section className="border-y border-white/[0.08] bg-[#080909] px-6 py-24 lg:px-10 lg:py-36"><div className="mx-auto grid max-w-[1280px] items-center gap-14 lg:grid-cols-[.9fr_1.1fr] lg:gap-24"><div><p className="eyebrow">/ the signal, in focus</p><h2 className="mt-6 text-4xl font-light leading-[.96] tracking-[-0.07em] sm:text-6xl">See the story behind the number.</h2><p className="mt-7 max-w-md text-base leading-7 text-white/50">From first upload to final report, every result comes with context. Explore the outliers, understand the risk, and share a clear next step.</p><Link to="/signup" className="mt-9 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9af36f]">explore the dashboard <ArrowUpRight className="size-4" /></Link></div><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0e0f] p-5 shadow-2xl shadow-black/30 sm:p-7"><div className="mb-7 flex items-center justify-between border-b border-white/10 pb-5"><div><p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">Q4 / transaction review</p><p className="mt-2 text-lg tracking-[-0.03em]">operating_ledger.csv</p></div><div className="flex size-9 items-center justify-center rounded-full bg-[#9af36f]/10 text-[#9af36f]"><TrendingUp className="size-4" /></div></div><div className="grid grid-cols-3 gap-3 border-b border-white/10 pb-6"><div><p className="font-mono text-[9px] uppercase tracking-widest text-white/30">reviewed</p><p className="mt-2 text-2xl font-light">$842k</p></div><div><p className="font-mono text-[9px] uppercase tracking-widest text-white/30">outliers</p><p className="mt-2 text-2xl font-light text-[#ffb86b]">14</p></div><div><p className="font-mono text-[9px] uppercase tracking-widest text-white/30">confidence</p><p className="mt-2 text-2xl font-light text-[#9af36f]">98%</p></div></div><div className="mt-6 space-y-3">{["Duplicate vendor payment", "Unusual round-number cluster", "Benford distribution drift"].map((item, index) => <div key={item} className="flex items-center justify-between rounded-lg border border-white/[0.08] bg-white/[0.025] px-4 py-3"><span className="flex items-center gap-3 text-xs text-white/65"><span className={`size-1.5 rounded-full ${index === 1 ? "bg-[#ffb86b]" : "bg-[#9af36f]"}`} />{item}</span><span className="font-mono text-[9px] uppercase tracking-wider text-white/30">{index === 0 ? "review" : index === 1 ? "watch" : "passed"}</span></div>)}</div><div className="mt-7 flex items-center gap-3 border-t border-white/10 pt-5 font-mono text-[10px] text-white/35"><FileSearch className="size-3.5 text-[#9af36f]" /> report ready / 18 sec</div></div></div></section>

                <section id="workflow" className="mx-auto max-w-[1440px] px-6 py-28 lg:px-10 lg:py-40"><div className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className="eyebrow">/ simple by design</p><h2 className="mt-6 max-w-xl text-5xl font-light leading-[.94] tracking-[-0.07em] sm:text-6xl">From raw data to <span className="text-white/35">clear action.</span></h2></div><p className="max-w-xs text-sm leading-6 text-white/45">A focused workflow for people who want the answer without the audit marathon.</p></div><div className="grid border-y border-white/10 md:grid-cols-3 md:divide-x md:divide-white/10">{workflow.map((step, index) => { const Icon = [Upload, BarChart3, CircleDollarSign][index]; return <div key={step.number} className="group border-b border-white/10 py-9 last:border-0 md:border-b-0 md:px-8 md:first:pl-0 md:last:pr-0"><div className="mb-14 flex items-start justify-between"><span className="font-mono text-[11px] text-[#9af36f]">{step.number}</span><Icon className="size-5 text-white/25 transition-colors group-hover:text-[#9af36f]" strokeWidth={1.5} /></div><h3 className="text-2xl font-light tracking-[-0.04em]">{step.title}</h3><p className="mt-4 max-w-xs text-sm leading-6 text-white/45">{step.description}</p></div>; })}</div></section>

                <section id="about" className="relative overflow-hidden border-t border-white/[0.08] bg-[#080909] px-6 py-28 text-center lg:py-40"><div className="hero-glow hero-glow-green absolute left-1/2 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full" /><div className="relative z-10 mx-auto max-w-3xl"><p className="eyebrow">/ make the next move</p><h2 className="mt-7 text-5xl font-light leading-[.9] tracking-[-0.08em] sm:text-7xl">Your numbers already know.<br /><span className="text-[#9af36f]">Now you can, too.</span></h2><p className="mx-auto mt-7 max-w-lg text-base leading-7 text-white/50">Start with one file. Leave with a sharper understanding of your business.</p><Link to="/signup"><Button className="mt-9 h-12 rounded-none bg-[#f4f4f0] px-7 text-xs font-semibold uppercase tracking-wider text-black hover:bg-[#9af36f]">get started <ArrowUpRight className="ml-2 size-4" /></Button></Link></div></section>
            </main>

            <footer className="border-t border-white/[0.08] bg-[#050505] px-6 py-7 lg:px-10"><div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center"><div className="flex items-center gap-3"><img src={Logo} alt="" className="size-6" /><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">financial integrity, verified.</span></div><div className="flex items-center gap-5 font-mono text-[10px] uppercase tracking-wider text-white/30"><span className="flex items-center gap-2"><LockKeyhole className="size-3" /> secure by design</span><span>© 2026 fin-analysis</span></div></div></footer>
        </div>
    );
}
