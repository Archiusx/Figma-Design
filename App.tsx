import { useState } from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  LayoutDashboard, Search, Database, Brain, Network, Clock,
  FileText, BarChart3, Settings, Shield, Bell, User,
  Plus, Upload, CheckCircle2, Loader2, TrendingUp,
  Users, Download, Share2, Filter, Hash, AtSign,
  Phone, Link as LinkIcon, RefreshCw, Calendar, Activity,
  Fingerprint, AlertCircle, Zap, ChevronRight, ArrowUpRight,
  MoreHorizontal, Globe, Github, MessageSquare, AlertTriangle,
  Circle, Flag, Eye, ExternalLink, Info, Target, Mail, Image,
  ChevronDown, Check, Scan, MapPin,
} from "lucide-react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid,
} from "recharts";

const cn = (...args: (string | false | null | undefined)[]) => twMerge(clsx(args));

// ─── Types ──────────────────────────────────────────────────────────────────

type Page = "dashboard" | "osint" | "ai-analysis" | "graph" | "report";
type Risk = "critical" | "high" | "medium" | "low";

// ─── Static Data ─────────────────────────────────────────────────────────────

const threatData = [
  { name: "Cybercrime", value: 35, color: "#dc2626" },
  { name: "Fraud", value: 28, color: "#f97316" },
  { name: "Harassment", value: 20, color: "#eab308" },
  { name: "Identity Theft", value: 17, color: "#8b5cf6" },
];

const platformBarData = [
  { name: "Instagram", cases: 89 },
  { name: "Telegram", cases: 76 },
  { name: "Twitter/X", cases: 71 },
  { name: "GitHub", cases: 45 },
  { name: "Reddit", cases: 38 },
  { name: "Facebook", cases: 29 },
  { name: "Forums", cases: 22 },
];

const activityData = [
  { day: "Mon", investigations: 8, suspects: 5 },
  { day: "Tue", investigations: 14, suspects: 9 },
  { day: "Wed", investigations: 11, suspects: 7 },
  { day: "Thu", investigations: 19, suspects: 13 },
  { day: "Fri", investigations: 16, suspects: 11 },
  { day: "Sat", investigations: 9, suspects: 6 },
  { day: "Sun", investigations: 12, suspects: 8 },
];

const recentInvestigations = [
  { id: "INV-2024-089", target: "@darkweb_trader", type: "Username", platforms: ["Twitter", "Telegram", "GitHub"], risk: "critical" as Risk, status: "Active", date: "Dec 5, 2024", analyst: "S. Chen" },
  { id: "INV-2024-088", target: "john.doe.scam@gmail.com", type: "Email", platforms: ["Facebook", "Instagram"], risk: "high" as Risk, status: "Analysis", date: "Dec 4, 2024", analyst: "M. Torres" },
  { id: "INV-2024-087", target: "+1 555-019-2847", type: "Phone", platforms: ["WhatsApp", "Telegram"], risk: "medium" as Risk, status: "Collection", date: "Dec 3, 2024", analyst: "R. Patel" },
  { id: "INV-2024-086", target: "@crypto_whale99", type: "Username", platforms: ["Twitter", "GitHub"], risk: "high" as Risk, status: "Completed", date: "Dec 2, 2024", analyst: "S. Chen" },
  { id: "INV-2024-085", target: "@fake_vendor_01", type: "Username", platforms: ["Reddit", "Forums"], risk: "medium" as Risk, status: "Completed", date: "Dec 1, 2024", analyst: "K. Williams" },
  { id: "INV-2024-084", target: "james.miller.95", type: "Username", platforms: ["Facebook", "Instagram", "LinkedIn"], risk: "low" as Risk, status: "Completed", date: "Nov 30, 2024", analyst: "M. Torres" },
];

const osintPlatforms = [
  { id: "instagram", name: "Instagram", abbr: "IG", color: "#e1306c", status: "found", count: 3, details: ["@dark_user_x", "@dm_trader99", "@shadow.ig"] },
  { id: "telegram", name: "Telegram", abbr: "TG", color: "#0088cc", status: "found", count: 2, details: ["@signal_private", "DarkMarket Group"] },
  { id: "twitter", name: "Twitter / X", abbr: "TW", color: "#000000", status: "found", count: 1, details: ["@darkweb_trader"] },
  { id: "github", name: "GitHub", abbr: "GH", color: "#24292e", status: "found", count: 2, details: ["crypto_exchanger", "anon_dev_x"] },
  { id: "reddit", name: "Reddit", abbr: "RD", color: "#ff4500", status: "collecting", count: 0, details: [] },
  { id: "facebook", name: "Facebook", abbr: "FB", color: "#1877f2", status: "searching", count: 0, details: [] },
  { id: "forums", name: "Dark Forums", abbr: "DF", color: "#7c3aed", status: "found", count: 4, details: ["darkweb_forum", "crypto_underground", "+2 more"] },
  { id: "email", name: "Email Lookup", abbr: "EM", color: "#0f766e", status: "pending", count: 0, details: [] },
];

const activityLog = [
  { time: "14:31:52", level: "success", msg: "Forum: 4 pseudonyms identified on dark web forums" },
  { time: "14:31:48", level: "info", msg: "Running email correlation on extracted contact data" },
  { time: "14:31:41", level: "warn", msg: "Reddit: Rate limit hit — retrying with alternate endpoint" },
  { time: "14:31:35", level: "info", msg: "Cross-referencing profile images via perceptual hash" },
  { time: "14:31:29", level: "success", msg: "GitHub: 2 repositories linked — commit metadata extracted" },
  { time: "14:31:22", level: "success", msg: "Telegram: 2 accounts identified — group memberships pulled" },
  { time: "14:31:15", level: "info", msg: "Extracting timezone & behavioral fingerprint from patterns" },
  { time: "14:31:08", level: "success", msg: "Instagram: 3 related profiles found — downloading metadata" },
  { time: "14:31:02", level: "info", msg: "Initiating deep OSINT scan for @darkweb_trader" },
];

const analysisCategories = [
  { id: "username", title: "Username Similarity", icon: "Hash", score: 91, confidence: "Very High", matches: [
    { account: "@darkweb_exchange", platform: "GitHub", score: 91, risk: "critical" as Risk },
    { account: "@dark_trader_x", platform: "Reddit", score: 83, risk: "high" as Risk },
    { account: "@dwtrader", platform: "Forums", score: 74, risk: "high" as Risk },
  ]},
  { id: "bio", title: "Bio & Writing Style", icon: "FileText", score: 78, confidence: "High", matches: [
    { account: "@signal_private", platform: "Telegram", score: 78, risk: "high" as Risk },
    { account: "anon_dev_x", platform: "GitHub", score: 71, risk: "medium" as Risk },
  ]},
  { id: "behavioral", title: "Behavioral Patterns", icon: "Activity", score: 85, confidence: "Very High", matches: [
    { account: "Cross-Platform Activity", platform: "Multiple", score: 85, risk: "high" as Risk },
    { account: "Night-Hours Posting (UTC+8)", platform: "All Platforms", score: 79, risk: "high" as Risk },
  ]},
  { id: "metadata", title: "Metadata Correlation", icon: "Database", score: 93, confidence: "Critical", matches: [
    { account: "Device Fingerprint Match", platform: "Multiple", score: 93, risk: "critical" as Risk },
    { account: "Timezone: UTC+8 (consistent)", platform: "All Platforms", score: 89, risk: "high" as Risk },
  ]},
  { id: "face", title: "Face Recognition", icon: "Scan", score: 67, confidence: "Moderate", matches: [
    { account: "@dark_user_x", platform: "Instagram", score: 67, risk: "medium" as Risk },
  ]},
  { id: "social", title: "Social Connection Map", icon: "Network", score: 79, confidence: "High", matches: [
    { account: "12 Shared Connections", platform: "Cross-platform", score: 79, risk: "high" as Risk },
    { account: "3 Common Groups", platform: "Telegram", score: 71, risk: "medium" as Risk },
  ]},
];

interface GraphNode {
  id: string; label: string; platform: string; abbr: string;
  color: string; risk: Risk; matchPct: number; x: number; y: number; size: number;
}

const graphNodes: GraphNode[] = [
  { id: "center", label: "@darkweb_trader", platform: "Target", abbr: "★", color: "#dc2626", risk: "critical", matchPct: 100, x: 380, y: 235, size: 44 },
  { id: "n1", label: "@binance_whale99", platform: "Twitter/X", abbr: "TW", color: "#ef4444", risk: "critical", matchPct: 91, x: 380, y: 62, size: 34 },
  { id: "n2", label: "@crypto_exchanger", platform: "GitHub", abbr: "GH", color: "#f97316", risk: "high", matchPct: 87, x: 138, y: 112, size: 32 },
  { id: "n3", label: "@signal_private", platform: "Telegram", abbr: "TG", color: "#ef4444", risk: "critical", matchPct: 83, x: 622, y: 112, size: 32 },
  { id: "n4", label: "@shadow_mkt", platform: "Reddit", abbr: "RD", color: "#f97316", risk: "high", matchPct: 72, x: 682, y: 285, size: 30 },
  { id: "n5", label: "@dark_user_x", platform: "Instagram", abbr: "IG", color: "#f97316", risk: "high", matchPct: 76, x: 552, y: 408, size: 30 },
  { id: "n6", label: "darkweb_forum", platform: "Forum", abbr: "FM", color: "#eab308", risk: "medium", matchPct: 59, x: 208, y: 408, size: 28 },
  { id: "n7", label: "anon@proton.me", platform: "Email", abbr: "EM", color: "#eab308", risk: "medium", matchPct: 64, x: 78, y: 285, size: 28 },
  { id: "n8", label: "anon_dev_x", platform: "GitHub", abbr: "GH", color: "#eab308", risk: "medium", matchPct: 68, x: 380, y: 415, size: 26 },
];

const graphEdges = [
  { from: "center", to: "n1", strength: 91 },
  { from: "center", to: "n2", strength: 87 },
  { from: "center", to: "n3", strength: 83 },
  { from: "center", to: "n4", strength: 72 },
  { from: "center", to: "n5", strength: 76 },
  { from: "center", to: "n6", strength: 59 },
  { from: "center", to: "n7", strength: 64 },
  { from: "center", to: "n8", strength: 68 },
  { from: "n1", to: "n3", strength: 45 },
  { from: "n2", to: "n8", strength: 38 },
  { from: "n3", to: "n4", strength: 41 },
];

const nodeById = (id: string) => graphNodes.find((n) => n.id === id)!;

const riskFill: Record<Risk, { fill: string; stroke: string; glow: string }> = {
  critical: { fill: "#fff1f2", stroke: "#ef4444", glow: "rgba(239,68,68,0.2)" },
  high: { fill: "#fff7ed", stroke: "#f97316", glow: "rgba(249,115,22,0.2)" },
  medium: { fill: "#fefce8", stroke: "#eab308", glow: "rgba(234,179,8,0.2)" },
  low: { fill: "#f0fdf4", stroke: "#22c55e", glow: "rgba(34,197,94,0.2)" },
};

const timelineEvents = [
  { date: "Nov 12, 2024", time: "09:14 UTC", event: "Account @darkweb_trader created on Twitter/X", type: "account", risk: "critical" as Risk },
  { date: "Nov 19, 2024", time: "22:37 UTC", event: "@crypto_exchanger GitHub account created — identical bio fragment detected", type: "correlation", risk: "high" as Risk },
  { date: "Nov 24, 2024", time: "03:18 UTC", event: "First dark-market cryptocurrency transaction traced ($12,400 BTC)", type: "financial", risk: "critical" as Risk },
  { date: "Nov 28, 2024", time: "18:55 UTC", event: "@shadow_mkt Reddit activity linked via shared IP metadata", type: "correlation", risk: "high" as Risk },
  { date: "Dec 01, 2024", time: "11:29 UTC", event: "@binance_whale99 account connected — 91% metadata fingerprint match", type: "discovery", risk: "critical" as Risk },
  { date: "Dec 03, 2024", time: "15:42 UTC", event: "Telegram @signal_private group memberships extracted", type: "account", risk: "high" as Risk },
  { date: "Dec 05, 2024", time: "14:23 UTC", event: "Investigation INV-2024-089 opened — full identity correlation initiated", type: "investigation", risk: "medium" as Risk },
];

// ─── Shared UI Atoms ─────────────────────────────────────────────────────────

function RiskBadge({ risk }: { risk: Risk }) {
  const map: Record<Risk, string> = {
    critical: "bg-red-50 text-red-700 ring-1 ring-red-200",
    high: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    medium: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    low: "bg-green-50 text-green-700 ring-1 ring-green-200",
  };
  return (
    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium", map[risk])}>
      <span className={cn("w-1.5 h-1.5 rounded-full", {
        critical: "bg-red-500", high: "bg-orange-500", medium: "bg-amber-500", low: "bg-green-500",
      }[risk])} />
      {risk.charAt(0).toUpperCase() + risk.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    Active: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
    Analysis: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    Collection: "bg-cyan-50 text-cyan-700 ring-1 ring-cyan-200",
    Completed: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };
  return (
    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-xs font-medium", map[status] ?? "bg-slate-100 text-slate-600")}>
      {status}
    </span>
  );
}

function ScoreBar({ score, color = "#2563eb" }: { score: number; color?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-medium tabular-nums text-slate-600 w-8 text-right"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}>
        {score}%
      </span>
    </div>
  );
}

function PlatformPill({ abbr, color }: { abbr: string; color: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-white text-[10px] font-bold"
      style={{ backgroundColor: color, fontFamily: "'JetBrains Mono', monospace" }}>
      {abbr}
    </span>
  );
}

// ─── Sidebar ─────────────────────────────────────────────────────────────────

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "main" },
  { id: "osint", label: "New Investigation", icon: Plus, group: "main" },
  { id: "osint", label: "OSINT Collection", icon: Database, group: "work" },
  { id: "ai-analysis", label: "AI Analysis", icon: Brain, group: "work" },
  { id: "graph", label: "Relationship Graph", icon: Network, group: "work" },
  { id: "graph", label: "Timeline", icon: Clock, group: "work" },
  { id: "report", label: "Reports", icon: FileText, group: "output" },
  { id: "dashboard", label: "Analytics", icon: BarChart3, group: "output" },
  { id: "dashboard", label: "Settings", icon: Settings, group: "system" },
] as const;

function Sidebar({ activePage, setActivePage }: { activePage: Page; setActivePage: (p: Page) => void }) {
  return (
    <aside className="w-[220px] min-w-[220px] flex flex-col h-full overflow-y-auto"
      style={{ backgroundColor: "#0f172a", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}>
          <Shield size={15} className="text-white" />
        </div>
        <div className="min-w-0">
          <div className="text-white text-[11px] font-semibold leading-tight tracking-wide"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>SMART SUSPECT</div>
          <div className="text-blue-400 text-[10px] leading-tight tracking-widest"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}>FINDER · v2.1</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {/* Active Investigation badge */}
        <div className="mx-2 mb-4 px-3 py-2 rounded-lg" style={{ backgroundColor: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)" }}>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
            <span className="text-red-300 text-[10px] font-medium">1 ACTIVE CASE</span>
          </div>
          <div className="text-slate-400 text-[10px] mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>INV-2024-089</div>
        </div>

        {(["main", "work", "output", "system"] as const).map((group) => {
          const groupItems = navItems.filter((i) => i.group === group);
          const labels: Record<string, string> = { main: "", work: "INVESTIGATION", output: "OUTPUT", system: "SYSTEM" };
          return (
            <div key={group} className={group !== "main" ? "pt-3" : ""}>
              {labels[group] && (
                <div className="px-3 pb-1.5">
                  <span className="text-[10px] font-semibold tracking-widest" style={{ color: "rgba(148,163,184,0.5)" }}>{labels[group]}</span>
                </div>
              )}
              {groupItems.map((item, idx) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button key={`${item.id}-${idx}`}
                    onClick={() => setActivePage(item.id as Page)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all duration-150 group",
                      isActive
                        ? "text-white"
                        : "text-slate-400 hover:text-slate-200"
                    )}
                    style={isActive ? { backgroundColor: "rgba(59,130,246,0.15)" } : undefined}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = ""; }}
                  >
                    <Icon size={15} className={isActive ? "text-blue-400" : "text-slate-500 group-hover:text-slate-300"} />
                    <span className="text-sm">{item.label}</span>
                    {isActive && <span className="ml-auto w-1 h-4 rounded-full bg-blue-400" />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">SC</span>
          </div>
          <div className="min-w-0">
            <div className="text-slate-200 text-xs font-medium truncate">Sarah Chen</div>
            <div className="text-slate-500 text-[10px]">Senior Analyst</div>
          </div>
          <Settings size={13} className="ml-auto text-slate-600 hover:text-slate-400 cursor-pointer flex-shrink-0" />
        </div>
      </div>
    </aside>
  );
}

// ─── Top Navbar ───────────────────────────────────────────────────────────────

const pageTitles: Record<Page, { title: string; sub: string }> = {
  dashboard: { title: "Investigation Dashboard", sub: "Overview of all active & completed cases" },
  osint: { title: "OSINT Data Collection", sub: "INV-2024-089 · @darkweb_trader · Live collection in progress" },
  "ai-analysis": { title: "AI Analysis & Fingerprinting", sub: "INV-2024-089 · Digital identity correlation engine" },
  graph: { title: "Relationship Graph & Timeline", sub: "INV-2024-089 · Network visualization & event reconstruction" },
  report: { title: "Forensic Report Generation", sub: "INV-2024-089 · Exportable investigation summary" },
};

function TopNav({ activePage, setActivePage }: { activePage: Page; setActivePage: (p: Page) => void }) {
  const { title, sub } = pageTitles[activePage];
  const steps: { id: Page; label: string }[] = [
    { id: "dashboard", label: "1. Input" },
    { id: "osint", label: "2. Collection" },
    { id: "ai-analysis", label: "3. Analysis" },
    { id: "graph", label: "4. Graph" },
    { id: "report", label: "5. Report" },
  ];
  const stepIdx = steps.findIndex((s) => s.id === activePage);

  return (
    <header className="bg-white flex flex-col flex-shrink-0" style={{ borderBottom: "1px solid #e2e8f0" }}>
      <div className="flex items-center justify-between px-6 h-14">
        <div className="min-w-0">
          <h1 className="text-slate-800 font-semibold text-base leading-tight">{title}</h1>
          <p className="text-slate-500 text-xs mt-0.5 truncate">{sub}</p>
        </div>
        <div className="flex items-center gap-3 ml-4 flex-shrink-0">
          {/* Workflow stepper */}
          <div className="hidden lg:flex items-center gap-1">
            {steps.map((step, i) => (
              <button key={step.id} onClick={() => setActivePage(step.id)}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors",
                  i === stepIdx ? "bg-blue-600 text-white" :
                    i < stepIdx ? "bg-blue-50 text-blue-600" :
                      "text-slate-400 hover:text-slate-600"
                )}>
                {i < stepIdx && <Check size={10} />}
                {step.label}
              </button>
            ))}
          </div>
          <div className="w-px h-5 bg-slate-200" />
          <button className="relative p-2 rounded-lg hover:bg-slate-50 transition-colors">
            <Bell size={17} className="text-slate-500" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 pl-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <span className="text-white text-[10px] font-bold">SC</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── PAGE 1: Dashboard ────────────────────────────────────────────────────────

function DashboardPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const [searchTab, setSearchTab] = useState<"username" | "email" | "phone" | "url" | "keyword" | "image">("username");
  const [searchVal, setSearchVal] = useState("");

  const searchTabs = [
    { id: "username", label: "Username", icon: AtSign },
    { id: "email", label: "Email", icon: Mail },
    { id: "phone", label: "Phone", icon: Phone },
    { id: "url", label: "Profile URL", icon: LinkIcon },
    { id: "keyword", label: "Keyword", icon: Hash },
    { id: "image", label: "Image", icon: Image },
  ] as const;

  const stats = [
    { label: "Total Investigations", value: "247", delta: "+12 this week", icon: Target, color: "blue" },
    { label: "Suspects Identified", value: "89", delta: "+7 this week", icon: Users, color: "indigo" },
    { label: "High Risk Cases", value: "23", delta: "4 require action", icon: AlertTriangle, color: "red" },
    { label: "Platforms Scanned", value: "14", delta: "Across all cases", icon: Globe, color: "cyan" },
  ];

  const colorMap: Record<string, { bg: string; icon: string; ring: string }> = {
    blue: { bg: "bg-blue-50", icon: "text-blue-600", ring: "ring-blue-100" },
    indigo: { bg: "bg-indigo-50", icon: "text-indigo-600", ring: "ring-indigo-100" },
    red: { bg: "bg-red-50", icon: "text-red-600", ring: "ring-red-100" },
    cyan: { bg: "bg-cyan-50", icon: "text-cyan-600", ring: "ring-cyan-100" },
  };

  return (
    <div className="p-6 space-y-6 min-h-full">
      {/* Search panel */}
      <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-slate-800 font-semibold text-sm">New Investigation Search</h2>
              <p className="text-slate-500 text-xs mt-0.5">Enter a target identifier to begin OSINT data collection</p>
            </div>
            <button onClick={() => setActivePage("osint")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
              <Plus size={14} />
              New Investigation
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-slate-50 rounded-lg w-fit mb-4">
            {searchTabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSearchTab(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                  searchTab === id ? "bg-white text-slate-800 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Input */}
          {searchTab === "image" ? (
            <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl h-24 cursor-pointer hover:border-blue-300 hover:bg-blue-50/50 transition-all group">
              <div className="text-center">
                <Upload size={20} className="text-slate-300 group-hover:text-blue-400 mx-auto mb-1 transition-colors" />
                <p className="text-slate-400 text-xs group-hover:text-blue-500">Drop profile image or click to upload</p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder={`Search by ${searchTabs.find((t) => t.id === searchTab)?.label.toLowerCase()}…`}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all"
                />
              </div>
              <button onClick={() => setActivePage("osint")}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                <Zap size={14} />
                Investigate
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, delta, icon: Icon, color }) => {
          const c = colorMap[color];
          return (
            <div key={label} className="bg-white rounded-xl p-5 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-start justify-between mb-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center ring-1", c.bg, c.ring)}>
                  <Icon size={16} className={c.icon} />
                </div>
                <ArrowUpRight size={14} className="text-slate-300" />
              </div>
              <div className="text-2xl font-bold text-slate-800 mb-0.5"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
              <div className="text-slate-500 text-xs font-medium">{label}</div>
              <div className="text-slate-400 text-[11px] mt-1">{delta}</div>
            </div>
          );
        })}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent investigations table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
            <h3 className="text-slate-800 font-semibold text-sm">Recent Investigations</h3>
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <Filter size={13} />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 transition-colors">
                <RefreshCw size={13} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {["Case ID", "Target", "Type", "Platforms", "Risk", "Status", "Date", ""].map((h) => (
                    <th key={h} className="text-left px-5 py-2.5 text-slate-400 font-medium text-[11px] tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentInvestigations.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/60 transition-colors cursor-pointer group"
                    style={{ borderBottom: "1px solid #f8fafc" }}>
                    <td className="px-5 py-3">
                      <span className="text-blue-600 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{inv.id}</span>
                    </td>
                    <td className="px-5 py-3">
                      <span className="text-slate-700 font-medium">{inv.target}</span>
                    </td>
                    <td className="px-5 py-3 text-slate-400">{inv.type}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1">
                        {inv.platforms.slice(0, 2).map((p) => (
                          <span key={p} className="bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded text-[10px]">{p}</span>
                        ))}
                        {inv.platforms.length > 2 && <span className="text-slate-400 text-[10px]">+{inv.platforms.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3"><RiskBadge risk={inv.risk} /></td>
                    <td className="px-5 py-3"><StatusBadge status={inv.status} /></td>
                    <td className="px-5 py-3 text-slate-400">{inv.date}</td>
                    <td className="px-5 py-3">
                      <button className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-slate-100 transition-all">
                        <ChevronRight size={13} className="text-slate-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Threat overview pie */}
          <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-800 font-semibold text-sm mb-4">Threat Overview</h3>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={110} height={110}>
                <PieChart>
                  <Pie data={threatData} cx={50} cy={50} innerRadius={32} outerRadius={50} dataKey="value" stroke="none">
                    {threatData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`]} contentStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {threatData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-slate-600 text-xs flex-1 truncate">{d.name}</span>
                    <span className="text-slate-700 text-xs font-medium tabular-nums"
                      style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top platforms */}
          <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-800 font-semibold text-sm mb-4">Top Platforms</h3>
            <div className="space-y-2.5">
              {platformBarData.slice(0, 5).map((p) => (
                <div key={p.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-600">{p.name}</span>
                    <span className="text-slate-400 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.cases}</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full">
                    <div className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                      style={{ width: `${(p.cases / 89) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Activity chart */}
      <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-slate-800 font-semibold text-sm">Investigation Activity — Last 7 Days</h3>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 rounded inline-block" />Investigations</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-400 rounded inline-block" />Suspects</span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={activityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gInv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gSus" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e2e8f0" }} />
            <Area type="monotone" dataKey="investigations" stroke="#2563eb" strokeWidth={2} fill="url(#gInv)" dot={false} />
            <Area type="monotone" dataKey="suspects" stroke="#4f46e5" strokeWidth={2} fill="url(#gSus)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ─── PAGE 2: OSINT Collection ─────────────────────────────────────────────────

function OSINTPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const steps = ["Input", "Collection", "Correlation", "Analysis", "Report"];
  const currentStep = 1;

  const statusIcon = (s: string) => {
    if (s === "found") return <CheckCircle2 size={14} className="text-green-500" />;
    if (s === "collecting") return <Loader2 size={14} className="text-blue-500 animate-spin" />;
    if (s === "searching") return <Loader2 size={14} className="text-amber-500 animate-spin" />;
    return <Circle size={14} className="text-slate-300" />;
  };

  const statusLabel = (s: string) => {
    if (s === "found") return { text: "Data Found", cls: "bg-green-50 text-green-700 ring-1 ring-green-200" };
    if (s === "collecting") return { text: "Collecting…", cls: "bg-blue-50 text-blue-700 ring-1 ring-blue-200" };
    if (s === "searching") return { text: "Searching…", cls: "bg-amber-50 text-amber-700 ring-1 ring-amber-200" };
    return { text: "Pending", cls: "bg-slate-100 text-slate-500" };
  };

  const logColor = (l: string) => {
    if (l === "success") return "text-green-400";
    if (l === "warn") return "text-amber-400";
    return "text-slate-400";
  };

  const logDot = (l: string) => {
    if (l === "success") return "bg-green-500";
    if (l === "warn") return "bg-amber-500";
    return "bg-blue-500";
  };

  const totalFound = osintPlatforms.reduce((a, p) => a + p.count, 0);

  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Progress stepper */}
      <div className="bg-white rounded-xl px-6 py-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 text-xs">Case:</span>
            <span className="text-blue-600 font-medium text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>INV-2024-089</span>
            <span className="text-slate-300">·</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-green-600 text-xs font-medium">Live Collection</span>
          </div>
          <div className="flex items-center gap-1">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center">
                <div className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold",
                  i < currentStep ? "bg-blue-600 text-white" :
                    i === currentStep ? "bg-blue-100 text-blue-700 ring-2 ring-blue-400" :
                      "bg-slate-100 text-slate-400"
                )}>
                  {i < currentStep ? <Check size={10} /> : i + 1}
                </div>
                <span className={cn("hidden sm:block text-[10px] mx-1.5", i === currentStep ? "text-blue-600 font-medium" : "text-slate-400")}>{s}</span>
                {i < steps.length - 1 && <div className={cn("w-6 h-px", i < currentStep ? "bg-blue-300" : "bg-slate-200")} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Target Details</h3>
            </div>
            <div className="px-5 py-4 space-y-3">
              {[
                { label: "Username", val: "@darkweb_trader", icon: AtSign },
                { label: "Email", val: "—", icon: Mail },
                { label: "Phone", val: "—", icon: Phone },
                { label: "Profile URL", val: "x.com/darkweb_trader", icon: LinkIcon },
              ].map(({ label, val, icon: Icon }) => (
                <div key={label}>
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">{label}</label>
                  <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg" style={{ border: "1px solid #e2e8f0" }}>
                    <Icon size={12} className="text-slate-400" />
                    <span className="text-slate-600 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{val}</span>
                  </div>
                </div>
              ))}
              <div>
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block mb-1">Profile Image</label>
                <div className="flex items-center justify-center border-2 border-dashed border-slate-200 rounded-lg h-16 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition-all group">
                  <div className="flex items-center gap-2 text-slate-300 group-hover:text-blue-400">
                    <Upload size={14} />
                    <span className="text-xs">Upload for face match</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metadata panel */}
          <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-800 font-semibold text-sm mb-3">Extracted Metadata</h3>
            <div className="space-y-2">
              {[
                { k: "Timezone", v: "UTC+8 (Asia/Shanghai)" },
                { k: "Language", v: "English (US)" },
                { k: "Device", v: "Android 14 · Chrome 120" },
                { k: "IP Range", v: "Redacted (VPN detected)" },
                { k: "First Seen", v: "Nov 12, 2024" },
                { k: "Last Active", v: "Dec 05, 2024 · 02:41" },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between items-start gap-2">
                  <span className="text-slate-400 text-[11px] flex-shrink-0">{k}</span>
                  <span className="text-slate-600 text-[11px] text-right" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform grid + log */}
        <div className="lg:col-span-2 space-y-4">
          {/* Collection summary */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Profiles Found", value: totalFound, color: "text-green-600", bg: "bg-green-50" },
              { label: "Platforms Active", value: "7 / 8", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Collection", value: "74%", color: "text-indigo-600", bg: "bg-indigo-50" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={cn("rounded-xl px-4 py-3 shadow-sm", bg)} style={{ border: "1px solid #e2e8f0" }}>
                <div className={cn("text-lg font-bold tabular-nums", color)} style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
                <div className="text-slate-500 text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          {/* Platform cards */}
          <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Platform Collection Status</h3>
              <div className="flex items-center gap-1.5 text-xs text-blue-600">
                <Loader2 size={12} className="animate-spin" />
                <span>Scanning…</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 p-4">
              {osintPlatforms.map((p) => {
                const sl = statusLabel(p.status);
                return (
                  <div key={p.id} className="rounded-xl p-3.5 hover:shadow-md transition-all cursor-pointer group"
                    style={{ border: "1px solid #e2e8f0", backgroundColor: p.status === "found" ? "#f8fff8" : "#fafafa" }}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <PlatformPill abbr={p.abbr} color={p.color} />
                        <span className="text-slate-700 text-xs font-semibold">{p.name}</span>
                      </div>
                      {statusIcon(p.status)}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={cn("text-[10px] font-medium px-2 py-0.5 rounded-full", sl.cls)}>{sl.text}</span>
                      {p.count > 0 && (
                        <span className="text-[11px] font-bold text-slate-600 tabular-nums"
                          style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.count} acct{p.count > 1 ? "s" : ""}</span>
                      )}
                    </div>
                    {p.details.length > 0 && (
                      <div className="mt-2 space-y-0.5">
                        {p.details.map((d) => (
                          <div key={d} className="text-[10px] text-slate-400 truncate"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>{d}</div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live activity log */}
          <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Live Activity Log</h3>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2 max-h-48 overflow-y-auto">
              {activityLog.map((entry, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[10px] tabular-nums text-slate-400 pt-0.5 flex-shrink-0 w-16"
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}>{entry.time}</span>
                  <span className={cn("w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0", logDot(entry.level))} />
                  <span className={cn("text-[11px] leading-relaxed", logColor(entry.level))}>{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={() => setActivePage("ai-analysis")}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
            <Brain size={15} />
            Proceed to AI Analysis
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE 3: AI Analysis ──────────────────────────────────────────────────────

function AIAnalysisPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const [activeCategory, setActiveCategory] = useState("username");
  const circumference = 2 * Math.PI * 40;
  const fingerScore = 87;
  const scoreOffset = circumference - (fingerScore / 100) * circumference;

  const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
    Hash, FileText, Activity, Database, Scan, Network,
  };

  const riskColor: Record<Risk, string> = {
    critical: "#ef4444", high: "#f97316", medium: "#eab308", low: "#22c55e",
  };

  const overallRisk = 91;
  const confidenceScore = 88;

  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Top row: fingerprint score + overall metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Fingerprint score card */}
        <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-5 flex flex-col items-center" style={{ border: "1px solid #e2e8f0" }}>
          <div className="text-slate-800 font-semibold text-sm mb-3 text-center">Digital Identity<br />Fingerprint Score</div>
          <div className="relative w-32 h-32 mb-3">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="url(#scoreGrad)" strokeWidth="8"
                strokeDasharray={circumference} strokeDashoffset={scoreOffset} strokeLinecap="round" />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{fingerScore}</span>
              <span className="text-xs text-slate-400">/100</span>
            </div>
          </div>
          <div className="w-full">
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-slate-400">Confidence</span>
              <span className="font-medium text-blue-600">{confidenceScore}%</span>
            </div>
            <ScoreBar score={confidenceScore} color="#2563eb" />
            <div className="flex justify-between text-[11px] mb-1 mt-2">
              <span className="text-slate-400">Risk Level</span>
              <span className="font-medium text-red-600">{overallRisk}%</span>
            </div>
            <ScoreBar score={overallRisk} color="#ef4444" />
          </div>
          <div className="mt-3 w-full">
            <div className="rounded-lg px-3 py-2 bg-red-50 text-center" style={{ border: "1px solid #fecaca" }}>
              <div className="text-red-700 text-xs font-semibold">CRITICAL THREAT</div>
              <div className="text-red-500 text-[10px] mt-0.5">9 linked accounts confirmed</div>
            </div>
          </div>
        </div>

        {/* Overview metrics */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[
            { label: "Linked Accounts", value: "9", sub: "Across 6 platforms", icon: Users, color: "#2563eb" },
            { label: "Match Confidence", value: "88%", sub: "AI engine score", icon: Target, color: "#4f46e5" },
            { label: "Risk Score", value: "91/100", sub: "Requires escalation", icon: AlertTriangle, color: "#ef4444" },
            { label: "Behavior Clusters", value: "4", sub: "Unique patterns found", icon: Activity, color: "#0891b2" },
            { label: "Metadata Hits", value: "37", sub: "Cross-platform signals", icon: Database, color: "#7c3aed" },
            { label: "Face Matches", value: "1", sub: "67% confidence", icon: Scan, color: "#0f766e" },
          ].map(({ label, value, sub, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-xl p-4 shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}>
                  <Icon size={14} style={{ color }} />
                </div>
              </div>
              <div className="text-xl font-bold text-slate-800 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
              <div className="text-slate-600 text-xs font-medium mt-0.5">{label}</div>
              <div className="text-slate-400 text-[10px] mt-0.5">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Analysis categories */}
      <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
          <h3 className="text-slate-800 font-semibold text-sm">Correlation Analysis</h3>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Zap size={12} className="text-indigo-500" />
            <span>AI engine · Model v4.2</span>
          </div>
        </div>

        <div className="flex">
          {/* Category tabs */}
          <div className="w-52 flex-shrink-0 p-2 space-y-0.5" style={{ borderRight: "1px solid #f1f5f9" }}>
            {analysisCategories.map((cat) => {
              const Icon = iconMap[cat.icon] ?? Hash;
              const isActive = activeCategory === cat.id;
              const scoreColor = cat.score >= 90 ? "#ef4444" : cat.score >= 75 ? "#f97316" : cat.score >= 60 ? "#eab308" : "#22c55e";
              return (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left transition-all",
                    isActive ? "bg-blue-50" : "hover:bg-slate-50"
                  )}>
                  <Icon size={13} className={isActive ? "text-blue-600" : "text-slate-400"} />
                  <div className="flex-1 min-w-0">
                    <div className={cn("text-xs font-medium truncate", isActive ? "text-blue-700" : "text-slate-600")}>{cat.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{cat.score}%</div>
                  </div>
                  <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: isActive ? "#2563eb" : "transparent" }} />
                </button>
              );
            })}
          </div>

          {/* Analysis detail */}
          {(() => {
            const cat = analysisCategories.find((c) => c.id === activeCategory)!;
            const Icon = iconMap[cat.icon] ?? Hash;
            const scoreColor = cat.score >= 90 ? "#ef4444" : cat.score >= 75 ? "#f97316" : "#eab308";
            return (
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
                      <Icon size={18} className="text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-slate-800 font-semibold text-sm">{cat.title}</h4>
                      <div className="text-slate-400 text-xs mt-0.5">Confidence: <span className="font-medium text-slate-600">{cat.confidence}</span></div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold tabular-nums" style={{ color: scoreColor, fontFamily: "'JetBrains Mono', monospace" }}>{cat.score}%</div>
                    <div className="text-slate-400 text-[11px]">Match Score</div>
                  </div>
                </div>

                <div className="mb-5">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Overall similarity score</span>
                    <span className="font-medium text-slate-700">{cat.score}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${cat.score}%`, background: `linear-gradient(90deg, #2563eb, #4f46e5)` }} />
                  </div>
                </div>

                <div>
                  <h5 className="text-slate-600 text-xs font-semibold uppercase tracking-wide mb-3">Matched Accounts</h5>
                  <div className="space-y-2">
                    {cat.matches.map((m, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                        style={{ border: "1px solid #f1f5f9" }}>
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: riskColor[m.risk] }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-700 text-xs font-medium truncate"
                            style={{ fontFamily: "'JetBrains Mono', monospace" }}>{m.account}</div>
                          <div className="text-slate-400 text-[10px]">{m.platform}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <ScoreBar score={m.score} color={riskColor[m.risk]} />
                          <RiskBadge risk={m.risk} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <button onClick={() => setActivePage("graph")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
        <Network size={15} />
        View Relationship Graph
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── PAGE 4: Relationship Graph & Timeline ────────────────────────────────────

function GraphPage({ setActivePage }: { setActivePage: (p: Page) => void }) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"graph" | "timeline">("graph");

  const edgeColor = (strength: number) => {
    if (strength >= 80) return "#ef4444";
    if (strength >= 65) return "#f97316";
    return "#eab308";
  };

  const hNode = hoveredNode ? graphNodes.find((n) => n.id === hoveredNode) : null;

  const timelineIcon = (type: string) => {
    const map: Record<string, React.FC<{ size?: number; className?: string }>> = {
      account: AtSign, correlation: Network, financial: AlertTriangle,
      discovery: Target, investigation: FileText,
    };
    return map[type] ?? Circle;
  };

  const timelineColor: Record<string, string> = {
    account: "#2563eb", correlation: "#4f46e5", financial: "#ef4444",
    discovery: "#f97316", investigation: "#0891b2",
  };

  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-white rounded-xl w-fit shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        {(["graph", "timeline"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize",
              activeTab === tab ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}>
            {tab === "graph" ? "🕸 Relationship Graph" : "📅 Timeline"}
          </button>
        ))}
      </div>

      {activeTab === "graph" && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          {/* Graph */}
          <div className="lg:col-span-3 bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <div>
                <h3 className="text-slate-800 font-semibold text-sm">Suspect Identity Network</h3>
                <p className="text-slate-400 text-xs mt-0.5">9 nodes · 11 edges · Target: @darkweb_trader</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3 text-[10px] text-slate-400">
                  {(["critical", "high", "medium"] as Risk[]).map((r) => (
                    <div key={r} className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: riskFill[r].stroke }} />
                      <span className="capitalize">{r}</span>
                    </div>
                  ))}
                </div>
                <button className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400">
                  <RefreshCw size={13} />
                </button>
              </div>
            </div>

            <div className="relative" style={{ backgroundColor: "#fafbfd" }}>
              <svg viewBox="0 0 760 490" className="w-full" style={{ minHeight: 380 }}>
                <defs>
                  <filter id="nodeShadow">
                    <feDropShadow dx="0" dy="2" stdDeviation="4" floodOpacity="0.12" />
                  </filter>
                  <filter id="glowFilter">
                    <feGaussianBlur stdDeviation="4" result="blur" />
                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <marker id="arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L6,3 z" fill="#cbd5e1" />
                  </marker>
                </defs>

                {/* Grid */}
                {Array.from({ length: 10 }).map((_, i) => (
                  <line key={`h${i}`} x1="0" y1={i * 50} x2="760" y2={i * 50} stroke="#f1f5f9" strokeWidth="1" />
                ))}
                {Array.from({ length: 16 }).map((_, i) => (
                  <line key={`v${i}`} x1={i * 50} y1="0" x2={i * 50} y2="490" stroke="#f1f5f9" strokeWidth="1" />
                ))}

                {/* Edges */}
                {graphEdges.map((edge, i) => {
                  const from = nodeById(edge.from);
                  const to = nodeById(edge.to);
                  const isHovered = hoveredNode === edge.from || hoveredNode === edge.to;
                  const color = edgeColor(edge.strength);
                  const midX = (from.x + to.x) / 2;
                  const midY = (from.y + to.y) / 2 - 20;
                  return (
                    <g key={i}>
                      <path
                        d={`M${from.x},${from.y} Q${midX},${midY} ${to.x},${to.y}`}
                        fill="none"
                        stroke={color}
                        strokeWidth={isHovered ? 2.5 : 1.5}
                        strokeOpacity={isHovered ? 0.9 : 0.35}
                        strokeDasharray={edge.from !== "center" ? "5,4" : undefined}
                      />
                      <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 5}
                        textAnchor="middle" fill={color} fontSize="9"
                        fontFamily="'JetBrains Mono', monospace" opacity={isHovered ? 0.9 : 0.5}>
                        {edge.strength}%
                      </text>
                    </g>
                  );
                })}

                {/* Nodes */}
                {graphNodes.map((node) => {
                  const style = riskFill[node.risk];
                  const isHov = hoveredNode === node.id;
                  const isCenter = node.id === "center";
                  return (
                    <g key={node.id} style={{ cursor: "pointer" }}
                      onMouseEnter={() => setHoveredNode(node.id)}
                      onMouseLeave={() => setHoveredNode(null)}>
                      {isHov && (
                        <circle cx={node.x} cy={node.y} r={node.size + 10}
                          fill={style.glow} />
                      )}
                      <circle cx={node.x} cy={node.y} r={node.size}
                        fill={isCenter ? "#fef2f2" : style.fill}
                        stroke={style.stroke}
                        strokeWidth={isCenter ? 3 : isHov ? 2.5 : 2}
                        filter="url(#nodeShadow)" />
                      {isCenter && (
                        <circle cx={node.x} cy={node.y} r={node.size - 6}
                          fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity={0.5} />
                      )}
                      <text x={node.x} y={node.y - 3} textAnchor="middle"
                        fill={style.stroke} fontSize={isCenter ? "11" : "9"}
                        fontWeight="700" fontFamily="'JetBrains Mono', monospace">
                        {node.abbr}
                      </text>
                      <text x={node.x} y={node.y + 9} textAnchor="middle"
                        fill="#64748b" fontSize="7.5" fontFamily="'JetBrains Mono', monospace">
                        {node.matchPct}%
                      </text>
                      <text x={node.x} y={node.y + node.size + 14} textAnchor="middle"
                        fill="#475569" fontSize="9" fontFamily="'Inter', sans-serif">
                        {node.label.length > 14 ? node.label.slice(0, 13) + "…" : node.label}
                      </text>
                      <text x={node.x} y={node.y + node.size + 24} textAnchor="middle"
                        fill="#94a3b8" fontSize="8" fontFamily="'Inter', sans-serif">
                        {node.platform}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Node detail panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0", minHeight: 200 }}>
              {hNode ? (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: riskFill[hNode.risk].stroke }} />
                    <h3 className="text-slate-800 font-semibold text-sm">Node Details</h3>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="text-[11px] text-slate-400 mb-0.5">Account</div>
                      <div className="text-sm font-medium text-slate-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{hNode.label}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 mb-0.5">Platform</div>
                      <div className="text-sm text-slate-600">{hNode.platform}</div>
                    </div>
                    <div>
                      <div className="text-[11px] text-slate-400 mb-1">Match Score</div>
                      <ScoreBar score={hNode.matchPct} color={riskFill[hNode.risk].stroke} />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-[11px] text-slate-400">Risk Level</div>
                      <RiskBadge risk={hNode.risk} />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <Network size={24} className="text-slate-200 mb-2" />
                  <p className="text-slate-400 text-xs">Hover a node to see details</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
              <h3 className="text-slate-700 font-semibold text-xs uppercase tracking-wide mb-3">Risk Legend</h3>
              {(["critical", "high", "medium", "low"] as Risk[]).map((r) => (
                <div key={r} className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full border-2" style={{ borderColor: riskFill[r].stroke, backgroundColor: riskFill[r].fill }} />
                  <span className="text-slate-600 text-xs capitalize">{r}</span>
                </div>
              ))}
              <div className="mt-3 pt-3" style={{ borderTop: "1px solid #f1f5f9" }}>
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-0 border-t-2 border-slate-400" />
                  <span className="text-slate-400 text-[11px]">Direct link</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-0 border-t-2 border-dashed border-slate-300" />
                  <span className="text-slate-400 text-[11px]">Indirect link</span>
                </div>
              </div>
            </div>

            {/* Network stats */}
            <div className="bg-white rounded-xl shadow-sm p-4" style={{ border: "1px solid #e2e8f0" }}>
              <h3 className="text-slate-700 font-semibold text-xs uppercase tracking-wide mb-3">Network Stats</h3>
              {[
                { k: "Cluster Density", v: "High" },
                { k: "Avg Match Score", v: "74.3%" },
                { k: "Critical Nodes", v: "3" },
                { k: "Isolated Accounts", v: "0" },
              ].map(({ k, v }) => (
                <div key={k} className="flex justify-between items-center mb-2">
                  <span className="text-slate-400 text-xs">{k}</span>
                  <span className="text-slate-700 text-xs font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "timeline" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Investigation Timeline</h3>
              <p className="text-slate-400 text-xs mt-0.5">Chronological reconstruction of suspect activity</p>
            </div>
            <div className="px-6 py-5">
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-[18px] top-4 bottom-4 w-px bg-slate-200" />
                <div className="space-y-6">
                  {timelineEvents.map((ev, i) => {
                    const Icon = timelineIcon(ev.type);
                    const color = timelineColor[ev.type];
                    return (
                      <div key={i} className="flex gap-4 relative">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center z-10 flex-shrink-0 shadow-sm"
                          style={{ backgroundColor: `${color}18`, border: `2px solid ${color}40` }}>
                          <Icon size={14} style={{ color }} />
                        </div>
                        <div className="flex-1 pb-2">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-slate-700 text-sm leading-relaxed">{ev.event}</p>
                            <RiskBadge risk={ev.risk} />
                          </div>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Calendar size={11} className="text-slate-400" />
                            <span className="text-slate-400 text-[11px]">{ev.date} · {ev.time}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
              <h3 className="text-slate-800 font-semibold text-sm mb-4">Activity Heatmap</h3>
              <div className="grid grid-cols-7 gap-1 mb-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="text-center text-[10px] text-slate-400">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 28 }).map((_, i) => {
                  const intensity = [0, 1, 2, 3, 2, 1, 0, 1, 3, 2, 1, 0, 2, 1, 3, 3, 2, 1, 2, 3, 1, 0, 1, 2, 3, 2, 1, 0][i];
                  const colors = ["bg-slate-100", "bg-blue-100", "bg-blue-300", "bg-blue-500"];
                  return <div key={i} className={cn("w-full aspect-square rounded-sm", colors[intensity])} />;
                })}
              </div>
              <div className="flex items-center justify-between mt-2 text-[10px] text-slate-400">
                <span>Less activity</span>
                <div className="flex gap-1">
                  {["bg-slate-100", "bg-blue-100", "bg-blue-300", "bg-blue-500"].map((c, i) => (
                    <div key={i} className={cn("w-3 h-3 rounded-sm", c)} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
              <h3 className="text-slate-800 font-semibold text-sm mb-3">Account Creation History</h3>
              {[
                { platform: "Twitter/X", account: "@darkweb_trader", date: "Nov 12, 2024", color: "#000" },
                { platform: "GitHub", account: "crypto_exchanger", date: "Nov 19, 2024", color: "#24292e" },
                { platform: "Reddit", account: "@shadow_mkt", date: "Nov 22, 2024", color: "#ff4500" },
                { platform: "Telegram", account: "@signal_private", date: "Nov 27, 2024", color: "#0088cc" },
                { platform: "Instagram", account: "@dark_user_x", date: "Dec 01, 2024", color: "#e1306c" },
              ].map((acc) => (
                <div key={acc.account} className="flex items-center gap-3 mb-3 last:mb-0">
                  <PlatformPill abbr={acc.platform.slice(0, 2).toUpperCase()} color={acc.color} />
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-700 text-xs font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{acc.account}</div>
                    <div className="text-slate-400 text-[10px]">{acc.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <button onClick={() => setActivePage("report")}
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors">
        <FileText size={15} />
        Generate Forensic Report
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── PAGE 5: Forensic Report ──────────────────────────────────────────────────

function ReportPage() {
  const [downloaded, setDownloaded] = useState(false);

  const circumference = 2 * Math.PI * 36;
  const riskScore = 91;
  const riskOffset = circumference - (riskScore / 100) * circumference;

  const evidenceItems = [
    { id: "EV-001", type: "Account Profile", description: "@binance_whale99 — Twitter/X account, 91% metadata match", platform: "Twitter/X", risk: "critical" as Risk, date: "Dec 01, 2024" },
    { id: "EV-002", type: "Repository", description: "crypto_exchanger — GitHub repo, identical commit email hash", platform: "GitHub", risk: "critical" as Risk, date: "Nov 19, 2024" },
    { id: "EV-003", type: "Messaging", description: "@signal_private — Telegram, 83% writing-style similarity", platform: "Telegram", risk: "critical" as Risk, date: "Nov 27, 2024" },
    { id: "EV-004", type: "Forum Post", description: "darkweb_forum — 4 posts linked by fingerprint", platform: "Dark Forums", risk: "high" as Risk, date: "Nov 28, 2024" },
    { id: "EV-005", type: "Social Profile", description: "@dark_user_x — Instagram, face recognition 67% match", platform: "Instagram", risk: "high" as Risk, date: "Dec 01, 2024" },
    { id: "EV-006", type: "Financial", description: "BTC transaction trace — $12,400 linked to wallet cluster", platform: "On-Chain", risk: "critical" as Risk, date: "Nov 24, 2024" },
  ];

  return (
    <div className="p-6 space-y-5 min-h-full">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield size={16} className="text-blue-600" />
                <span className="text-blue-600 text-xs font-semibold uppercase tracking-wider">Forensic Investigation Report</span>
              </div>
              <h2 className="text-slate-800 font-bold text-xl mb-1">Case INV-2024-089</h2>
              <p className="text-slate-500 text-sm">Target: <span className="font-medium text-slate-700" style={{ fontFamily: "'JetBrains Mono', monospace" }}>@darkweb_trader</span> · Opened Dec 05, 2024 · Analyst: Sarah Chen</p>
            </div>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <button
                onClick={() => { setDownloaded(true); setTimeout(() => setDownloaded(false), 2500); }}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                  downloaded ? "bg-green-600 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"
                )}>
                {downloaded ? <CheckCircle2 size={14} /> : <Download size={14} />}
                {downloaded ? "Downloaded!" : "Download PDF"}
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Share2 size={14} />
                Share Report
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex flex-wrap items-center gap-2 mt-4 pt-4" style={{ borderTop: "1px solid #f1f5f9" }}>
            <span className="flex items-center gap-1.5 text-xs bg-red-50 text-red-700 px-3 py-1.5 rounded-full ring-1 ring-red-200">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Threat Level: CRITICAL
            </span>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">9 Linked Accounts</span>
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full">6 Platforms Identified</span>
            <span className="text-xs bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full ring-1 ring-indigo-200">88% Confidence</span>
            <span className="text-xs bg-slate-100 text-slate-500 px-3 py-1.5 rounded-full">Generated Dec 05, 2024 · 16:47 UTC</span>
          </div>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
        {[
          { label: "Connected Accounts", value: "9", icon: Users, color: "#2563eb" },
          { label: "Platforms Found", value: "6", icon: Globe, color: "#4f46e5" },
          { label: "Confidence Score", value: "88%", icon: Target, color: "#0891b2" },
          { label: "Risk Score", value: "91/100", icon: AlertTriangle, color: "#ef4444" },
          { label: "Evidence Items", value: "6", icon: FileText, color: "#7c3aed" },
          { label: "Days Active", value: "23", icon: Calendar, color: "#f97316" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl p-4 shadow-sm text-center" style={{ border: "1px solid #e2e8f0" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2"
              style={{ backgroundColor: `${color}15` }}>
              <Icon size={15} style={{ color }} />
            </div>
            <div className="text-lg font-bold text-slate-800 tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
            <div className="text-slate-500 text-[10px] mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Main report content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Executive findings */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Executive Findings</h3>
            </div>
            <div className="px-6 py-5 space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Digital OSINT investigation <span className="font-medium text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>INV-2024-089</span> was initiated on December 5, 2024 following a referral for suspected cybercrime activity linked to the Twitter/X account <span className="font-medium text-slate-800">@darkweb_trader</span>. The AI-powered identity correlation engine identified a high-confidence cluster of <span className="font-semibold text-red-600">9 linked accounts</span> across 6 digital platforms.
              </p>
              <p>
                Metadata analysis yielded a <span className="font-semibold text-blue-700">93% device fingerprint match</span> across GitHub, Instagram, and Telegram accounts, establishing that a single operator is responsible for the activity cluster. Behavioral pattern analysis confirmed consistent UTC+8 timezone activity and writing-style similarity across all platforms.
              </p>
              <p>
                A cryptocurrency transaction trace identified on November 24, 2024 linked the suspect to an on-chain wallet cluster with a cumulative value of approximately <span className="font-semibold text-red-600">$12,400 USD in BTC</span>, consistent with dark-market trading activity.
              </p>
              <div className="rounded-xl p-4" style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca" }}>
                <div className="flex items-start gap-3">
                  <AlertTriangle size={15} className="text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-red-700 font-semibold text-sm mb-1">Analyst Recommendation</div>
                    <p className="text-red-600 text-xs leading-relaxed">
                      Confidence level and risk score warrant immediate escalation to law enforcement. Recommend account preservation requests to Twitter/X, GitHub, Telegram, and Instagram be issued within 24 hours to prevent evidence destruction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence table */}
          <div className="bg-white rounded-xl shadow-sm" style={{ border: "1px solid #e2e8f0" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
              <h3 className="text-slate-800 font-semibold text-sm">Evidence Registry</h3>
              <span className="text-xs text-slate-400">{evidenceItems.length} items collected</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: "1px solid #f1f5f9" }}>
                    {["Evidence ID", "Type", "Description", "Platform", "Risk", "Date"].map((h) => (
                      <th key={h} className="text-left px-5 py-2.5 text-slate-400 font-medium text-[11px] tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {evidenceItems.map((ev) => (
                    <tr key={ev.id} className="hover:bg-slate-50/60 transition-colors" style={{ borderBottom: "1px solid #f8fafc" }}>
                      <td className="px-5 py-3">
                        <span className="text-blue-600 font-medium" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{ev.id}</span>
                      </td>
                      <td className="px-5 py-3">
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px]">{ev.type}</span>
                      </td>
                      <td className="px-5 py-3 text-slate-600 max-w-[220px] truncate">{ev.description}</td>
                      <td className="px-5 py-3 text-slate-400">{ev.platform}</td>
                      <td className="px-5 py-3"><RiskBadge risk={ev.risk} /></td>
                      <td className="px-5 py-3 text-slate-400">{ev.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          {/* Risk gauge */}
          <div className="bg-white rounded-xl shadow-sm p-5 text-center" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-700 font-semibold text-sm mb-4">Threat Assessment</h3>
            <div className="relative w-28 h-28 mx-auto mb-3">
              <svg viewBox="0 0 80 80" className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" fill="none" stroke="#f1f5f9" strokeWidth="7" />
                <circle cx="40" cy="40" r="36" fill="none"
                  stroke="url(#riskGrad)" strokeWidth="7"
                  strokeDasharray={circumference}
                  strokeDashoffset={riskOffset}
                  strokeLinecap="round" />
                <defs>
                  <linearGradient id="riskGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#dc2626" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-slate-800" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{riskScore}</span>
                <span className="text-[10px] text-slate-400">/100</span>
              </div>
            </div>
            <div className="bg-red-50 rounded-xl px-3 py-2" style={{ border: "1px solid #fecaca" }}>
              <div className="text-red-700 font-bold text-sm">CRITICAL</div>
              <div className="text-red-400 text-[10px] mt-0.5">Immediate action required</div>
            </div>
          </div>

          {/* Mini graph */}
          <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-700 font-semibold text-sm mb-3">Network Preview</h3>
            <svg viewBox="0 0 200 160" className="w-full rounded-lg" style={{ backgroundColor: "#fafbfd" }}>
              {graphEdges.slice(0, 8).map((edge, i) => {
                const from = nodeById(edge.from);
                const to = nodeById(edge.to);
                const scale = 0.26;
                const ox = 10; const oy = 10;
                const color = edgeColor(edge.strength);
                return (
                  <line key={i}
                    x1={from.x * scale + ox} y1={from.y * scale + oy}
                    x2={to.x * scale + ox} y2={to.y * scale + oy}
                    stroke={color} strokeWidth="1" strokeOpacity="0.4" />
                );
              })}
              {graphNodes.map((node) => {
                const scale = 0.26;
                const ox = 10; const oy = 10;
                const style = riskFill[node.risk];
                return (
                  <circle key={node.id}
                    cx={node.x * scale + ox} cy={node.y * scale + oy}
                    r={node.id === "center" ? 9 : 6}
                    fill={style.fill} stroke={style.stroke} strokeWidth="1.5" />
                );
              })}
            </svg>
          </div>

          {/* Platform summary */}
          <div className="bg-white rounded-xl shadow-sm p-5" style={{ border: "1px solid #e2e8f0" }}>
            <h3 className="text-slate-700 font-semibold text-sm mb-3">Platforms Identified</h3>
            <div className="space-y-2">
              {[
                { name: "Twitter/X", count: 1, color: "#000" },
                { name: "GitHub", count: 2, color: "#24292e" },
                { name: "Telegram", count: 2, color: "#0088cc" },
                { name: "Instagram", count: 3, color: "#e1306c" },
                { name: "Reddit", count: 1, color: "#ff4500" },
                { name: "Dark Forums", count: 4, color: "#7c3aed" },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2">
                  <PlatformPill abbr={p.name.slice(0, 2).toUpperCase()} color={p.color} />
                  <span className="text-slate-600 text-xs flex-1">{p.name}</span>
                  <span className="text-slate-400 text-xs tabular-nums" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{p.count} acct{p.count > 1 ? "s" : ""}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conclusion */}
          <div className="rounded-xl p-4" style={{ border: "1px solid #bfdbfe", backgroundColor: "#eff6ff" }}>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={14} className="text-blue-600" />
              <span className="text-blue-700 font-semibold text-xs">Investigation Conclusion</span>
            </div>
            <p className="text-blue-600 text-[11px] leading-relaxed">
              Single operator confirmed across 9 accounts with 88% confidence. Metadata, behavioral, and financial evidence are sufficient for a preservation request and formal referral.
            </p>
            <div className="mt-2 text-blue-400 text-[10px]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              Signed: Sarah Chen · Dec 05, 2024
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const pageComponents: Record<Page, React.ReactNode> = {
    dashboard: <DashboardPage setActivePage={setActivePage} />,
    osint: <OSINTPage setActivePage={setActivePage} />,
    "ai-analysis": <AIAnalysisPage setActivePage={setActivePage} />,
    graph: <GraphPage setActivePage={setActivePage} />,
    report: <ReportPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Sidebar activePage={activePage} setActivePage={setActivePage} />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopNav activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 overflow-y-auto bg-slate-50" style={{ scrollbarWidth: "thin", scrollbarColor: "#cbd5e1 transparent" }}>
          {pageComponents[activePage]}
        </main>
      </div>
    </div>
  );
}
