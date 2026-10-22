import { C } from "../lib/theme";

export function Footer({ go }) {
  return (
    <div style={{ background: C.ink, marginTop: 80 }}>
      <div style={{ maxWidth: 1440, margin: "0 auto", padding: "56px 24px 32px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <p className="tn-display" style={{ color: C.white, fontSize: 18, fontWeight: 700, margin: "0 0 10px" }}>Talent Nation Project Hub</p>
          <p className="tn-body" style={{ color: "rgba(255,255,255,0.55)", fontSize: 13.5, lineHeight: 1.6, maxWidth: 280 }}>
            A home for the projects, ideas, and portfolios built by Talent Nation fellows across our campuses.
          </p>
        </div>
        {[
          ["Platform", [["explore", "Explore projects"], ["fellows", "Fellows"], ["campuses", "Campuses"], ["mentors", "Coding Mentors"]]],
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
        <p className="tn-body" style={{ maxWidth: 1440, margin: "0 auto", color: "rgba(255,255,255,0.4)", fontSize: 12.5 }}>
          © {new Date().getFullYear()} Talent Nation. All rights reserved.
        </p>
      </div>
    </div>
  );
}
