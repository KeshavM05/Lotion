<!-- Vision Board -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;family=Space+Grotesk:wght@300..700&amp;family=JetBrains+Mono:wght@400;700&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-secondary-container": "#a8b5d9",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary-fixed-variant": "#3a4665",
                        "secondary-fixed": "#d9e2ff",
                        "on-surface": "#dbe2fb",
                        "inverse-primary": "#565e73",
                        "secondary": "#b9c6eb",
                        "secondary-fixed-dim": "#b9c6eb",
                        "primary": "#bec6df",
                        "on-primary": "#283043",
                        "background": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-container": "#b36e67",
                        "inverse-on-surface": "#283043",
                        "surface": "#0b1325",
                        "on-background": "#dbe2fb",
                        "tertiary-container": "#320806",
                        "tertiary-fixed": "#ffdad6",
                        "error": "#ffb4ab",
                        "surface-container-low": "#131b2d",
                        "inverse-surface": "#dbe2fb",
                        "surface-tint": "#bec6df",
                        "primary-container": "#0f1729",
                        "error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "primary-fixed": "#dbe2fb",
                        "on-tertiary-fixed": "#380c09",
                        "on-primary-container": "#798097",
                        "surface-container-lowest": "#060e1f",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "on-tertiary": "#53211c",
                        "on-primary-fixed-variant": "#3f465b",
                        "outline-variant": "#45464c",
                        "outline": "#909097",
                        "on-primary-fixed": "#131b2d",
                        "surface-container-highest": "#2d3448",
                        "surface-dim": "#0b1325",
                        "on-secondary": "#23304d",
                        "surface-container": "#171f32",
                        "tertiary": "#ffb4ab",
                        "secondary-container": "#3a4665",
                        "surface-variant": "#2d3448",
                        "primary-fixed-dim": "#bec6df",
                        "surface-bright": "#31394c",
                        "surface-container-high": "#222a3d",
                        "on-error": "#690005"
                    },
                    fontFamily: {
                        "headline": ["Newsreader", "serif"],
                        "body": ["Space Grotesk", "sans-serif"],
                        "label": ["Space Grotesk", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"],
                        "serif": ["Playfair Display", "serif"]
                    },
                    borderRadius: {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "2xl": "1.5rem",
                        "full": "9999px"
                    },
                },
            },
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .progress-ring__circle {
            transition: stroke-dashoffset 0.35s;
            transform: rotate(-90deg);
            transform-origin: 50% 50%;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-tertiary selection:text-on-tertiary min-h-screen overflow-x-hidden">
<!-- Sidebar Navigation Shell -->
<aside class="fixed left-0 top-0 h-screen w-64 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col py-8 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.4)]">
<div class="mb-12 px-4">
<h1 class="text-2xl font-serif italic text-[#F5F5F5]">Motion</h1>
<p class="text-xs text-[#9CA3AF] font-body tracking-[0.2em] uppercase mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined text-xl">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold bg-white/5 rounded-lg" href="#">
<span class="material-symbols-outlined text-xl text-[#C17A72]">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined text-xl">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined text-xl text-[#BEC6DF]">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined text-xl">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-2 pt-8 border-t border-white/5">
<button class="w-full flex items-center justify-center gap-2 bg-[#C17A72] text-[#F5F5F5] py-3 rounded-xl font-bold text-sm mb-6 transition-transform active:scale-95 duration-200">
<span class="material-symbols-outlined text-lg">bolt</span>
                Auto-schedule
            </button>
<a class="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm" href="#">
<span class="material-symbols-outlined text-xl">settings</span>
                Settings
            </a>
<a class="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg text-sm" href="#">
<span class="material-symbols-outlined text-xl">help_outline</span>
                Support
            </a>
</div>
</aside>
<!-- Top Navigation -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 z-40 bg-transparent flex justify-between items-center px-8">
<div class="flex items-center gap-8">
<nav class="flex gap-6">
<a class="font-body font-medium text-sm text-[#C17A72] border-b border-[#C17A72] pb-1" href="#">Focus Mode</a>
<a class="font-body font-medium text-sm text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors" href="#">Insights</a>
</nav>
</div>
<div class="flex items-center gap-6">
<div class="relative">
<span class="material-symbols-outlined text-[#BEC6DF] opacity-80 hover:opacity-100 cursor-pointer">notifications</span>
<div class="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full shadow-[0_0_8px_rgba(255,180,171,0.6)]"></div>
</div>
<img alt="Profile" class="w-8 h-8 rounded-full border border-white/10" data-alt="Sophisticated portrait of a professional woman profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCu95MJBZif3E9HBF7N9DkoSoJMpH1A7KjlalRJbR0EE422HPgeYwuPN3ke2VI1YXdZSCFXpV0xDS83yZbUbNeWU1PRfgCVCV6Zrp_akN3xNSyvkxAX6NAeEuc4n0QTglFyAWqhyvF5oHfB15T9TQE4mkyX4laAyX4A8YQj69Jmq1LGqwoM4681bUnwLEN_DoijuLWG-26y6IIFfD2MiYvx-mN9ef9DZ4EDjFFWub7OH2ssaL6m6BNso_f6n-6Etr0Ekq5XbQMQ5Q"/>
</div>
</header>
<!-- Main Content -->
<main class="ml-64 pt-24 pb-12 px-12 relative">
<!-- Background Bloom Elements -->
<div class="fixed top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#C17A72]/5 blur-[120px] rounded-full -z-10"></div>
<div class="fixed bottom-[10%] left-[5%] w-[300px] h-[300px] bg-[#BEC6DF]/5 blur-[100px] rounded-full -z-10"></div>
<!-- Header Section -->
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
<div>
<h2 class="text-5xl font-serif text-[#F5F5F5] mb-4">Vision Board</h2>
<p class="text-[#9CA3AF] max-w-xl font-body text-lg leading-relaxed">
                    Manifesting your celestial path through logic and design. Your long-term trajectories, curated by Motion.
                </p>
</div>
<div class="flex gap-3">
<button class="glass-card px-6 py-2 rounded-full text-sm font-medium border-tertiary/20 text-tertiary">All Goals</button>
<button class="px-6 py-2 rounded-full text-sm font-medium text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors">Milestones</button>
</div>
</div>
<!-- Category Filters -->
<div class="flex flex-wrap gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-tertiary text-tertiary bg-tertiary/5 transition-all">Career</button>
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5] transition-all">Business</button>
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5] transition-all">Finance</button>
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5] transition-all">Personal</button>
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5] transition-all">Health</button>
<button class="px-6 py-2 rounded-full text-sm font-label tracking-wide border border-white/5 text-[#9CA3AF] hover:border-white/20 hover:text-[#F5F5F5] transition-all">Creative</button>
</div>
<!-- Bento Grid of Goal Cards -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
<!-- Card 1: Launch Business -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 65;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">75%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Career • Q4</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">Launch Business</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Establish the digital architecture for "Aether Studio" and secure the first 3 retainers.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Brand Identity Finalized</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Landing Page Live</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>First Client Acquisition</span>
</div>
</div>
</div>
</div>
<!-- Card 2: Marathon Prep -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 158;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">40%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Health • NOV</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">Marathon Prep</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Systematic training for the New York Marathon. Achieving sub-4 hour completion.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Registration Confirmed</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Complete 30km Long Run</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Race Day Pacing Strategy</span>
</div>
</div>
</div>
</div>
<!-- Card 3: Financial Freedom -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 105;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">60%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Finance • FY24</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">Financial Freedom</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Diversify portfolio across celestial assets and secure 12 months of runway.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Emergency Fund Cap</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Retirement Auto-Deposit</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Dividend Income Target</span>
</div>
</div>
</div>
</div>
<!-- Card 4: Global Residency -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 211;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">20%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Personal • 2025</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">Global Residency</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Transitioning to a nomadic lifestyle with hubs in Tokyo and Lisbon.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Passport Renewal</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Visa Application Filed</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Lease Termination Plan</span>
</div>
</div>
</div>
</div>
<!-- Card 5: Learn Piano -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 184;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">30%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Creative • INDEFINITE</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">Mastering Nocturnes</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Learning Chopin's Op. 9 No. 2 with technical precision and emotional depth.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Basic Notation Mastery</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Right Hand Proficiency</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#BEC6DF]">
<span class="material-symbols-outlined text-sm">radio_button_unchecked</span>
<span>Metronome Alignment</span>
</div>
</div>
</div>
</div>
<!-- Card 6: AI Mentorship -->
<div class="glass-card p-8 rounded-2xl flex flex-col justify-between group hover:border-[#C17A72]/30 transition-all duration-500 hover:-translate-y-1">
<div class="flex justify-between items-start mb-12">
<div class="relative w-24 h-24">
<svg class="w-full h-full" viewbox="0 0 100 100">
<circle class="text-surface-variant/30 stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-width="6"></circle>
<circle class="text-[#C17A72] progress-ring__circle stroke-current" cx="50" cy="50" fill="transparent" r="42" stroke-linecap="round" stroke-width="6" style="stroke-dasharray: 263.89; stroke-dashoffset: 26;"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-[#F5F5F5]">90%</div>
</div>
<span class="text-xs font-label tracking-widest text-[#9CA3AF] uppercase">Career • COMPLETED</span>
</div>
<div>
<h3 class="text-2xl font-serif text-[#F5F5F5] mb-2">AI Mentorship</h3>
<p class="text-[#9CA3AF] text-sm font-body mb-6 leading-relaxed">Guiding 5 junior developers through the "Celestial Design" framework.</p>
<div class="space-y-3">
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Curriculum Development</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Weekly Lab Sessions</span>
</div>
<div class="flex items-center gap-3 text-xs text-[#9CA3AF]">
<span class="material-symbols-outlined text-sm text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">check_circle</span>
<span>Final Project Review</span>
</div>
</div>
</div>
</div>
</div>
<!-- FAB for New Goal -->
<button class="fixed bottom-12 right-12 w-16 h-16 bg-[#C17A72] rounded-full flex items-center justify-center shadow-[0px_20px_40px_rgba(15,23,41,0.4)] hover:scale-105 transition-transform active:scale-95 z-50 group">
<span class="material-symbols-outlined text-[#F5F5F5] text-3xl group-hover:rotate-90 transition-transform duration-300">add</span>
</button>
</main>
<!-- Visual Polish: Noise Texture Overlay -->
<div class="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')] z-[100]"></div>
</body></html>

<!-- Dashboard -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion Dashboard | Celestial Curator</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;700&amp;family=Newsreader:opsz,wght@6..72,400;6..72,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-secondary-container": "#a8b5d9",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary-fixed-variant": "#3a4665",
                        "secondary-fixed": "#d9e2ff",
                        "on-surface": "#dbe2fb",
                        "inverse-primary": "#565e73",
                        "secondary": "#b9c6eb",
                        "secondary-fixed-dim": "#b9c6eb",
                        "primary": "#bec6df",
                        "on-primary": "#283043",
                        "background": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-container": "#b36e67",
                        "inverse-on-surface": "#283043",
                        "surface": "#0b1325",
                        "on-background": "#dbe2fb",
                        "tertiary-container": "#320806",
                        "tertiary-fixed": "#ffdad6",
                        "error": "#ffb4ab",
                        "surface-container-low": "#131b2d",
                        "inverse-surface": "#dbe2fb",
                        "surface-tint": "#bec6df",
                        "primary-container": "#0f1729",
                        "error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "primary-fixed": "#dbe2fb",
                        "on-tertiary-fixed": "#380c09",
                        "on-primary-container": "#798097",
                        "surface-container-lowest": "#060e1f",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "on-tertiary": "#53211c",
                        "on-primary-fixed-variant": "#3f465b",
                        "outline-variant": "#45464c",
                        "outline": "#909097",
                        "on-primary-fixed": "#131b2d",
                        "surface-container-highest": "#2d3448",
                        "surface-dim": "#0b1325",
                        "on-secondary": "#23304d",
                        "surface-container": "#171f32",
                        "tertiary": "#ffb4ab",
                        "secondary-container": "#3a4665",
                        "surface-variant": "#2d3448",
                        "primary-fixed-dim": "#bec6df",
                        "surface-bright": "#31394c",
                        "surface-container-high": "#222a3d",
                        "on-error": "#690005"
                    },
                    fontFamily: {
                        "headline": ["Playfair Display", "serif"],
                        "body": ["Space Grotesk", "sans-serif"],
                        "label": ["Space Grotesk", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1.5rem", "full": "9999px"},
                },
            },
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #0b1325;
            background-image: radial-gradient(circle at 50% -20%, #1a2744 0%, #0b1325 100%);
            min-height: 100vh;
        }
    </style>
</head>
<body class="font-body text-on-surface overflow-x-hidden">
<!-- Sidebar Navigation -->
<aside class="fixed left-0 top-0 h-screen w-64 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-headline italic text-[#F5F5F5]">Motion</h1>
<p class="text-xs font-label tracking-widest text-on-tertiary-container mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<!-- Active Navigation -->
<a class="relative flex items-center gap-3 px-4 py-3 text-[#F5F5F5] font-bold before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] transition-all duration-300 hover:bg-white/5" href="#">
<span class="material-symbols-outlined text-[#C17A72]">dashboard</span>
<span class="font-label">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300 hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined group-hover:text-primary">auto_awesome_motion</span>
<span class="font-label">Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300 hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined group-hover:text-primary">calendar_today</span>
<span class="font-label">Calendar</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300 hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined group-hover:text-primary">smart_toy</span>
<span class="font-label">AI Coach</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300 hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined group-hover:text-primary">edit_note</span>
<span class="font-label">Journal</span>
</a>
</nav>
<div class="mt-auto pt-8 border-t border-white/5 space-y-2">
<button class="w-full flex items-center justify-center gap-2 bg-[#C17A72]/10 text-[#C17A72] border border-[#C17A72]/20 py-2.5 rounded-lg font-label text-sm hover:bg-[#C17A72]/20 transition-all duration-200 mb-6">
<span class="material-symbols-outlined text-sm">bolt</span>
                Auto-schedule
            </button>
<a class="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label text-sm">Settings</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-all duration-300" href="#">
<span class="material-symbols-outlined">help_outline</span>
<span class="font-label text-sm">Support</span>
</a>
</div>
</aside>
<!-- Top Navigation Bar -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-transparent flex justify-between items-center px-8 z-40">
<div class="flex gap-8">
<a class="text-[#9CA3AF] font-label text-sm hover:text-[#F5F5F5] transition-colors" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] font-label text-sm hover:text-[#F5F5F5] transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center gap-6">
<div class="relative group">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer opacity-80 hover:opacity-100 transition-opacity">notifications</span>
<span class="absolute -top-1 -right-1 w-2 h-2 bg-[#C17A72] rounded-full shadow-[0_0_8px_#C17A72]"></span>
</div>
<div class="flex items-center gap-3 cursor-pointer group">
<img class="w-8 h-8 rounded-full border border-white/20 object-cover" data-alt="User Profile Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmPLtdNnOohS0T0fPK8JM_gg40bGDP0mA9JAwot7V-8Zs4bm_te1IBXMspWFKumtIfYUjr2S5YoKT0lbYoq7ES1J0Y4sxW9xkxOmT90fvCt5HwZg200MuKheBt2Yg06a4D4gVn9aEo7JjnisG4QVEUnIhpnzrBLR9NBaHhxKaLLMEk4LOfXAJYwpu4_2U0j2rmlzb_l-KmNHQkuazBZwyL8UrqfYb2jA0PbIsHaRMLP1Zle4Ys0i2XXB1i67WXPWLU0aVm4HPgug"/>
<span class="material-symbols-outlined text-[#BEC6DF] opacity-80 group-hover:opacity-100 transition-opacity">account_circle</span>
</div>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 pt-24 px-12 pb-12">
<!-- Dashboard Header -->
<header class="mb-12">
<h2 class="text-5xl font-headline text-[#F5F5F5] mb-2">Dashboard</h2>
<p class="text-on-secondary-container font-body tracking-wide">Welcome back. Your celestial alignment is high today.</p>
</header>
<!-- Bento Grid Layout -->
<div class="grid grid-cols-12 gap-6 items-start">
<!-- Column 1 & 2: Main Insights & Stats (Large Span) -->
<div class="col-span-12 lg:col-span-8 space-y-6">
<!-- AI Coach Card (High-End Glassmorphism) -->
<div class="glass-card p-8 rounded-2xl relative overflow-hidden group">
<div class="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
<span class="material-symbols-outlined text-8xl text-[#C17A72]">flare</span>
</div>
<div class="relative z-10 max-w-2xl">
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-[#C17A72]">smart_toy</span>
<span class="font-label text-xs uppercase tracking-widest text-[#C17A72]">Personalized Insight</span>
</div>
<h3 class="text-3xl font-headline italic text-white mb-4">"The quietest hours often hold the loudest truths. You've been most productive at 7:00 AM this week—try leaning into that stillness tomorrow."</h3>
<p class="text-[#BEC6DF] font-body leading-relaxed mb-6 opacity-80">Based on your recent journal entries and task completion patterns, your creative energy peaks when your environment is at its lowest frequency.</p>
<button class="flex items-center gap-2 text-[#C17A72] font-label text-sm font-semibold hover:translate-x-1 transition-transform">
                            View Full Analysis
                            <span class="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
</div>
<!-- Quick Stats Grid -->
<div class="grid grid-cols-3 gap-6">
<div class="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
<span class="font-mono text-4xl text-[#C17A72] mb-1">4</span>
<span class="font-label text-xs text-on-secondary-container uppercase tracking-widest">Active Goals</span>
</div>
<div class="glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center border-l-2 border-l-[#C17A72]/30">
<span class="font-mono text-4xl text-[#C17A72] mb-1">7</span>
<span class="font-label text-xs text-on-secondary-container uppercase tracking-widest">Tasks Due Today</span>
</div>
<div class="glass-card p-6 rounded-2xl relative overflow-hidden">
<div class="flex flex-col items-center justify-center text-center relative z-10">
<span class="font-mono text-4xl text-[#C17A72] mb-1">65%</span>
<span class="font-label text-xs text-on-secondary-container uppercase tracking-widest">Week Progress</span>
</div>
<!-- Subtle progress ring background decoration -->
<div class="absolute bottom-[-20%] right-[-10%] opacity-10">
<svg class="w-24 h-24 transform -rotate-90">
<circle cx="48" cy="48" fill="transparent" r="40" stroke="#C17A72" stroke-dasharray="251.2" stroke-dashoffset="87.9" stroke-width="8"></circle>
</svg>
</div>
</div>
</div>
<!-- Recent Journal Entries (Asymmetric Layout) -->
<div class="pt-8">
<div class="flex justify-between items-center mb-6">
<h4 class="font-headline text-2xl text-white">Journal Preview</h4>
<a class="text-xs font-label text-[#9CA3AF] hover:text-[#C17A72] uppercase tracking-widest" href="#">View All Entries</a>
</div>
<div class="grid grid-cols-2 gap-8">
<div class="glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
<div class="flex items-center gap-4 mb-4">
<span class="font-mono text-xs text-[#C17A72]">OCT 24</span>
<div class="h-px flex-1 bg-white/10"></div>
</div>
<h5 class="text-lg font-headline text-white mb-2">Morning Reflection on Clarity</h5>
<p class="text-on-secondary-container font-body text-sm line-clamp-3 leading-relaxed opacity-70">Woke up feeling a strange sense of weightlessness. The vision board is starting to take shape, but the "Focus" aspect still feels elusive...</p>
</div>
<div class="glass-card p-8 rounded-2xl transition-all duration-300 hover:scale-[1.02] mt-8 lg:mt-4">
<div class="flex items-center gap-4 mb-4">
<span class="font-mono text-xs text-[#C17A72]">OCT 22</span>
<div class="h-px flex-1 bg-white/10"></div>
</div>
<h5 class="text-lg font-headline text-white mb-2">The Night Audit</h5>
<p class="text-on-secondary-container font-body text-sm line-clamp-3 leading-relaxed opacity-70">Task completion was high, yet I feel depleted. Need to reconsider the balance between output and recharge...</p>
</div>
</div>
</div>
</div>
<!-- Column 3: Calendar Widget & Tasks (Shorter Sidebar Feel) -->
<div class="col-span-12 lg:col-span-4 space-y-6">
<!-- Upcoming Calendar Widget -->
<div class="glass-card p-8 rounded-2xl">
<div class="flex items-center justify-between mb-8">
<h4 class="font-headline text-xl text-white">Upcoming</h4>
<span class="material-symbols-outlined text-[#9CA3AF] cursor-pointer hover:text-white transition-colors">calendar_view_day</span>
</div>
<div class="space-y-8">
<!-- Event 1 -->
<div class="flex gap-4 group cursor-pointer">
<div class="flex flex-col items-center">
<span class="font-mono text-sm text-[#C17A72] font-bold">10:00</span>
<div class="w-px h-full bg-white/10 my-2 group-last:hidden"></div>
</div>
<div class="pb-6">
<p class="text-sm font-label text-white group-hover:text-[#C17A72] transition-colors">Deep Work: Strategy Session</p>
<p class="text-xs text-[#9CA3AF] mt-1">Focus Mode: Activated</p>
</div>
</div>
<!-- Event 2 -->
<div class="flex gap-4 group cursor-pointer">
<div class="flex flex-col items-center">
<span class="font-mono text-sm text-on-secondary-container">13:30</span>
<div class="w-px h-full bg-white/10 my-2 group-last:hidden"></div>
</div>
<div class="pb-6">
<p class="text-sm font-label text-white group-hover:text-[#C17A72] transition-colors">Vision Review with AI Coach</p>
<p class="text-xs text-[#9CA3AF] mt-1">Celestial Alignment Check</p>
</div>
</div>
<!-- Event 3 -->
<div class="flex gap-4 group cursor-pointer">
<div class="flex flex-col items-center">
<span class="font-mono text-sm text-on-secondary-container">16:00</span>
<div class="w-px h-0 bg-white/10 my-2"></div>
</div>
<div>
<p class="text-sm font-label text-white group-hover:text-[#C17A72] transition-colors">Evening Reflection</p>
<p class="text-xs text-[#9CA3AF] mt-1">Journal Entry Due</p>
</div>
</div>
</div>
</div>
<!-- Life Balance Progress Rings -->
<div class="glass-card p-8 rounded-2xl">
<h4 class="font-headline text-xl text-white mb-8">Celestial Balance</h4>
<div class="grid grid-cols-2 gap-8">
<div class="flex flex-col items-center">
<div class="relative w-20 h-20 mb-3 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle cx="40" cy="40" fill="transparent" r="34" stroke="#2D3448" stroke-opacity="0.3" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="34" stroke="url(#roseGradient)" stroke-dasharray="213.6" stroke-dashoffset="42.7" stroke-linecap="round" stroke-width="4"></circle>
<defs>
<lineargradient id="roseGradient" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" stop-color="#FFB4AB"></stop>
<stop offset="100%" stop-color="#C17A72"></stop>
</lineargradient>
</defs>
</svg>
<span class="absolute font-mono text-sm text-white">80%</span>
</div>
<span class="font-label text-xs text-on-secondary-container tracking-wider">Mind</span>
</div>
<div class="flex flex-col items-center">
<div class="relative w-20 h-20 mb-3 flex items-center justify-center">
<svg class="w-full h-full transform -rotate-90">
<circle cx="40" cy="40" fill="transparent" r="34" stroke="#2D3448" stroke-opacity="0.3" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="34" stroke="#BEC6DF" stroke-dasharray="213.6" stroke-dashoffset="128.1" stroke-linecap="round" stroke-width="4"></circle>
</svg>
<span class="absolute font-mono text-sm text-white">40%</span>
</div>
<span class="font-label text-xs text-on-secondary-container tracking-wider">Motion</span>
</div>
</div>
</div>
<!-- Action Card (Small) -->
<div class="bg-gradient-to-br from-[#C17A72] to-[#320806] p-6 rounded-2xl shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
<div class="flex items-start justify-between mb-4">
<span class="material-symbols-outlined text-white p-2 bg-black/20 rounded-full">wb_sunny</span>
</div>
<h5 class="text-white font-headline text-lg mb-2">Enhance Focus</h5>
<p class="text-white/80 text-xs font-body leading-relaxed mb-4">You have a gap in 2 hours. Would you like to schedule a deep work sprint?</p>
<button class="w-full py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-label text-sm transition-colors">
                        Quick Start
                    </button>
</div>
</div>
</div>
</main>
<!-- Floating Action Element -->
<div class="fixed bottom-8 right-8 z-50">
<button class="glass-card w-14 h-14 rounded-full flex items-center justify-center text-[#C17A72] border-[#C17A72]/30 hover:bg-[#C17A72]/10 transition-all duration-300 shadow-[0px_20px_40px_rgba(15,23,41,0.4)]">
<span class="material-symbols-outlined text-3xl" style="font-variation-settings: 'FILL' 1;">add</span>
</button>
</div>
</body></html>

<!-- Journal -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&amp;family=Space+Grotesk:wght@300..700&amp;family=JetBrains+Mono:wght@300..700&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "inverse-on-surface": "#283043",
                    "surface-container-lowest": "#060e1f",
                    "surface-variant": "#2d3448",
                    "surface-container-highest": "#2d3448",
                    "secondary-fixed-dim": "#b9c6eb",
                    "on-primary-container": "#798097",
                    "background": "#0b1325",
                    "on-primary": "#283043",
                    "primary-fixed": "#dbe2fb",
                    "on-tertiary-container": "#b36e67",
                    "on-secondary-fixed": "#0d1b37",
                    "on-background": "#dbe2fb",
                    "tertiary-fixed": "#ffdad6",
                    "surface-container": "#171f32",
                    "secondary": "#b9c6eb",
                    "on-secondary-fixed-variant": "#3a4665",
                    "tertiary-container": "#320806",
                    "tertiary-fixed-dim": "#ffb4ab",
                    "surface-bright": "#31394c",
                    "surface-container-high": "#222a3d",
                    "inverse-surface": "#dbe2fb",
                    "on-secondary-container": "#a8b5d9",
                    "surface": "#0b1325",
                    "on-tertiary": "#53211c",
                    "on-surface-variant": "#c6c6cd",
                    "on-secondary": "#23304d",
                    "surface-tint": "#bec6df",
                    "on-surface": "#dbe2fb",
                    "outline-variant": "#45464c",
                    "outline": "#909097",
                    "on-tertiary-fixed-variant": "#6f3630",
                    "on-tertiary-fixed": "#380c09",
                    "on-error": "#690005",
                    "secondary-fixed": "#d9e2ff",
                    "primary-fixed-dim": "#bec6df",
                    "surface-container-low": "#131b2d",
                    "on-primary-fixed": "#131b2d",
                    "surface-dim": "#0b1325",
                    "secondary-container": "#3a4665",
                    "on-primary-fixed-variant": "#3f465b",
                    "inverse-primary": "#565e73",
                    "error-container": "#93000a",
                    "on-error-container": "#ffdad6",
                    "primary-container": "#0f1729",
                    "tertiary": "#ffb4ab",
                    "primary": "#bec6df",
                    "error": "#ffb4ab"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Playfair Display", "serif"],
                    "display": ["Playfair Display", "serif"],
                    "body": ["Space Grotesk", "sans-serif"],
                    "label": ["Space Grotesk", "sans-serif"],
                    "mono": ["JetBrains Mono", "monospace"]
            }
          },
        },
      }
    </script>
<style>
        body { background-color: #0b1325; color: #dbe2fb; }
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .rose-glow:focus-within {
            box-shadow: 0 0 25px -5px rgba(193, 122, 114, 0.4);
            border-color: rgba(193, 122, 114, 0.5);
        }
    </style>
</head>
<body class="font-body selection:bg-tertiary-container selection:text-tertiary">
<!-- Sidebar Shell -->
<aside class="fixed left-0 h-screen w-64 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-on-primary-container mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<!-- Navigation Items Mapping -->
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 group text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 group text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 group text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 group text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<!-- Active State: Journal -->
<a class="flex items-center gap-4 px-4 py-3 relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold bg-white/5" href="#">
<span class="material-symbols-outlined">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-2 pt-8 border-t border-white/5">
<button class="w-full mb-4 bg-tertiary text-on-tertiary py-3 rounded-xl font-bold text-sm tracking-tight active:scale-95 transition-transform">
                Auto-schedule
            </button>
<a class="flex items-center gap-4 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-['Space_Grotesk'] text-sm">Settings</span>
</a>
<a class="flex items-center gap-4 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined">help_outline</span>
<span class="font-['Space_Grotesk'] text-sm">Support</span>
</a>
</div>
</aside>
<!-- Top Navigation -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-transparent flex justify-between items-center px-8 z-40">
<div class="flex gap-8">
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center gap-6">
<div class="relative group">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer opacity-80 hover:opacity-100">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full border-2 border-background"></span>
</div>
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer opacity-80 hover:opacity-100">account_circle</span>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 pt-24 pb-32 min-h-screen px-12 max-w-6xl mx-auto">
<!-- Editorial Header -->
<header class="mb-20">
<h2 class="text-64 font-display italic text-on-surface leading-tight">The Stream of Consciousness</h2>
<p class="text-on-primary-container font-body mt-4 max-w-xl text-lg">Your chronological repository of thoughts, curated and tagged by Motion AI to find patterns in your celestial drift.</p>
</header>
<!-- Journal Timeline Container -->
<section class="relative">
<!-- Vertical Line -->
<div class="absolute left-[3.25rem] top-0 bottom-0 w-[1px] bg-white/10 z-0"></div>
<!-- Entry 1: Today -->
<div class="flex gap-12 mb-16 relative z-10 group">
<!-- Date Margin -->
<div class="w-24 pt-2 text-right">
<span class="font-mono text-tertiary text-xs block opacity-60">TODAY</span>
<span class="font-mono text-on-surface text-xl font-bold block">14.05</span>
</div>
<!-- Content -->
<div class="flex-1">
<div class="glass-card p-8 rounded-2xl group-hover:bg-[#1A2744]/80 transition-all duration-500">
<div class="flex justify-between items-start mb-6">
<h3 class="text-3xl font-display text-white italic">Finding clarity in the noise</h3>
<span class="font-mono text-[10px] text-tertiary bg-tertiary-container px-2 py-1 rounded">09:12 AM</span>
</div>
<p class="text-[#BEC6DF] leading-relaxed mb-8 text-lg font-light">
                            Woke up feeling a strange resonance with the architecture of the morning. There's a particular quality to the light today that feels... architectural. I spent forty minutes just observing how the shadows moved across the workspace before I even touched the keyboard. AI suggests this is a "Reflective Equilibrium" state.
                        </p>
<div class="flex gap-3">
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span> High Clarity
                            </span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#Atmospheric</span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#MorningFocus</span>
</div>
</div>
</div>
</div>
<!-- Image Break -->
<div class="ml-36 mb-16 h-64 rounded-2xl overflow-hidden glass-card p-1">
<img class="w-full h-full object-cover rounded-xl opacity-60 hover:opacity-100 transition-opacity duration-700" data-alt="A cinematic, low-angle shot of a minimalist home office at dawn. Soft, ethereal blue light filters through a large window, casting long, dramatic shadows across a clean wooden desk. A digital screen glows softly in the background with abstract, celestial data visualizations. The mood is incredibly serene, meditative, and high-end, perfectly capturing the Celestial Curator aesthetic with deep navy and rose-gold undertones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDP0ndHOwIalg2WwoJVeOEtp6v0ou3BwtcLUmFtjTss6nd3FZauvJzcTLll881qMyCBMHHw1hyHzXWh3AX0uYb0Nt34O6PVCgrWtHRAn-cL_fE85RvD3kC_Jb5jGfITWpn37HmzKEZyIXgkflJbSVuR7bqJxNpy7U0PQIbD0WvDX-wLTa5rCXnr5rkZgtiT-a0QWUZpA0y8e5jb0H6E6yMkn7Gds2xSXeaTVN-N2HfHsS_GSpQ8dnkjJ4TktavbjveEinXB2Nma7Q"/>
</div>
<!-- Entry 2: Yesterday -->
<div class="flex gap-12 mb-16 relative z-10 group">
<div class="w-24 pt-2 text-right">
<span class="font-mono text-on-primary-container text-xs block opacity-60">YESTERDAY</span>
<span class="font-mono text-on-surface text-xl font-bold block">13.05</span>
</div>
<div class="flex-1">
<div class="glass-card p-8 rounded-2xl group-hover:bg-[#1A2744]/80 transition-all duration-500">
<div class="flex justify-between items-start mb-6">
<h3 class="text-3xl font-display text-white italic">The friction of late-night ideas</h3>
<span class="font-mono text-[10px] text-tertiary bg-tertiary-container px-2 py-1 rounded">11:45 PM</span>
</div>
<p class="text-[#BEC6DF] leading-relaxed mb-8 text-lg font-light">
                            The project deadline is looming, but I found myself spiraling into the 'why' instead of the 'how'. Why do we seek symmetry in chaos? The AI Coach noted a 15% increase in contemplative language today. Perhaps I'm avoiding the technical work by hiding in philosophy.
                        </p>
<div class="flex gap-3">
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary"></span> Medium Friction
                            </span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#Symmetry</span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#CreativeDrift</span>
</div>
</div>
</div>
</div>
<!-- Entry 3: Weekend -->
<div class="flex gap-12 mb-16 relative z-10 group">
<div class="w-24 pt-2 text-right">
<span class="font-mono text-on-primary-container text-xs block opacity-60">SUNDAY</span>
<span class="font-mono text-on-surface text-xl font-bold block">11.05</span>
</div>
<div class="flex-1">
<div class="glass-card p-8 rounded-2xl group-hover:bg-[#1A2744]/80 transition-all duration-500">
<div class="flex justify-between items-start mb-6">
<h3 class="text-3xl font-display text-white italic">Silence as a substrate</h3>
<span class="font-mono text-[10px] text-tertiary bg-tertiary-container px-2 py-1 rounded">03:20 PM</span>
</div>
<p class="text-[#BEC6DF] leading-relaxed mb-8 text-lg font-light">
                            Total digital blackout today. The silence wasn't empty; it was a physical thing. I felt the weight of my own attention returning to me. Motion's 'Celestial Curator' mode suggested I needed this to reset my cognitive baseline.
                        </p>
<div class="flex gap-3">
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-outline-variant"></span> Low Energy
                            </span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#Restoration</span>
<span class="text-[11px] font-mono border border-outline-variant px-3 py-1 rounded-full text-on-surface-variant">#Blackout</span>
</div>
</div>
</div>
</div>
</section>
</main>
<!-- Fixed Quick Capture Area -->
<div class="fixed bottom-0 right-0 w-[calc(100%-16rem)] p-8 pointer-events-none">
<div class="max-w-4xl mx-auto w-full pointer-events-auto">
<div class="glass-card p-1 rounded-2xl rose-glow transition-all duration-500">
<div class="bg-surface-container-low rounded-xl flex items-center px-6 py-4 shadow-2xl">
<span class="material-symbols-outlined text-tertiary mr-4">auto_awesome</span>
<input class="bg-transparent border-none focus:ring-0 w-full text-[#F5F5F5] placeholder:text-on-primary-container font-body text-lg" placeholder="Transcribe a thought into the ether..." type="text"/>
<div class="flex items-center gap-3 ml-4">
<button class="p-2 rounded-lg hover:bg-white/5 transition-colors text-on-primary-container">
<span class="material-symbols-outlined">mic</span>
</button>
<button class="p-2 rounded-lg hover:bg-white/5 transition-colors text-on-primary-container">
<span class="material-symbols-outlined">attach_file</span>
</button>
<button class="bg-tertiary text-on-tertiary px-5 py-2 rounded-lg font-bold text-sm tracking-wide hover:scale-105 transition-transform">
                            Capture
                        </button>
</div>
</div>
</div>
</div>
</div>
<!-- Background Elements -->
<div class="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px] -z-10 pointer-events-none"></div>
<div class="fixed bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-tertiary/5 blur-[120px] -z-10 pointer-events-none"></div>
</body></html>

<!-- Motion App Requirements -->
# Motion — AI Life Coach App (PRD)

## Core Concept
An AI-powered life coaching platform that unifies calendar management, goal tracking, task management, and journaling with contextual AI guidance. Unlike traditional productivity apps, Motion treats each goal as a living project with its own AI chat interface for personalized coaching.

## Design System

### Color Palette
- **Primary:** Deep navy (#0F1729)
- **Cards:** Blue-tinted glass (#1A2744, 60% opacity)
- **Accent:** Warm rose (#C17A72) - Used for CTAs, active states, progress indicators, AI responses
- **Text:** Off-white (#F5F5F5)
- **Secondary Text:** Gray (#9ca3af)

### Typography
- **Body:** Space Grotesk (400-700 weights)
- **Headlines:** Playfair Display (Serif)
- **Stats/Monospace:** JetBrains Mono

### Visual Style
- **Glassmorphism:** 60% opacity blue-tinted cards, 24px backdrop blur
- **Borders:** Subtle white (10% opacity), 12px border radius
- **Shadows:** Soft, subtle depth

## Key Screens to Design
1. **Dashboard:** Overview with quick stats, upcoming events, recent journal entries, and an AI insights card.
2. **Vision Board / Goals:** Grid of goal cards with circular progress rings and category filters.
3. **Goal Detail:** 3-tab interface featuring Milestones, Task list, and a goal-specific AI Chat.
4. **Calendar:** Week/month view with sync, drag-to-schedule, and time blocking.
5. **Tasks:** Filterable list with priority indicators and an auto-schedule button.
6. **Journal:** Timeline of daily entries with a quick capture button.
7. **AI Coach:** General chat interface with streaming responses.
8. **AI Memory:** Editable document showing AI knowledge about the user.
9. **Weekly Ritual:** Guided planning flow.

## Core UI Components
- Sidebar navigation with rose active states and badges.
- Glass cards with hover-responsive borders.
- Modal overlays with input-glass styling.
- Progress rings with animated fills.
- Priority dots (Red, Orange, Yellow, Blue).
- Quick Capture (floating textarea) & Command Palette.

## Interactions & Technical
- Staggered fade-in animations (50ms).
- AI thinking indicators (pulse glow).
- Smooth transitions (200ms ease).
- Click-to-edit forms.
- Built with Next.js 16, Dark theme only.


<!-- AI Coach -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-secondary-container": "#a8b5d9",
              "on-surface-variant": "#c6c6cd",
              "on-secondary-fixed-variant": "#3a4665",
              "secondary-fixed": "#d9e2ff",
              "on-surface": "#dbe2fb",
              "inverse-primary": "#565e73",
              "secondary": "#b9c6eb",
              "secondary-fixed-dim": "#b9c6eb",
              "primary": "#bec6df",
              "on-primary": "#283043",
              "background": "#0b1325",
              "on-secondary-fixed": "#0d1b37",
              "on-error-container": "#ffdad6",
              "on-tertiary-container": "#b36e67",
              "inverse-on-surface": "#283043",
              "surface": "#0b1325",
              "on-background": "#dbe2fb",
              "tertiary-container": "#320806",
              "tertiary-fixed": "#ffdad6",
              "error": "#ffb4ab",
              "surface-container-low": "#131b2d",
              "inverse-surface": "#dbe2fb",
              "surface-tint": "#bec6df",
              "primary-container": "#0f1729",
              "error-container": "#93000a",
              "on-tertiary-fixed-variant": "#6f3630",
              "primary-fixed": "#dbe2fb",
              "on-tertiary-fixed": "#380c09",
              "on-primary-container": "#798097",
              "surface-container-lowest": "#060e1f",
              "tertiary-fixed-dim": "#ffb4ab",
              "on-tertiary": "#53211c",
              "on-primary-fixed-variant": "#3f465b",
              "outline-variant": "#45464c",
              "outline": "#909097",
              "on-primary-fixed": "#131b2d",
              "surface-container-highest": "#2d3448",
              "surface-dim": "#0b1325",
              "on-secondary": "#23304d",
              "surface-container": "#171f32",
              "tertiary": "#ffb4ab",
              "secondary-container": "#3a4665",
              "surface-variant": "#2d3448",
              "primary-fixed-dim": "#bec6df",
              "surface-bright": "#31394c",
              "surface-container-high": "#222a3d",
              "on-error": "#690005"
            },
            fontFamily: {
              "headline": ["Playfair Display", "serif"],
              "body": ["Space Grotesk", "sans-serif"],
              "label": ["Space Grotesk", "sans-serif"],
              "mono": ["JetBrains Mono", "monospace"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .ai-pulse {
            box-shadow: 0 0 15px rgba(193, 122, 114, 0.4);
        }
        .editorial-indent {
            padding-left: clamp(1rem, 5vw, 4rem);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-tertiary/30">
<div class="flex h-screen overflow-hidden">
<!-- SideNavBar -->
<aside class="hidden md:flex flex-col h-full py-8 px-4 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 w-64 shadow-[0px_20px_40px_rgba(15,23,41,0.4)]">
<div class="mb-12 px-4">
<span class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</span>
<p class="text-xs text-[#9CA3AF] mt-1 font-['Space_Grotesk'] tracking-widest uppercase">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<!-- Active Tab: AI Coach -->
<a class="relative flex items-center gap-3 px-4 py-3 rounded-lg text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group" href="#">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-2 pt-8 border-t border-white/5">
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Settings</span>
</button>
<button class="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Support</span>
</button>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 relative flex flex-col h-full bg-surface-dim overflow-hidden">
<!-- TopNavBar -->
<header class="h-16 flex justify-between items-center px-8 w-full bg-transparent z-10">
<div class="flex items-center gap-8">
<h1 class="font-headline text-2xl text-on-surface">AI Coach</h1>
<div class="hidden lg:flex gap-6">
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors font-['Space_Grotesk'] font-medium text-sm" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors font-['Space_Grotesk'] font-medium text-sm" href="#">Insights</a>
</div>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-[#BEC6DF] hover:text-[#F5F5F5] opacity-80 hover:opacity-100 transition-all duration-300">
<span class="material-symbols-outlined" data-icon="notifications">notifications</span>
</button>
<div class="h-8 w-8 rounded-full overflow-hidden border border-white/10">
<img alt="Profile" class="w-full h-full object-cover" data-alt="Close up of a professional male user avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCPvnBHuJvaNR1j3J6BFFfAp83HmjBqyoFY54R5R624kDIl2wmG3a9hQyAKBN7Jyjy3bXiGiLc-3eaMBuF8ZITfeQPFxPEobVSwjX7q0pS7KYoIgkNeFsrMe7hOT-gZ1ggPplYOD7P3Gkk8bZlWvJnvs3AXhdIEvkDk2DOWoUiCM9pihQPbFVV5SqH4b1oiYPPpq4PTdgO_7hrjIG0Ow5dkhHzJslBrgElPZdO3aaJOA9WMnbQdDll5OAId0wRBafsIdHoEhtC_Q"/>
</div>
</div>
</header>
<!-- Chat Container -->
<div class="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-12 scroll-smooth custom-scrollbar">
<!-- AI Message: Greeting -->
<div class="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
<div class="flex items-start gap-6">
<div class="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center ai-pulse">
<span class="material-symbols-outlined text-tertiary text-lg" data-icon="smart_toy">smart_toy</span>
</div>
<div class="space-y-4">
<h2 class="font-headline text-3xl italic text-on-surface leading-tight">Good evening, Julian.</h2>
<div class="glass-card p-6 rounded-xl border-l-4 border-tertiary shadow-xl">
<p class="text-on-surface leading-relaxed text-lg">
                                    I noticed you've been deeply focused on the "Ethereal Design" project for 4 hours today. Your cognitive load is peaking. Shall we recalibrate your evening to ensure a restful transition, or would you like to synthesize today's breakthroughs into your Vision Board?
                                </p>
</div>
<span class="font-mono text-[10px] text-tertiary/60 uppercase tracking-widest">Confidence 98.4%</span>
</div>
</div>
</div>
<!-- User Message -->
<div class="max-w-2xl ml-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
<div class="flex flex-row-reverse items-start gap-6">
<div class="mt-1 flex-shrink-0 w-8 h-8 rounded-full overflow-hidden border border-white/10">
<img alt="Julian" class="w-full h-full object-cover" data-alt="Professional user profile photo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDEiVwHjSxpqIDDfAeVKY7YqhmjcwowjtAadfsso_ueN39ktBllqY2e8PqcQBQcglvBO8iKGPol7YAhP6wKIOAUFEdI7qBIi2WD88YHnH6Yf0Kl0kDy6hq1qnd5ec1ymMb7cG3fpjwmzjQUZNC3ztrX1p7bFpZN_D9UcGhrDyib_fl2NWy3vK33JZaap7LS_8ztqiSHdrhGkaq4ZFyN4N49JPw9YLRfGoPaKHy-jJH4xSC7p8PkJIUOI8gm_wP2B6KsF5Q4cPxGZg"/>
</div>
<div class="text-right">
<div class="bg-surface-container-highest/40 backdrop-blur-sm p-6 rounded-xl border border-white/5">
<p class="text-on-secondary-container leading-relaxed">
                                    I'm feeling a bit stuck on the navigation logic. It feels too "standard." How can I make it more celestial?
                                </p>
</div>
</div>
</div>
</div>
<!-- AI Message: Streaming/Response -->
<div class="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
<div class="flex items-start gap-6">
<div class="mt-1 flex-shrink-0 w-8 h-8 rounded-full bg-tertiary/10 border border-tertiary/20 flex items-center justify-center ai-pulse">
<span class="material-symbols-outlined text-tertiary text-lg" data-icon="auto_awesome">auto_awesome</span>
</div>
<div class="space-y-4">
<div class="glass-card p-6 rounded-xl shadow-xl">
<div class="space-y-4 text-on-surface leading-relaxed">
<p>To achieve a celestial feel, we must move away from the "Container-First" mindset. Consider these three conceptual shifts:</p>
<div class="editorial-indent space-y-3 border-l border-tertiary/20">
<p><strong class="text-tertiary">01. Orbital Hierarchy:</strong> Instead of lists, use varying scales and depths. Let secondary elements orbit the primary focus with lower opacity and higher blur.</p>
<p><strong class="text-tertiary">02. Negative Space as Matter:</strong> Treat the dark space not as "empty," but as a fluid medium. Elements shouldn't just sit; they should float.</p>
<p><strong class="text-tertiary">03. Ghosting:</strong> Replace solid lines with tonal shifts. Use a 10% white border only where necessary for structural definition.</p>
</div>
<div class="flex items-center gap-2 mt-4 text-tertiary">
<span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span class="font-mono text-xs tracking-tighter">Curating architectural patterns...</span>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Chat Footer: Floating Prompts & Input -->
<div class="relative px-6 md:px-12 pb-10 pt-4 bg-gradient-to-t from-surface-dim via-surface-dim to-transparent">
<!-- Quick Prompts -->
<div class="flex flex-wrap gap-3 mb-6 justify-center max-w-4xl mx-auto">
<button class="px-4 py-2 rounded-full glass-card text-xs font-medium text-on-surface hover:text-tertiary border border-white/5 transition-all active:scale-95">
                        Plan my week
                    </button>
<button class="px-4 py-2 rounded-full glass-card text-xs font-medium text-on-surface hover:text-tertiary border border-white/5 transition-all active:scale-95">
                        Review my goals
                    </button>
<button class="px-4 py-2 rounded-full glass-card text-xs font-medium text-on-surface hover:text-tertiary border border-white/5 transition-all active:scale-95">
                        I'm feeling stuck
                    </button>
<button class="px-4 py-2 rounded-full glass-card text-xs font-medium text-on-surface hover:text-tertiary border border-white/5 transition-all active:scale-95">
                        Daily reflection
                    </button>
</div>
<!-- Input Box -->
<div class="max-w-4xl mx-auto relative group">
<div class="absolute -inset-1 bg-gradient-to-r from-tertiary/20 to-primary/20 rounded-[2rem] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
<div class="relative glass-card rounded-[2rem] flex items-center p-2 shadow-2xl border border-white/10">
<button class="p-3 text-on-surface-variant hover:text-tertiary transition-colors">
<span class="material-symbols-outlined" data-icon="add_circle">add_circle</span>
</button>
<input class="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-on-surface-variant/50 font-body px-4 py-3" placeholder="Speak to the Curator..." type="text"/>
<button class="p-3 text-on-surface-variant hover:text-tertiary transition-colors">
<span class="material-symbols-outlined" data-icon="mic">mic</span>
</button>
<button class="ml-2 bg-tertiary text-on-tertiary h-10 w-10 rounded-full flex items-center justify-center hover:shadow-[0_0_20px_rgba(193,122,114,0.4)] transition-all active:scale-90">
<span class="material-symbols-outlined font-bold" data-icon="arrow_upward">arrow_upward</span>
</button>
</div>
</div>
<p class="text-center text-[10px] text-on-surface-variant/40 mt-4 font-mono uppercase tracking-[0.2em]">
                    Motion AI is an exploratory intelligence. Verify key insights.
                </p>
</div>
<!-- Background Aesthetic Elements (Blobs) -->
<div class="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
<div class="absolute bottom-[-10%] left-[-5%] w-[30rem] h-[30rem] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
</main>
</div>
</body></html>

<!-- Calendar -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:opsz,wght@6-72,400;6-72,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .calendar-grid {
            display: grid;
            grid-template-columns: 64px repeat(7, 1fr);
        }
        body {
            background-color: #0b1325;
            color: #f5f5f5;
            font-family: 'Space Grotesk', sans-serif;
        }
        .font-mono-data {
            font-family: 'JetBrains Mono', monospace;
        }
        .font-serif-editorial {
            font-family: 'Playfair Display', serif;
        }
    </style>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-secondary-container": "#a8b5d9",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary-fixed-variant": "#3a4665",
                        "secondary-fixed": "#d9e2ff",
                        "on-surface": "#dbe2fb",
                        "inverse-primary": "#565e73",
                        "secondary": "#b9c6eb",
                        "secondary-fixed-dim": "#b9c6eb",
                        "primary": "#bec6df",
                        "on-primary": "#283043",
                        "background": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-error-container": "#ffdad6",
                        "on-tertiary-container": "#b36e67",
                        "inverse-on-surface": "#283043",
                        "surface": "#0b1325",
                        "on-background": "#dbe2fb",
                        "tertiary-container": "#320806",
                        "tertiary-fixed": "#ffdad6",
                        "error": "#ffb4ab",
                        "surface-container-low": "#131b2d",
                        "inverse-surface": "#dbe2fb",
                        "surface-tint": "#bec6df",
                        "primary-container": "#0f1729",
                        "error-container": "#93000a",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "primary-fixed": "#dbe2fb",
                        "on-tertiary-fixed": "#380c09",
                        "on-primary-container": "#798097",
                        "surface-container-lowest": "#060e1f",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "on-tertiary": "#53211c",
                        "on-primary-fixed-variant": "#3f465b",
                        "outline-variant": "#45464c",
                        "outline": "#909097",
                        "on-primary-fixed": "#131b2d",
                        "surface-container-highest": "#2d3448",
                        "surface-dim": "#0b1325",
                        "on-secondary": "#23304d",
                        "surface-container": "#171f32",
                        "tertiary": "#ffb4ab",
                        "secondary-container": "#3a4665",
                        "surface-variant": "#2d3448",
                        "primary-fixed-dim": "#bec6df",
                        "surface-bright": "#31394c",
                        "surface-container-high": "#222a3d",
                        "on-error": "#690005"
                    },
                    fontFamily: {
                        "headline": ["Newsreader"],
                        "body": ["Space Grotesk"],
                        "label": ["Space Grotesk"]
                    },
                    borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "full": "9999px"},
                },
            },
        }
    </script>
</head>
<body class="flex overflow-hidden h-screen">
<!-- SideNavBar (Shared Component) -->
<aside class="bg-[#060E1F]/80 backdrop-blur-xl text-[#C17A72] font-['Space_Grotesk'] text-sm tracking-wide fixed left-0 h-screen w-64 border-r border-white/10 shadow-[0px_20px_40px_rgba(15,23,41,0.4)] flex flex-col h-full py-8 px-4 z-50">
<div class="mb-10 px-2">
<span class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</span>
<p class="text-[#9CA3AF] text-xs mt-1">Celestial Curator</p>
</div>
<nav class="flex-grow space-y-2">
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span>Dashboard</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 transition-all duration-300 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span>Vision Board</span>
</a>
<!-- Active State: Calendar -->
<a class="relative text-[#F5F5F5] before:content-[''] before:absolute before:left-[-16px] before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span>Calendar</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 transition-all duration-300 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
<span>AI Coach</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 transition-all duration-300 rounded-lg" href="#">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span>Journal</span>
</a>
</nav>
<div class="mt-auto space-y-2 border-t border-white/5 pt-6">
<button class="w-full bg-[#C17A72] text-white py-2.5 rounded-xl font-medium mb-4 scale-98 active:scale-95 duration-200">
                Auto-schedule
            </button>
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span>Settings</span>
</a>
<a class="flex items-center gap-3 px-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined" data-icon="help_outline">help_outline</span>
<span>Support</span>
</a>
</div>
</aside>
<main class="flex-grow ml-64 flex flex-col bg-[#0b1325]">
<!-- TopNavBar (Shared Component) -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 w-full z-40 bg-transparent">
<div class="flex items-center gap-8">
<div class="flex items-center gap-4">
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors font-['Space_Grotesk'] font-medium text-sm opacity-80 hover:opacity-100 duration-300" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors font-['Space_Grotesk'] font-medium text-sm opacity-80 hover:opacity-100 duration-300" href="#">Insights</a>
</div>
</div>
<div class="flex items-center gap-6">
<div class="relative">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer" data-icon="notifications">notifications</span>
<div class="absolute -top-1 -right-1 w-2 h-2 bg-[#C17A72] rounded-full"></div>
</div>
<div class="w-8 h-8 rounded-full overflow-hidden border border-white/10">
<img class="w-full h-full object-cover" data-alt="User Profile Avatar" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAu3KAlmsAOgzDLp8afZHaxqH-EJ0X7sS7xCDQJk3LF4_d5FwFeAiwS8qgrjEnBpTWtF2fAR5WqxVB1szj1ZbFlO-23cwjIfiZYv6uOPppb-jVCVcj3zTrkDRUmXG3wXakxtEFTG92yd3Kr9h_lVmuwr-wsxnZaEZVK4UoWvMSCjfKzTEo8SbnzvEL75LYPuItFPQvEWszEQ3YNWBBMKFPEkO1pEmzk3hysKJ0Rmv3poQEsSUrC9EuVou8kFx5jWQIE1jLYJ1nMpw"/>
</div>
</div>
</header>
<!-- Calendar Content -->
<section class="mt-16 p-8 flex gap-8 h-[calc(100vh-4rem)]">
<!-- Main Calendar View -->
<div class="flex-grow flex flex-col">
<div class="mb-8 flex justify-between items-end">
<div>
<h1 class="text-5xl font-serif-editorial text-[#F5F5F5]">Calendar</h1>
<p class="text-[#9CA3AF] font-mono-data text-xs mt-2 uppercase tracking-widest">October 21 — 27, 2023</p>
</div>
<div class="flex gap-2">
<button class="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF]"><span class="material-symbols-outlined" data-icon="chevron_left">chevron_left</span></button>
<button class="px-4 py-2 rounded-lg hover:bg-white/5 text-[#F5F5F5] font-medium border border-white/10">Today</button>
<button class="p-2 rounded-lg hover:bg-white/5 text-[#9CA3AF]"><span class="material-symbols-outlined" data-icon="chevron_right">chevron_right</span></button>
</div>
</div>
<!-- Calendar Grid Container -->
<div class="flex-grow glass-card rounded-2xl overflow-hidden flex flex-col">
<!-- Day Headers -->
<div class="calendar-grid border-b border-white/5 bg-white/5">
<div class="h-12"></div>
<div class="h-12 flex flex-col justify-center items-center">
<span class="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Mon</span>
<span class="text-sm font-mono-data text-[#F5F5F5]">21</span>
</div>
<div class="h-12 flex flex-col justify-center items-center bg-white/5">
<span class="text-[10px] text-[#C17A72] uppercase font-bold tracking-tighter">Tue</span>
<span class="text-sm font-mono-data text-[#F5F5F5]">22</span>
</div>
<div class="h-12 flex flex-col justify-center items-center">
<span class="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Wed</span>
<span class="text-sm font-mono-data text-[#F5F5F5]">23</span>
</div>
<div class="h-12 flex flex-col justify-center items-center">
<span class="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Thu</span>
<span class="text-sm font-mono-data text-[#F5F5F5]">24</span>
</div>
<div class="h-12 flex flex-col justify-center items-center">
<span class="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-tighter">Fri</span>
<span class="text-sm font-mono-data text-[#F5F5F5]">25</span>
</div>
<div class="h-12 flex flex-col justify-center items-center text-[#9CA3AF]/50">
<span class="text-[10px] uppercase font-bold tracking-tighter">Sat</span>
<span class="text-sm font-mono-data">26</span>
</div>
<div class="h-12 flex flex-col justify-center items-center text-[#9CA3AF]/50">
<span class="text-[10px] uppercase font-bold tracking-tighter">Sun</span>
<span class="text-sm font-mono-data">27</span>
</div>
</div>
<!-- Scrollable Grid Body -->
<div class="flex-grow overflow-y-auto relative custom-scrollbar">
<div class="calendar-grid min-h-full">
<!-- Time Column -->
<div class="border-r border-white/5 flex flex-col text-right pr-3 pt-4 text-[10px] font-mono-data text-[#9CA3AF]/60 space-y-[44px]">
<span>07:00</span>
<span>08:00</span>
<span>09:00</span>
<span>10:00</span>
<span>11:00</span>
<span>12:00</span>
<span>13:00</span>
<span>14:00</span>
<span>15:00</span>
<span>16:00</span>
<span>17:00</span>
<span>18:00</span>
<span>19:00</span>
<span>20:00</span>
<span>21:00</span>
<span>22:00</span>
</div>
<!-- Day Columns -->
<div class="relative border-r border-white/5"></div>
<div class="relative border-r border-white/5">
<!-- Event: Morning Run -->
<div class="absolute top-[60px] left-1 right-1 h-[60px] glass-card border-l-2 border-l-[#C17A72] rounded-md p-2 flex flex-col justify-between group cursor-pointer hover:bg-white/10 transition-all">
<div class="text-[11px] font-bold text-[#F5F5F5] leading-tight">Morning Run</div>
<div class="text-[9px] text-[#9CA3AF] font-mono-data uppercase">Goal: Health</div>
</div>
<!-- Event: Product Strategy -->
<div class="absolute top-[240px] left-1 right-1 h-[120px] glass-card border-l-2 border-l-[#BEC6DF] rounded-md p-2 flex flex-col justify-between group cursor-pointer hover:bg-white/10 transition-all">
<div>
<div class="text-[11px] font-bold text-[#F5F5F5] leading-tight">Product Strategy</div>
<div class="text-[9px] text-[#9CA3AF] mt-1">Deep Work Phase</div>
</div>
<div class="text-[9px] text-[#9CA3AF] font-mono-data uppercase">Goal: Business</div>
</div>
</div>
<div class="relative border-r border-white/5"></div>
<div class="relative border-r border-white/5"></div>
<div class="relative border-r border-white/5"></div>
<div class="relative border-r border-white/5 bg-black/5"></div>
<div class="relative bg-black/5"></div>
<!-- Horizontal Grid Lines Overlay (Positioned absolutely over columns) -->
<div class="absolute inset-0 pointer-events-none">
<div class="grid grid-cols-1 divide-y divide-white/5 h-full">
<div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div><div class="h-[60px]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
<!-- Drag-to-schedule task drawer -->
<aside class="w-80 flex flex-col gap-6">
<div class="glass-card rounded-2xl p-6 flex-grow flex flex-col">
<div class="flex items-center justify-between mb-6">
<h3 class="text-lg font-medium text-[#F5F5F5]">Pending Tasks</h3>
<span class="material-symbols-outlined text-[#9CA3AF] text-xl" data-icon="more_horiz">more_horiz</span>
</div>
<div class="space-y-4 overflow-y-auto">
<!-- Task 1 -->
<div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-[#9CA3AF] mt-0.5" data-icon="drag_indicator">drag_indicator</span>
<div>
<h4 class="text-sm font-medium text-[#F5F5F5]">Review Q4 Roadmap</h4>
<div class="flex items-center gap-2 mt-2">
<span class="w-2 h-2 rounded-full bg-[#BEC6DF]"></span>
<span class="text-[10px] font-mono-data text-[#9CA3AF]">45 MIN</span>
</div>
</div>
</div>
</div>
<!-- Task 2 -->
<div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all group">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-[#9CA3AF] mt-0.5" data-icon="drag_indicator">drag_indicator</span>
<div>
<h4 class="text-sm font-medium text-[#F5F5F5]">Sync with Design Team</h4>
<div class="flex items-center gap-2 mt-2">
<span class="w-2 h-2 rounded-full bg-[#C17A72]"></span>
<span class="text-[10px] font-mono-data text-[#9CA3AF]">30 MIN</span>
</div>
</div>
</div>
</div>
<!-- Task 3 -->
<div class="p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-grab active:cursor-grabbing transition-all group opacity-60">
<div class="flex items-start gap-3">
<span class="material-symbols-outlined text-[#9CA3AF] mt-0.5" data-icon="drag_indicator">drag_indicator</span>
<div>
<h4 class="text-sm font-medium text-[#F5F5F5]">Weekly Reflection</h4>
<div class="flex items-center gap-2 mt-2">
<span class="w-2 h-2 rounded-full bg-outline-variant"></span>
<span class="text-[10px] font-mono-data text-[#9CA3AF]">20 MIN</span>
</div>
</div>
</div>
</div>
</div>
<div class="mt-auto pt-6">
<div class="glass-card bg-[#C17A72]/10 border-[#C17A72]/20 rounded-xl p-4">
<div class="flex gap-3">
<span class="material-symbols-outlined text-[#C17A72]" data-icon="auto_fix_high">auto_fix_high</span>
<p class="text-xs text-[#BEC6DF] leading-relaxed">
                                    AI Suggestion: You have a 2-hour gap on Wednesday. Schedule <span class="text-[#F5F5F5] font-bold">Deep Work</span> there?
                                </p>
</div>
<button class="mt-3 w-full text-[10px] font-bold uppercase tracking-widest text-[#C17A72] py-2 hover:bg-[#C17A72]/10 rounded-lg transition-colors">
                                Apply Suggestion
                            </button>
</div>
</div>
</div>
<!-- Celestial Focus Card -->
<div class="glass-card rounded-2xl p-6 overflow-hidden relative group">
<div class="absolute -right-4 -bottom-4 w-24 h-24 bg-[#C17A72] blur-[40px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
<h4 class="text-xs font-mono-data text-[#9CA3AF] uppercase mb-4 tracking-widest">Focus Target</h4>
<div class="flex items-center gap-4">
<div class="relative w-12 h-12 flex items-center justify-center">
<svg class="absolute inset-0 w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" stroke-width="3"></circle>
<circle class="text-[#C17A72]" cx="24" cy="24" fill="transparent" r="20" stroke="currentColor" stroke-dasharray="125.6" stroke-dashoffset="37" stroke-width="3"></circle>
</svg>
<span class="text-[10px] font-mono-data">70%</span>
</div>
<div>
<p class="text-sm font-medium text-[#F5F5F5]">Deep Work Ratio</p>
<p class="text-[10px] text-[#9CA3AF]">Celestial state achieved</p>
</div>
</div>
</div>
</aside>
</section>
</main>
<style>
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(193, 122, 114, 0.2);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(193, 122, 114, 0.5);
        }
    </style>
</body></html>

<!-- Design System -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion - Vision Board</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:opsz,ital,wght@6..72,0,400;6..72,1,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "inverse-on-surface": "#283043",
                        "surface-container-lowest": "#060e1f",
                        "surface-variant": "#2d3448",
                        "surface-container-highest": "#2d3448",
                        "secondary-fixed-dim": "#b9c6eb",
                        "on-primary-container": "#798097",
                        "background": "#0b1325",
                        "on-primary": "#283043",
                        "primary-fixed": "#dbe2fb",
                        "on-tertiary-container": "#b36e67",
                        "on-secondary-fixed": "#0d1b37",
                        "on-background": "#dbe2fb",
                        "tertiary-fixed": "#ffdad6",
                        "surface-container": "#171f32",
                        "secondary": "#b9c6eb",
                        "on-secondary-fixed-variant": "#3a4665",
                        "tertiary-container": "#320806",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "surface-bright": "#31394c",
                        "surface-container-high": "#222a3d",
                        "inverse-surface": "#dbe2fb",
                        "on-secondary-container": "#a8b5d9",
                        "surface": "#0b1325",
                        "on-tertiary": "#53211c",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary": "#23304d",
                        "surface-tint": "#bec6df",
                        "on-surface": "#dbe2fb",
                        "outline-variant": "#45464c",
                        "outline": "#909097",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "on-tertiary-fixed": "#380c09",
                        "on-error": "#690005",
                        "secondary-fixed": "#d9e2ff",
                        "primary-fixed-dim": "#bec6df",
                        "surface-container-low": "#131b2d",
                        "on-primary-fixed": "#131b2d",
                        "surface-dim": "#0b1325",
                        "secondary-container": "#3a4665",
                        "on-primary-fixed-variant": "#3f465b",
                        "inverse-primary": "#565e73",
                        "error-container": "#93000a",
                        "on-error-container": "#ffdad6",
                        "primary-container": "#0f1729",
                        "tertiary": "#ffb4ab",
                        "primary": "#bec6df",
                        "error": "#ffb4ab"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Playfair Display", "serif"],
                        "display": ["Playfair Display", "serif"],
                        "body": ["Space Grotesk", "sans-serif"],
                        "label": ["Space Grotesk", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #060E1F; }
        ::-webkit-scrollbar-thumb { background: #2D3448; border-radius: 10px; }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-tertiary/30">
<div class="flex min-h-screen">
<!-- SideNavBar -->
<aside class="docked left-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col h-full py-8 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.4)] fixed z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-[#C17A72] mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined transition-transform group-active:scale-95">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold hover:bg-white/5 rounded-lg" href="#">
<span class="material-symbols-outlined">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto px-4 space-y-6">
<button class="w-full py-3 bg-primary-container text-primary rounded-xl font-medium text-sm hover:brightness-110 transition-all border border-white/5 active:scale-95">
                    Auto-schedule
                </button>
<div class="space-y-2">
<a class="flex items-center gap-3 text-[#9CA3AF] hover:text-[#BEC6DF] text-sm py-2" href="#">
<span class="material-symbols-outlined">settings</span>
<span>Settings</span>
</a>
<a class="flex items-center gap-3 text-[#9CA3AF] hover:text-[#BEC6DF] text-sm py-2" href="#">
<span class="material-symbols-outlined">help_outline</span>
<span>Support</span>
</a>
</div>
</div>
</aside>
<!-- Main Content Area -->
<main class="flex-1 ml-64 min-h-screen relative">
<!-- TopNavBar -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 w-full z-40 bg-transparent">
<div class="flex gap-6 items-center">
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors opacity-80 hover:opacity-100" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors opacity-80 hover:opacity-100" href="#">Insights</a>
</div>
<div class="flex items-center gap-6">
<div class="relative group">
<input class="bg-surface-container-low border-none rounded-full px-4 py-1.5 text-xs w-48 focus:ring-1 focus:ring-tertiary/40 transition-all placeholder:text-on-primary-container" placeholder="Search aspirations..." type="text"/>
<span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-primary-container text-sm">search</span>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-tertiary transition-colors">notifications</span>
<div class="h-8 w-8 rounded-full overflow-hidden border border-white/10 cursor-pointer">
<img class="w-full h-full object-cover" data-alt="Close-up portrait of a professional woman with a calm and confident expression, set against a soft, out-of-focus urban background with cool blue and warm golden hour lighting. The image maintains a high-end editorial aesthetic consistent with a sophisticated digital sanctuary environment." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6JW4uhURGYZWNA8hRE05Gj0oI5qzCf_pMhfp69SoATr4u2z6_iz2afRJxo6BScFHtXlYkIBoh03RwXPVBKI5cTd5zOM50thAL2reaCu5Zy-JSeIl-DWCmEVcPOkBGv8lNLqanpPWLjL0hBpmV4My_ggzLk_UZvVxQUip0skdTmpCsOh68Ms5y3KzR_gjwoFkOExM-1QzdVUFW6i6g0hmx3z3lJ9wQ1PjTpROsGltyh_P_OeuqXDK2_-4nfb_WiVkekbHBJeU-pQ"/>
</div>
</div>
</div>
</header>
<div class="pt-24 pb-12 px-12 max-w-7xl mx-auto">
<!-- Page Header -->
<div class="mb-12 flex justify-between items-end">
<div class="max-w-2xl">
<h2 class="text-5xl font-headline italic text-on-surface mb-4">Vision Board</h2>
<p class="text-on-primary-container font-body tracking-wide leading-relaxed">
                            Your celestial roadmap to growth. AI-curated milestones aligned with your long-term frequency. 
                            Currently focusing on <span class="text-tertiary italic">Expansion &amp; Resonance</span>.
                        </p>
</div>
<button class="p-4 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">add</span>
</button>
</div>
<!-- Filters -->
<div class="flex gap-3 mb-12 overflow-x-auto pb-4 no-scrollbar">
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-tertiary bg-tertiary/10">All Goals</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Career</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Business</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Finance</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Personal</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Health</button>
<button class="px-6 py-2 rounded-full glass-card border-none text-xs font-medium tracking-widest uppercase text-on-primary-container hover:text-on-surface transition-colors">Creative</button>
</div>
<!-- Bento Grid for Goals -->
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
<!-- Goal Card 1: Creative -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
<div class="flex justify-between items-start mb-8">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-[#C17A72]" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-dasharray="226.2" stroke-dashoffset="79.17" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-sm text-on-surface">65%</div>
</div>
<span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-tertiary/10 text-tertiary rounded-md">Creative</span>
</div>
<h3 class="text-3xl font-headline italic mb-2">Publish First Novel</h3>
<p class="text-on-primary-container text-sm leading-relaxed mb-8">Finalizing the structural edit and character arcs for 'The Midnight Archive'.</p>
<div class="space-y-4 mt-auto">
<p class="text-[10px] uppercase tracking-[0.2em] text-on-primary-container font-medium mb-2">Next Milestones</p>
<div class="flex items-center gap-3 group/item">
<div class="w-5 h-5 rounded border border-tertiary/40 flex items-center justify-center bg-tertiary/5 cursor-pointer">
<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<span class="text-xs text-on-surface-variant line-through opacity-50">Complete Chapter 12 edit</span>
</div>
<div class="flex items-center gap-3 group/item">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center hover:border-tertiary/60 transition-colors cursor-pointer"></div>
<span class="text-xs text-on-surface">Submit draft to beta readers</span>
</div>
<div class="flex items-center gap-3 group/item">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center hover:border-tertiary/60 transition-colors cursor-pointer"></div>
<span class="text-xs text-on-surface">Query primary agent list</span>
</div>
</div>
</div>
<!-- Goal Card 2: Business -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
<div class="flex justify-between items-start mb-8">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-[#C17A72]" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-dasharray="226.2" stroke-dashoffset="135.7" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-sm text-on-surface">40%</div>
</div>
<span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-primary/10 text-primary rounded-md">Business</span>
</div>
<h3 class="text-3xl font-headline italic mb-2">Scale Design Studio</h3>
<p class="text-on-primary-container text-sm leading-relaxed mb-8">Transitioning from solo practitioner to a boutique creative collective.</p>
<div class="space-y-4 mt-auto">
<p class="text-[10px] uppercase tracking-[0.2em] text-on-primary-container font-medium mb-2">Next Milestones</p>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-tertiary/40 flex items-center justify-center bg-tertiary/5 cursor-pointer">
<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<span class="text-xs text-on-surface-variant line-through opacity-50">Revamp service packages</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Hire lead UI specialist</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Launch new portfolio site</span>
</div>
</div>
</div>
<!-- Goal Card 3: Health (Image Focused) -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col relative overflow-hidden group hover:translate-y-[-4px] transition-all duration-500 min-h-[400px]">
<div class="absolute inset-0 z-0">
<img class="w-full h-full object-cover opacity-20 transition-transform duration-700 group-hover:scale-110" data-alt="A serene morning yoga session in a high-floor glass studio overlooking a misty mountain range at sunrise. The lighting is ethereal and soft, with layers of deep indigo and soft coral reflecting off the polished floor. The atmosphere is quiet, meditative, and focused on holistic wellness and mental clarity, perfectly aligned with the Celestial Curator theme." src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5GbStq1l8GY3EF4CyH0DJZLATgUAMOfat-aYXaEiMtdy8bgeSlIRbiFcv6mTQEXm_7iFvhox8Qlv9sAm8HV88483LiVVfikUimYVsQ1l6FCzxi891fii1oPyBnvbsHA7oZMRUkQZtNm6a0Min20gEXLgYJs7leM4dJXyUcAM4w8C4muUgWg6sL_PbDQV4_BUdVk-gsaghrj0EMQYy7viuD0H2KEDDT2FgQRjhdo2PoAVoZOxGsKPY1TIZ6T1aZykBcvJaGNTIdw"/>
<div class="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>
</div>
<div class="relative z-10 flex flex-col h-full">
<div class="flex justify-between items-start mb-8">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-[#C17A72]" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-dasharray="226.2" stroke-dashoffset="45.2" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-sm text-on-surface">80%</div>
</div>
<span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-outline-variant/20 text-on-surface-variant rounded-md">Health</span>
</div>
<h3 class="text-3xl font-headline italic mb-2">Ironman Triathlon</h3>
<p class="text-on-primary-container text-sm leading-relaxed mb-8">Peak training phase. Focusing on endurance and metabolic efficiency.</p>
<div class="space-y-4 mt-auto">
<p class="text-[10px] uppercase tracking-[0.2em] text-on-primary-container font-medium mb-2">Next Milestones</p>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">3-hour brick workout</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Optimize nutrition protocol</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Taper week schedule</span>
</div>
</div>
</div>
</div>
<!-- Goal Card 4: Personal -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col group hover:translate-y-[-4px] transition-all duration-500 xl:col-span-2">
<div class="flex flex-col md:flex-row gap-8">
<div class="flex-1">
<div class="flex justify-between items-start mb-6">
<span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-surface-container-highest text-secondary rounded-md">Personal</span>
</div>
<h3 class="text-4xl font-headline italic mb-4">Master Minimalism</h3>
<p class="text-on-primary-container text-sm leading-relaxed mb-6 max-w-lg">Designing a life of essentialism by curating high-quality possessions and clearing mental clutter to make room for deep work and presence.</p>
<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
<div class="p-4 rounded-xl bg-white/5 border border-white/5">
<p class="text-[10px] uppercase tracking-wider text-tertiary mb-1">Focus Level</p>
<p class="font-mono text-xl text-on-surface">High Priority</p>
</div>
<div class="p-4 rounded-xl bg-white/5 border border-white/5">
<p class="text-[10px] uppercase tracking-wider text-tertiary mb-1">Coach Sentiment</p>
<p class="font-mono text-xl text-on-surface">Balanced</p>
</div>
</div>
</div>
<div class="w-full md:w-64 space-y-6">
<div class="relative w-32 h-32 mx-auto">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" stroke-width="6"></circle>
<circle class="text-[#C17A72]" cx="64" cy="64" fill="transparent" r="60" stroke="currentColor" stroke-dasharray="377" stroke-dashoffset="301" stroke-width="6"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-lg text-on-surface">20%</div>
</div>
<div class="space-y-4">
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Capsule wardrobe audit</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Digital detox protocol</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Library curation project</span>
</div>
</div>
</div>
</div>
</div>
<!-- Goal Card 5: Finance -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col group hover:translate-y-[-4px] transition-all duration-500">
<div class="flex justify-between items-start mb-8">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-[#C17A72]" cx="40" cy="40" fill="transparent" r="36" stroke="currentColor" stroke-dasharray="226.2" stroke-dashoffset="11.31" stroke-width="4"></circle>
</svg>
<div class="absolute inset-0 flex items-center justify-center font-mono text-sm text-on-surface">95%</div>
</div>
<span class="text-[10px] font-mono uppercase tracking-widest px-3 py-1 bg-surface-container-high text-on-surface-variant rounded-md">Finance</span>
</div>
<h3 class="text-3xl font-headline italic mb-2">Real Estate Fund</h3>
<p class="text-on-primary-container text-sm leading-relaxed mb-8">Accumulating capital for the first commercial development partnership.</p>
<div class="space-y-4 mt-auto">
<p class="text-[10px] uppercase tracking-[0.2em] text-on-primary-container font-medium mb-2">Next Milestones</p>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-tertiary/40 flex items-center justify-center bg-tertiary/5 cursor-pointer">
<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<span class="text-xs text-on-surface-variant line-through opacity-50">Review Q3 dividend yield</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-tertiary/40 flex items-center justify-center bg-tertiary/5 cursor-pointer">
<span class="material-symbols-outlined text-[16px] text-tertiary" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<span class="text-xs text-on-surface-variant line-through opacity-50">Finalize LP agreement</span>
</div>
<div class="flex items-center gap-3">
<div class="w-5 h-5 rounded border border-outline/30 flex items-center justify-center cursor-pointer"></div>
<span class="text-xs text-on-surface">Transfer final seed capital</span>
</div>
</div>
</div>
</div>
</div>
<!-- Footer Quote (Editorial Touch) -->
<footer class="mt-12 mb-20 px-12 text-center">
<div class="max-w-xl mx-auto border-t border-white/5 pt-12">
<p class="font-headline italic text-2xl text-on-primary-container mb-4">"The future belongs to those who see beauty in the slow unfolding of their own potential."</p>
<p class="font-mono text-[10px] tracking-[0.3em] uppercase text-tertiary">Motion Celestial AI</p>
</div>
</footer>
</main>
</div>
</body></html>

<!-- Vision Board -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion — Launch SaaS Business</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "on-secondary-container": "#a8b5d9",
              "on-surface-variant": "#c6c6cd",
              "on-secondary-fixed-variant": "#3a4665",
              "secondary-fixed": "#d9e2ff",
              "on-surface": "#dbe2fb",
              "inverse-primary": "#565e73",
              "secondary": "#b9c6eb",
              "secondary-fixed-dim": "#b9c6eb",
              "primary": "#bec6df",
              "on-primary": "#283043",
              "background": "#0b1325",
              "on-secondary-fixed": "#0d1b37",
              "on-error-container": "#ffdad6",
              "on-tertiary-container": "#b36e67",
              "inverse-on-surface": "#283043",
              "surface": "#0b1325",
              "on-background": "#dbe2fb",
              "tertiary-container": "#320806",
              "tertiary-fixed": "#ffdad6",
              "error": "#ffb4ab",
              "surface-container-low": "#131b2d",
              "inverse-surface": "#dbe2fb",
              "surface-tint": "#bec6df",
              "primary-container": "#0f1729",
              "error-container": "#93000a",
              "on-tertiary-fixed-variant": "#6f3630",
              "primary-fixed": "#dbe2fb",
              "on-tertiary-fixed": "#380c09",
              "on-primary-fixed-variant": "#3f465b",
              "outline-variant": "#45464c",
              "outline": "#909097",
              "on-primary-fixed": "#131b2d",
              "surface-container-highest": "#2d3448",
              "surface-dim": "#0b1325",
              "on-secondary": "#23304d",
              "surface-container": "#171f32",
              "tertiary": "#ffb4ab",
              "secondary-container": "#3a4665",
              "surface-variant": "#2d3448",
              "primary-fixed-dim": "#bec6df",
              "surface-bright": "#31394c",
              "surface-container-high": "#222a3d",
              "on-error": "#690005"
            },
            fontFamily: {
              "headline": ["Playfair Display", "serif"],
              "body": ["Space Grotesk", "sans-serif"],
              "label": ["Space Grotesk", "sans-serif"],
              "mono": ["JetBrains Mono", "monospace"]
            },
            borderRadius: {"DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "0.75rem", "2xl": "1.5rem", "full": "9999px"},
          },
        },
      }
    </script>
<style>
      .glass-card {
        background: rgba(26, 39, 68, 0.6);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.75rem; /* 12px mapping to xl in tailwind/custom */
      }
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
      }
      .ai-bubble {
        background: linear-gradient(135deg, rgba(193, 122, 114, 0.2), rgba(50, 8, 6, 0.4));
        border: 1px solid rgba(193, 122, 114, 0.2);
      }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-tertiary/30">
<!-- Sidebar Navigation -->
<aside class="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-headline italic text-[#F5F5F5] tracking-tight">Motion</h1>
<p class="text-xs text-on-primary-container font-label mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-sm font-label text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined text-lg">dashboard</span>
<span>Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-sm font-label text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined text-lg">auto_awesome_motion</span>
<span>Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-sm font-label text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined text-lg">calendar_today</span>
<span>Calendar</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-sm font-label relative text-[#F5F5F5] font-bold transition-all duration-300 rounded-lg group" href="#">
<div class="absolute left-0 w-[2px] h-6 bg-[#C17A72]"></div>
<span class="material-symbols-outlined text-lg">smart_toy</span>
<span>AI Coach</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-sm font-label text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined text-lg">edit_note</span>
<span>Journal</span>
</a>
</nav>
<div class="mt-auto pt-8 border-t border-white/5 space-y-2">
<button class="w-full flex items-center gap-3 px-4 py-3 text-xs font-label text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors rounded-lg">
<span class="material-symbols-outlined text-lg">settings</span>
<span>Settings</span>
</button>
<button class="w-full flex items-center gap-3 px-4 py-3 text-xs font-label text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors rounded-lg">
<span class="material-symbols-outlined text-lg">help_outline</span>
<span>Support</span>
</button>
</div>
</aside>
<!-- Top Navigation -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-transparent flex justify-between items-center px-8 z-40">
<div class="flex items-center gap-8">
<nav class="flex gap-6">
<a class="text-sm font-medium text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors" href="#">Focus Mode</a>
<a class="text-sm font-medium text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors" href="#">Insights</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="p-2 text-[#BEC6DF] hover:text-[#F5F5F5] transition-colors">
<span class="material-symbols-outlined">notifications</span>
</button>
<div class="h-8 w-8 rounded-full overflow-hidden border border-white/10">
<img alt="User Profile Avatar" class="w-full h-full object-cover" data-alt="Close up portrait of a professional woman" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkHTgcp0hLxGO-0CXnAQqfFe6BQFCuwkDi5V0oMZiTnH3HZRFBCBxBk32r9mSjOiU7FBVxlA0GTZet6YR_p-rGI9-DZ14Jtf7Ju37lVeEs0U7IC16xdDc5dIt-QXNcvdbMAaSnBdzcDx_HG0Gvt2M4b8T6KPwRfBOK7YWmYXIeuaTj0OjVSsLckhEQuXiGixKLi0HEeWDB2_J-ngneDE8y-Lsmtcf630McnETDBKTtL6HHwCvUFRunG0UamIbzxTuLNzNgf1b3iA"/>
</div>
</div>
</header>
<!-- Main Content -->
<main class="ml-64 pt-24 px-8 pb-12 min-h-screen">
<div class="max-w-6xl mx-auto grid grid-cols-12 gap-8">
<!-- Left Column: Goal Summary -->
<section class="col-span-12 lg:col-span-4 space-y-8">
<div class="glass-card p-8 flex flex-col items-center text-center">
<div class="relative w-48 h-48 mb-8">
<!-- Progress Ring -->
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-container-highest/30" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-width="8"></circle>
<circle class="text-[#C17A72]" cx="96" cy="96" fill="transparent" r="88" stroke="currentColor" stroke-dasharray="552.92" stroke-dashoffset="138.23" stroke-linecap="round" stroke-width="8"></circle>
</svg>
<div class="absolute inset-0 flex flex-col items-center justify-center">
<span class="font-mono text-3xl font-medium text-[#F5F5F5]">75%</span>
<span class="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-label">Complete</span>
</div>
</div>
<h2 class="font-headline text-3xl text-[#F5F5F5] leading-tight mb-2">Launch SaaS Business</h2>
<p class="text-sm text-[#9CA3AF] font-body leading-relaxed max-w-xs">Transitioning from architecture to cloud-based solutions. Finalizing the MVP deployment phase.</p>
</div>
<div class="glass-card p-6">
<h3 class="font-label text-xs font-semibold uppercase tracking-widest text-[#C17A72] mb-4">Upcoming Milestones</h3>
<div class="space-y-4">
<div class="flex items-center gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
<span class="w-2 h-2 rounded-full bg-tertiary shadow-[0_0_8px_rgba(255,180,171,0.6)]"></span>
<div class="flex-1">
<p class="text-sm font-label text-[#F5F5F5]">Beta User Onboarding</p>
<p class="text-[10px] text-[#9CA3AF] font-mono">OCT 24, 2023</p>
</div>
</div>
<div class="flex items-center gap-4 p-3 rounded-lg border border-white/5">
<span class="w-2 h-2 rounded-full bg-[#BEC6DF]"></span>
<div class="flex-1">
<p class="text-sm font-label text-[#BEC6DF]">Payment Gateway Sync</p>
<p class="text-[10px] text-[#9CA3AF] font-mono">OCT 28, 2023</p>
</div>
</div>
</div>
</div>
</section>
<!-- Middle/Right Column: Interactive AI Interface -->
<section class="col-span-12 lg:col-span-8 flex flex-col">
<!-- Inner Tabs Navigation -->
<div class="flex gap-1 mb-6 bg-surface-container-low p-1 rounded-xl w-fit">
<button class="px-6 py-2 text-sm font-label text-[#9CA3AF] hover:text-[#F5F5F5] transition-all rounded-lg">Milestones</button>
<button class="px-6 py-2 text-sm font-label text-[#9CA3AF] hover:text-[#F5F5F5] transition-all rounded-lg">Tasks</button>
<button class="px-6 py-2 text-sm font-label text-[#F5F5F5] bg-[#1A2744] shadow-sm rounded-lg">AI Coach</button>
</div>
<!-- Chat Interface -->
<div class="glass-card flex-1 flex flex-col min-h-[600px] overflow-hidden">
<div class="p-6 border-b border-white/5 flex items-center justify-between">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full bg-gradient-to-br from-[#C17A72] to-[#320806] flex items-center justify-center">
<span class="material-symbols-outlined text-[#F5F5F5]" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
</div>
<div>
<h3 class="font-label font-bold text-[#F5F5F5] text-sm">SaaS Business AI Coach</h3>
<div class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-[#C17A72] animate-pulse"></span>
<span class="text-[10px] text-[#9CA3AF] font-mono">STRATEGIZING...</span>
</div>
</div>
</div>
<button class="text-[#9CA3AF] hover:text-[#F5F5F5]">
<span class="material-symbols-outlined">more_vert</span>
</button>
</div>
<div class="flex-1 p-8 overflow-y-auto space-y-6">
<!-- User Message -->
<div class="flex justify-end">
<div class="max-w-[80%] p-4 bg-surface-container-highest rounded-2xl rounded-tr-none">
<p class="text-sm font-body leading-relaxed text-[#F5F5F5]">
                                    I'm feeling stuck on the pricing model. Should I go with tiered subscriptions or a usage-based approach for the initial launch?
                                </p>
</div>
</div>
<!-- AI Response -->
<div class="flex justify-start">
<div class="max-w-[85%] ai-bubble backdrop-blur-md p-6 rounded-2xl rounded-tl-none space-y-4">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-[#C17A72] text-sm">temp_preferences_custom</span>
<span class="text-[10px] font-mono tracking-widest text-[#C17A72] uppercase">Strategic Perspective</span>
</div>
<p class="text-sm font-body leading-relaxed text-[#F5F5F5]">
                                    Based on your current progress (75%) and the specific niche of architectural cloud solutions, a <span class="text-[#C17A72] font-semibold">Tiered Subscription</span> model is likely your safest bet for the MVP. 
                                </p>
<p class="text-sm font-body leading-relaxed text-[#F5F5F5]">
                                    Usage-based pricing often creates "billing anxiety" for enterprise-level clients in your sector. By offering three clear tiers, you provide the predictability architectural firms crave while maintaining scalability.
                                </p>
<div class="grid grid-cols-2 gap-3 pt-2">
<div class="p-3 bg-white/5 rounded-lg border border-[#C17A72]/20">
<p class="text-[10px] font-mono text-[#9CA3AF] mb-1">PRO TIP</p>
<p class="text-xs font-body text-[#BEC6DF]">Include a "Project-Based" add-on for flexibility.</p>
</div>
<div class="p-3 bg-white/5 rounded-lg border border-[#C17A72]/20">
<p class="text-[10px] font-mono text-[#9CA3AF] mb-1">NEXT STEP</p>
<p class="text-xs font-body text-[#BEC6DF]">Define features for the 'Standard' tier.</p>
</div>
</div>
</div>
</div>
<!-- Pulse Indicator -->
<div class="flex justify-start items-center gap-3">
<div class="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
<div class="flex gap-1">
<div class="w-1 h-1 rounded-full bg-[#C17A72]/40 animate-bounce"></div>
<div class="w-1 h-1 rounded-full bg-[#C17A72]/60 animate-bounce [animation-delay:0.2s]"></div>
<div class="w-1 h-1 rounded-full bg-[#C17A72]/80 animate-bounce [animation-delay:0.4s]"></div>
</div>
</div>
<span class="text-[10px] font-mono text-[#9CA3AF] italic">Thinking...</span>
</div>
</div>
<!-- Input Area -->
<div class="p-6 bg-[#060E1F]/40 border-t border-white/5">
<div class="relative flex items-center">
<input class="w-full bg-surface-container-low border-white/10 focus:border-[#C17A72]/40 focus:ring-0 rounded-xl px-6 py-4 text-sm font-body text-[#F5F5F5] placeholder-[#9CA3AF] transition-all" placeholder="Ask your AI Coach anything..." type="text"/>
<div class="absolute right-4 flex items-center gap-3">
<button class="text-[#9CA3AF] hover:text-[#C17A72] transition-colors">
<span class="material-symbols-outlined">attach_file</span>
</button>
<button class="bg-[#C17A72] text-[#F5F5F5] p-2 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_4px_12px_rgba(193,122,114,0.3)]">
<span class="material-symbols-outlined">send</span>
</button>
</div>
</div>
<div class="mt-3 flex gap-4 px-2">
<button class="text-[10px] font-mono text-[#9CA3AF] hover:text-[#BEC6DF]">#pricing-strategy</button>
<button class="text-[10px] font-mono text-[#9CA3AF] hover:text-[#BEC6DF]">#go-to-market</button>
<button class="text-[10px] font-mono text-[#9CA3AF] hover:text-[#BEC6DF]">#mvp-roadmap</button>
</div>
</div>
</div>
</section>
</div>
</main>
<!-- Background Decor Elements -->
<div class="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#C17A72]/5 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
<div class="fixed bottom-[-5%] left-[10%] w-[30%] h-[30%] bg-[#BEC6DF]/5 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
</body></html>

<!-- Goal Detail - AI Chat -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:opsz,wght@6-72,400;6-72,700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    "colors": {
                        "tertiary": "#ffb4ab",
                        "surface-container-low": "#131b2d",
                        "error-container": "#93000a",
                        "on-secondary-fixed": "#0d1b37",
                        "primary-fixed": "#dbe2fb",
                        "on-surface": "#dbe2fb",
                        "surface-container-high": "#222a3d",
                        "surface-container-highest": "#2d3448",
                        "on-tertiary-container": "#b36e67",
                        "outline-variant": "#45464c",
                        "tertiary-container": "#320806",
                        "surface-tint": "#bec6df",
                        "surface-container": "#171f32",
                        "on-background": "#dbe2fb",
                        "on-primary-fixed": "#131b2d",
                        "on-tertiary-fixed": "#380c09",
                        "on-tertiary": "#53211c",
                        "on-primary-container": "#798097",
                        "primary": "#bec6df",
                        "surface-container-lowest": "#060e1f",
                        "secondary-fixed-dim": "#b9c6eb",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "primary-container": "#0f1729",
                        "inverse-surface": "#dbe2fb",
                        "outline": "#909097",
                        "on-primary-fixed-variant": "#3f465b",
                        "on-secondary": "#23304d",
                        "on-error": "#690005",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "on-surface-variant": "#c6c6cd",
                        "tertiary-fixed": "#ffdad6",
                        "secondary-fixed": "#d9e2ff",
                        "on-primary": "#283043",
                        "surface-variant": "#2d3448",
                        "primary-fixed-dim": "#bec6df",
                        "surface-dim": "#0b1325",
                        "surface-bright": "#31394c",
                        "secondary-container": "#3a4665",
                        "error": "#ffb4ab",
                        "on-secondary-fixed-variant": "#3a4665",
                        "inverse-on-surface": "#283043",
                        "on-secondary-container": "#a8b5d9",
                        "inverse-primary": "#565e73",
                        "on-error-container": "#ffdad6",
                        "background": "#0b1325",
                        "surface": "#0b1325",
                        "secondary": "#b9c6eb"
                    },
                    "borderRadius": {
                        "DEFAULT": "0.25rem",
                        "lg": "0.5rem",
                        "xl": "0.75rem",
                        "full": "9999px"
                    },
                    "fontFamily": {
                        "headline": ["Playfair Display", "serif"],
                        "display": ["Playfair Display", "serif"],
                        "body": ["Space Grotesk", "sans-serif"],
                        "label": ["Space Grotesk", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .glass-card:hover {
            border-color: rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 20px rgba(193, 122, 114, 0.15);
        }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(156, 163, 175, 0.2); border-radius: 10px; }
    </style>
</head>
<body class="bg-surface-dim text-on-surface font-body overflow-hidden">
<div class="flex h-screen w-full">
<!-- SideNavBar (Shared Component) -->
<aside class="docked left-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col py-8 px-4 font-['Space_Grotesk'] text-sm tracking-wide shadow-[0px_20px_40px_rgba(15,23,41,0.4)] z-50">
<div class="mb-10 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-[#C17A72] mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group duration-300" href="#">
<span class="material-symbols-outlined text-lg">dashboard</span>
                    Dashboard
                </a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group duration-300" href="#">
<span class="material-symbols-outlined text-lg">auto_awesome_motion</span>
                    Vision Board
                </a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group duration-300" href="#">
<span class="material-symbols-outlined text-lg">calendar_today</span>
                    Calendar
                </a>
<!-- Active Item Logic: Tasks maps best to Dashboard/AI Coach context, but usually is a standalone tab or sub-item. Since it's a tasks page, we'll assume a dedicated 'Tasks' if it existed, but using the provided JSON: -->
<a class="flex items-center gap-3 px-4 py-3 relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold bg-white/5" href="#">
<span class="material-symbols-outlined text-lg">edit_note</span>
                    Tasks
                </a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 group duration-300" href="#">
<span class="material-symbols-outlined text-lg">smart_toy</span>
                    AI Coach
                </a>
</nav>
<div class="mt-auto space-y-4 pt-6 px-4">
<button class="w-full py-3 bg-[#C17A72] text-on-surface font-bold rounded-lg scale-98 active:scale-95 duration-200 shadow-lg shadow-[#C17A72]/20">
                    Auto-schedule
                </button>
<div class="space-y-1">
<a class="flex items-center gap-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined text-lg">settings</span>
                        Settings
                    </a>
<a class="flex items-center gap-3 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined text-lg">help_outline</span>
                        Support
                    </a>
</div>
</div>
</aside>
<!-- Main Content Canvas -->
<main class="flex-1 flex flex-col relative overflow-hidden">
<!-- TopNavBar (Shared Component Partial) -->
<header class="h-16 flex justify-between items-center px-8 w-full z-40">
<div class="flex items-center gap-6">
<nav class="flex gap-8">
<a class="font-['Space_Grotesk'] font-medium text-sm text-[#C17A72] border-b border-[#C17A72] opacity-80 hover:opacity-100 duration-300" href="#">Focus Mode</a>
<a class="font-['Space_Grotesk'] font-medium text-sm text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors opacity-80 hover:opacity-100 duration-300" href="#">Insights</a>
</nav>
</div>
<div class="flex items-center gap-4">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-white transition-colors">notifications</span>
<div class="w-8 h-8 rounded-full overflow-hidden border border-white/10">
<img class="w-full h-full object-cover" data-alt="A close-up professional portrait of a calm, thoughtful man with soft cinematic lighting. The background is a deep navy blue, maintaining the dark-mode aesthetic of a sophisticated digital sanctuary. He wears a dark, textured garment, and the overall mood is serene and intellectual, fitting for a user profile in a high-end AI coaching application." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8nYH4PHXgPc_XkOKS9BI1ug4rLfvUIwQU1LXM2lftc880L-8WUtAwooIFyBx2j06sYeA60Sr634k15L9awt5CKgj-dvw3N18Gy87m0_0P5vg2D96we4DP8zayTsC2HXhLRJFsCkcx4u9WFJbaY9tv2f7zeXFaLNAmVMGYBA2e1_Icc-S0dL8J_WVDmh_QDHCgxmoXMRoEuxjOnIEW4iSOYKDSxmHUVSrAJk-P-YvSdis6JbUfnNuOCTez11JoaFM-mNJi-FhO7Q"/>
</div>
</div>
</header>
<div class="flex flex-1 overflow-hidden">
<!-- Task Canvas -->
<div class="flex-1 px-12 py-8 custom-scrollbar overflow-y-auto">
<div class="mb-12">
<h2 class="text-5xl font-display font-bold text-white mb-3">Tasks</h2>
<p class="text-subtext italic opacity-80 font-headline text-lg">Aligning your daily actions with your celestial goals.</p>
</div>
<!-- Filter & Control Bar -->
<div class="flex items-center justify-between mb-8">
<div class="flex gap-6 border-b border-white/5 pb-2">
<button class="text-sm font-medium text-[#C17A72] border-b-2 border-[#C17A72] -mb-[10px] pb-2 px-1">All</button>
<button class="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors pb-2 px-1">Today</button>
<button class="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors pb-2 px-1">Upcoming</button>
<button class="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors pb-2 px-1">Done</button>
</div>
<div class="flex items-center gap-4">
<div class="relative">
<span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#9CA3AF]">search</span>
<input class="bg-surface-container-low/50 border-none rounded-full pl-10 pr-4 py-2 text-xs w-64 focus:ring-1 focus:ring-[#C17A72]/30 text-on-surface placeholder-[#45464C]" placeholder="Search tasks..." type="text"/>
</div>
<div class="flex items-center gap-2 text-xs text-[#9CA3AF] bg-surface-container-low/50 px-4 py-2 rounded-full cursor-pointer hover:bg-surface-container-high transition-colors">
<span class="material-symbols-outlined text-sm">swap_vert</span>
<span>Sort: Priority</span>
</div>
</div>
</div>
<!-- Vertical Task List -->
<div class="space-y-4">
<!-- Task Card: Critical -->
<div class="glass-card p-5 rounded-xl flex items-center gap-6 transition-all duration-300 group">
<div class="relative w-6 h-6 flex items-center justify-center">
<input class="w-5 h-5 rounded border-white/20 bg-transparent checked:bg-[#C17A72] focus:ring-0 transition-colors" type="checkbox"/>
</div>
<div class="flex-1">
<div class="flex items-center gap-3 mb-1">
<h3 class="text-base font-medium text-white tracking-tight">Finalize Q4 Strategic Vision Document</h3>
<span class="w-2 h-2 rounded-full bg-[#FFB4AB] shadow-[0_0_8px_#FFB4AB]"></span>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-1.5 text-[10px] font-mono text-tertiary">
<span class="material-symbols-outlined text-[14px]">schedule</span>
                                        14:30 TODAY
                                    </div>
<span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-[#BEC6DF] uppercase tracking-wider font-bold">Business</span>
</div>
</div>
<button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full">
<span class="material-symbols-outlined text-[#9CA3AF]">more_horiz</span>
</button>
</div>
<!-- Task Card: High -->
<div class="glass-card p-5 rounded-xl flex items-center gap-6 transition-all duration-300 group">
<div class="relative w-6 h-6 flex items-center justify-center">
<input class="w-5 h-5 rounded border-white/20 bg-transparent checked:bg-[#C17A72] focus:ring-0 transition-colors" type="checkbox"/>
</div>
<div class="flex-1">
<div class="flex items-center gap-3 mb-1">
<h3 class="text-base font-medium text-white tracking-tight">Deep Work: Architecture Refactoring</h3>
<span class="w-2 h-2 rounded-full bg-orange-400"></span>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF]">
<span class="material-symbols-outlined text-[14px]">schedule</span>
                                        17:00 TODAY
                                    </div>
<span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-[#BEC6DF] uppercase tracking-wider font-bold">Product</span>
</div>
</div>
<button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full">
<span class="material-symbols-outlined text-[#9CA3AF]">more_horiz</span>
</button>
</div>
<!-- Task Card: Medium -->
<div class="glass-card p-5 rounded-xl flex items-center gap-6 transition-all duration-300 group">
<div class="relative w-6 h-6 flex items-center justify-center">
<input class="w-5 h-5 rounded border-white/20 bg-transparent checked:bg-[#C17A72] focus:ring-0 transition-colors" type="checkbox"/>
</div>
<div class="flex-1">
<div class="flex items-center gap-3 mb-1">
<h3 class="text-base font-medium text-white tracking-tight">Post-Workout Mindful Integration</h3>
<span class="w-2 h-2 rounded-full bg-yellow-400"></span>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF]">
<span class="material-symbols-outlined text-[14px]">schedule</span>
                                        08:00 TOMORROW
                                    </div>
<span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-[#BEC6DF] uppercase tracking-wider font-bold">Health</span>
</div>
</div>
<button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full">
<span class="material-symbols-outlined text-[#9CA3AF]">more_horiz</span>
</button>
</div>
<!-- Task Card: Low -->
<div class="glass-card p-5 rounded-xl flex items-center gap-6 transition-all duration-300 group">
<div class="relative w-6 h-6 flex items-center justify-center">
<input class="w-5 h-5 rounded border-white/20 bg-transparent checked:bg-[#C17A72] focus:ring-0 transition-colors" type="checkbox"/>
</div>
<div class="flex-1">
<div class="flex items-center gap-3 mb-1">
<h3 class="text-base font-medium text-white tracking-tight">Review Celestial Reading List</h3>
<span class="w-2 h-2 rounded-full bg-blue-400"></span>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-1.5 text-[10px] font-mono text-[#9CA3AF]">
<span class="material-symbols-outlined text-[14px]">schedule</span>
                                        WEEKEND
                                    </div>
<span class="text-[10px] px-2 py-0.5 rounded bg-surface-container-highest text-[#BEC6DF] uppercase tracking-wider font-bold">Growth</span>
</div>
</div>
<button class="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full">
<span class="material-symbols-outlined text-[#9CA3AF]">more_horiz</span>
</button>
</div>
</div>
</div>
<!-- Right Side Panel -->
<aside class="w-80 h-full bg-surface-container-low/30 p-8 border-l border-white/5 overflow-y-auto custom-scrollbar">
<!-- AI Suggestion Card -->
<div class="relative mb-10 rounded-2xl p-6 overflow-hidden bg-gradient-to-br from-[#1A2744] to-[#0F1729] border border-[#C17A72]/20">
<div class="absolute -top-10 -right-10 w-32 h-32 bg-[#C17A72]/10 rounded-full blur-3xl"></div>
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-[#C17A72]" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<span class="text-[10px] font-bold uppercase tracking-widest text-[#C17A72]">AI Suggestion</span>
</div>
<p class="text-sm text-[#BEC6DF] leading-relaxed mb-4">
                            "Your peak cognitive energy is occurring right now. I recommend tackling <span class="text-white font-medium italic">Strategic Vision</span> before your 3 PM dip."
                        </p>
<button class="w-full py-2 bg-white/5 hover:bg-white/10 text-xs font-bold text-white rounded-lg transition-all border border-white/10">
                            Start Focus Mode
                        </button>
</div>
<!-- Priority Breakdown -->
<div class="mb-10">
<h4 class="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] mb-6">Priority Breakdown</h4>
<div class="space-y-6">
<div>
<div class="flex justify-between text-[11px] mb-2 font-mono">
<span class="text-[#BEC6DF]">CRITICAL ALIGNMENT</span>
<span class="text-white">12%</span>
</div>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-[#FFB4AB]" style="width: 12%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[11px] mb-2 font-mono">
<span class="text-[#BEC6DF]">HIGH MOMENTUM</span>
<span class="text-white">45%</span>
</div>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-orange-400" style="width: 45%"></div>
</div>
</div>
<div>
<div class="flex justify-between text-[11px] mb-2 font-mono">
<span class="text-[#BEC6DF]">MAINTENANCE</span>
<span class="text-white">33%</span>
</div>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-yellow-400" style="width: 33%"></div>
</div>
</div>
</div>
</div>
<!-- Energy Meter -->
<div class="p-6 rounded-2xl bg-surface-container-highest/40 border border-white/5">
<h4 class="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4 text-center">Energy Resonance</h4>
<div class="flex justify-center mb-4">
<div class="relative w-24 h-24 flex items-center justify-center">
<svg class="w-full h-full -rotate-90">
<circle class="text-white/5" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" stroke-width="4"></circle>
<circle class="text-[#C17A72]" cx="48" cy="48" fill="transparent" r="44" stroke="currentColor" stroke-dasharray="276" stroke-dashoffset="69" stroke-width="4"></circle>
</svg>
<div class="absolute flex flex-col items-center">
<span class="text-xl font-mono font-bold text-white leading-none">75%</span>
<span class="text-[8px] text-[#9CA3AF] uppercase">Flow</span>
</div>
</div>
</div>
<p class="text-[10px] text-center text-[#9CA3AF] leading-snug">Optimal window for deep architecture tasks ends in 90 minutes.</p>
</div>
</aside>
</div>
</main>
</div>
<!-- Floating Action Button (FAB) - Suppressed on Task Details as per rules, but shown here as primary global task entry -->
<button class="fixed bottom-8 right-96 mr-8 w-14 h-14 bg-[#C17A72] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#C17A72]/30 hover:scale-110 active:scale-95 transition-all z-50">
<span class="material-symbols-outlined text-2xl">add</span>
</button>
</body></html>

<!-- Tasks -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion - AI Memory</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "surface-container-low": "#131b2d",
                        "surface-container-highest": "#2d3448",
                        "background": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-primary": "#283043",
                        "tertiary": "#ffb4ab",
                        "on-tertiary": "#53211c",
                        "on-surface": "#dbe2fb",
                        "error-container": "#93000a",
                        "primary": "#bec6df",
                        "inverse-surface": "#dbe2fb",
                        "outline": "#909097",
                        "primary-fixed": "#dbe2fb",
                        "surface-container": "#171f32",
                        "on-secondary-container": "#a8b5d9",
                        "on-surface-variant": "#c6c6cd",
                        "on-error-container": "#ffdad6",
                        "surface-container-lowest": "#060e1f",
                        "surface-variant": "#2d3448",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "on-secondary-fixed-variant": "#3a4665",
                        "on-background": "#dbe2fb",
                        "tertiary-fixed": "#ffdad6",
                        "outline-variant": "#45464c",
                        "surface-container-high": "#222a3d",
                        "on-tertiary-fixed": "#380c09",
                        "error": "#ffb4ab",
                        "surface-tint": "#bec6df",
                        "on-secondary": "#23304d",
                        "inverse-primary": "#565e73",
                        "surface": "#0b1325",
                        "secondary-fixed-dim": "#b9c6eb",
                        "on-primary-fixed-variant": "#3f465b",
                        "on-tertiary-container": "#b36e67",
                        "on-primary-container": "#798097",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "tertiary-container": "#320806",
                        "on-error": "#690005",
                        "secondary": "#b9c6eb",
                        "surface-bright": "#31394c",
                        "inverse-on-surface": "#283043",
                        "secondary-container": "#3a4665",
                        "primary-fixed-dim": "#bec6df",
                        "surface-dim": "#0b1325",
                        "secondary-fixed": "#d9e2ff",
                        "on-primary-fixed": "#131b2d",
                        "primary-container": "#0f1729"
                    },
                    fontFamily: {
                        "headline": ["Playfair Display", "serif"],
                        "display": ["Playfair Display", "serif"],
                        "body": ["Space Grotesk", "sans-serif"],
                        "label": ["Space Grotesk", "sans-serif"],
                        "mono": ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
    </style>
</head>
<body class="bg-background text-on-surface font-body selection:bg-tertiary/30">
<!-- Sidebar Navigation -->
<aside class="fixed left-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col py-8 px-4 z-50">
<div class="mb-10 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-tertiary mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<!-- AI Coach is the active context for 'Memory' -->
<div class="relative flex items-center gap-3 px-4 py-3 text-[#F5F5F5] font-bold before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72]">
<span class="material-symbols-outlined text-[#C17A72]">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</div>
<a class="flex items-center gap-3 px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors hover:bg-white/5 rounded-lg group" href="#">
<span class="material-symbols-outlined">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto border-t border-white/5 pt-6 px-4 space-y-4">
<button class="w-full py-3 bg-[#1A2744] hover:bg-[#23345c] text-primary text-xs font-bold rounded-xl transition-all active:scale-95">
                Auto-schedule
            </button>
<div class="space-y-2">
<a class="flex items-center gap-3 text-[#9CA3AF] hover:text-[#BEC6DF] text-sm" href="#">
<span class="material-symbols-outlined text-lg">settings</span>
<span>Settings</span>
</a>
<a class="flex items-center gap-3 text-[#9CA3AF] hover:text-[#BEC6DF] text-sm" href="#">
<span class="material-symbols-outlined text-lg">help_outline</span>
<span>Support</span>
</a>
</div>
</div>
</aside>
<!-- Main Canvas -->
<main class="ml-64 min-h-screen relative overflow-hidden">
<!-- Top Navigation Bar -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-transparent flex justify-between items-center px-8 z-40">
<div class="flex gap-8">
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] font-['Space_Grotesk'] font-medium text-sm transition-colors opacity-80 hover:opacity-100" href="#">Focus Mode</a>
<a class="text-[#C17A72] border-b border-[#C17A72] font-['Space_Grotesk'] font-medium text-sm transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center gap-6">
<div class="relative">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-white transition-colors">notifications</span>
<span class="absolute -top-1 -right-1 w-2 h-2 bg-tertiary rounded-full"></span>
</div>
<div class="flex items-center gap-3">
<div class="w-8 h-8 rounded-full overflow-hidden border border-white/10">
<img alt="User Profile Avatar" data-alt="A professional close-up portrait of a thoughtful man in his thirties with short hair and a neat beard. The lighting is dramatic and cinematic, with deep shadows and soft amber highlights reflecting the nocturnal celestial curator aesthetic. The background is a blurred high-end studio space with deep navy and subtle rose-toned bokeh." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAoj0xYnQMSyJRRxkzqj7DiAWJUjIJUn3horJV0EuvaBAnWVrahB-mGsJhmjTNc7KvfXQNg7WMSoJWOQiPLp6Brljcp7Qxp4YqSUwayKV3pZP-q0U_rgNbJgLaSHlf9M_-cbSTcY5xEwm2GdCqyw9YYSOEDXpfy3kHGJj-ebs8AK4WwNq1v8IFtosCqDuyj7HA1BWb7DyBcxHXe6m_kBCyKZFPl1SZo4hZF5DfdoxKeifci67AyjYtMWxvvwlVD4c2Q1p4aUtDA_w"/>
</div>
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-white transition-colors">account_circle</span>
</div>
</div>
</header>
<!-- Background Decor -->
<div class="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-tertiary/5 blur-[120px] rounded-full pointer-events-none"></div>
<div class="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none"></div>
<section class="pt-24 pb-12 px-12 max-w-7xl mx-auto relative z-10">
<!-- Header Section -->
<div class="mb-16">
<h2 class="text-6xl font-headline text-on-surface leading-tight">AI Memory</h2>
<p class="text-subtext max-w-xl mt-4 font-body leading-relaxed text-[#9CA3AF]">
                    A living blueprint of your intellectual and emotional landscape. This knowledge base evolves with every interaction, refining its understanding of your vision, productivity, and core relationships.
                </p>
</div>
<div class="grid grid-cols-12 gap-8">
<!-- Left Column: Knowledge Cards -->
<div class="col-span-8 space-y-8">
<!-- Bento Grid for Memories -->
<div class="grid grid-cols-2 gap-8">
<!-- Card 1: Core Values -->
<div class="glass-card rounded-[2rem] p-8 flex flex-col group relative overflow-hidden">
<div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-full bg-white/5 text-tertiary hover:bg-white/10">
<span class="material-symbols-outlined text-sm">edit</span>
</button>
</div>
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-tertiary" style="font-variation-settings: 'FILL' 1;">stars</span>
<h3 class="text-xl font-headline italic">Core Values &amp; Vision</h3>
</div>
<div class="space-y-4 flex-1">
<div class="bg-white/5 rounded-xl p-4 border border-white/5">
<p class="text-sm font-medium text-on-surface/90">Long-term Aspirations</p>
<p class="text-xs text-[#9CA3AF] mt-1">Striving for cognitive harmony and sustainable high-performance through algorithmic mindfulness.</p>
</div>
<div class="bg-white/5 rounded-xl p-4 border border-white/5">
<p class="text-sm font-medium text-on-surface/90">Philosophical Drivers</p>
<p class="text-xs text-[#9CA3AF] mt-1">Preference for minimalism, depth over breadth, and the 'Celestial Curator' aesthetic in all workspaces.</p>
</div>
</div>
<div class="mt-8 flex justify-between items-center font-mono text-[10px] tracking-tighter text-[#45464c]">
<span>TAG: PHILOSOPHY</span>
<span>UPDATED: 2023.10.24 // 14:32</span>
</div>
</div>
<!-- Card 2: Productivity -->
<div class="glass-card rounded-[2rem] p-8 flex flex-col group relative overflow-hidden">
<div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-full bg-white/5 text-tertiary hover:bg-white/10">
<span class="material-symbols-outlined text-sm">edit</span>
</button>
</div>
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-primary">bolt</span>
<h3 class="text-xl font-headline italic">Productivity Patterns</h3>
</div>
<div class="space-y-3">
<div class="flex items-center justify-between p-3 rounded-lg border-b border-white/5">
<span class="text-xs text-[#9CA3AF]">Peak Energy</span>
<span class="font-mono text-xs text-tertiary">07:00 AM — 11:00 AM</span>
</div>
<div class="flex items-center justify-between p-3 rounded-lg border-b border-white/5">
<span class="text-xs text-[#9CA3AF]">Deep Work Req.</span>
<span class="font-mono text-xs text-on-surface">2.5 HOURS</span>
</div>
<div class="flex items-center justify-between p-3 rounded-lg border-b border-white/5">
<span class="text-xs text-[#9CA3AF]">Main Distraction</span>
<span class="font-mono text-xs text-error">CONTEXT SWITCHING</span>
</div>
</div>
<div class="mt-auto pt-6 flex justify-between items-center font-mono text-[10px] tracking-tighter text-[#45464c]">
<span>TAG: BIOMETRICS</span>
<span>UPDATED: 2023.10.25 // 09:15</span>
</div>
</div>
<!-- Card 3: Social context (Wide) -->
<div class="col-span-2 glass-card rounded-[2rem] p-8 group relative">
<div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-full bg-white/5 text-tertiary hover:bg-white/10">
<span class="material-symbols-outlined text-sm">edit</span>
</button>
</div>
<div class="flex items-center gap-3 mb-8">
<span class="material-symbols-outlined text-tertiary">hub</span>
<h3 class="text-xl font-headline italic">Social &amp; Professional Context</h3>
</div>
<div class="grid grid-cols-3 gap-6">
<div>
<h4 class="text-[10px] uppercase tracking-widest text-primary mb-3">Key Stakeholders</h4>
<ul class="space-y-2 text-sm text-on-surface/80">
<li class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                            Elena (Design Director)
                                        </li>
<li class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                            Marcus (Tech Lead)
                                        </li>
</ul>
</div>
<div>
<h4 class="text-[10px] uppercase tracking-widest text-primary mb-3">Active Projects</h4>
<ul class="space-y-2 text-sm text-on-surface/80">
<li class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-tertiary"></span>
                                            Project 'Nova'
                                        </li>
<li class="flex items-center gap-2">
<span class="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                            Q4 Vision Audit
                                        </li>
</ul>
</div>
<div>
<h4 class="text-[10px] uppercase tracking-widest text-primary mb-3">Commitments</h4>
<p class="text-xs text-[#9CA3AF] leading-relaxed">Weekly synthesis every Friday at 16:00. Bi-monthly mentorship sessions with the engineering group.</p>
</div>
</div>
<div class="mt-8 flex justify-between items-center font-mono text-[10px] tracking-tighter text-[#45464c]">
<span>TAG: NETWORK</span>
<span>UPDATED: 2023.10.22 // 18:01</span>
</div>
</div>
<!-- Card 4: Goal Insights -->
<div class="col-span-2 glass-card rounded-[2rem] p-8 group relative bg-gradient-to-br from-[#1A2744]/80 to-transparent">
<div class="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
<button class="p-2 rounded-full bg-white/5 text-tertiary hover:bg-white/10">
<span class="material-symbols-outlined text-sm">edit</span>
</button>
</div>
<div class="flex items-center gap-3 mb-6">
<span class="material-symbols-outlined text-tertiary">insights</span>
<h3 class="text-xl font-headline italic">Goal Progress &amp; Insights</h3>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
<div class="space-y-6">
<div class="relative pl-6 border-l border-tertiary/20">
<span class="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-tertiary glow-sm"></span>
<p class="text-sm italic font-headline text-on-surface">"You've shown 40% more consistency in your 'Flow State' during evening sessions when you skip dinner meetings."</p>
<p class="text-[10px] text-tertiary mt-2 uppercase tracking-wide">Derived from: Deep Work Chats</p>
</div>
<div class="relative pl-6 border-l border-primary/20">
<span class="absolute left-[-4px] top-0 w-2 h-2 rounded-full bg-primary/40"></span>
<p class="text-sm italic font-headline text-on-surface">"The recurring anxiety about the 'Nova' project seems linked to unclear architectural boundaries."</p>
<p class="text-[10px] text-primary mt-2 uppercase tracking-wide">Derived from: Mental Clarity Journal</p>
</div>
</div>
<div class="flex flex-col justify-center items-center">
<div class="relative w-32 h-32 flex items-center justify-center">
<svg class="absolute inset-0 w-full h-full -rotate-90">
<circle class="text-surface-variant/30" cx="64" cy="64" fill="transparent" r="58" stroke="currentColor" stroke-width="8"></circle>
<circle cx="64" cy="64" fill="transparent" r="58" stroke="url(#rose-gradient)" stroke-dasharray="364" stroke-dashoffset="84" stroke-linecap="round" stroke-width="8"></circle>
<defs>
<lineargradient id="rose-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" style="stop-color:#FFB4AB"></stop>
<stop offset="100%" style="stop-color:#C17A72"></stop>
</lineargradient>
</defs>
</svg>
<div class="text-center">
<span class="font-mono text-2xl font-bold text-on-surface">77%</span>
<p class="text-[8px] uppercase tracking-widest text-[#9CA3AF]">Memory<br/>Alignment</p>
</div>
</div>
</div>
</div>
<div class="mt-8 pt-6 border-t border-white/5 flex justify-between items-center font-mono text-[10px] tracking-tighter text-[#45464c]">
<span>TAG: SYNTHESIS</span>
<span>UPDATED: 2023.10.25 // 22:45</span>
</div>
</div>
</div>
</div>
<!-- Right Column: Sidebar Widget -->
<div class="col-span-4 space-y-8">
<!-- Memory Health Widget -->
<div class="glass-card rounded-[2rem] p-8 border border-tertiary/10">
<h4 class="text-[10px] uppercase tracking-[0.3em] text-tertiary mb-8 font-medium">Memory Health</h4>
<div class="space-y-8 mb-10">
<div>
<div class="flex justify-between items-end mb-2">
<span class="text-2xl font-mono text-on-surface">1,428</span>
<span class="text-[10px] text-primary uppercase">Data points captured</span>
</div>
<div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-[82%]"></div>
</div>
</div>
<div class="grid grid-cols-2 gap-4">
<div class="p-4 rounded-2xl bg-white/5 border border-white/5">
<p class="text-[10px] uppercase text-[#9CA3AF] mb-1">Stability</p>
<p class="font-mono text-lg text-primary">High</p>
</div>
<div class="p-4 rounded-2xl bg-white/5 border border-white/5">
<p class="text-[10px] uppercase text-[#9CA3AF] mb-1">Clarity</p>
<p class="font-mono text-lg text-on-surface">94%</p>
</div>
</div>
</div>
<div class="space-y-4">
<button class="group w-full py-4 bg-gradient-to-r from-tertiary to-[#C17A72] text-on-tertiary font-bold rounded-2xl transition-all hover:shadow-[0_0_20px_rgba(193,122,114,0.4)] active:scale-95 flex items-center justify-center gap-2">
<span class="material-symbols-outlined text-lg">psychology</span>
<span>Refine Knowledge</span>
</button>
<p class="text-[10px] text-center text-[#9CA3AF] italic leading-relaxed px-4">
                                "Self-correction is the path to divine precision. Your feedback improves my synthesis by 12% per session."
                            </p>
</div>
</div>
<!-- Knowledge Integrity Log -->
<div class="glass-card rounded-[2rem] p-8">
<h4 class="text-[10px] uppercase tracking-[0.3em] text-primary mb-6 font-medium">Capture Stream</h4>
<div class="space-y-6">
<div class="flex gap-4">
<div class="w-1 h-10 bg-tertiary/30 rounded-full mt-1"></div>
<div>
<p class="text-xs text-on-surface font-medium">New Pattern Detected</p>
<p class="text-[10px] text-[#9CA3AF] mt-1">Identified evening productivity dip after 21:00.</p>
<p class="text-[9px] font-mono text-[#45464c] mt-1">3 HOURS AGO</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-1 h-10 bg-primary/30 rounded-full mt-1"></div>
<div>
<p class="text-xs text-on-surface font-medium">Entity Updated</p>
<p class="text-[10px] text-[#9CA3AF] mt-1">Refined relationship context for 'Elena'.</p>
<p class="text-[9px] font-mono text-[#45464c] mt-1">12 HOURS AGO</p>
</div>
</div>
<div class="flex gap-4">
<div class="w-1 h-10 bg-white/10 rounded-full mt-1"></div>
<div>
<p class="text-xs text-on-surface font-medium">Batch Reconciliation</p>
<p class="text-[10px] text-[#9CA3AF] mt-1">Consolidated 14 chat summaries into 'Vision'.</p>
<p class="text-[9px] font-mono text-[#45464c] mt-1">YESTERDAY</p>
</div>
</div>
</div>
</div>
<!-- Visual Accent Image -->
<div class="rounded-[2rem] overflow-hidden h-48 border border-white/5 relative group">
<img alt="AI Consciousness Visualization" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" data-alt="An ethereal digital representation of a human mind as a glowing constellation of interconnected nodes and data streams. The scene is set in a deep, nocturnal cosmic void with shimmering starlight and swirling nebulae in shades of navy, midnight blue, and soft rose. The style is high-end editorial and cinematic, representing the sophistication of a celestial AI curator." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCyCEe7M4rt4OtIz4Mjj08H9ZtrjzZAx93_ztX6g4c7LqoK5P_HLd72IfbKQohlynAAAdFYGlIzY93l4md0R1X4LVmin_60y8mNnxjlIHqNOPDfDMreyzWbboV9en32w_SqLnvMDKTE7k0_5xuFA-ZuRJRtiYWjnbk81IVrC21UOayvniBYI1ow7eFA22f1TfAN6wdZSavxY_RFSaqIRb92WwQ7fHn3JK_J4J4RPuxL_LF6gmEMAWl8nUkTmpg91_r_pBS0xvHPzQ"/>
<div class="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
<div class="absolute bottom-4 left-6">
<p class="text-[10px] uppercase tracking-widest text-white/60">Neural Engine Status</p>
<p class="text-sm font-headline italic text-tertiary">Optimal Synchronization</p>
</div>
</div>
</div>
</div>
</section>
<!-- Floating Decorative Footer Element -->
<div class="fixed bottom-8 right-8 px-4 py-2 glass-card rounded-full flex items-center gap-4 z-40 border-tertiary/20">
<div class="flex items-center gap-2">
<span class="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
<span class="text-[10px] font-mono text-tertiary uppercase tracking-tighter">AI Pulse: Syncing</span>
</div>
<div class="h-4 w-[1px] bg-white/10"></div>
<button class="text-[10px] font-bold text-on-surface/60 hover:text-on-surface transition-colors">EXPORT DATA</button>
</div>
</main>
</body></html>

<!-- AI Memory -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion — Reflective Ritual</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,700;1,6..72,400&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                "on-primary-fixed": "#131b2d",
                "error": "#ffb4ab",
                "surface-bright": "#31394c",
                "on-background": "#dbe2fb",
                "on-tertiary-fixed-variant": "#6f3630",
                "secondary-fixed": "#d9e2ff",
                "on-tertiary": "#53211c",
                "on-error": "#690005",
                "on-error-container": "#ffdad6",
                "inverse-surface": "#dbe2fb",
                "outline": "#909097",
                "surface-container": "#171f32",
                "surface-container-high": "#222a3d",
                "inverse-on-surface": "#283043",
                "surface-tint": "#bec6df",
                "surface-container-lowest": "#060e1f",
                "background": "#0b1325",
                "error-container": "#93000a",
                "surface-variant": "#2d3448",
                "on-primary": "#283043",
                "inverse-primary": "#565e73",
                "primary": "#bec6df",
                "on-tertiary-container": "#b36e67",
                "on-primary-fixed-variant": "#3f465b",
                "surface-container-low": "#131b2d",
                "on-secondary-fixed-variant": "#3a4665",
                "tertiary": "#ffb4ab",
                "on-tertiary-fixed": "#380c09",
                "secondary-fixed-dim": "#b9c6eb",
                "secondary-container": "#3a4665",
                "surface": "#0b1325",
                "outline-variant": "#45464c",
                "primary-container": "#0f1729",
                "secondary": "#b9c6eb",
                "on-secondary": "#23304d",
                "on-surface": "#dbe2fb",
                "surface-container-highest": "#2d3448",
                "primary-fixed": "#dbe2fb",
                "on-primary-container": "#798097",
                "surface-dim": "#0b1325",
                "on-secondary-fixed": "#0d1b37",
                "on-surface-variant": "#c6c6cd",
                "on-secondary-container": "#a8b5d9",
                "tertiary-container": "#320806",
                "primary-fixed-dim": "#bec6df",
                "tertiary-fixed-dim": "#ffb4ab",
                "tertiary-fixed": "#ffdad6"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "fontFamily": {
                "headline": ["Newsreader", "serif"],
                "display": ["Newsreader", "serif"],
                "body": ["Space Grotesk", "sans-serif"],
                "label": ["Space Grotesk", "sans-serif"]
            }
          }
        }
      }
    </script>
<style>
        body { background-color: #0b1325; color: #f5f5f5; font-family: 'Space Grotesk', sans-serif; overflow-x: hidden; }
        .glass-card { background: rgba(26, 39, 68, 0.6); backdrop-filter: blur(24px); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 1.5rem; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .mono-stat { font-family: 'JetBrains Mono', monospace; }
        .editorial-title { font-family: 'Playfair Display', serif; font-style: italic; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .asymmetric-indent { padding-left: 12%; }
    </style>
</head>
<body class="flex min-h-screen">
<!-- SideNavBar from JSON -->
<aside class="fixed left-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] mt-1 font-['Space_Grotesk']">Celestial Curator</p>
</div>
<nav class="flex-1 flex flex-col space-y-6">
<a class="group flex items-center px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors font-['Space_Grotesk'] text-sm tracking-wide" href="#">
<span class="material-symbols-outlined mr-3 text-lg" data-icon="dashboard">dashboard</span>
                Dashboard
            </a>
<a class="group flex items-center px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors font-['Space_Grotesk'] text-sm tracking-wide" href="#">
<span class="material-symbols-outlined mr-3 text-lg" data-icon="auto_awesome_motion">auto_awesome_motion</span>
                Vision Board
            </a>
<a class="group flex items-center px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors font-['Space_Grotesk'] text-sm tracking-wide" href="#">
<span class="material-symbols-outlined mr-3 text-lg" data-icon="calendar_today">calendar_today</span>
                Calendar
            </a>
<a class="group flex items-center px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors font-['Space_Grotesk'] text-sm tracking-wide" href="#">
<span class="material-symbols-outlined mr-3 text-lg" data-icon="smart_toy">smart_toy</span>
                AI Coach
            </a>
<!-- ACTIVE TAB: Journal (The Reflect context) -->
<a class="group relative flex items-center px-4 py-2 text-[#F5F5F5] font-bold before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] transition-all font-['Space_Grotesk'] text-sm tracking-wide" href="#">
<span class="material-symbols-outlined mr-3 text-lg" data-icon="edit_note">edit_note</span>
                Journal
            </a>
</nav>
<div class="mt-auto space-y-4 px-4">
<button class="w-full bg-[#C17A72] text-[#0B1325] py-3 rounded-lg font-bold text-xs uppercase tracking-widest hover:opacity-90 active:scale-95 transition-all duration-200">
                Auto-schedule
            </button>
<div class="pt-6 border-t border-white/5 space-y-4">
<a class="flex items-center text-[#9CA3AF] hover:text-[#BEC6DF] text-xs transition-colors font-['Space_Grotesk']" href="#">
<span class="material-symbols-outlined mr-2 text-sm" data-icon="settings">settings</span>
                    Settings
                </a>
<a class="flex items-center text-[#9CA3AF] hover:text-[#BEC6DF] text-xs transition-colors font-['Space_Grotesk']" href="#">
<span class="material-symbols-outlined mr-2 text-sm" data-icon="help_outline">help_outline</span>
                    Support
                </a>
</div>
</div>
</aside>
<!-- TopNavBar Cluster (Web Style) -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 w-full z-40 bg-transparent">
<div class="flex items-center space-x-8">
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] font-['Space_Grotesk'] font-medium text-sm transition-colors opacity-80 hover:opacity-100" href="#">Focus Mode</a>
<a class="text-[#C17A72] border-b border-[#C17A72] font-['Space_Grotesk'] font-medium text-sm transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center space-x-6">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer hover:text-white transition-opacity duration-300 opacity-80 hover:opacity-100" data-icon="account_circle">account_circle</span>
</div>
</header>
<!-- Main Canvas -->
<main class="ml-64 w-full pt-16 flex flex-col md:flex-row h-screen overflow-hidden bg-background">
<!-- Left Column: AI Synthesis -->
<section class="w-full md:w-[45%] h-full p-8 md:p-12 overflow-y-auto no-scrollbar border-r border-white/5 bg-surface-container-low">
<div class="mb-12">
<span class="text-tertiary mono-stat text-xs tracking-widest uppercase mb-4 block">Session 04 // Ritual</span>
<h2 class="text-5xl editorial-title text-on-background mb-4">The Synthesis</h2>
<p class="text-on-surface-variant max-w-sm leading-relaxed font-light">Last week through the lens of your digital consciousness.</p>
</div>
<!-- Bento Summary -->
<div class="grid grid-cols-1 gap-6">
<!-- Win Card -->
<div class="glass-card p-8 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-20">
<span class="material-symbols-outlined text-6xl" data-icon="auto_awesome">auto_awesome</span>
</div>
<span class="text-tertiary mono-stat text-xs mb-2 block">Dominant Pattern</span>
<h3 class="text-2xl font-semibold text-on-surface mb-4">Deep Work Resilience</h3>
<p class="text-on-surface-variant mb-6 leading-relaxed">Your journal notes a "flow state breakthrough" during the Thursday session. You completed 14 complex tasks, exceeding your velocity baseline by 22%.</p>
<div class="flex items-center space-x-4">
<div class="flex flex-col">
<span class="mono-stat text-lg text-on-surface">88%</span>
<span class="text-[10px] uppercase text-outline tracking-tighter">Efficiency</span>
</div>
<div class="w-px h-8 bg-outline-variant/30"></div>
<div class="flex flex-col">
<span class="mono-stat text-lg text-on-surface">12.5h</span>
<span class="text-[10px] uppercase text-outline tracking-tighter">Focused Time</span>
</div>
</div>
</div>
<!-- Progress Ring Metrics -->
<div class="grid grid-cols-2 gap-6">
<div class="glass-card p-6 flex flex-col items-center text-center">
<div class="relative w-20 h-20 mb-4 flex items-center justify-center">
<svg class="w-full h-full -rotate-90">
<circle cx="40" cy="40" fill="transparent" r="36" stroke="#2D3448" stroke-opacity="0.3" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="36" stroke="url(#roseGradient)" stroke-dasharray="226" stroke-dashoffset="60" stroke-linecap="round" stroke-width="4"></circle>
<defs>
<lineargradient id="roseGradient" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" style="stop-color:#FFB4AB"></stop>
<stop offset="100%" style="stop-color:#C17A72"></stop>
</lineargradient>
</defs>
</svg>
<span class="absolute mono-stat text-sm">74%</span>
</div>
<span class="text-xs text-on-surface font-medium uppercase tracking-widest">Cognitive Load</span>
</div>
<div class="glass-card p-6 flex flex-col items-center text-center">
<div class="relative w-20 h-20 mb-4 flex items-center justify-center">
<svg class="w-full h-full -rotate-90">
<circle cx="40" cy="40" fill="transparent" r="36" stroke="#2D3448" stroke-opacity="0.3" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="36" stroke="url(#roseGradient)" stroke-dasharray="226" stroke-dashoffset="130" stroke-linecap="round" stroke-width="4"></circle>
</svg>
<span class="absolute mono-stat text-sm">42%</span>
</div>
<span class="text-xs text-on-surface font-medium uppercase tracking-widest">Rest Balance</span>
</div>
</div>
<!-- Challenge Insight -->
<div class="p-8 border-l-2 border-tertiary bg-white/5 rounded-r-xl">
<span class="material-symbols-outlined text-tertiary mb-3" data-icon="warning">warning</span>
<h4 class="text-on-surface font-medium mb-2">Social Exhaustion Detected</h4>
<p class="text-on-surface-variant text-sm leading-relaxed">Friday's journal entry mentions "feeling drained after consecutive syncs." AI recommendation: Protect your Tuesday morning with a hard block.</p>
</div>
</div>
</section>
<!-- Right Column: User Reflection -->
<section class="w-full md:w-[55%] h-full relative overflow-hidden bg-background">
<div class="absolute inset-0 z-0">
<img class="w-full h-full object-cover opacity-10" data-alt="A moody, high-contrast photograph of a single leaf floating on a perfectly still, dark pool of water. The lighting is ethereal and nocturnal, with subtle highlights that emphasize the deep navy and charcoal tones of the setting. The aesthetic is extremely minimalist and peaceful, echoing a celestial digital sanctuary design. Soft bokeh lights in the distance suggest a vast, quiet night." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhlxIeqXzkmjRN7JGn5Hnyby23p3owUm8RIYT4uKhOYKHEMXjYMSQXkzEtapL7ZIYbj_rW1hk0hcThNRpADPiSYVy8DFoq42TEmCHR3fYmmcg_NGdotU8t8oufz-kS5LNupmWfegW94sg95vg067c04ZJwy5OugJn-lDKZh7gJODmlvcnTZ6vxWYdvK7TfZCtOAfkL7dmsytsyyjy-MYI3xr6QeBjgO61nZlYRr6_ynI7QWBL6Mogg-vTGhm91_t-rtvE_KhiHgw"/>
</div>
<div class="relative z-10 h-full flex flex-col p-12 md:p-20">
<div class="max-w-2xl w-full mx-auto h-full flex flex-col">
<header class="mb-12">
<h2 class="text-4xl editorial-title text-on-background leading-tight">
                            Capture your state of mind
                        </h2>
<div class="h-px w-24 bg-tertiary mt-6 opacity-40"></div>
</header>
<textarea class="flex-1 w-full bg-transparent border-none focus:ring-0 text-2xl font-['Newsreader'] italic text-on-surface placeholder:text-on-surface-variant/20 resize-none leading-relaxed no-scrollbar" placeholder="In the silence of the past seven days, what remains true..."></textarea>
<footer class="mt-12 flex justify-between items-center">
<div class="flex space-x-6">
<button class="flex items-center text-xs uppercase tracking-[0.2em] text-outline hover:text-on-surface transition-colors">
<span class="material-symbols-outlined mr-2 text-sm" data-icon="mic">mic</span>
                                Voice Note
                            </button>
<button class="flex items-center text-xs uppercase tracking-[0.2em] text-outline hover:text-on-surface transition-colors">
<span class="material-symbols-outlined mr-2 text-sm" data-icon="image">image</span>
                                Visual Anchor
                            </button>
</div>
<button class="glass-card px-10 py-4 text-[#F5F5F5] font-['Space_Grotesk'] text-sm font-bold tracking-widest uppercase hover:bg-white/10 active:scale-95 transition-all">
                            Seal Ritual
                        </button>
</footer>
</div>
</div>
<!-- Asymmetric Accent -->
<div class="absolute bottom-0 right-0 w-64 h-64 bg-tertiary/5 rounded-full blur-[100px] pointer-events-none"></div>
</section>
</main>
<!-- Subtle Background Noise/Grain Overlay -->
<div class="fixed inset-0 pointer-events-none opacity-[0.03] z-[100]" style="background-image: url('https://lh3.googleusercontent.com/aida-public/AB6AXuDAIA8iQ-IFu-nJppzDVfgO8ydq3ybA0JRewzmusz74eUZd33x9lfNhLjMuQ-HGeDRMo6bh9D-TgMkoVAAwfXyqNcSH1rwhZueyhx8ObSBFAhG9UyCl9IFF_4AVCoxLQTxv6PPPyCDqQhKRnF5OKSL0PX3gbptRD3YQPFoYC3X4LVof1x80tfbtfybHw5_os9AMYOM3oHBaFe3EmGfn5yH4R49nc0NXH683AuQfowwiC_khWfeVRi6NTGRsRXfVIiJgwIKGpv7qhg');"></div>
</body></html>

<!-- Weekly Ritual - Reflect -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion | Align Your Vision</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;700&amp;family=JetBrains+Mono:wght@400;700&amp;family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-primary-fixed": "#131b2d",
                        "error": "#ffb4ab",
                        "surface-bright": "#31394c",
                        "on-background": "#dbe2fb",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "secondary-fixed": "#d9e2ff",
                        "on-tertiary": "#53211c",
                        "on-error": "#690005",
                        "on-error-container": "#ffdad6",
                        "inverse-surface": "#dbe2fb",
                        "outline": "#909097",
                        "surface-container": "#171f32",
                        "surface-container-high": "#222a3d",
                        "inverse-on-surface": "#283043",
                        "surface-tint": "#bec6df",
                        "surface-container-lowest": "#060e1f",
                        "background": "#0b1325",
                        "error-container": "#93000a",
                        "surface-variant": "#2d3448",
                        "on-primary": "#283043",
                        "inverse-primary": "#565e73",
                        "primary": "#bec6df",
                        "on-tertiary-container": "#b36e67",
                        "on-primary-fixed-variant": "#3f465b",
                        "surface-container-low": "#131b2d",
                        "on-secondary-fixed-variant": "#3a4665",
                        "tertiary": "#ffb4ab",
                        "on-tertiary-fixed": "#380c09",
                        "secondary-fixed-dim": "#b9c6eb",
                        "secondary-container": "#3a4665",
                        "surface": "#0b1325",
                        "outline-variant": "#45464c",
                        "primary-container": "#0f1729",
                        "secondary": "#b9c6eb",
                        "on-secondary": "#23304d",
                        "on-surface": "#dbe2fb",
                        "surface-container-highest": "#2d3448",
                        "primary-fixed": "#dbe2fb",
                        "on-primary-container": "#798097",
                        "surface-dim": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary-container": "#a8b5d9",
                        "tertiary-container": "#320806",
                        "primary-fixed-dim": "#bec6df",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "tertiary-fixed": "#ffdad6"
                    },
                    fontFamily: {
                        display: ["Playfair Display", "serif"],
                        body: ["Space Grotesk", "sans-serif"],
                        mono: ["JetBrains Mono", "monospace"],
                    }
                }
            }
        }
    </script>
<style>
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
        }
        body {
            background-color: #0b1325;
            color: #dbe2fb;
        }
    </style>
</head>
<body class="font-body selection:bg-tertiary selection:text-on-tertiary-fixed">
<!-- Sidebar Navigation -->
<aside class="fixed left-0 top-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-display italic text-[#F5F5F5] tracking-tight">Motion</h1>
<p class="text-xs font-body text-[#9CA3AF] tracking-widest mt-1 opacity-70 uppercase">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform" data-icon="dashboard">dashboard</span>
<span class="text-sm tracking-wide">Dashboard</span>
</a>
<!-- ACTIVE TAB: Vision Board -->
<a class="relative flex items-center px-4 py-3 text-[#F5F5F5] bg-white/5 font-bold transition-all duration-300 rounded-lg group before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72]" href="#">
<span class="material-symbols-outlined mr-3 text-[#C17A72] group-hover:scale-110 transition-transform" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform" data-icon="calendar_today">calendar_today</span>
<span class="text-sm tracking-wide">Calendar</span>
</a>
<a class="flex items-center px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform" data-icon="smart_toy">smart_toy</span>
<span class="text-sm tracking-wide">AI Coach</span>
</a>
<a class="flex items-center px-4 py-3 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5 transition-all duration-300 rounded-lg group" href="#">
<span class="material-symbols-outlined mr-3 group-hover:scale-110 transition-transform" data-icon="edit_note">edit_note</span>
<span class="text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-4 px-4">
<button class="w-full bg-primary-container text-primary-fixed border border-white/10 py-3 rounded-xl text-sm font-medium hover:bg-surface-variant transition-colors active:scale-95 duration-200">
                Auto-schedule
            </button>
<div class="pt-6 space-y-2 border-t border-white/5">
<a class="flex items-center text-xs text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors group" href="#">
<span class="material-symbols-outlined text-sm mr-2" data-icon="settings">settings</span>
                    Settings
                </a>
<a class="flex items-center text-xs text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors group" href="#">
<span class="material-symbols-outlined text-sm mr-2" data-icon="help_outline">help_outline</span>
                    Support
                </a>
</div>
</div>
</aside>
<!-- Main Canvas -->
<main class="ml-64 min-h-screen p-12">
<!-- Header -->
<header class="flex justify-between items-end mb-16">
<div class="space-y-2">
<span class="font-mono text-tertiary text-xs uppercase tracking-[0.3em]">Weekly Ritual — Step 02</span>
<h2 class="text-5xl font-display text-on-surface">Align Your Intentions</h2>
</div>
<div class="flex items-center gap-4">
<div class="text-right">
<p class="text-xs text-on-surface-variant font-mono">Current Phase</p>
<p class="text-sm font-body text-primary uppercase tracking-widest">Waxing Gibbous</p>
</div>
<div class="h-10 w-10 rounded-full border border-outline-variant/30 flex items-center justify-center overflow-hidden">
<img class="h-full w-full object-cover" data-alt="A professional studio portrait of a thoughtful man in his 30s with a clean-shaven face and modern short hair. The lighting is dramatic and cinematic, utilizing a cool-toned rim light against a deep navy background that perfectly complements the high-end editorial UI of the application. His expression is serene and focused, representing the calm and wise user profile of the Motion platform." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMQr4DhrbEzbsvUENGxg3yD9S-INXWYf7ezaMnA3DBg7sEEharvu9Q4eVO6i3udqymGWQwvNTmN2GqoKqa8ec1SsRq1mJ31jpcLLh93-rHC1ZIsdTMXeryLTNky65f1H7vobOX1IJuwPVenBNaOOxOfzU0INJi1o0GrtbiN_nf_jMavTudurHVzanv0mETcwQ4GTW7bd1-wqSoctsWTvE5Amx38C-AuQC2i1XlTxovZCThv15NlKIUTtzm-B8iujiK_rrHP0bIaA"/>
</div>
</div>
</header>
<div class="grid grid-cols-12 gap-8 items-start">
<!-- Left Column: Vision Board Top Goals -->
<section class="col-span-8 space-y-8">
<div class="flex justify-between items-center mb-4">
<h3 class="text-xl font-display italic text-[#F5F5F5]">Manifesting Pillars</h3>
<button class="text-sm text-tertiary font-body hover:underline decoration-tertiary/40 underline-offset-4">View All Vision Cards</button>
</div>
<div class="grid grid-cols-2 gap-6">
<!-- Goal Card 1 -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col justify-between h-[280px] relative overflow-hidden group">
<div class="absolute top-0 right-0 w-32 h-32 bg-tertiary/10 rounded-full blur-[60px] group-hover:bg-tertiary/20 transition-all"></div>
<div class="relative z-10">
<span class="font-mono text-xs text-primary mb-4 block">01 / CREATIVE FLOW</span>
<h4 class="text-2xl font-display leading-tight mb-2">Publish the 'Celestial Design' Anthology</h4>
</div>
<div class="relative z-10 flex items-center justify-between">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="34" stroke="url(#rose-gradient)" stroke-dasharray="213" stroke-dashoffset="64" stroke-width="4"></circle>
<defs>
<lineargradient id="rose-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
<stop offset="0%" stop-color="#FFB4AB"></stop>
<stop offset="100%" stop-color="#C17A72"></stop>
</lineargradient>
</defs>
</svg>
<span class="absolute inset-0 flex items-center justify-center font-mono text-lg text-tertiary">72%</span>
</div>
<div class="text-right">
<p class="text-xs text-on-surface-variant font-mono">Status</p>
<p class="text-sm font-body text-primary italic">In Ascendance</p>
</div>
</div>
</div>
<!-- Goal Card 2 -->
<div class="glass-card rounded-[1.5rem] p-8 flex flex-col justify-between h-[280px] relative overflow-hidden group">
<div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px] group-hover:bg-primary/20 transition-all"></div>
<div class="relative z-10">
<span class="font-mono text-xs text-primary mb-4 block">02 / TEMPLE BODY</span>
<h4 class="text-2xl font-display leading-tight mb-2">Master the 108 Sun Salutations Flow</h4>
</div>
<div class="relative z-10 flex items-center justify-between">
<div class="relative w-20 h-20">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant/30" cx="40" cy="40" fill="transparent" r="34" stroke="currentColor" stroke-width="4"></circle>
<circle cx="40" cy="40" fill="transparent" r="34" stroke="url(#rose-gradient)" stroke-dasharray="213" stroke-dashoffset="140" stroke-width="4"></circle>
</svg>
<span class="absolute inset-0 flex items-center justify-center font-mono text-lg text-tertiary">34%</span>
</div>
<div class="text-right">
<p class="text-xs text-on-surface-variant font-mono">Status</p>
<p class="text-sm font-body text-primary italic">Gaining Momentum</p>
</div>
</div>
</div>
</div>
<!-- Weekly Milestones -->
<div class="mt-12 space-y-6">
<div class="flex items-center gap-4">
<h3 class="text-xl font-display italic text-[#F5F5F5]">Weekly Constellations</h3>
<div class="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
</div>
<div class="space-y-3">
<!-- Toggle Item 1 -->
<div class="flex items-center justify-between p-5 glass-card rounded-xl group hover:border-tertiary/20 transition-all cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-6 h-6 rounded-full border-2 border-tertiary flex items-center justify-center bg-tertiary/10">
<span class="material-symbols-outlined text-[14px] text-tertiary font-bold" style="font-variation-settings: 'FILL' 1;">check</span>
</div>
<div>
<p class="text-on-surface font-body font-medium">Finalize Anthology Chapter Three Draft</p>
<p class="text-xs text-on-surface-variant">Associated with: Creative Flow</p>
</div>
</div>
<div class="flex items-center gap-4">
<span class="font-mono text-[10px] text-tertiary uppercase border border-tertiary/30 px-2 py-0.5 rounded">High Priority</span>
<span class="material-symbols-outlined text-[#9CA3AF]" data-icon="drag_indicator">drag_indicator</span>
</div>
</div>
<!-- Toggle Item 2 -->
<div class="flex items-center justify-between p-5 glass-card rounded-xl group hover:border-primary/20 transition-all cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors"></div>
<div>
<p class="text-on-surface font-body font-medium">Daily 15-minute Morning Flow session</p>
<p class="text-xs text-on-surface-variant">Associated with: Temple Body</p>
</div>
</div>
<div class="flex items-center gap-4">
<span class="font-mono text-[10px] text-primary uppercase border border-primary/30 px-2 py-0.5 rounded">Daily Habit</span>
<span class="material-symbols-outlined text-[#9CA3AF]" data-icon="drag_indicator">drag_indicator</span>
</div>
</div>
<!-- Toggle Item 3 -->
<div class="flex items-center justify-between p-5 glass-card rounded-xl group hover:border-primary/20 transition-all cursor-pointer">
<div class="flex items-center gap-6">
<div class="w-6 h-6 rounded-full border-2 border-outline-variant flex items-center justify-center group-hover:border-primary transition-colors"></div>
<div>
<p class="text-on-surface font-body font-medium">Schedule interview with visual artists</p>
<p class="text-xs text-on-surface-variant">Associated with: Creative Flow</p>
</div>
</div>
<div class="flex items-center gap-4">
<span class="font-mono text-[10px] text-outline-variant uppercase border border-outline-variant/30 px-2 py-0.5 rounded">Logistics</span>
<span class="material-symbols-outlined text-[#9CA3AF]" data-icon="drag_indicator">drag_indicator</span>
</div>
</div>
</div>
</div>
</section>
<!-- Right Column: AI Insight -->
<aside class="col-span-4 sticky top-12">
<div class="glass-card rounded-[2rem] overflow-hidden border border-tertiary/20 shadow-2xl">
<div class="h-48 relative overflow-hidden">
<img class="w-full h-full object-cover" data-alt="A breathtaking view of a deep purple and blue nebula in deep space, filled with thousands of twinkling stars and cosmic dust. The aesthetic is ethereal and vast, perfectly representing the 'Celestial Curator' theme. The lighting is natural but intense, with glowing gaseous clouds creating a sense of infinite depth and movement that serves as a backdrop for the AI's guidance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhGGA2HhSs4J07Y9vN65_1QpU3bSabilEBVl38AtGQJulRG8ils6z4OuTm6sc6sWHvS8SiBYRx481Aw8Pp9RytgzWABTe-tniyWwKxMwxFiZXKQ-akqhQ7RjU5onrLYHOyWQhB-xKrDQnNlh6Ofjnn74168gnRWd-DDiQurOtWY8nTIPOLLKI2Jo_2enPr9eNIf-_3F-8H4DAWplY8jOJRoIOx_ZpoGVHZ8AAImlt9iy0P4IqsHNopT-FwI4js4KE0FeoUPrk0mA"/>
<div class="absolute inset-0 bg-gradient-to-t from-primary-container via-transparent to-transparent"></div>
<div class="absolute bottom-6 left-8">
<div class="flex items-center gap-2 mb-2">
<span class="material-symbols-outlined text-tertiary text-lg" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<span class="font-mono text-[10px] text-tertiary tracking-widest uppercase">Celestial Alignment</span>
</div>
<h4 class="text-2xl font-display italic text-[#F5F5F5]">The Motion Insight</h4>
</div>
</div>
<div class="p-8 space-y-6">
<p class="text-on-surface-variant leading-relaxed italic">
                            "Your Creative Flow is currently peaking, but your physical vessel requires more attention to sustain this momentum. The stars suggest shifting 15% of your evening energy from research to restorative movement."
                        </p>
<div class="space-y-4">
<h5 class="text-xs font-mono text-primary uppercase tracking-widest">Recommended Focus</h5>
<div class="p-4 bg-white/5 rounded-xl border border-white/5 group hover:bg-white/10 transition-all">
<div class="flex justify-between items-center mb-1">
<span class="text-sm font-medium text-on-surface">Temple Body</span>
<span class="text-[10px] font-mono text-tertiary">+12% Intensity Recommended</span>
</div>
<div class="h-1 w-full bg-surface-variant/50 rounded-full overflow-hidden">
<div class="h-full bg-tertiary w-1/3 rounded-full shadow-[0_0_8px_rgba(255,180,171,0.5)]"></div>
</div>
</div>
</div>
<button class="w-full py-4 rounded-xl font-display text-lg italic text-on-tertiary-fixed bg-tertiary hover:opacity-90 transition-all active:scale-[0.98] mt-4 shadow-lg shadow-tertiary/10">
                            Apply Alignment Changes
                        </button>
</div>
</div>
<!-- Extra Contextual Info -->
<div class="mt-8 px-6 space-y-4">
<div class="flex items-start gap-4">
<div class="w-2 h-2 rounded-full bg-tertiary mt-1.5 shadow-[0_0_8px_rgba(255,180,171,0.8)]"></div>
<div>
<p class="text-xs font-mono text-on-surface-variant uppercase tracking-tighter">High Urgency</p>
<p class="text-sm text-on-surface">Weekly Review completion deadline is in 14 hours.</p>
</div>
</div>
<div class="flex items-start gap-4 opacity-50">
<div class="w-2 h-2 rounded-full bg-outline-variant mt-1.5"></div>
<div>
<p class="text-xs font-mono text-on-surface-variant uppercase tracking-tighter">System Note</p>
<p class="text-sm text-on-surface">Vision Board sync with Calendar successful.</p>
</div>
</div>
</div>
</aside>
</div>
</main>
<!-- Footer Controls (Optional Floating Action) -->
<div class="fixed bottom-8 right-8 flex gap-4">
<button class="h-14 w-14 rounded-full glass-card flex items-center justify-center text-[#F5F5F5] hover:scale-110 transition-transform active:scale-95 shadow-xl">
<span class="material-symbols-outlined" data-icon="add">add</span>
</button>
<button class="px-8 h-14 rounded-full bg-[#0F1729] border border-white/10 flex items-center gap-3 text-sm font-medium hover:bg-surface-variant transition-all active:scale-95 shadow-xl">
<span class="material-symbols-outlined text-tertiary" data-icon="auto_fix_high">auto_fix_high</span>
            Ritual Summary
        </button>
</div>
</body></html>

<!-- Weekly Ritual - Align -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            "colors": {
                    "on-primary-fixed": "#131b2d",
                    "error": "#ffb4ab",
                    "surface-bright": "#31394c",
                    "on-background": "#dbe2fb",
                    "on-tertiary-fixed-variant": "#6f3630",
                    "secondary-fixed": "#d9e2ff",
                    "on-tertiary": "#53211c",
                    "on-error": "#690005",
                    "on-error-container": "#ffdad6",
                    "inverse-surface": "#dbe2fb",
                    "outline": "#909097",
                    "surface-container": "#171f32",
                    "surface-container-high": "#222a3d",
                    "inverse-on-surface": "#283043",
                    "surface-tint": "#bec6df",
                    "surface-container-lowest": "#060e1f",
                    "background": "#0b1325",
                    "error-container": "#93000a",
                    "surface-variant": "#2d3448",
                    "on-primary": "#283043",
                    "inverse-primary": "#565e73",
                    "primary": "#bec6df",
                    "on-tertiary-container": "#b36e67",
                    "on-primary-fixed-variant": "#3f465b",
                    "surface-container-low": "#131b2d",
                    "on-secondary-fixed-variant": "#3a4665",
                    "tertiary": "#ffb4ab",
                    "on-tertiary-fixed": "#380c09",
                    "secondary-fixed-dim": "#b9c6eb",
                    "secondary-container": "#3a4665",
                    "surface": "#0b1325",
                    "outline-variant": "#45464c",
                    "primary-container": "#0f1729",
                    "secondary": "#b9c6eb",
                    "on-secondary": "#23304d",
                    "on-surface": "#dbe2fb",
                    "surface-container-highest": "#2d3448",
                    "primary-fixed": "#dbe2fb",
                    "on-primary-container": "#798097",
                    "surface-dim": "#0b1325",
                    "on-secondary-fixed": "#0d1b37",
                    "on-surface-variant": "#c6c6cd",
                    "on-secondary-container": "#a8b5d9",
                    "tertiary-container": "#320806",
                    "primary-fixed-dim": "#bec6df",
                    "tertiary-fixed-dim": "#ffb4ab",
                    "tertiary-fixed": "#ffdad6"
            },
            "borderRadius": {
                    "DEFAULT": "0.25rem",
                    "lg": "0.5rem",
                    "xl": "0.75rem",
                    "full": "9999px"
            },
            "fontFamily": {
                    "headline": ["Newsreader"],
                    "display": ["Newsreader"],
                    "body": ["Space Grotesk"],
                    "label": ["Space Grotesk"]
            }
          },
        },
      }
    </script>
<style>
        body {
            background-color: #0b1325;
            color: #f5f5f5;
            font-family: 'Space Grotesk', sans-serif;
            overflow-x: hidden;
        }
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .celestial-bg {
            background: radial-gradient(circle at 50% 50%, #131B2D 0%, #0B1325 100%);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
        }
        .star-field {
            background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px);
            background-size: 550px 550px;
            opacity: 0.1;
        }
    </style>
</head>
<body class="flex min-h-screen">
<div class="celestial-bg">
<div class="star-field absolute inset-0"></div>
<div class="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-[#C17A72]/5 blur-[120px]"></div>
<div class="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#BEC6DF]/5 blur-[100px]"></div>
</div>
<aside class="docked left-0 h-screen w-64 border-r border-white/10 bg-[#060E1F]/80 backdrop-blur-xl flex flex-col h-full py-8 px-4 shadow-[0px_20px_40px_rgba(15,23,41,0.4)] fixed z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-[#9CA3AF] mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 group relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold" href="#">
<span class="material-symbols-outlined text-[#C17A72]" data-icon="dashboard">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<a class="flex items-center gap-4 px-4 py-3 transition-all duration-300 hover:bg-white/5 text-[#9CA3AF] hover:text-[#BEC6DF]" href="#">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-1">
<button class="w-full mb-6 py-3 px-4 rounded-xl bg-gradient-to-br from-[#BEC6DF] to-[#0F1729] text-[#0B1325] font-['Space_Grotesk'] font-bold text-sm scale-98 active:scale-95 duration-200">
                Auto-schedule
            </button>
<a class="flex items-center gap-4 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined text-lg" data-icon="settings">settings</span>
<span class="font-['Space_Grotesk'] text-sm">Settings</span>
</a>
<a class="flex items-center gap-4 px-4 py-2 text-[#9CA3AF] hover:text-[#BEC6DF] transition-colors" href="#">
<span class="material-symbols-outlined text-lg" data-icon="help_outline">help_outline</span>
<span class="font-['Space_Grotesk'] text-sm">Support</span>
</a>
<div class="pt-6 flex items-center gap-3 px-4">
<img alt="User Profile Avatar" class="w-8 h-8 rounded-full object-cover" data-alt="A close-up portrait of a thoughtful man in his 30s with soft, natural lighting. He has a clean-shaven face and short, neat hair. The background is a soft-focus office with warm, ambient light that creates a professional yet approachable and intimate atmosphere. The color palette is composed of muted earth tones and soft blues." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyE2xg8o2MnwAodZWmN78J8NdslWGyQcR5VQ1u7VYzm9aFUMUlDWP62Fk7trfEDO2owWADQ4sh69Kzir_ouaizI7o_Cdnv8fmnbHWE8VEdD6w_fYrAuTSFtXgTWaJYdu4W4W-MvZ6IcMnAv8ul6pE3tM4RmMc2oVC8r4Gu4q7NPj7ZZu3QMmRynSsApmF9vKjhGKoX-iPZ7vR6bDZuvXG9atktWWP1K0jqSu2K62ncp-5Z3rfS2I0-HKr75KgIlgiGufJik064Cg"/>
<div>
<p class="text-xs font-bold text-[#F5F5F5]">Julian Voss</p>
<p class="text-[10px] text-[#9CA3AF]">Pro Member</p>
</div>
</div>
</div>
</aside>
<main class="ml-64 flex-1 relative flex flex-col items-center justify-center px-12 py-20 min-h-screen">
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 w-full z-40 bg-transparent">
<div class="flex items-center gap-8">
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] font-['Space_Grotesk'] font-medium text-sm hover:text-[#F5F5F5] transition-colors" href="#">Insights</a>
</div>
<div class="flex items-center gap-6">
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer opacity-80 hover:opacity-100 duration-300" data-icon="notifications">notifications</span>
<span class="material-symbols-outlined text-[#BEC6DF] cursor-pointer opacity-80 hover:opacity-100 duration-300" data-icon="account_circle">account_circle</span>
</div>
</header>
<section class="max-w-5xl w-full text-center space-y-16">
<div class="space-y-4">
<p class="font-['JetBrains_Mono'] text-sm text-[#C17A72] tracking-[0.4em] uppercase opacity-80">Phase: Transition</p>
<h1 class="text-[5rem] md:text-[7rem] leading-[0.95] font-['Playfair_Display'] font-normal text-[#F5F5F5] tracking-tight">
                    Weekly <span class="italic font-light opacity-80 text-[#BEC6DF]">Ritual</span>
</h1>
<div class="w-24 h-[1px] bg-[#C17A72]/40 mx-auto mt-8"></div>
</div>
<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left relative">
<div class="glass-card p-10 rounded-[2rem] space-y-6 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="font-['JetBrains_Mono'] text-6xl">01</span>
</div>
<div class="w-12 h-12 rounded-full bg-[#C17A72]/10 flex items-center justify-center border border-[#C17A72]/20">
<span class="material-symbols-outlined text-[#C17A72]" data-icon="history_edu">history_edu</span>
</div>
<div>
<h3 class="font-['Playfair_Display'] text-2xl text-[#F5F5F5] mb-2">Past Week</h3>
<p class="text-[#9CA3AF] leading-relaxed text-sm">Quietly observe the threads of the previous seven days. What resonated? What remained unfinished?</p>
</div>
</div>
<div class="glass-card p-10 rounded-[2rem] space-y-6 relative overflow-hidden group translate-y-8">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="font-['JetBrains_Mono'] text-6xl">02</span>
</div>
<div class="w-12 h-12 rounded-full bg-[#BEC6DF]/10 flex items-center justify-center border border-[#BEC6DF]/20">
<span class="material-symbols-outlined text-[#BEC6DF]" data-icon="visibility">visibility</span>
</div>
<div>
<h3 class="font-['Playfair_Display'] text-2xl text-[#F5F5F5] mb-2">Alignment</h3>
<p class="text-[#9CA3AF] leading-relaxed text-sm">Hold your current path against your Vision Board. Ensure your momentum is serving your greater purpose.</p>
</div>
</div>
<div class="glass-card p-10 rounded-[2rem] space-y-6 relative overflow-hidden group">
<div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
<span class="font-['JetBrains_Mono'] text-6xl">03</span>
</div>
<div class="w-12 h-12 rounded-full bg-[#F5F5F5]/5 flex items-center justify-center border border-[#F5F5F5]/10">
<span class="material-symbols-outlined text-[#F5F5F5]" data-icon="center_focus_strong">center_focus_strong</span>
</div>
<div>
<h3 class="font-['Playfair_Display'] text-2xl text-[#F5F5F5] mb-2">Set Focus</h3>
<p class="text-[#9CA3AF] leading-relaxed text-sm">Distill your upcoming week into singular, potent intentions. Choose where your energy will flow.</p>
</div>
</div>
</div>
<div class="pt-12 flex flex-col items-center space-y-6">
<button class="px-12 py-5 rounded-full bg-[#C17A72] text-[#0B1325] font-['Space_Grotesk'] font-bold text-lg tracking-wide shadow-[0px_20px_40px_rgba(193,122,114,0.3)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center gap-3">
                    Start Your Reflection
                    <span class="material-symbols-outlined" data-icon="arrow_forward">arrow_forward</span>
</button>
<p class="text-[#9CA3AF] text-sm italic font-['Newsreader']">Estimate: 12 minutes of conscious presence</p>
</div>
</section>
<footer class="mt-32 w-full max-w-5xl flex justify-between items-end border-t border-white/5 pt-8 opacity-60">
<div class="space-y-2">
<p class="font-['JetBrains_Mono'] text-[10px] tracking-widest text-[#BEC6DF]">TIMESTAMP // 2023.10.27.09.41</p>
<p class="text-xs text-[#9CA3AF]">System Status: All systems aligned</p>
</div>
<div class="flex gap-12 text-[10px] tracking-widest uppercase font-['Space_Grotesk'] text-[#BEC6DF]">
<a class="hover:text-[#F5F5F5]" href="#">Privacy Ritual</a>
<a class="hover:text-[#F5F5F5]" href="#">Architecture</a>
</div>
</footer>
<div class="absolute bottom-20 right-20 w-[400px] h-[400px] pointer-events-none opacity-20">
<img class="w-full h-full object-cover mix-blend-screen grayscale" data-alt="A deep space nebula captured with high-contrast telescope photography. Swirls of cosmic dust and gas are illuminated by distant starlight, creating a sense of infinite depth and movement. The scene is monochromatic with subtle variations in dark grays and bright whites, evoking an ethereal and philosophical mood that aligns with the celestial curator aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAW5JYdXqnY5u_jPp2Z0oYELgQPYXb43UbyIFpahjLH66gIgdZGiBfmHurK-tKMy7L25I7uMmywgMUYqvynaK4UK6r52Mk13ChTScm5aRJSu02wiokdBydghtbJJsT0bh2Amy77_frfI4Rk517Oom3XsiowCSIdf3lk-18K0HC78gqJ8bf9-PahGzJMq_MG-jLC4Ns2bn3Lk1uId6tWsxAG_ROl9PvZw5KtaQQVjqoLsTMskUkuDMBCk8VlRoV9VyQ3wlowZgt-yw"/>
</div>
</main>
</body></html>

<!-- Weekly Ritual - Start -->
<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Motion | Focus Step</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&amp;family=Space+Grotesk:wght@300;400;500;600;700&amp;family=JetBrains+Mono:wght@400;500&amp;family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
        tailwind.config = {
            darkMode: "class",
            theme: {
                extend: {
                    colors: {
                        "on-primary-fixed": "#131b2d",
                        "error": "#ffb4ab",
                        "surface-bright": "#31394c",
                        "on-background": "#dbe2fb",
                        "on-tertiary-fixed-variant": "#6f3630",
                        "secondary-fixed": "#d9e2ff",
                        "on-tertiary": "#53211c",
                        "on-error": "#690005",
                        "on-error-container": "#ffdad6",
                        "inverse-surface": "#dbe2fb",
                        "outline": "#909097",
                        "surface-container": "#171f32",
                        "surface-container-high": "#222a3d",
                        "inverse-on-surface": "#283043",
                        "surface-tint": "#bec6df",
                        "surface-container-lowest": "#060e1f",
                        "background": "#0b1325",
                        "error-container": "#93000a",
                        "surface-variant": "#2d3448",
                        "on-primary": "#283043",
                        "inverse-primary": "#565e73",
                        "primary": "#bec6df",
                        "on-tertiary-container": "#b36e67",
                        "on-primary-fixed-variant": "#3f465b",
                        "surface-container-low": "#131b2d",
                        "on-secondary-fixed-variant": "#3a4665",
                        "tertiary": "#ffb4ab",
                        "on-tertiary-fixed": "#380c09",
                        "secondary-fixed-dim": "#b9c6eb",
                        "secondary-container": "#3a4665",
                        "surface": "#0b1325",
                        "outline-variant": "#45464c",
                        "primary-container": "#0f1729",
                        "secondary": "#b9c6eb",
                        "on-secondary": "#23304d",
                        "on-surface": "#dbe2fb",
                        "surface-container-highest": "#2d3448",
                        "primary-fixed": "#dbe2fb",
                        "on-primary-container": "#798097",
                        "surface-dim": "#0b1325",
                        "on-secondary-fixed": "#0d1b37",
                        "on-surface-variant": "#c6c6cd",
                        "on-secondary-container": "#a8b5d9",
                        "tertiary-container": "#320806",
                        "primary-fixed-dim": "#bec6df",
                        "tertiary-fixed-dim": "#ffb4ab",
                        "tertiary-fixed": "#ffdad6"
                    },
                    fontFamily: {
                        headline: ["Newsreader", "serif"],
                        display: ["Playfair Display", "serif"],
                        body: ["Space Grotesk", "sans-serif"],
                        label: ["Space Grotesk", "sans-serif"],
                        mono: ["JetBrains Mono", "monospace"]
                    }
                }
            }
        }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
            vertical-align: middle;
        }
        .glass-card {
            background: rgba(26, 39, 68, 0.6);
            backdrop-filter: blur(24px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #45464c; border-radius: 10px; }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-tertiary selection:text-on-tertiary overflow-hidden">
<!-- SideNavBar Shell -->
<aside class="fixed left-0 top-0 h-screen w-64 bg-[#060E1F]/80 backdrop-blur-xl border-r border-white/10 flex flex-col py-8 px-4 z-50">
<div class="mb-12 px-4">
<h1 class="text-2xl font-['Playfair_Display'] italic text-[#F5F5F5]">Motion</h1>
<p class="text-[10px] uppercase tracking-[0.2em] text-[#C17A72] mt-1">Celestial Curator</p>
</div>
<nav class="flex-1 space-y-2">
<!-- Dashboard -->
<a class="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="dashboard">dashboard</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Dashboard</span>
</a>
<!-- Vision Board -->
<a class="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="auto_awesome_motion">auto_awesome_motion</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Vision Board</span>
</a>
<!-- Calendar - ACTIVE -->
<a class="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 relative text-[#F5F5F5] before:content-[''] before:absolute before:left-0 before:w-[2px] before:h-6 before:bg-[#C17A72] font-bold bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="calendar_today">calendar_today</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Calendar</span>
</a>
<!-- AI Coach -->
<a class="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="smart_toy">smart_toy</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">AI Coach</span>
</a>
<!-- Journal -->
<a class="flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-300 text-[#9CA3AF] hover:text-[#BEC6DF] hover:bg-white/5" href="#">
<span class="material-symbols-outlined" data-icon="edit_note">edit_note</span>
<span class="font-['Space_Grotesk'] text-sm tracking-wide">Journal</span>
</a>
</nav>
<div class="mt-auto space-y-4">
<button class="w-full py-3 bg-primary-container text-primary rounded-xl border border-outline-variant/20 font-medium text-sm flex items-center justify-center gap-2 hover:bg-surface-variant transition-colors">
<span class="material-symbols-outlined text-sm">bolt</span>
                Auto-schedule
            </button>
<div class="pt-4 border-t border-white/5 space-y-1">
<a class="flex items-center gap-3 py-2 px-4 text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors text-xs" href="#">
<span class="material-symbols-outlined text-lg" data-icon="settings">settings</span>
                    Settings
                </a>
<a class="flex items-center gap-3 py-2 px-4 text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors text-xs" href="#">
<span class="material-symbols-outlined text-lg" data-icon="help_outline">help_outline</span>
                    Support
                </a>
</div>
</div>
</aside>
<!-- TopNavBar Shell -->
<header class="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 flex justify-between items-center px-8 z-40">
<div class="flex items-center gap-8">
<nav class="flex items-center gap-6">
<a class="text-[#C17A72] border-b border-[#C17A72] font-['Space_Grotesk'] font-medium text-sm py-1" href="#">Focus Mode</a>
<a class="text-[#9CA3AF] hover:text-[#F5F5F5] transition-colors font-['Space_Grotesk'] font-medium text-sm py-1" href="#">Insights</a>
</nav>
</div>
<div class="flex items-center gap-6">
<div class="relative">
<span class="material-symbols-outlined text-[#BEC6DF] opacity-80 hover:opacity-100 cursor-pointer" data-icon="notifications">notifications</span>
<span class="absolute top-0 right-0 w-2 h-2 bg-tertiary rounded-full border-2 border-background"></span>
</div>
<span class="material-symbols-outlined text-[#BEC6DF] opacity-80 hover:opacity-100 cursor-pointer" data-icon="account_circle">account_circle</span>
</div>
</header>
<!-- Main Content Canvas -->
<main class="ml-64 pt-20 h-screen flex flex-col">
<!-- Hero Header -->
<div class="px-10 pb-6 flex justify-between items-end">
<div>
<span class="text-tertiary font-mono text-xs tracking-widest uppercase">Phase 02 / Focus</span>
<h2 class="text-5xl font-headline italic text-on-surface mt-2">The Weekly Ritual</h2>
<p class="text-on-surface-variant mt-3 max-w-lg font-light leading-relaxed">
                    Motion has synthesized your peak biological performance windows. Review your pre-filled <span class="text-tertiary font-medium">Deep Work</span> blocks and align your highest priorities.
                </p>
</div>
<button class="px-8 py-4 bg-tertiary text-on-tertiary-fixed rounded-full font-bold tracking-tight shadow-[0px_20px_40px_rgba(193,122,114,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                Commit to the Week
            </button>
</div>
<div class="flex-1 flex gap-8 px-10 pb-8 overflow-hidden">
<!-- Calendar View (Center) -->
<div class="flex-1 glass-card rounded-3xl overflow-hidden flex flex-col">
<!-- Calendar Header -->
<div class="grid grid-cols-7 border-b border-white/5">
<div class="p-4 text-center border-r border-white/5">
<span class="text-[10px] text-on-surface-variant uppercase tracking-widest">Mon</span>
<div class="text-xl font-mono mt-1">12</div>
</div>
<div class="p-4 text-center border-r border-white/5">
<span class="text-[10px] text-on-surface-variant uppercase tracking-widest">Tue</span>
<div class="text-xl font-mono mt-1">13</div>
</div>
<div class="p-4 text-center border-r border-white/5 bg-white/5">
<span class="text-[10px] text-tertiary uppercase tracking-widest font-bold">Wed</span>
<div class="text-xl font-mono mt-1 text-tertiary">14</div>
</div>
<div class="p-4 text-center border-r border-white/5">
<span class="text-[10px] text-on-surface-variant uppercase tracking-widest">Thu</span>
<div class="text-xl font-mono mt-1">15</div>
</div>
<div class="p-4 text-center border-r border-white/5">
<span class="text-[10px] text-on-surface-variant uppercase tracking-widest">Fri</span>
<div class="text-xl font-mono mt-1">16</div>
</div>
<div class="p-4 text-center border-r border-white/5">
<span class="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest">Sat</span>
<div class="text-xl font-mono mt-1 opacity-50 text-on-surface-variant">17</div>
</div>
<div class="p-4 text-center">
<span class="text-[10px] text-on-surface-variant opacity-50 uppercase tracking-widest">Sun</span>
<div class="text-xl font-mono mt-1 opacity-50 text-on-surface-variant">18</div>
</div>
</div>
<!-- Calendar Grid Body -->
<div class="flex-1 overflow-y-auto relative custom-scrollbar">
<div class="grid grid-cols-7 h-[800px]">
<!-- Time Markers Layer -->
<div class="absolute left-0 w-full h-full pointer-events-none opacity-20">
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">08:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">09:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">10:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">11:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">12:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">13:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">14:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">15:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">16:00</span></div>
<div class="h-20 border-b border-white/10 flex items-center pl-2"><span class="font-mono text-[10px]">17:00</span></div>
</div>
<!-- Column Slots -->
<div class="border-r border-white/5 relative">
<!-- Deep Work Block -->
<div class="absolute top-20 left-1 right-1 h-40 rounded-xl bg-primary/10 border-l-2 border-primary p-3 flex flex-col justify-between group cursor-grab active:cursor-grabbing hover:bg-primary/20 transition-all">
<div>
<span class="text-[10px] text-primary font-bold uppercase tracking-wider">Deep Work</span>
<h4 class="text-xs font-semibold text-on-surface">Strategy Dev</h4>
</div>
<span class="material-symbols-outlined text-primary text-sm self-end opacity-0 group-hover:opacity-100">drag_indicator</span>
</div>
</div>
<div class="border-r border-white/5 relative">
<div class="absolute top-60 left-1 right-1 h-20 rounded-xl bg-tertiary/10 border-l-2 border-tertiary p-3">
<span class="text-[10px] text-tertiary font-bold uppercase tracking-wider">Ritual</span>
<h4 class="text-xs font-semibold text-on-surface">Weekly Sync</h4>
</div>
</div>
<div class="border-r border-white/5 relative bg-white/[0.02]">
<!-- Pre-filled AI slots on Active day -->
<div class="absolute top-20 left-1 right-1 h-60 rounded-xl bg-primary/20 border border-primary/30 border-l-2 border-l-primary p-4 shadow-xl">
<div class="flex items-start justify-between">
<div>
<div class="flex items-center gap-1">
<span class="material-symbols-outlined text-[12px] text-primary" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
<span class="text-[10px] text-primary font-bold uppercase tracking-widest">AI Optimal Window</span>
</div>
<h4 class="text-sm font-headline italic text-on-surface mt-1">Deep Architecture Analysis</h4>
</div>
<span class="font-mono text-[10px] text-primary-fixed-dim">09:00 - 12:00</span>
</div>
<p class="text-[11px] text-on-surface-variant mt-4 leading-relaxed line-clamp-2">Based on your focus metrics from last Tuesday, your cognitive load is best utilized here.</p>
</div>
</div>
<div class="border-r border-white/5 relative"></div>
<div class="border-r border-white/5 relative">
<div class="absolute top-40 left-1 right-1 h-40 rounded-xl bg-primary/10 border-l-2 border-primary p-3">
<span class="text-[10px] text-primary font-bold uppercase tracking-wider">Deep Work</span>
<h4 class="text-xs font-semibold text-on-surface">Creative Flow</h4>
</div>
</div>
<div class="border-r border-white/5 relative"></div>
<div class="relative"></div>
</div>
</div>
</div>
<!-- Task Sidebar (Right) -->
<aside class="w-80 flex flex-col gap-6">
<!-- AI Coach Tip -->
<div class="p-6 rounded-3xl bg-primary-container border border-outline-variant/20 relative overflow-hidden group">
<div class="absolute -top-4 -right-4 w-16 h-16 bg-primary/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
<div class="relative z-10">
<div class="flex items-center gap-2 mb-3">
<span class="material-symbols-outlined text-primary text-xl" style="font-variation-settings: 'FILL' 1;">smart_toy</span>
<span class="font-mono text-[10px] tracking-tighter uppercase text-primary">Guidance</span>
</div>
<p class="text-xs leading-relaxed text-on-surface-variant italic">
                            "You've allocated 14 hours of deep work. I recommend adding your 'Project Zenith' milestone to Thursday's open slot."
                        </p>
</div>
</div>
<!-- Draggable Tasks -->
<div class="flex-1 glass-card rounded-3xl flex flex-col overflow-hidden">
<div class="p-5 border-b border-white/5 flex items-center justify-between">
<h3 class="font-semibold text-sm tracking-tight">High Priority Tasks</h3>
<span class="px-2 py-0.5 rounded-full bg-surface-variant text-[10px] font-mono text-primary">4 PENDING</span>
</div>
<div class="p-4 space-y-3 overflow-y-auto">
<!-- Task Item -->
<div class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-tertiary/40 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group">
<div class="flex items-start justify-between">
<div class="w-1 h-1 rounded-full bg-tertiary mt-2 shadow-[0_0_8px_#ffb4ab]"></div>
<div class="flex-1 ml-3">
<h5 class="text-xs font-medium text-on-surface leading-snug">Project Zenith: Design Audit</h5>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
<span class="font-mono text-[10px] text-on-surface-variant">2.5h</span>
</div>
</div>
<span class="material-symbols-outlined text-[#45464c] group-hover:text-on-surface-variant transition-colors">drag_pan</span>
</div>
</div>
<div class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-tertiary/40 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group">
<div class="flex items-start justify-between">
<div class="w-1 h-1 rounded-full bg-tertiary mt-2 shadow-[0_0_8px_#ffb4ab]"></div>
<div class="flex-1 ml-3">
<h5 class="text-xs font-medium text-on-surface leading-snug">Market Expansion Deck</h5>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
<span class="font-mono text-[10px] text-on-surface-variant">4.0h</span>
</div>
</div>
<span class="material-symbols-outlined text-[#45464c] group-hover:text-on-surface-variant transition-colors">drag_pan</span>
</div>
</div>
<div class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-tertiary/40 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group">
<div class="flex items-start justify-between">
<div class="w-1 h-1 rounded-full bg-primary mt-2"></div>
<div class="flex-1 ml-3">
<h5 class="text-xs font-medium text-on-surface leading-snug">Stakeholder Review Prep</h5>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
<span class="font-mono text-[10px] text-on-surface-variant">1.5h</span>
</div>
</div>
<span class="material-symbols-outlined text-[#45464c] group-hover:text-on-surface-variant transition-colors">drag_pan</span>
</div>
</div>
<div class="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-tertiary/40 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group">
<div class="flex items-start justify-between">
<div class="w-1 h-1 rounded-full bg-outline-variant mt-2"></div>
<div class="flex-1 ml-3">
<h5 class="text-xs font-medium text-on-surface leading-snug">Archival Documentation</h5>
<div class="flex items-center gap-2 mt-2">
<span class="material-symbols-outlined text-[14px] text-on-surface-variant">timer</span>
<span class="font-mono text-[10px] text-on-surface-variant">0.5h</span>
</div>
</div>
<span class="material-symbols-outlined text-[#45464c] group-hover:text-on-surface-variant transition-colors">drag_pan</span>
</div>
</div>
</div>
</div>
<!-- Life Balance Card -->
<div class="p-6 glass-card rounded-3xl">
<h4 class="text-[10px] font-mono tracking-widest uppercase text-on-surface-variant mb-4">Focus Capacity</h4>
<div class="flex items-center justify-between">
<div class="relative w-16 h-16">
<svg class="w-full h-full transform -rotate-90">
<circle class="text-surface-variant opacity-30" cx="32" cy="32" fill="transparent" r="28" stroke="currentColor" stroke-width="4"></circle>
<circle cx="32" cy="32" fill="transparent" r="28" stroke="url(#rose-gradient)" stroke-dasharray="176" stroke-dashoffset="44" stroke-linecap="round" stroke-width="4"></circle>
</svg>
<defs>
<lineargradient id="rose-gradient" x1="0%" x2="100%" y1="0%" y2="100%">
<stop offset="0%" stop-color="#ffb4ab"></stop>
<stop offset="100%" stop-color="#C17A72"></stop>
</lineargradient>
</defs>
<span class="absolute inset-0 flex items-center justify-center font-mono text-[10px]">75%</span>
</div>
<div class="text-right">
<div class="text-2xl font-mono text-tertiary">14/18</div>
<div class="text-[10px] text-on-surface-variant">HOURS PLANNED</div>
</div>
</div>
</div>
</aside>
</div>
</main>
<!-- Celestial Decor -->
<div class="fixed top-[-10%] right-[-5%] w-[40%] h-[40%] bg-tertiary/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
<div class="fixed bottom-[-10%] left-[10%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
</body></html>