import { useState } from "react";
import { supabase } from "../supabaseClient";
import { Eye, EyeOff } from "lucide-react";
import { C } from "../lib/theme";
import { CAMPUSES } from "../lib/data";
import { passwordStrength } from "../lib/passwordStrength";
import { PrimaryButton } from "../components/ui";

export function AuthPage({ mode, go }) {
  const [fullName, setFullName] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [memberType, setMemberType] = useState("fellow");
  const [requestedCampus, setRequestedCampus] = useState("");
  const [headNote, setHeadNote] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);

    if (mode === "signup") {
      if (memberType === "head" && !requestedCampus) {
        setLoading(false);
        setError("Please choose the campus you want to lead.");
        return;
      }
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: {
          full_name: fullName,
          discord_username: discordName.trim() || null,
          member_type: memberType,
          ...(memberType === "head" ? { requested_campus: requestedCampus, head_note: headNote.trim() } : {}),
        } },
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
        {mode === "login" ? "Log in to your account" : memberType === "mentor" ? "Create your mentor account" : memberType === "head" ? "Create your Head of Campus account" : "Create your fellow account"}
      </h1>
      <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight, textAlign: "center", margin: "0 0 32px" }}>
        {mode === "login" ? "Welcome back." : "Join the Talent Nation Project Hub."}
      </p>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {mode === "signup" && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[["fellow", "I'm a Fellow"], ["mentor", "I'm a Mentor"], ["head", "I'm a Head of Campus"]].map(([val, label]) => (
              <button
                key={val}
                type="button"
                onClick={() => setMemberType(val)}
                className="tn-body"
                style={{
                  flex: "1 1 120px", padding: "12px 10px", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
                  border: `1.5px solid ${memberType === val ? C.teal : C.line}`,
                  background: memberType === val ? C.tealPale : C.white,
                  color: memberType === val ? C.tealDeep : C.slate,
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}
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
        {mode === "signup" && (
          <input
            value={discordName}
            onChange={(e) => setDiscordName(e.target.value)}
            placeholder="Discord username (optional, you can connect Discord after signing up)"
            className="tn-body"
            style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14 }}
          />
        )}
        {mode === "signup" && memberType === "head" && (
          <>
            <select
              value={requestedCampus}
              onChange={(e) => setRequestedCampus(e.target.value)}
              required
              className="tn-body"
              style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14, background: C.white, color: requestedCampus ? C.ink : C.slateLight }}
            >
              <option value="">Which campus will you lead?</option>
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <textarea
              value={headNote}
              onChange={(e) => setHeadNote(e.target.value)}
              placeholder="Tell us briefly about yourself and why you should lead this campus"
              rows={3}
              className="tn-body"
              style={{ padding: "12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14, resize: "vertical", fontFamily: "inherit" }}
            />
            <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0 }}>
              Head of Campus accounts are reviewed. You can log in right away, and you'll become Head once the Talent Nation team approves your request.
            </p>
          </>
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
        {mode === "signup" && (
          <p className="tn-body" style={{ fontSize: 12.5, color: C.slateLight, margin: 0, lineHeight: 1.5 }}>
            Use a strong password: 8+ characters with letters, numbers and a symbol.
          </p>
        )}
        <div style={{ position: "relative" }}>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="tn-body"
            style={{ padding: "12px 44px 12px 14px", borderRadius: 10, border: `1px solid ${C.line}`, fontSize: 14, width: "100%", boxSizing: "border-box" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", padding: 6, cursor: "pointer", color: C.slateLight, display: "flex" }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {mode === "signup" && password && (() => {
          const st = passwordStrength(password);
          return (
            <div>
              <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} style={{ flex: 1, height: 5, borderRadius: 3, background: st.score >= n ? st.color : C.line }} />
                ))}
              </div>
              <p className="tn-body" style={{ fontSize: 12.5, fontWeight: 600, color: st.color, margin: 0 }}>
                Password strength: {st.label}
              </p>
            </div>
          );
        })()}
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
