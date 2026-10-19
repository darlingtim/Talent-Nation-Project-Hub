import { Globe } from "lucide-react";
import { C } from "../lib/theme";

/* --------------------------------- helpers ---------------------------------- */

export function Badge({ children, tone = "neutral", style }) {
  const tones = {
    neutral: { background: C.paperDeep, color: C.slate },
    gold: { background: C.goldPale, color: C.goldDeep },
    teal: { background: C.tealPale, color: C.tealDeep },
    danger: { background: C.dangerPale, color: C.danger },
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

export function Avatar({ name, size = 40, hue = C.ink, photo }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  return (
    <div
      style={{
        width: size, height: size, borderRadius: "50%", color: C.white,
        background: photo ? `url(${photo}) center 20%/cover` : hue,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
      }}
      className="tn-display"
    >
      {photo ? null : initials}
    </div>
  );
}

// Full-screen overlay showing a picture at full size. Click anywhere to close.
export function PhotoLightbox({ src, onClose }) {
  if (!src) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(27,16,146,0.88)", zIndex: 1000,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24, cursor: "zoom-out",
      }}
    >
      <img src={src} alt="Full size" style={{ maxWidth: "100%", maxHeight: "100%", borderRadius: 12, objectFit: "contain" }} />
    </div>
  );
}

export function StatusDot({ status }) {
  const colors = { Completed: C.teal, Ongoing: C.gold, Prototype: C.slateLight, "Idea Stage": C.slateLight };
  return <span style={{ width: 7, height: 7, borderRadius: "50%", background: colors[status], display: "inline-block" }} />;
}

export function PrimaryButton({ children, onClick, style, small, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tn-body"
      style={{
        background: C.gold, color: C.ink, border: "none", borderRadius: 10,
        padding: small ? "8px 16px" : "12px 22px", fontWeight: 700,
        fontSize: small ? 13 : 14, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex",
        alignItems: "center", gap: 8, transition: "transform 0.15s ease",
        opacity: disabled ? 0.6 : 1,
        ...style,
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      {children}
    </button>
  );
}

export function GhostButton({ children, onClick, style, small, dark, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="tn-body"
      style={{
        background: "transparent", color: dark ? C.white : C.ink,
        border: `1.5px solid ${dark ? "rgba(255,255,255,0.35)" : C.line}`,
        borderRadius: 10, padding: small ? "8px 16px" : "12px 22px", fontWeight: 600,
        fontSize: small ? 13 : 14, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex",
        alignItems: "center", gap: 8, opacity: disabled ? 0.6 : 1,
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function SectionHeading({ eyebrow, title, sub, dark }) {
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

export function ExternalLinkIcon(props) { return <Globe {...props} />; }

/* ---------------------------------- submit page --------------------------------- */

export const inputStyle = { padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14, width: "100%", boxSizing: "border-box" };

export function Field({ label, children }) {
  return (
    <div>
      <p className="tn-body" style={{ fontSize: 13, fontWeight: 600, color: C.ink, margin: "0 0 6px" }}>{label}</p>
      {children}
    </div>
  );
}
