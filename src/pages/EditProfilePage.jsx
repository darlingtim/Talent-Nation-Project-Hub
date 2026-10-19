import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { CAMPUSES } from "../lib/data";
import { Avatar, Field, GhostButton, PhotoLightbox, PrimaryButton, SectionHeading, inputStyle } from "../components/ui";
import { C } from "../lib/theme";

/* ------------------------------------- edit profile -------------------------------------- */

export function EditProfilePage({ go, session, profile, onSaved, isMentor }) {
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [campusSlug, setCampusSlug] = useState("");
  const [bio, setBio] = useState("");
  const [skillsText, setSkillsText] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState(null);
  const [showPhoto, setShowPhoto] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    const { error: rpcError } = await supabase.rpc("delete_my_account");
    if (rpcError) {
      setDeleting(false);
      setDeleteError(`Could not delete your account: ${rpcError.message}`);
      return;
    }
    await supabase.auth.signOut();
    window.location.reload(); // start fresh on the home page
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file || null);
    setPhotoPreview(file ? URL.createObjectURL(file) : null);
  };

  // Fill the form from whatever's already on the profile the first time it
  // becomes available (App loads it once on login, so this runs once).
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name || "");
    setUserName(profile.user_name || "");
    setTitle(profile.title || "");
    setCity(profile.city || "");
    const campus = CAMPUSES.find((c) => c.dbId === profile.campus_id);
    setCampusSlug(campus?.id || "");
    setBio(profile.bio || "");
    setSkillsText((profile.skills || []).join(", "));
    setLinkedinUrl(profile.linkedin_url || "");
    setGithubUrl(profile.github_url || "");
    setExistingPhotoUrl(profile.avatar_url || null);
    // Discord username lives in a private table (only you can read it).
    supabase
      .from("member_private")
      .select("discord_username")
      .eq("user_id", profile.id)
      .maybeSingle()
      .then(({ data }) => setDiscordName(data?.discord_username || ""));
  }, [profile?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!fullName) {
      setError("Please enter your name.");
      return;
    }
    const campus = CAMPUSES.find((c) => c.id === campusSlug);
    setSaving(true);

    // Upload a new profile picture if one was chosen (reuses the existing
    // public "project_image" bucket, with an "avatar-" filename prefix).
    let avatarUrl = existingPhotoUrl;
    if (photoFile) {
      const fileExt = photoFile.name.split(".").pop();
      const fileName = `avatar-${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("project_image").upload(fileName, photoFile);
      if (uploadError) {
        setSaving(false);
        setError(`Picture upload failed: ${uploadError.message}`);
        return;
      }
      const { data: urlData } = supabase.storage.from("project_image").getPublicUrl(fileName);
      avatarUrl = urlData.publicUrl;
    }

    const { error: saveError } = await supabase
      .from("profiles")
      .update({
        avatar_url: avatarUrl,
        full_name: fullName,
        user_name: userName || null,
        ...(isMentor ? { title: title || null } : {}),
        city: city || null,
        campus_id: campus?.dbId || null,
        bio: bio || null,
        skills: skillsText.split(",").map((s) => s.trim()).filter(Boolean),
        linkedin_url: linkedinUrl || null,
        github_url: githubUrl || null,
      })
      .eq("id", session.user.id);
    if (!saveError) {
      const { error: privError } = await supabase
        .from("member_private")
        .upsert({ user_id: session.user.id, discord_username: discordName.trim() || null });
      if (privError) {
        setSaving(false);
        setError(`Profile saved, but Discord username failed: ${privError.message}`);
        return;
      }
    }
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    onSaved?.();
    go("dashboard");
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 96px" }}>
      <SectionHeading eyebrow="Your profile" title="Edit profile" sub="This is what other fellows see when they look you up." />
      <form onSubmit={handleSubmit} style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Profile picture">
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              onClick={() => (photoPreview || existingPhotoUrl) && setShowPhoto(true)}
              style={{ cursor: (photoPreview || existingPhotoUrl) ? "zoom-in" : "default" }}
            >
              <Avatar name={fullName || "Fellow"} size={140} hue={C.teal} photo={photoPreview || existingPhotoUrl} />
            </div>
            {showPhoto && <PhotoLightbox src={photoPreview || existingPhotoUrl} onClose={() => setShowPhoto(false)} />}
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="tn-body" style={{ fontSize: 13.5 }} />
          </div>
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Full name *">
            <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="tn-body" style={inputStyle} />
          </Field>
          <Field label="Username">
            <input value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="e.g. amakaobi" className="tn-body" style={inputStyle} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMentor ? "1fr 1fr" : "1fr", gap: 14 }}>
          {isMentor && (
            <Field label="Title">
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" className="tn-body" style={inputStyle} />
            </Field>
          )}
          <Field label="City">
            <input value={city} onChange={(e) => setCity(e.target.value)} className="tn-body" style={inputStyle} />
          </Field>
        </div>
        <Field label="Campus">
          <select value={campusSlug} onChange={(e) => setCampusSlug(e.target.value)} className="tn-body" style={inputStyle}>
            <option value="">Select a campus</option>
            {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Discord username (private, used for notifications)">
          <input value={discordName} onChange={(e) => setDiscordName(e.target.value)} placeholder="e.g. amakaobi" className="tn-body" style={inputStyle} />
        </Field>
        <Field label="Bio">
          <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} className="tn-body" style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="Skills (comma-separated)">
          <input value={skillsText} onChange={(e) => setSkillsText(e.target.value)} placeholder="React, Node.js, Figma" className="tn-body" style={inputStyle} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="LinkedIn link">
            <input value={linkedinUrl} onChange={(e) => setLinkedinUrl(e.target.value)} placeholder="https://linkedin.com/in/…" className="tn-body" style={inputStyle} />
          </Field>
          <Field label="GitHub link">
            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/…" className="tn-body" style={inputStyle} />
          </Field>
        </div>

        {error && <p className="tn-body" style={{ fontSize: 13, color: C.danger, margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <GhostButton small onClick={() => go("dashboard")}>Cancel</GhostButton>
          <PrimaryButton small disabled={saving}>{saving ? "Saving…" : "Save profile"}</PrimaryButton>
        </div>
      </form>

      <div style={{ marginTop: 40, paddingTop: 24, borderTop: `1px solid ${C.line}` }}>
        <p className="tn-display" style={{ fontSize: 15, fontWeight: 700, color: C.danger, margin: "0 0 6px" }}>Delete account</p>
        <p className="tn-body" style={{ fontSize: 13, color: C.slate, margin: "0 0 14px" }}>
          This permanently removes your profile, your projects and your login. It cannot be undone.
        </p>
        {!showDelete ? (
          <GhostButton small onClick={() => setShowDelete(true)} style={{ color: C.danger, borderColor: C.danger }}>Delete my account…</GhostButton>
        ) : (
          <div style={{ border: `1px solid ${C.danger}`, background: C.dangerPale, borderRadius: 12, padding: 16 }}>
            <p className="tn-body" style={{ fontSize: 13, color: C.slate, margin: "0 0 10px" }}>
              Type <b>DELETE</b> to confirm.
            </p>
            <input
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              placeholder="DELETE"
              className="tn-body"
              style={{ ...inputStyle, marginBottom: 12 }}
            />
            {deleteError && <p className="tn-body" style={{ fontSize: 13, color: C.danger, margin: "0 0 10px" }}>{deleteError}</p>}
            <div style={{ display: "flex", gap: 10 }}>
              <GhostButton small onClick={() => { setShowDelete(false); setDeleteConfirm(""); setDeleteError(""); }}>Cancel</GhostButton>
              <GhostButton small disabled={deleteConfirm !== "DELETE" || deleting} onClick={handleDeleteAccount} style={{ color: C.danger, borderColor: C.danger }}>
                {deleting ? "Deleting…" : "Permanently delete"}
              </GhostButton>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
