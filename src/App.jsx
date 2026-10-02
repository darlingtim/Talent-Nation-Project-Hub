import { useState, useMemo, useEffect } from "react";
import { supabase } from "./supabaseClient";
import {
  Search, Menu, X, ChevronRight, ChevronDown, Heart, Bookmark, Share2, Code2,
  Link2, Globe, Users, FolderKanban, Building2, Sparkles, Eye,
  LayoutDashboard, ShieldCheck, TrendingUp, CheckCircle2, XCircle, MapPin,
  Calendar, Quote, Mail, PlayCircle, FileText, ArrowLeft, Plus, Trash2, Pencil,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";

/* ---------------------------------- tokens --------------------------------- */

const C = {
  ink: "#12141F",
  inkSoft: "#1B1E2E",
  paper: "#F5F6FB",
  paperDeep: "#EAEDF6",
  gold: "#F2B705",
  goldDeep: "#B98A00",
  goldPale: "#FDF1CC",
  teal: "#0E7C7B",
  tealDeep: "#0A5F5E",
  tealPale: "#E0F1F0",
  slate: "#454A5C",
  slateLight: "#7A8094",
  line: "#E2E4EC",
  white: "#FFFFFF",
  danger: "#C24545",
  dangerPale: "#FBEAEA",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  .tn-display { font-family: 'Space Grotesk', sans-serif; }
  .tn-body { font-family: 'Inter', sans-serif; }
`;

/* ----------------------------------- data ----------------------------------- */

const CAMPUSES = [
  { id: "lagos", name: "Lagos Campus", city: "Lagos", country: "Nigeria", fellowCount: 312, desc: "Talent Nation's founding campus, anchored in Yaba's tech corridor — strongest in fintech and software engineering.", hue: C.gold },
  { id: "abuja", name: "Abuja Campus", city: "Abuja", country: "Nigeria", fellowCount: 198, desc: "A policy-adjacent campus with fellows building civic tech, govtech, and public-interest data tools.", hue: C.teal },
  { id: "enugu", name: "Enugu Campus", city: "Enugu", country: "Nigeria", fellowCount: 164, desc: "Known for agritech and hardware projects, drawing on the South East's manufacturing base.", hue: C.gold },
  { id: "kano", name: "Kano Campus", city: "Kano", country: "Nigeria", fellowCount: 141, desc: "A fast-growing campus with a strong cohort in health tech and logistics.", hue: C.teal },
  { id: "nairobi", name: "Nairobi Campus", city: "Nairobi", country: "Kenya", fellowCount: 187, desc: "Talent Nation's first campus outside Nigeria, focused on climate tech and mobile-first products.", hue: C.gold },
];

const CATEGORIES = [
  "Artificial Intelligence", "Software Development", "Cybersecurity", "Data Science",
  "Agriculture", "Health", "Education", "FinTech", "Business", "Creative Industry",
  "Climate and Sustainability", "Engineering", "Community Development", "Research", "Entrepreneurship",
];

const TECHNOLOGIES = [
  "React", "Node.js", "Python", "TensorFlow", "Flutter", "PostgreSQL", "Django",
  "Next.js", "Solidity", "Figma", "Arduino", "TypeScript", "AWS", "Firebase", "Vue.js", "R",
];

const STATUSES = ["Completed", "Ongoing", "Prototype", "Idea Stage"];

const FELLOWS = [
  { id: "amaka-obi", name: "Amaka Obi", title: "Frontend Engineer", campusId: "lagos", city: "Lagos", skills: ["React", "TypeScript", "Figma"], bio: "Builds accessible interfaces for financial products. Two years into a self-taught path that started with a bootcamp scholarship.", linkedin: "#", github: "#" },
  { id: "tunde-bakare", name: "Tunde Bakare", title: "Backend Engineer", campusId: "lagos", city: "Lagos", skills: ["Node.js", "PostgreSQL", "AWS"], bio: "Focused on payments infrastructure. Previously built internal tools for a Lagos logistics startup.", linkedin: "#", github: "#" },
  { id: "chiamaka-eze", name: "Chiamaka Eze", title: "ML Engineer", campusId: "lagos", city: "Lagos", skills: ["Python", "TensorFlow", "R"], bio: "Works on crop-disease detection models trained on locally collected image data.", linkedin: "#", github: "#" },
  { id: "ibrahim-yusuf", name: "Ibrahim Yusuf", title: "Product Designer", campusId: "abuja", city: "Abuja", skills: ["Figma", "React"], bio: "Designs civic-tech products, with a focus on low-literacy interface patterns.", linkedin: "#", github: "#" },
  { id: "grace-adeyemi", name: "Grace Adeyemi", title: "Full-Stack Developer", campusId: "abuja", city: "Abuja", skills: ["Django", "Vue.js", "PostgreSQL"], bio: "Building a citizen feedback platform for local government budgets.", linkedin: "#", github: "#" },
  { id: "musa-abdullahi", name: "Musa Abdullahi", title: "Data Analyst", campusId: "abuja", city: "Abuja", skills: ["Python", "R"], bio: "Analyzes public procurement data to flag anomalies for civic watchdog groups.", linkedin: "#", github: "#" },
  { id: "ngozi-eke", name: "Ngozi Eke", title: "Hardware Engineer", campusId: "enugu", city: "Enugu", skills: ["Arduino", "Python"], bio: "Prototypes low-cost soil sensors for smallholder farmers.", linkedin: "#", github: "#" },
  { id: "chidi-nwosu", name: "Chidi Nwosu", title: "Mobile Developer", campusId: "enugu", city: "Enugu", skills: ["Flutter", "Firebase"], bio: "Building offline-first apps for markets with unreliable connectivity.", linkedin: "#", github: "#" },
  { id: "adaeze-okoro", name: "Adaeze Okoro", title: "Agritech Founder", campusId: "enugu", city: "Enugu", skills: ["Python", "Arduino"], bio: "Runs a small team building irrigation scheduling tools for cassava farms.", linkedin: "#", github: "#" },
  { id: "fatima-sani", name: "Fatima Sani", title: "Health-Tech Developer", campusId: "kano", city: "Kano", skills: ["React", "Node.js"], bio: "Builds appointment and referral systems for primary health centres.", linkedin: "#", github: "#" },
  { id: "abubakar-lawal", name: "Abubakar Lawal", title: "Logistics Engineer", campusId: "kano", city: "Kano", skills: ["Python", "PostgreSQL"], bio: "Optimizes last-mile delivery routes for informal transport networks.", linkedin: "#", github: "#" },
  { id: "hauwa-bello", name: "Hauwa Bello", title: "UX Researcher", campusId: "kano", city: "Kano", skills: ["Figma"], bio: "Runs field research for products serving low-bandwidth users.", linkedin: "#", github: "#" },
  { id: "wanjiru-kamau", name: "Wanjiru Kamau", title: "Climate-Tech Engineer", campusId: "nairobi", city: "Nairobi", skills: ["Python", "TensorFlow"], bio: "Models deforestation risk using satellite imagery.", linkedin: "#", github: "#" },
  { id: "brian-otieno", name: "Brian Otieno", title: "Mobile Developer", campusId: "nairobi", city: "Nairobi", skills: ["Flutter", "Firebase"], bio: "Builds savings and micro-insurance apps for informal workers.", linkedin: "#", github: "#" },
  { id: "achieng-odhiambo", name: "Achieng Odhiambo", title: "Blockchain Developer", campusId: "nairobi", city: "Nairobi", skills: ["Solidity", "React"], bio: "Explores land-registry applications for smart contracts.", linkedin: "#", github: "#" },
  { id: "emeka-chukwu", name: "Emeka Chukwu", title: "Security Engineer", campusId: "lagos", city: "Lagos", skills: ["Python", "AWS"], bio: "Runs security audits for early-stage fintech products.", linkedin: "#", github: "#" },
];

const fellowName = (id) => FELLOWS.find((f) => f.id === id)?.name || id;

const PROJECTS = [
  { id: "farmsense", title: "FarmSense", campusId: "enugu", fellowIds: ["chiamaka-eze", "ngozi-eke"], category: "Agriculture", industry: "Agriculture", technologies: ["Python", "TensorFlow", "Arduino"], status: "Ongoing", year: 2025, teamType: "Team", featured: true, views: 4820, likes: 312, shortDesc: "A crop-disease detection app that reads leaf photos and flags early blight using a lightweight on-device model.", problem: "Smallholder farmers often lose entire seasons to diseases caught too late.", solution: "A phone-based classifier that works offline and shows treatment steps in three local languages.", objectives: "Cut disease-related crop loss by identifying infections within the first week of visible symptoms.", audience: "Smallholder cassava and maize farmers in the South East.", challenges: "Collecting a large, well-labelled image dataset from the field.", results: "Piloted with 240 farmers across two seasons; 71% reported catching infections earlier than before.", impact: "Early estimates suggest a 15-20% reduction in crop loss among pilot users.", future: "Add soil-moisture sensor integration and expand the language set.", github: "#", demo: "#" },
  { id: "civiceye", title: "CivicEye", campusId: "abuja", fellowIds: ["musa-abdullahi", "grace-adeyemi"], category: "Community Development", industry: "Government", technologies: ["Python", "Django", "PostgreSQL"], status: "Completed", year: 2024, teamType: "Team", featured: true, views: 6210, likes: 498, shortDesc: "A dashboard that cross-references local government budget line items with actual project completions.", problem: "Public budget data is published but rarely checked against what's actually built.", solution: "Automated matching of budget entries to geo-tagged project photos submitted by residents.", objectives: "Make budget follow-through visible to residents and journalists.", audience: "Civic journalists, resident associations, and local watchdog groups.", challenges: "Inconsistent formatting across different states' budget documents.", results: "Flagged 34 stalled projects across two states in its first six months.", impact: "Cited in two local news investigations into contract delays.", future: "Expand to five more states and add an SMS reporting channel.", github: "#", demo: "#" },
  { id: "payflow", title: "PayFlow", campusId: "lagos", fellowIds: ["tunde-bakare", "amaka-obi"], category: "FinTech", industry: "Financial Services", technologies: ["Node.js", "React", "PostgreSQL"], status: "Completed", year: 2024, teamType: "Team", featured: true, views: 8130, likes: 640, shortDesc: "A reconciliation layer for small merchants juggling multiple mobile payment providers.", problem: "Merchants accepting several payment apps struggle to reconcile daily takings.", solution: "A single dashboard pulling transaction data from four major providers into one ledger.", objectives: "Cut end-of-day reconciliation time from hours to minutes.", audience: "Independent retailers and market traders.", challenges: "Each provider's API returns data in a different shape and update frequency.", results: "Used daily by 90 merchants in a Lagos market pilot.", impact: "Average reconciliation time dropped from 45 to 6 minutes per merchant.", future: "Add automatic tax-ready exports.", github: "#", demo: "#" },
  { id: "clinicline", title: "ClinicLine", campusId: "kano", fellowIds: ["fatima-sani"], category: "Health", industry: "Healthcare", technologies: ["React", "Node.js"], status: "Ongoing", year: 2025, teamType: "Individual", featured: false, views: 2140, likes: 168, shortDesc: "A referral and appointment queue system for primary health centres with patchy internet.", problem: "Referrals between clinics are handled by phone calls and paper, causing delays.", solution: "A lightweight web app that syncs when connectivity returns and works offline in between.", objectives: "Reduce missed referrals between primary and secondary care.", audience: "Primary health centre staff and referral coordinators.", challenges: "Designing sync logic that handles conflicting offline edits.", results: "Live in two clinics with plans to expand to a third this quarter.", impact: "Early data shows a drop in duplicate referrals.", future: "Add SMS notifications for patients without smartphones.", github: "#", demo: "#" },
  { id: "routewise", title: "RouteWise", campusId: "kano", fellowIds: ["abubakar-lawal"], category: "Business", industry: "Logistics", technologies: ["Python", "PostgreSQL"], status: "Prototype", year: 2026, teamType: "Individual", featured: false, views: 980, likes: 74, shortDesc: "Route optimization for informal delivery riders using real traffic and load data.", problem: "Riders often plan routes manually, wasting fuel and time.", solution: "A suggested-route engine that factors in current traffic reports and delivery windows.", objectives: "Cut average delivery time per rider by 20%.", audience: "Independent delivery riders and small courier fleets.", challenges: "Getting reliable, low-cost traffic data for secondary roads.", results: "Early prototype tested with 12 riders over three weeks.", impact: "Too early for firm numbers; anecdotal time savings reported.", future: "Partner with a local courier cooperative for a larger pilot.", github: "#", demo: "#" },
  { id: "greenroot", title: "GreenRoot", campusId: "nairobi", fellowIds: ["wanjiru-kamau"], category: "Climate and Sustainability", industry: "Environment", technologies: ["Python", "TensorFlow"], status: "Ongoing", year: 2025, teamType: "Individual", featured: true, views: 3760, likes: 289, shortDesc: "Satellite-imagery model that flags high-risk deforestation zones for community forest monitors.", problem: "Community monitors cover large forest areas with limited resources.", solution: "A weekly risk map generated from satellite imagery, prioritizing patrol routes.", objectives: "Direct limited monitoring hours toward the highest-risk zones.", audience: "Community forest monitoring groups.", challenges: "Cloud cover reduces usable imagery in the rainy season.", results: "Piloted with one monitoring group across a 40km² reserve.", impact: "Monitors report covering the same ground with fewer patrol hours.", future: "Combine with acoustic sensors for chainsaw detection.", github: "#", demo: "#" },
  { id: "learnloop", title: "LearnLoop", campusId: "lagos", fellowIds: ["amaka-obi"], category: "Education", industry: "Education", technologies: ["React", "Firebase"], status: "Completed", year: 2024, teamType: "Individual", featured: false, views: 2980, likes: 201, shortDesc: "A spaced-repetition study tool built for WAEC and JAMB exam prep.", problem: "Exam-prep apps rarely adapt to what a specific student keeps getting wrong.", solution: "A quiz engine that resurfaces missed questions on an increasing interval.", objectives: "Improve retention of previously missed questions.", audience: "Secondary school students preparing for standardized exams.", challenges: "Sourcing a clean, well-tagged question bank.", results: "Used by around 1,200 students in its first term.", impact: "Self-reported quiz scores improved by an average of 18%.", future: "Add a teacher dashboard for classroom-wide tracking.", github: "#", demo: "#" },
  { id: "landchain", title: "LandChain", campusId: "nairobi", fellowIds: ["achieng-odhiambo"], category: "Business", industry: "Real Estate", technologies: ["Solidity", "React"], status: "Idea Stage", year: 2026, teamType: "Individual", featured: false, views: 640, likes: 45, shortDesc: "Exploring smart-contract-based land title records for peri-urban plots.", problem: "Informal land sales often lack a reliable, tamper-resistant record.", solution: "A permissioned ledger co-signed by community elders and a local registry office.", objectives: "Reduce disputes arising from duplicate or forged sale documents.", audience: "Peri-urban landholders and local registry offices.", challenges: "Getting institutional buy-in for a new record-keeping process.", results: "Still at the concept and stakeholder-interview stage.", impact: "Not yet measurable.", future: "Run a small pilot with one ward registry office.", github: "#", demo: "#" },
  { id: "shieldbox", title: "ShieldBox", campusId: "lagos", fellowIds: ["emeka-chukwu"], category: "Cybersecurity", industry: "Financial Services", technologies: ["Python", "AWS"], status: "Ongoing", year: 2025, teamType: "Individual", featured: false, views: 1870, likes: 132, shortDesc: "An automated security-audit checklist tool for early-stage fintech products.", problem: "Early-stage teams often ship without a basic security review.", solution: "A scriptable checklist that scans common misconfigurations before launch.", objectives: "Catch the most common early-stage security gaps before they ship.", audience: "Early-stage fintech engineering teams.", challenges: "Keeping the checklist current as cloud provider defaults change.", results: "Adopted internally by three fellow-led startups.", impact: "Caught two exposed storage buckets before public launch.", future: "Package as a CLI tool with CI integration.", github: "#", demo: "#" },
  { id: "marketmesh", title: "MarketMesh", campusId: "kano", fellowIds: ["hauwa-bello", "abubakar-lawal"], category: "Business", industry: "Retail", technologies: ["Figma", "React"], status: "Prototype", year: 2026, teamType: "Team", featured: false, views: 1120, likes: 88, shortDesc: "A shared inventory board for market traders selling overlapping goods.", problem: "Traders in the same market often don't know what neighbours have in stock.", solution: "A simple shared board updated by SMS or a lightweight app.", objectives: "Reduce duplicate restocking trips within the same market.", audience: "Market traders in shared stalls or sections.", challenges: "Getting traders to update stock consistently.", results: "Tested with eight stalls in a single market section.", impact: "Traders reported fewer wasted restocking trips.", future: "Add a simple matching feature for cross-stall orders.", github: "#", demo: "#" },
  { id: "soilsense", title: "SoilSense", campusId: "enugu", fellowIds: ["ngozi-eke", "adaeze-okoro"], category: "Agriculture", industry: "Agriculture", technologies: ["Arduino", "Python"], status: "Completed", year: 2024, teamType: "Team", featured: false, views: 2410, likes: 176, shortDesc: "Low-cost soil-moisture sensors that trigger irrigation alerts over SMS.", problem: "Manual soil checks are time-consuming and often skipped.", solution: "A $6 sensor kit paired with an SMS alert when moisture drops below threshold.", objectives: "Reduce both over- and under-watering on smallholder plots.", audience: "Smallholder cassava and vegetable farmers.", challenges: "Building a sensor housing that survives the rainy season.", results: "40 kits deployed across two farming cooperatives.", impact: "Farmers reported more consistent yields across the pilot season.", future: "Move to solar-powered units for remote plots.", github: "#", demo: "#" },
  { id: "budgetlens", title: "BudgetLens", campusId: "abuja", fellowIds: ["musa-abdullahi"], category: "Data Science", industry: "Government", technologies: ["Python", "R"], status: "Ongoing", year: 2025, teamType: "Individual", featured: false, views: 1560, likes: 97, shortDesc: "Statistical anomaly detection across three years of procurement records.", problem: "Procurement fraud patterns are hard to spot manually across large datasets.", solution: "A model flagging statistically unusual pricing or vendor concentration.", objectives: "Surface leads for civic investigators, not final conclusions.", audience: "Civic watchdog analysts.", challenges: "Avoiding false positives that discredit the tool.", results: "Flagged 19 contracts for closer review in an initial pass.", impact: "Two flagged contracts led to follow-up reporting.", future: "Add a public-facing summary view.", github: "#", demo: "#" },
  { id: "voicecare", title: "VoiceCare", campusId: "kano", fellowIds: ["fatima-sani", "hauwa-bello"], category: "Health", industry: "Healthcare", technologies: ["Python", "Flutter"], status: "Idea Stage", year: 2026, teamType: "Team", featured: false, views: 410, likes: 29, shortDesc: "A voice-first symptom triage assistant for patients with low literacy.", problem: "Text-based health apps exclude patients who can't read comfortably.", solution: "A voice interface in Hausa that routes patients to the right level of care.", objectives: "Improve appropriate triage for low-literacy patients.", audience: "Rural clinic patients with limited reading ability.", challenges: "Voice-recognition accuracy for regional dialects.", results: "Concept validated through 20 patient interviews.", impact: "Not yet measurable.", future: "Build a working voice-recognition prototype.", github: "#", demo: "#" },
  { id: "solarledger", title: "SolarLedger", campusId: "nairobi", fellowIds: ["brian-otieno"], category: "FinTech", industry: "Energy", technologies: ["Flutter", "Firebase"], status: "Ongoing", year: 2025, teamType: "Individual", featured: false, views: 2050, likes: 154, shortDesc: "A pay-as-you-go tracker for households paying off small solar kits in installments.", problem: "Households and vendors both lose track of partial solar-kit payments.", solution: "A shared ledger both sides can check, with reminders before due dates.", objectives: "Reduce missed payments and repossessions.", audience: "Rural households on solar-kit installment plans.", challenges: "Working reliably on very low-end Android devices.", results: "In use by 60 households across two vendor partners.", impact: "Vendor-reported missed-payment rate dropped noticeably.", future: "Add a lightweight credit-scoring feature for repeat customers.", github: "#", demo: "#" },
  { id: "designsprint", title: "DesignSprint Kit", campusId: "abuja", fellowIds: ["ibrahim-yusuf"], category: "Creative Industry", industry: "Design", technologies: ["Figma"], status: "Completed", year: 2024, teamType: "Individual", featured: false, views: 1340, likes: 112, shortDesc: "A Figma template library for running five-day design sprints with civic-tech teams.", problem: "Civic-tech teams often skip structured design sprints due to time pressure.", solution: "A ready-made set of templates that compress a sprint into two focused days.", objectives: "Lower the setup cost of running a proper design sprint.", audience: "Small civic-tech and public-interest product teams.", challenges: "Keeping templates simple enough for non-designers to use.", results: "Adopted by four Talent Nation project teams so far.", impact: "Teams reported faster alignment on early product decisions.", future: "Publish as an open Figma community file.", github: "#", demo: "#" },
  { id: "aidhub", title: "AidHub", campusId: "lagos", fellowIds: ["tunde-bakare", "emeka-chukwu"], category: "Community Development", industry: "Nonprofit", technologies: ["Node.js", "React", "PostgreSQL"], status: "Prototype", year: 2026, teamType: "Team", featured: false, views: 760, likes: 51, shortDesc: "A coordination tool so small relief organizations don't duplicate aid distribution to the same households.", problem: "Multiple small NGOs sometimes serve the same households while others get missed.", solution: "A shared, privacy-conscious registry of aid distribution events by ward.", objectives: "Reduce duplicate distribution and improve coverage gaps.", audience: "Small and mid-sized relief organizations.", challenges: "Getting competing organizations to share data at all.", results: "Two organizations piloting the registry in one ward.", impact: "Too early to measure at scale.", future: "Add a coverage-gap heatmap for coordinators.", github: "#", demo: "#" },
];

const projectsByFellow = (id) => PROJECTS.filter((p) => p.fellowIds.includes(id));
const projectsByCampus = (id) => PROJECTS.filter((p) => p.campusId === id);
const fellowsByCampus = (id) => FELLOWS.filter((f) => f.campusId === id);
const getCampus = (id) => CAMPUSES.find((c) => c.id === id);

const ANCHORS = [
  {
    id: "amara-nwachukwu", name: "Amara Nwachukwu", role: "Founder & CEO",
    tag: "Founder",
    photo: "AN",
    shortBio: "Started Talent Nation from a single WhatsApp group of 40 aspiring developers in 2021.",
    background: "Spent six years as a software engineer and engineering manager before leaving to build Talent Nation full-time. Studied Computer Engineering.",
    expertise: ["Community building", "Software engineering", "Talent development"],
    contribution: "Set the fellowship curriculum, opened the first three campuses, and built the partner-employer network Talent Nation now runs on.",
    vision: "\"I want a fellow's postcode to say nothing about how far their career can go. The Project Hub is where that gets proven, project by project.\"",
    linkedin: "#",
  },
  {
    id: "daniel-okafor", name: "Daniel Okafor", role: "Co-Founder & Head of Campuses",
    tag: "Co-Founder",
    photo: "DO",
    shortBio: "Opened and now oversees Talent Nation's five campuses, from curriculum delivery to campus-lead hiring.",
    background: "Previously ran regional operations for an education nonprofit across three states. Studied Education Policy.",
    expertise: ["Operations", "Campus growth", "Curriculum design"],
    contribution: "Built the campus-lead training program and the standards that keep quality consistent as Talent Nation expands.",
    vision: "\"Growth only matters if the fifth campus feels as good as the first. That's the job.\"",
    linkedin: "#",
  },
  {
    id: "zainab-mustapha", name: "Zainab Mustapha", role: "Co-Founder & Head of Partnerships",
    tag: "Co-Founder",
    photo: "ZM",
    shortBio: "Built Talent Nation's employer and funder network from a cold-email list to over 80 active partners.",
    background: "Spent five years in venture-backed startup operations before co-founding Talent Nation. Studied Business Administration.",
    expertise: ["Partnerships", "Fundraising", "Employer relations"],
    contribution: "Negotiated every major employer placement pipeline and most of Talent Nation's campus funding.",
    vision: "\"The Project Hub isn't a portfolio wall. It's the first thing an employer should check before an interview.\"",
    linkedin: "#",
  },
];

/* --------------------------------- helpers ---------------------------------- */

function Badge({ children, tone = "neutral", style }) {
  const tones = {
    neutral: { background: C.paperDeep, color: C.slate },
    gold: { background: C.goldPale, color: C.goldDeep },
    teal: { background: C.tealPale, color: C.tealDeep },
    ink: { background: C.ink, color: C.white },
  };
  return (
    <span
      className="tn-body"
      style={{
        display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12,
        fontWeight: 600, padding: "4px 10px", borderRadius: 999, whiteSpace: "nowrap",
        ...tones[tone], ...style,
      }}
    >
      {children}
    </span>
  );
}

function Avatar({ name, size = 40, hue = C.ink }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", background: hue, color: C.white,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      }}
      className="tn-display"
    >
      {initials}
    </div>
  );
}

function StatusDot({ status }) {
  const colors = { Completed: C.teal, Ongoing: C.gold, Prototype: C.slateLight, "Idea Stage": C.slateLight };
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status], display: "inline-block" }} />;
}

function PrimaryButton({ children, onClick, style, small }) {
  return (
    <button
      onClick={onClick}
      className="tn-body"
      style={{
        background: C.gold, color: C.ink, border: "none", borderRadius: 10,
        padding: small ? "8px 16px" : "12px 22px", fontWeight: 700,
        fontSize: small ? 13 : 14, cursor: "pointer", display: "inline-flex",
        alignItems: "center", gap: 8, transition: "transform 0.15s ease",
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick, style, small, dark }) {
  return (
    <button
      onClick={onClick}
      className="tn-body"
      style={{
        background: "transparent", color: dark ? C.white : C.ink,
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.35)" : C.line}`,
        borderRadius: 10, padding: small ? "8px 16px" : "12px 22px", fontWeight: 600,
        fontSize: small ? 13 : 14, cursor: "pointer", display: "inline-flex",
        alignItems: "center", gap: 8,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function SectionHeading({ eyebrow, title, sub, dark }) {
  return (
    <div style={{ marginBottom: 32, maxWidth: 640 }}>
      {eyebrow && (
        <p className="tn-body" style={{ fontSize: 13, fontWeight: 600, color: C.teal, margin: "0 0 8px" }}>
          {eyebrow}
        </p>
      )}
      <h2 className="tn-display" style={{ fontSize: 32, fontWeight: 700, color: dark ? C.white : C.ink, margin: "0 0 10px", lineHeight: 1.15 }}>
        {title}
      </h2>
      {sub && (
        <p className="tn-body" style={{ fontSize: 15, color: dark ? "rgba(255,255,255,0.65)" : C.slate, lineHeight: 1.6, margin: 0 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/* -------------------------------- project card ------------------------------- */

function ProjectCard({ project, onOpen, liked, bookmarked, onLike, onBookmark, big }) {
  const campus = getCampus(project.campusId);
  return (
    <div
      style={{
        background: C.white, borderRadius: 16, border: `1px solid ${C.line}`,
        overflow: "hidden", display: "flex", flexDirection: "column", height: "100%",
      }}
    >
      <div
        onClick={() => onOpen(project.id)}
        style={{
          height: big ? 200 : 130, cursor: "pointer",
          background: `linear-gradient(135deg, ${C.ink} 0%, ${C.inkSoft} 100%)`,
          position: "relative", display: "flex", alignItems: "flex-end", padding: 16,
        }}
      >
        <div style={{ position: "absolute", top: 14, right: 14 }}>
          <Badge tone="gold">{project.category}</Badge>
        </div>
        <p className="tn-display" style={{ color: "rgba(255,255,255,0.9)", fontSize: big ? 22 : 17, fontWeight: 700, margin: 0, maxWidth: "80%" }}>
          {project.title}
        </p>
      </div>
      <div style={{ padding: 18, display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8, fontSize: 12.5 }} className="tn-body">
          <StatusDot status={project.status} />
          <span style={{ color: C.slate, fontWeight: 600 }}>{project.status}</span>
          <span style={{ color: C.slateLight }}>·</span>
          <span style={{ color: C.slateLight }}>{campus?.city}</span>
        </div>
        <p className="tn-body" style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.55, margin: "0 0 12px", flex: 1 }}>
          {project.shortDesc}
        </p>
        <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 12px" }}>
          {project.fellowIds.map(fellowName).join(", ")}
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
          {project.technologies.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: 12, borderTop: `1px solid ${C.line}` }}>
          <div style={{ display: "flex", gap: 12, fontSize: 12.5, color: C.slateLight }} className="tn-body">
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={13} /> {project.views.toLocaleString()}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Heart size={13} /> {project.likes + (liked ? 1 : 0)}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => onLike(project.id)} aria-label="Like project" style={{ border: "none", background: liked ? C.dangerPale : C.paperDeep, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Heart size={14} color={liked ? C.danger : C.slate} fill={liked ? C.danger : "none"} />
            </button>
            <button onClick={() => onBookmark(project.id)} aria-label="Bookmark project" style={{ border: "none", background: bookmarked ? C.goldPale : C.paperDeep, borderRadius: 8, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Bookmark size={14} color={bookmarked ? C.goldDeep : C.slate} fill={bookmarked ? C.goldDeep : "none"} />
            </button>
            <GhostButton small onClick={() => onOpen(project.id)}>View</GhostButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- navbar ---------------------------------- */

function NavBar({ view, go, role, displayName, onLogout, mobileOpen, setMobileOpen }) {
  const links = [
    ["home", "Home"],
    ["explore", "Explore projects"],
    ["fellows", "Fellows"],
    ["campuses", "Campuses"],
    ["anchors", "Meet the anchors"],
    ["about", "About"],
  ];
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50, background: C.white, borderBottom: `1px solid ${C.line}` }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
        <div onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: C.ink, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Sparkles size={17} color={C.gold} />
          </div>
          <div>
            <p className="tn-display" style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: C.ink, lineHeight: 1.1 }}>Talent Nation</p>
            <p className="tn-body" style={{ margin: 0, fontSize: 10.5, fontWeight: 600, color: C.slateLight, letterSpacing: 0.3 }}>Project Hub</p>
          </div>
        </div>

        <div className="tn-body" style={{ display: "flex", gap: 4 }}>
          {links.map(([key, label]) => (
            <button
              key={key}
              onClick={() => go(key)}
              style={{
                display: window.innerWidth < 900 ? "none" : "inline-block",
                background: "none", border: "none", cursor: "pointer",
                padding: "8px 12px", borderRadius: 8, fontSize: 13.5, fontWeight: 600,
                color: view === key ? C.ink : C.slate,
                background: view === key ? C.paperDeep : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: window.innerWidth < 900 ? "none" : "flex", alignItems: "center", gap: 8 }}>
          {role === "visitor" ? (
            <>
              <GhostButton small onClick={() => go("login")}>Log in</GhostButton>
              <PrimaryButton small onClick={() => go("signup")}>Sign up</PrimaryButton>
            </>
          ) : (
            <>
              <PrimaryButton small onClick={() => go("submit")}>Submit a project</PrimaryButton>
              <button
                onClick={() => go(role === "admin" ? "admin" : "dashboard")}
                style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}
                aria-label="Open dashboard"
              >
                <Avatar name={displayName || "Fellow"} size={34} hue={C.teal} />
              </button>
              <GhostButton small onClick={onLogout}>Log out</GhostButton>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ display: window.innerWidth < 900 ? "flex" : "none", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="tn-body" style={{ borderTop: `1px solid ${C.line}`, padding: 16, display: "flex", flexDirection: "column", gap: 4 }}>
          {links.map(([key, label]) => (
            <button
              key={key}
              onClick={() => { go(key); setMobileOpen(false); }}
              style={{ textAlign: "left", background: "none", border: "none", padding: "10px 8px", fontSize: 14.5, fontWeight: 600, color: C.ink, cursor: "pointer" }}
            >
              {label}
            </button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            {role === "visitor" ? (
              <>
                <GhostButton small onClick={() => { go("login"); setMobileOpen(false); }}>Log in</GhostButton>
                <PrimaryButton small onClick={() => { go("signup"); setMobileOpen(false); }}>Sign up</PrimaryButton>
              </>
            ) : (
              <>
                <PrimaryButton small onClick={() => { go("submit"); setMobileOpen(false); }}>Submit a project</PrimaryButton>
                <GhostButton small onClick={() => { onLogout(); setMobileOpen(false); }}>Log out</GhostButton>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function Footer({ go }) {
  return (
    <div style={{ background: C.ink, marginTop: 80 }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <p className="tn-display" style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Talent Nation Project Hub</p>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.6, maxWidth: 280 }}>
            A home for the projects, ideas, and portfolios built by Talent Nation fellows across our campuses.
          </p>
        </div>
        {[
          ["Platform", [["explore", "Explore projects"], ["fellows", "Fellows"], ["campuses", "Campuses"]]],
          ["Community", [["anchors", "Meet the anchors"], ["about", "About"]]],
          ["Account", [["login", "Log in"], ["signup", "Sign up"]]],
        ].map(([title, items]) => (
          <div key={title}>
            <p className="tn-body" style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600, margin: "0 0 14px" }}>{title}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map(([key, label]) => (
                <button key={key} onClick={() => go(key)} className="tn-body" style={{ background: "none", border: "none", textAlign: "left", color: "rgba(255,255,255,0.55)", fontSize: 13.5, cursor: "pointer", padding: 0 }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", padding: "18px 24px" }}>
        <p className="tn-body" style={{ maxWidth: 1180, margin: "0 auto", color: "rgba(255,255,255,0.4)", fontSize: 12.5 }}>
          © 2026 Talent Nation. Prototype build for review — not connected to live data.
        </p>
      </div>
    </div>
  );
}

/* ---------------------------------- home page --------------------------------- */

function HomePage({ go, openProject, liked, bookmarked, onLike, onBookmark }) {
  const totalFellows = CAMPUSES.reduce((s, c) => s + c.fellowCount, 0);
  const featured = PROJECTS.filter((p) => p.featured);
  const stats = [
    { label: "Fellows", value: `${totalFellows.toLocaleString()}+`, icon: Users },
    { label: "Projects", value: `${PROJECTS.length}+`, icon: FolderKanban },
    { label: "Campuses", value: CAMPUSES.length, icon: Building2 },
    { label: "Categories", value: CATEGORIES.length, icon: Sparkles },
  ];

  return (
    <>
      <div style={{ background: C.ink, position: "relative", overflow: "hidden", paddingBottom: 60 }}>
        <div style={{
          position: "absolute", top: -180, left: "50%", transform: "translateX(-50%)",
          width: 640, height: 640, borderRadius: "50%",
          background: `radial-gradient(circle, ${C.gold}33 0%, transparent 70%)`,
        }} />
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "96px 24px 40px", position: "relative", textAlign: "center" }}>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)", marginBottom: 22 }}>
            <Sparkles size={12} /> {totalFellows.toLocaleString()}+ fellows across {CAMPUSES.length} campuses
          </Badge>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 52, fontWeight: 700, lineHeight: 1.08, margin: "0 0 20px" }}>
            Discover ideas. Explore innovation.<br />Celebrate talent.
          </h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: 17, lineHeight: 1.6, maxWidth: 620, margin: "0 auto 32px" }}>
            Explore projects created by Talent Nation fellows across our campuses, and discover the people, ideas, and solutions shaping the future.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <PrimaryButton onClick={() => go("explore")}>Explore projects <ChevronRight size={16} /></PrimaryButton>
            <GhostButton dark onClick={() => go("fellows")}>Meet the fellows</GhostButton>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px", position: "relative" }}>
          <div style={{ background: C.white, borderRadius: 18, padding: "26px 20px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", boxShadow: "0 24px 60px rgba(0,0,0,0.28)" }}>
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: "center", borderRight: s.label !== "Categories" ? `1px solid ${C.line}` : "none" }}>
                <s.icon size={18} color={C.teal} style={{ marginBottom: 6 }} />
                <p className="tn-display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 2px", color: C.ink }}>{s.value}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "72px 24px 0" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <SectionHeading eyebrow="Spotlight" title="Featured projects" sub="A rotating selection of standout work, chosen by the Talent Nation team." />
          <GhostButton small onClick={() => go("explore")}>View all projects <ChevronRight size={14} /></GhostButton>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20, gridTemplateRows: "auto auto" }}>
          <div style={{ gridRow: "span 2" }}>
            <ProjectCard project={featured[0]} onOpen={openProject} liked={liked.has(featured[0].id)} bookmarked={bookmarked.has(featured[0].id)} onLike={onLike} onBookmark={onBookmark} big />
          </div>
          {featured.slice(1, 5).map((p) => (
            <ProjectCard key={p.id} project={p} onOpen={openProject} liked={liked.has(p.id)} bookmarked={bookmarked.has(p.id)} onLike={onLike} onBookmark={onBookmark} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 24px 0" }}>
        <SectionHeading eyebrow="Where fellows learn" title="Our campuses" sub="Five campuses, each with its own strengths and specialties." />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}>
          {CAMPUSES.map((c) => (
            <div key={c.id} onClick={() => go("campus", c.id)} style={{ cursor: "pointer", borderRadius: 14, border: `1px solid ${C.line}`, padding: 18, background: C.white }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: c.hue, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Building2 size={18} color={C.white} />
              </div>
              <p className="tn-display" style={{ fontWeight: 700, fontSize: 15, margin: "0 0 4px", color: C.ink }}>{c.name}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 10px" }}>{c.city}, {c.country}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slate, margin: 0 }}>{c.fellowCount} fellows · {projectsByCampus(c.id).length} projects</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "80px 24px 96px" }}>
        <div style={{ background: C.teal, borderRadius: 24, padding: "56px 48px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ maxWidth: 460 }}>
            <h3 className="tn-display" style={{ color: C.white, fontSize: 26, fontWeight: 700, margin: "0 0 10px" }}>Behind Talent Nation is a small team with a clear vision.</h3>
            <p className="tn-body" style={{ color: "rgba(255,255,255,0.8)", fontSize: 14.5, lineHeight: 1.6, margin: 0 }}>
              Meet the founder and co-founders shaping the fellowship and the community around it.
            </p>
          </div>
          <PrimaryButton onClick={() => go("anchors")}>Meet the anchors <ChevronRight size={16} /></PrimaryButton>
        </div>
      </div>
    </>
  );
}

/* ------------------------------- explore projects ------------------------------ */

function ExplorePage({ go, openProject, liked, bookmarked, onLike, onBookmark }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [campus, setCampus] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Most recent");
  const [visible, setVisible] = useState(9);

  const filtered = useMemo(() => {
    let list = PROJECTS.filter((p) => {
      const matchQuery = query.trim() === "" || p.title.toLowerCase().includes(query.toLowerCase()) || p.shortDesc.toLowerCase().includes(query.toLowerCase());
      const matchCategory = category === "All" || p.category === category;
      const matchCampus = campus === "All" || p.campusId === campus;
      const matchStatus = status === "All" || p.status === status;
      return matchQuery && matchCategory && matchCampus && matchStatus;
    });
    if (sort === "Most recent") list = [...list].sort((a, b) => b.year - a.year);
    if (sort === "Most viewed") list = [...list].sort((a, b) => b.views - a.views);
    if (sort === "Most liked") list = [...list].sort((a, b) => b.likes - a.likes);
    if (sort === "Alphabetical") list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    return list;
  }, [query, category, campus, status, sort]);

  const selectStyle = {
    padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`,
    fontSize: 13, color: C.ink, background: C.white,
  };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 96px" }}>
      <SectionHeading eyebrow="Discover" title="Explore projects" sub={`Browse ${PROJECTS.length} projects built by Talent Nation fellows. Filter by category, campus, technology, and status.`} />

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color={C.slateLight} style={{ position: "absolute", left: 12, top: 12 }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects by name or description"
            className="tn-body"
            style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, boxSizing: "border-box" }}
          />
        </div>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="tn-body" style={selectStyle}>
          <option>All</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={campus} onChange={(e) => setCampus(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All campuses</option>
          {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All statuses</option>
          {STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="tn-body" style={selectStyle}>
          {["Most recent", "Most viewed", "Most liked", "Alphabetical"].map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, margin: "0 0 20px" }}>{filtered.length} project{filtered.length !== 1 ? "s" : ""} found</p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0", color: C.slateLight }} className="tn-body">
          No projects match those filters. Try widening your search.
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
            {filtered.slice(0, visible).map((p) => (
              <ProjectCard key={p.id} project={p} onOpen={openProject} liked={liked.has(p.id)} bookmarked={bookmarked.has(p.id)} onLike={onLike} onBookmark={onBookmark} />
            ))}
          </div>
          {visible < filtered.length && (
            <div style={{ textAlign: "center", marginTop: 32 }}>
              <GhostButton onClick={() => setVisible((v) => v + 9)}>Load more projects</GhostButton>
            </div>
          )}
        </>
      )}
    </div>
  );
}

/* -------------------------------- project detail -------------------------------- */

function ProjectDetailPage({ project, go, openFellow, liked, bookmarked, onLike, onBookmark }) {
  if (!project) return null;
  const campus = getCampus(project.campusId);
  const isLiked = liked.has(project.id);
  const isBookmarked = bookmarked.has(project.id);
  const fields = [
    ["Problem statement", project.problem],
    ["Proposed solution", project.solution],
    ["Objectives", project.objectives],
    ["Target audience", project.audience],
    ["Challenges", project.challenges],
    ["Results", project.results],
    ["Impact", project.impact],
    ["Future plans", project.future],
  ];

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("explore")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> Back to projects</GhostButton>

      <div style={{ borderRadius: 20, background: `linear-gradient(135deg, ${C.ink}, ${C.inkSoft})`, padding: 40, marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <Badge tone="gold">{project.category}</Badge>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)" }}><StatusDot status={project.status} /> {project.status}</Badge>
          <Badge tone="ink" style={{ border: "1px solid rgba(255,255,255,0.25)" }}>{project.year}</Badge>
        </div>
        <h1 className="tn-display" style={{ color: C.white, fontSize: 34, fontWeight: 700, margin: "0 0 12px" }}>{project.title}</h1>
        <p className="tn-body" style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, maxWidth: 640, lineHeight: 1.6, margin: "0 0 24px" }}>{project.shortDesc}</p>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
          {project.fellowIds.map((fid) => (
            <button key={fid} onClick={() => openFellow(fid)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer" }}>
              <Avatar name={fellowName(fid)} size={30} hue={C.gold} />
              <span className="tn-body" style={{ color: C.white, fontSize: 13.5, fontWeight: 600 }}>{fellowName(fid)}</span>
            </button>
          ))}
          <span className="tn-body" style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>· {campus?.name}</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div>
          <p className="tn-body" style={{ fontSize: 15, color: C.slate, lineHeight: 1.7, marginBottom: 32 }}>{project.solution} {project.problem}</p>
          {fields.map(([label, val]) => (
            <div key={label} style={{ marginBottom: 22 }}>
              <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, color: C.ink, margin: "0 0 6px" }}>{label}</p>
              <p className="tn-body" style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: 0 }}>{val}</p>
            </div>
          ))}

          <div style={{ marginTop: 32, padding: 20, borderRadius: 14, background: C.paper, border: `1px solid ${C.line}` }}>
            <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 12px" }}>Media</p>
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1, background: C.white, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}` }}>
                <PlayCircle size={16} color={C.teal} /> <span className="tn-body" style={{ fontSize: 12.5, color: C.slate }}>Demo video</span>
              </div>
              <div style={{ flex: 1, background: C.white, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 8, border: `1px solid ${C.line}` }}>
                <FileText size={16} color={C.teal} /> <span className="tn-body" style={{ fontSize: 12.5, color: C.slate }}>Project deck</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <PrimaryButton small onClick={() => onLike(project.id)} style={{ flex: 1, justifyContent: "center", background: isLiked ? C.dangerPale : C.gold, color: isLiked ? C.danger : C.ink }}>
                <Heart size={14} fill={isLiked ? C.danger : "none"} /> {project.likes + (isLiked ? 1 : 0)}
              </PrimaryButton>
              <GhostButton small onClick={() => onBookmark(project.id)} style={{ borderColor: isBookmarked ? C.goldDeep : C.line }}>
                <Bookmark size={14} fill={isBookmarked ? C.goldDeep : "none"} color={isBookmarked ? C.goldDeep : C.ink} />
              </GhostButton>
              <GhostButton small><Share2 size={14} /></GhostButton>
            </div>
            <p className="tn-body" style={{ fontSize: 12, color: C.slateLight, textAlign: "center", margin: 0 }}>{project.views.toLocaleString()} views</p>
          </div>

          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, marginBottom: 16 }}>
            <p className="tn-display" style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 12px" }}>Links</p>
            {[["Github repository", Code2], ["Live demo", Globe], ["Project website", ExternalLinkIcon]].map(([label, Icon], i) => (
              <a key={i} href={project.github} className="tn-body" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: C.teal, textDecoration: "none", padding: "8px 0", borderTop: i > 0 ? `1px solid ${C.line}` : "none" }}>
                <Icon size={14} /> {label}
              </a>
            ))}
          </div>

          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
            <p className="tn-display" style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 12px" }}>Technologies</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {project.technologies.map((t) => <Badge key={t}>{t}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function ExternalLinkIcon(props) { return <Globe {...props} />; }

/* ----------------------------------- fellows ---------------------------------- */

function FellowsPage({ go, openFellow }) {
  const [query, setQuery] = useState("");
  const [campus, setCampus] = useState("All");
  const [skill, setSkill] = useState("All");
  const allSkills = Array.from(new Set(FELLOWS.flatMap((f) => f.skills)));

  const filtered = FELLOWS.filter((f) => {
    const matchQuery = query.trim() === "" || f.name.toLowerCase().includes(query.toLowerCase());
    const matchCampus = campus === "All" || f.campusId === campus;
    const matchSkill = skill === "All" || f.skills.includes(skill);
    return matchQuery && matchCampus && matchSkill;
  });

  const selectStyle = { padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13, background: C.white };

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 96px" }}>
      <SectionHeading eyebrow="Community" title="Fellows" sub="Search and filter fellows across all Talent Nation campuses." />
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}>
        <div style={{ position: "relative", flex: "1 1 260px" }}>
          <Search size={16} color={C.slateLight} style={{ position: "absolute", left: 12, top: 12 }} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fellows by name" className="tn-body" style={{ width: "100%", padding: "10px 12px 10px 36px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 13.5, boxSizing: "border-box" }} />
        </div>
        <select value={campus} onChange={(e) => setCampus(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All campuses</option>
          {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={skill} onChange={(e) => setSkill(e.target.value)} className="tn-body" style={selectStyle}>
          <option value="All">All skills</option>
          {allSkills.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>
      <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, marginBottom: 20 }}>{filtered.length} fellow{filtered.length !== 1 ? "s" : ""} found</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {filtered.map((f) => {
          const campusObj = getCampus(f.campusId);
          return (
            <div key={f.id} onClick={() => openFellow(f.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 16, padding: 18, background: C.white }}>
              <Avatar name={f.name} size={44} hue={campusObj.hue} />
              <p className="tn-display" style={{ fontWeight: 700, fontSize: 14.5, margin: "12px 0 2px" }}>{f.name}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 10px" }}>{f.title}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                {f.skills.slice(0, 2).map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
              <p className="tn-body" style={{ fontSize: 12, color: C.slate, display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                <MapPin size={11} /> {f.city} · {projectsByFellow(f.id).length} projects
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FellowProfilePage({ fellow, go, openProject }) {
  if (!fellow) return null;
  const campus = getCampus(fellow.campusId);
  const projects = projectsByFellow(fellow.id);
  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("fellows")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> Back to fellows</GhostButton>
      <div style={{ display: "flex", gap: 24, marginBottom: 36, flexWrap: "wrap" }}>
        <Avatar name={fellow.name} size={92} hue={campus.hue} />
        <div style={{ flex: 1, minWidth: 260 }}>
          <h1 className="tn-display" style={{ fontSize: 28, fontWeight: 700, margin: "0 0 4px" }}>{fellow.name}</h1>
          <p className="tn-body" style={{ fontSize: 15, color: C.teal, fontWeight: 600, margin: "0 0 10px" }}>{fellow.title}</p>
          <p className="tn-body" style={{ fontSize: 13.5, color: C.slate, display: "flex", alignItems: "center", gap: 6, margin: "0 0 14px" }}>
            <MapPin size={13} /> {fellow.city} <span style={{ color: C.slateLight }}>·</span> {campus.name}
          </p>
          <div style={{ display: "flex", gap: 8 }}>
            <GhostButton small><Link2 size={14} /> LinkedIn</GhostButton>
            <GhostButton small><Code2 size={14} /> GitHub</GhostButton>
            <GhostButton small><Mail size={14} /> Contact</GhostButton>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 32 }}>
        <div>
          <p className="tn-display" style={{ fontSize: 15, fontWeight: 700, margin: "0 0 10px" }}>About</p>
          <p className="tn-body" style={{ fontSize: 14, color: C.slate, lineHeight: 1.7, marginBottom: 32 }}>{fellow.bio}</p>
          <p className="tn-display" style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px" }}>Projects ({projects.length})</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {projects.map((p) => (
              <div key={p.id} onClick={() => openProject(p.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{p.title}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{p.category} · {p.status}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
            <p className="tn-display" style={{ fontSize: 13.5, fontWeight: 700, margin: "0 0 12px" }}>Skills</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {fellow.skills.map((s) => <Badge key={s} tone="teal">{s}</Badge>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- campuses ---------------------------------- */

function CampusesPage({ go }) {
  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 24px 96px" }}>
      <SectionHeading eyebrow="Where fellows learn" title="Campuses" sub="Every fellow belongs to a Talent Nation campus. Explore each one and the projects it has produced." />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {CAMPUSES.map((c) => (
          <div key={c.id} style={{ border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", background: C.white }}>
            <div style={{ height: 100, background: `linear-gradient(135deg, ${c.hue}, ${C.ink})` }} />
            <div style={{ padding: 22 }}>
              <p className="tn-display" style={{ fontSize: 19, fontWeight: 700, margin: "0 0 4px" }}>{c.name}</p>
              <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, display: "flex", alignItems: "center", gap: 5, margin: "0 0 12px" }}><MapPin size={12} /> {c.city}, {c.country}</p>
              <p className="tn-body" style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.6, margin: "0 0 16px" }}>{c.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slate, margin: 0 }}>{c.fellowCount} fellows · {projectsByCampus(c.id).length} projects</p>
                <GhostButton small onClick={() => go("campus", c.id)}>View campus <ChevronRight size={13} /></GhostButton>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CampusDetailPage({ campus, go, openFellow, openProject }) {
  if (!campus) return null;
  const fellows = fellowsByCampus(campus.id);
  const projects = projectsByCampus(campus.id);
  return (
    <div>
      <div style={{ background: `linear-gradient(135deg, ${campus.hue}, ${C.ink})`, padding: "56px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <GhostButton small dark onClick={() => go("campuses")} style={{ marginBottom: 20 }}><ArrowLeft size={14} /> All campuses</GhostButton>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 32, fontWeight: 700, margin: "0 0 8px" }}>{campus.name}</h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.75)", fontSize: 14.5, display: "flex", alignItems: "center", gap: 6, margin: "0 0 16px" }}><MapPin size={14} /> {campus.city}, {campus.country}</p>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.85)", fontSize: 14.5, maxWidth: 560, lineHeight: 1.6 }}>{campus.desc}</p>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 96px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 48 }}>
          {[["Fellows", campus.fellowCount, Users], ["Projects on hub", projects.length, FolderKanban], ["Featured", projects.filter((p) => p.featured).length, Sparkles]].map(([label, val, Icon]) => (
            <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, textAlign: "center" }}>
              <Icon size={18} color={C.teal} style={{ marginBottom: 8 }} />
              <p className="tn-display" style={{ fontSize: 24, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>

        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Fellows from this campus</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 48 }}>
          {fellows.map((f) => (
            <div key={f.id} onClick={() => openFellow(f.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, textAlign: "center" }}>
              <Avatar name={f.name} size={40} hue={campus.hue} />
              <p className="tn-body" style={{ fontSize: 12.5, fontWeight: 600, margin: "8px 0 0" }}>{f.name}</p>
            </div>
          ))}
        </div>

        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: "0 0 16px" }}>Projects from this campus</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {projects.map((p) => (
            <div key={p.id} onClick={() => openProject(p.id)} style={{ cursor: "pointer", border: `1px solid ${C.line}`, borderRadius: 14, padding: 16 }}>
              <p className="tn-display" style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px" }}>{p.title}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>{p.category} · {p.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------- anchors ----------------------------------- */

function AnchorsPage({ go, openAnchor }) {
  return (
    <div>
      <div style={{ background: C.ink, padding: "64px 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
          <h1 className="tn-display" style={{ color: C.white, fontSize: 34, fontWeight: 700, margin: "0 0 12px" }}>Meet the anchors behind Talent Nation</h1>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.65)", fontSize: 15, lineHeight: 1.6 }}>
            Meet the visionary leaders whose passion, experience, and commitment continue to shape the Talent Nation community.
          </p>
        </div>
      </div>
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "56px 24px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 64 }}>
          {ANCHORS.map((a) => (
            <div key={a.id} style={{ border: `1px solid ${C.line}`, borderRadius: 18, padding: 24, textAlign: "center" }}>
              <div style={{ margin: "0 auto 16px" }}><Avatar name={a.name} size={72} hue={a.tag === "Founder" ? C.gold : C.teal} /></div>
              <Badge tone={a.tag === "Founder" ? "gold" : "teal"} style={{ marginBottom: 10 }}>{a.tag}</Badge>
              <p className="tn-display" style={{ fontWeight: 700, fontSize: 17, margin: "0 0 2px" }}>{a.name}</p>
              <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: "0 0 14px" }}>{a.role}</p>
              <p className="tn-body" style={{ fontSize: 13, color: C.slate, lineHeight: 1.6, margin: "0 0 18px" }}>{a.shortBio}</p>
              <GhostButton small onClick={() => openAnchor(a.id)}>Read more</GhostButton>
            </div>
          ))}
        </div>

        <div style={{ background: C.paper, borderRadius: 20, padding: 40 }}>
          <p className="tn-display" style={{ fontSize: 13, fontWeight: 700, color: C.teal, margin: "0 0 10px" }}>Our vision</p>
          <p className="tn-body" style={{ fontSize: 17, color: C.ink, lineHeight: 1.7, margin: 0 }}>
            "We believe talent is distributed evenly, but opportunity isn't. Talent Nation exists to close that gap — one campus, one fellow, and one shipped project at a time. The Project Hub is where that work becomes visible to the people who can open doors: employers, funders, and other fellows."
          </p>
        </div>
      </div>
    </div>
  );
}

function AnchorDetailPage({ anchor, go }) {
  if (!anchor) return null;
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 24px 96px" }}>
      <GhostButton small onClick={() => go("anchors")} style={{ marginBottom: 24 }}><ArrowLeft size={14} /> All anchors</GhostButton>
      <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 32 }}>
        <Avatar name={anchor.name} size={80} hue={anchor.tag === "Founder" ? C.gold : C.teal} />
        <div>
          <Badge tone={anchor.tag === "Founder" ? "gold" : "teal"} style={{ marginBottom: 8 }}>{anchor.tag}</Badge>
          <h1 className="tn-display" style={{ fontSize: 26, fontWeight: 700, margin: "0 0 4px" }}>{anchor.name}</h1>
          <p className="tn-body" style={{ fontSize: 14, color: C.slateLight, margin: 0 }}>{anchor.role}</p>
        </div>
      </div>
      {[["Background", anchor.background], ["Contribution to Talent Nation", anchor.contribution]].map(([label, val]) => (
        <div key={label} style={{ marginBottom: 24 }}>
          <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 6px" }}>{label}</p>
          <p className="tn-body" style={{ fontSize: 14, color: C.slate, lineHeight: 1.65, margin: 0 }}>{val}</p>
        </div>
      ))}
      <div style={{ marginBottom: 24 }}>
        <p className="tn-display" style={{ fontSize: 14.5, fontWeight: 700, margin: "0 0 8px" }}>Areas of expertise</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {anchor.expertise.map((e) => <Badge key={e} tone="teal">{e}</Badge>)}
        </div>
      </div>
      <div style={{ background: C.paper, borderRadius: 16, padding: 24, display: "flex", gap: 12 }}>
        <Quote size={18} color={C.teal} style={{ flexShrink: 0, marginTop: 2 }} />
        <p className="tn-body" style={{ fontSize: 14.5, color: C.ink, lineHeight: 1.7, fontStyle: "italic", margin: 0 }}>{anchor.vision}</p>
      </div>
      <div style={{ marginTop: 24 }}>
        <GhostButton small><Link2 size={14} /> LinkedIn</GhostButton>
      </div>
    </div>
  );
}

/* ------------------------------------ about ------------------------------------ */

function AboutPage({ go }) {
  const sections = [
    ["Who we are", "Talent Nation is a fellowship community that trains, supports, and showcases early-career tech talent across our campuses."],
    ["Our story", "Talent Nation began in 2021 as a small study group and has grown into a multi-campus fellowship spanning two countries."],
    ["Mission", "To close the gap between talent and opportunity by giving fellows the skills, community, and visibility to build real careers."],
    ["Vision", "A future where a fellow's postcode has nothing to do with the ceiling on their career."],
    ["Core values", "Community over competition, evidence over credentials, and consistency over intensity."],
    ["What we do", "We run a project-based fellowship, connect fellows with employers, and maintain the Project Hub as a public record of what fellows build."],
    ["How the fellowship works", "Fellows join a campus, work through a project-based curriculum, and graduate with a portfolio of shipped work rather than just certificates."],
    ["Impact", "Fellows from Talent Nation campuses have gone on to roles at startups, agencies, and larger tech employers across the region."],
  ];
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "56px 24px 96px" }}>
      <SectionHeading eyebrow="About us" title="Talent Nation" sub="A community-first fellowship building the next generation of tech talent." />
      {sections.map(([title, body]) => (
        <div key={title} style={{ marginBottom: 28 }}>
          <p className="tn-display" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 6px" }}>{title}</p>
          <p className="tn-body" style={{ fontSize: 14.5, color: C.slate, lineHeight: 1.7, margin: 0 }}>{body}</p>
        </div>
      ))}
      <div style={{ background: C.ink, borderRadius: 16, padding: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
        <p className="tn-body" style={{ color: C.white, fontSize: 14.5, margin: 0 }}>Curious who's behind it all?</p>
        <PrimaryButton onClick={() => go("anchors")}>Meet the anchors <ChevronRight size={16} /></PrimaryButton>
      </div>
    </div>
  );
}

/* --------------------------------- auth pages ----------------------------------- */

function AuthPage({ mode, go }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      if (data.session) {
        // Logged in immediately (email confirmation is off).
        go("dashboard");
      } else {
        // Supabase sent a confirmation email; no session yet.
        setNotice("Account created. Check your email to confirm it, then log in.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) {
        setError(error.message);
        return;
      }
      go("dashboard");
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "80px 24px 96px" }}>
      <h1 className="tn-display" style={{ fontSize: 26, fontWeight: 700, textAlign: "center", margin: "0 0 8px" }}>
        {mode === "login" ? "Log in to your account" : "Create your fellow account"}
      </h1>
      <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, textAlign: "center", margin: "0 0 32px" }}>
        {mode === "login" ? "Welcome back." : "Join the Talent Nation Project Hub."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "signup" && (
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Full name"
            required
            className="tn-body"
            style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }}
          />
        )}
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
          type="email"
          required
          className="tn-body"
          style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }}
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          minLength={6}
          className="tn-body"
          style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }}
        />
        {error && (
          <p className="tn-body" style={{ fontSize: 13, color: C.danger, margin: 0 }}>{error}</p>
        )}
        {notice && (
          <p className="tn-body" style={{ fontSize: 13, color: C.tealDeep, margin: 0 }}>{notice}</p>
        )}
        <PrimaryButton style={{ justifyContent: "center", marginTop: 8 }} disabled={loading}>
          {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
        </PrimaryButton>
        <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, textAlign: "center", margin: "8px 0 0" }}>
          {mode === "login" ? "New to Talent Nation? " : "Already a fellow? "}
          <button type="button" onClick={() => go(mode === "login" ? "signup" : "login")} style={{ background: "none", border: "none", color: C.teal, fontWeight: 600, cursor: "pointer", fontSize: 13 }}>
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </form>
    </div>
  );
}

/* -------------------------------- fellow dashboard ------------------------------- */

function FellowDashboard({ go, openProject, session, profile }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Load this fellow's real submitted projects (there's no "submit a
  // project" form wired up yet, so this will show 0 until that's built).
  useEffect(() => {
    if (!session) return;
    supabase
      .from("projects")
      .select("*")
      .eq("created_by", session.user.id)
      .then(({ data, error }) => {
        setLoadingProjects(false);
        if (error) {
          console.error("Failed to load your projects:", error);
          return;
        }
        setMyProjects(data || []);
      });
  }, [session]);

  const displayName = profile?.full_name || session?.user?.email || "Fellow";
  const firstName = displayName.split(" ")[0].split("@")[0];
  const totalViews = myProjects.reduce((s, p) => s + (p.views || 0), 0);
  const stats = [
    ["Total projects", myProjects.length, FolderKanban],
    ["Project views", totalViews.toLocaleString(), Eye],
    ["Likes", 0, Heart],
    ["Profile views", 0, Users],
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 96px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Avatar name={displayName} size={54} hue={C.teal} />
          <div>
            <p className="tn-display" style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Welcome back, {firstName}</p>
            <p className="tn-body" style={{ fontSize: 13, color: C.slateLight, margin: 0 }}>{profile?.title || "Fellow"}{profile?.campus_id ? "" : " · No campus set yet"}</p>
          </div>
        </div>
        <PrimaryButton onClick={() => go("submit")}><Plus size={15} /> Submit a project</PrimaryButton>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map(([label, val, Icon]) => (
          <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 }}>
            <Icon size={16} color={C.teal} style={{ marginBottom: 8 }} />
            <p className="tn-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
            <p className="tn-body" style={{ fontSize: 12, color: C.slateLight, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <p className="tn-display" style={{ fontSize: 17, fontWeight: 700, margin: 0 }}>Your projects</p>
      </div>
      {loadingProjects ? (
        <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>Loading…</p>
      ) : myProjects.length === 0 ? (
        <div style={{ border: `1px dashed ${C.line}`, borderRadius: 14, padding: 32, textAlign: "center" }}>
          <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, margin: "0 0 14px" }}>
            You haven't submitted a project yet.
          </p>
          <GhostButton small onClick={() => go("submit")}><Plus size={13} /> Submit your first project</GhostButton>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {myProjects.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div style={{ cursor: "pointer" }} onClick={() => openProject(p.id)}>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: 14.5, margin: "0 0 3px" }}>{p.title}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0, display: "flex", alignItems: "center", gap: 6 }}>
                  <StatusDot status={p.status} /> {p.status} · {(p.views || 0).toLocaleString()} views
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <GhostButton small><Pencil size={13} /> Edit</GhostButton>
                <GhostButton small style={{ color: C.danger, borderColor: "#F0D3D3" }}><Trash2 size={13} /></GhostButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- admin dashboard -------------------------------- */

function AdminDashboard() {
  const [pending, setPending] = useState([PROJECTS[8], PROJECTS[12], PROJECTS[14]]);
  const totalFellows = CAMPUSES.reduce((s, c) => s + c.fellowCount, 0);

  const byCampus = CAMPUSES.map((c) => ({ name: c.city, projects: projectsByCampus(c.id).length }));
  const byCategory = CATEGORIES.slice(0, 8).map((cat) => ({ name: cat.length > 10 ? cat.slice(0, 10) + "…" : cat, count: PROJECTS.filter((p) => p.category === cat).length }));

  const stats = [
    ["Total fellows", totalFellows.toLocaleString(), Users],
    ["Total projects", PROJECTS.length, FolderKanban],
    ["Total campuses", CAMPUSES.length, Building2],
    ["Pending approvals", pending.length, ShieldCheck],
  ];

  return (
    <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 24px 96px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 28 }}>
        <LayoutDashboard size={20} color={C.ink} />
        <p className="tn-display" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>Administrator dashboard</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
        {stats.map(([label, val, Icon]) => (
          <div key={label} style={{ border: `1px solid ${C.line}`, borderRadius: 14, padding: 18 }}>
            <Icon size={16} color={C.teal} style={{ marginBottom: 8 }} />
            <p className="tn-display" style={{ fontSize: 22, fontWeight: 700, margin: "0 0 2px" }}>{val}</p>
            <p className="tn-body" style={{ fontSize: 12, color: C.slateLight, margin: 0 }}>{label}</p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 40 }}>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
          <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Projects by campus</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCampus}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
              <Bar dataKey="projects" radius={[6, 6, 0, 0]}>
                {byCampus.map((_, i) => <Cell key={i} fill={i % 2 === 0 ? C.gold : C.teal} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
          <p className="tn-display" style={{ fontSize: 14, fontWeight: 700, margin: "0 0 16px" }}>Projects by category</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={byCategory} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.line} horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: C.slateLight }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10.5, fill: C.slateLight }} axisLine={false} tickLine={false} width={70} />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${C.line}` }} />
              <Bar dataKey="count" fill={C.teal} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="tn-display" style={{ fontSize: 16, fontWeight: 700, margin: "0 0 16px" }}>Pending project approvals</p>
      {pending.length === 0 ? (
        <p className="tn-body" style={{ color: C.slateLight, fontSize: 13.5 }}>No pending approvals right now.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pending.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <p className="tn-display" style={{ fontWeight: 700, fontSize: 14.5, margin: "0 0 3px" }}>{p.title}</p>
                <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>
                  Submitted by {p.fellowIds.map(fellowName).join(", ")} · {getCampus(p.campusId)?.name || "Campus"}
                </p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <GhostButton small style={{ color: C.teal, borderColor: C.tealPale }} onClick={() => setPending((cur) => cur.filter((x) => x.id !== p.id))}>
                  <CheckCircle2 size={13} /> Approve
                </GhostButton>
                <GhostButton small style={{ color: C.danger, borderColor: "#F0D3D3" }} onClick={() => setPending((cur) => cur.filter((x) => x.id !== p.id))}>
                  <XCircle size={13} /> Reject
                </GhostButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- submit page --------------------------------- */

function SubmitProjectPage({ go }) {
  const [step, setStep] = useState(1);
  const steps = ["Basic info", "Details", "Tech & skills", "Media", "Links", "Team", "Preview"];
  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 96px" }}>
      <SectionHeading eyebrow="New submission" title="Submit a project" sub="A quick preview of the multi-step submission flow." />
      <div style={{ display: "flex", gap: 6, marginBottom: 32, flexWrap: "wrap" }}>
        {steps.map((s, i) => (
          <div key={s} onClick={() => setStep(i + 1)} style={{ cursor: "pointer", padding: "6px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: step === i + 1 ? C.ink : C.paperDeep, color: step === i + 1 ? C.white : C.slate }} className="tn-body">
            {i + 1}. {s}
          </div>
        ))}
      </div>
      <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 28 }}>
        {step === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <input placeholder="Project title" className="tn-body" style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }} />
            <input placeholder="Short description" className="tn-body" style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }} />
            <textarea placeholder="Full project description" rows={4} className="tn-body" style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14, resize: "vertical" }} />
            <select className="tn-body" style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }}>
              <option>Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
        )}
        {step > 1 && step < 7 && (
          <p className="tn-body" style={{ color: C.slateLight, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            {steps[step - 1]} form fields go here in the full build.
          </p>
        )}
        {step === 7 && (
          <p className="tn-body" style={{ color: C.slate, fontSize: 14, textAlign: "center", padding: "40px 0" }}>
            Your project preview would appear here before final submission for admin review.
          </p>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24 }}>
          <GhostButton small onClick={() => setStep((s) => Math.max(1, s - 1))} style={{ visibility: step === 1 ? "hidden" : "visible" }}>Back</GhostButton>
          {step < 7 ? (
            <PrimaryButton small onClick={() => setStep((s) => Math.min(7, s + 1))}>Continue</PrimaryButton>
          ) : (
            <PrimaryButton small onClick={() => go("dashboard")}>Submit for review</PrimaryButton>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------- app -------------------------------------- */

export default function App() {
  const [view, setView] = useState("home");
  const [selectedId, setSelectedId] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liked, setLiked] = useState(new Set());
  const [bookmarked, setBookmarked] = useState(new Set());
  const [, forceRerender] = useState(0);

  // session = the logged-in Supabase Auth user (null when logged out).
  // profile = that user's row in our own "profiles" table (name, role, etc.).
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);

  // On first load, check if there's already a logged-in session (e.g. the
  // person refreshed the page). Then keep listening for login/logout events.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // Whenever the session changes, load (or clear) the matching profile row.
  useEffect(() => {
    if (!session) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single()
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load profile:", error);
          return;
        }
        setProfile(data);
      });
  }, [session]);

  const role = !session ? "visitor" : (profile?.role === "administrator" || profile?.role === "super_administrator") ? "admin" : "fellow";
  const displayName = profile?.full_name || session?.user?.email;
  const handleLogout = () => supabase.auth.signOut();

  // If someone logs out while on a fellow/admin-only page, send them home.
  useEffect(() => {
    if (role === "visitor" && ["dashboard", "admin", "submit"].includes(view)) {
      setView("home");
    }
  }, [role, view]);

  // Load real campuses from Supabase and swap them into the CAMPUSES array
  // that the rest of the app already reads from.
  useEffect(() => {
    supabase
      .from("campuses")
      .select("*")
      .order("name")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load campuses from database:", error);
          return;
        }
        const hues = [C.gold, C.teal];
        const live = data.map((row, i) => ({
          id: row.slug,
          name: row.name,
          city: row.city,
          country: row.country,
          desc: row.description,
          fellowCount: fellowsByCampus(row.slug).length,
          hue: hues[i % hues.length],
        }));
        CAMPUSES.splice(0, CAMPUSES.length, ...live);
        forceRerender((n) => n + 1);
      });
  }, []);

  // Load real anchors (founder/co-founders) from Supabase and swap them
  // into the ANCHORS array that the rest of the app already reads from.
  useEffect(() => {
    supabase
      .from("anchors")
      .select("*")
      .eq("active", true)
      .order("display_order")
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load anchors from database:", error);
          return;
        }
        const live = data.map((row) => ({
          id: row.slug,
          name: row.name,
          role: row.role,
          tag: row.tag,
          photo: row.photo_url,
          shortBio: row.short_bio,
          background: row.background,
          expertise: row.expertise || [],
          contribution: row.contribution,
          vision: row.vision,
          linkedin: row.linkedin_url,
        }));
        ANCHORS.splice(0, ANCHORS.length, ...live);
        forceRerender((n) => n + 1);
      });
  }, []);

  const go = (v, id) => {
    setView(v);
    if (id) setSelectedId(id);
    setMobileOpen(false);
    window.scrollTo?.(0, 0);
  };
  const openProject = (id) => go("project", id);
  const openFellow = (id) => go("fellow", id);
  const openAnchor = (id) => go("anchor", id);

  const toggleSet = (setter) => (id) => setter((cur) => {
    const next = new Set(cur);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  const onLike = toggleSet(setLiked);
  const onBookmark = toggleSet(setBookmarked);

  const project = PROJECTS.find((p) => p.id === selectedId);
  const fellow = FELLOWS.find((f) => f.id === selectedId);
  const campus = getCampus(selectedId);
  const anchor = ANCHORS.find((a) => a.id === selectedId);

  return (
    <div className="tn-body" style={{ background: C.paper, minHeight: "100vh" }}>
      <style>{FONTS}</style>
      <NavBar view={view} go={go} role={role} displayName={displayName} onLogout={handleLogout} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {view === "home" && <HomePage go={go} openProject={openProject} liked={liked} bookmarked={bookmarked} onLike={onLike} onBookmark={onBookmark} />}
      {view === "explore" && <ExplorePage go={go} openProject={openProject} liked={liked} bookmarked={bookmarked} onLike={onLike} onBookmark={onBookmark} />}
      {view === "project" && <ProjectDetailPage project={project} go={go} openFellow={openFellow} liked={liked} bookmarked={bookmarked} onLike={onLike} onBookmark={onBookmark} />}
      {view === "fellows" && <FellowsPage go={go} openFellow={openFellow} />}
      {view === "fellow" && <FellowProfilePage fellow={fellow} go={go} openProject={openProject} />}
      {view === "campuses" && <CampusesPage go={go} />}
      {view === "campus" && <CampusDetailPage campus={campus} go={go} openFellow={openFellow} openProject={openProject} />}
      {view === "anchors" && <AnchorsPage go={go} openAnchor={openAnchor} />}
      {view === "anchor" && <AnchorDetailPage anchor={anchor} go={go} />}
      {view === "about" && <AboutPage go={go} />}
      {view === "login" && <AuthPage mode="login" go={go} />}
      {view === "signup" && <AuthPage mode="signup" go={go} />}
      {view === "dashboard" && <FellowDashboard go={go} openProject={openProject} session={session} profile={profile} />}
      {view === "admin" && <AdminDashboard />}
      {view === "submit" && <SubmitProjectPage go={go} />}

      <Footer go={go} />
    </div>
  );
}