import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Plus } from "lucide-react";
import { CAMPUSES, CATEGORIES, STATUSES } from "../lib/data";
import { C } from "../lib/theme";
import { Field, GhostButton, PrimaryButton, SectionHeading, inputStyle } from "../components/ui";

export function SubmitProjectPage({ go, session, onSubmitted, editId, isMentor, profile, mentorCampusId }) {
  const [title, setTitle] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [fullDesc, setFullDesc] = useState("");
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [campusSlug, setCampusSlug] = useState("");
  const [status, setStatus] = useState("Ongoing");
  const [year, setYear] = useState(new Date().getFullYear());
  const [techText, setTechText] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(!!editId);

  // Editing an existing project: load its current data into the form.
  useEffect(() => {
    if (!editId) {
      setLoadingExisting(false);
      return;
    }
    setLoadingExisting(true);
    supabase
      .from("projects")
      .select("*")
      .eq("id", editId)
      .single()
      .then(({ data, error: fetchError }) => {
        setLoadingExisting(false);
        if (fetchError || !data) {
          setError("Couldn't load that project to edit it.");
          return;
        }
        const campus = CAMPUSES.find((c) => c.dbId === data.campus_id);
        setTitle(data.title || "");
        setShortDesc(data.short_description || "");
        setFullDesc(data.full_description || "");
        setProblem(data.problem_statement || "");
        setSolution(data.solution || "");
        if (data.category && !CATEGORIES.includes(data.category)) {
          setCategory("Others");
          setCustomCategory(data.category);
        } else {
          setCategory(data.category || "");
        }
        setCampusSlug(campus?.id || "");
        setStatus(data.status || "Ongoing");
        setYear(data.year || new Date().getFullYear());
        setTechText((data.technologies || []).join(", "));
        setGithubUrl(data.github_url || "");
        setDemoUrl(data.demo_url || "");
        setExistingCoverUrl(data.cover_image_url || null);
      });
  }, [editId]);

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverFile(file || null);
    setCoverPreview(file ? URL.createObjectURL(file) : null);
  };

  const slugify = (s) =>
    s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now().toString(36);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const finalCategory = category === "Others" ? customCategory.trim() : category;
    let campus = null;
    if (isMentor) {
      // Mentors and Heads only upload a portfolio: picture + links.
      if (!demoUrl.trim()) {
        setError("Please add the link to your live portfolio so people can view it.");
        return;
      }
      if (!coverFile && !existingCoverUrl) {
        setError("Please add a picture of your portfolio.");
        return;
      }
    } else {
      if (!title || !shortDesc || !category || !campusSlug) {
        setError("Please fill in the project title, short description, category, and campus.");
        return;
      }
      if (category === "Others" && !finalCategory) {
        setError("Please type your category.");
        return;
      }
      campus = CAMPUSES.find((c) => c.id === campusSlug);
      if (!campus?.dbId) {
        setError("That campus isn't available right now — try refreshing the page.");
        return;
      }
    }

    setSubmitting(true);

    // If a new cover photo was picked, upload it to Storage first and get
    // back a public URL. Otherwise keep whatever cover the project already
    // had (important when editing: no new file shouldn't mean "remove it").
    let coverImageUrl = existingCoverUrl;
    if (coverFile) {
      const fileExt = coverFile.name.split(".").pop();
      const fileName = `${session.user.id}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("project_image").upload(fileName, coverFile);
      if (uploadError) {
        setSubmitting(false);
        setError(`Image upload failed: ${uploadError.message}`);
        return;
      }
      const { data: urlData } = supabase.storage.from("project_image").getPublicUrl(fileName);
      coverImageUrl = urlData.publicUrl;
    }

    const mentorName = profile?.full_name || session.user.user_metadata?.full_name || "Mentor";
    const portfolioTitle = title || `${mentorName}'s portfolio`;
    const payload = isMentor ? {
      title: portfolioTitle,
      slug: slugify(portfolioTitle),
      short_description: shortDesc || "Mentor portfolio",
      category: "Portfolio",
      campus_id: mentorCampusId || null,
      status: "Completed",
      year: Number(year) || new Date().getFullYear(),
      is_portfolio: true,
      technologies: techText.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: githubUrl || null,
      demo_url: demoUrl.trim() ? (/^https?:\/\//i.test(demoUrl.trim()) ? demoUrl.trim() : `https://${demoUrl.trim()}`) : null,
      cover_image_url: coverImageUrl,
    } : {
      title,
      slug: slugify(title),
      short_description: shortDesc,
      full_description: fullDesc,
      problem_statement: problem,
      solution,
      category: finalCategory,
      campus_id: campus.dbId,
      status,
      year: Number(year),
      technologies: techText.split(",").map((t) => t.trim()).filter(Boolean),
      github_url: githubUrl || null,
      demo_url: demoUrl.trim() ? (/^https?:\/\//i.test(demoUrl.trim()) ? demoUrl.trim() : `https://${demoUrl.trim()}`) : null,
      cover_image_url: coverImageUrl,
      // Editing a declined project sends it back to the mentors for review.
      ...(editId ? { rejected: false, rejection_reason: null } : {}),
    };

    const { error: saveError } = editId
      ? await supabase.from("projects").update(payload).eq("id", editId).eq("created_by", session.user.id)
      : await supabase.from("projects").insert({ ...payload, created_by: session.user.id });
    setSubmitting(false);

    if (saveError) {
      setError(saveError.message);
      return;
    }
    onSubmitted?.();
    go("dashboard");
  };

  if (loadingExisting) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 96px" }}>
        <p className="tn-body" style={{ fontSize: 13.5, color: C.slateLight }}>Loading…</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "40px 24px 96px" }}>
      <SectionHeading
        eyebrow={editId ? "Edit submission" : isMentor ? "New portfolio" : "New submission"}
        title={editId ? (isMentor ? "Edit portfolio" : "Edit project") : isMentor ? "Upload portfolio" : "Submit a project"}
        sub={editId ? (isMentor ? "Update your portfolio details below." : "Update your project's details below.") : isMentor ? "Add a picture of your portfolio and the link to it. Portfolios appear on your profile, not in Spotlight or Explore." : "Add your project to the Project Hub. An admin will review it before it's featured publicly."}
      />
      <form onSubmit={handleSubmit} style={{ border: `1px solid ${C.line}`, borderRadius: 16, padding: 28, display: "flex", flexDirection: "column", gap: 18 }}>
        {!isMentor && (
          <>
        <Field label="Project title *">
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="tn-body" style={inputStyle} />
        </Field>
        <Field label="Short description *">
          <input value={shortDesc} onChange={(e) => setShortDesc(e.target.value)} placeholder="One or two sentences" className="tn-body" style={inputStyle} />
        </Field>
        <Field label="Full description">
          <textarea value={fullDesc} onChange={(e) => setFullDesc(e.target.value)} rows={4} className="tn-body" style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="Problem statement">
          <textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={2} className="tn-body" style={{ ...inputStyle, resize: "vertical" }} />
        </Field>
        <Field label="Proposed solution">
          <textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={2} className="tn-body" style={{ ...inputStyle, resize: "vertical" }} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Category *">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="tn-body" style={inputStyle}>
              <option value="">Select a category</option>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              <option value="Others">Others</option>
            </select>
            {category === "Others" && (
              <input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Type your category"
                className="tn-body"
                style={{ ...inputStyle, marginTop: 8 }}
                autoFocus
              />
            )}
          </Field>
          <Field label="Campus *">
            <select value={campusSlug} onChange={(e) => setCampusSlug(e.target.value)} className="tn-body" style={inputStyle}>
              <option value="">Select a campus</option>
              {CAMPUSES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Status">
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="tn-body" style={inputStyle}>
              {STATUSES.map((s) => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Year">
            <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="tn-body" style={inputStyle} />
          </Field>
        </div>
          </>
        )}

        {isMentor ? (
          <Field label="Portfolio picture">
            <label
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
                width: "100%", aspectRatio: "16 / 9", borderRadius: 14, overflow: "hidden", cursor: "pointer",
                border: `2px dashed ${C.line}`, background: C.paperDeep, position: "relative", boxSizing: "border-box",
              }}
            >
              {(coverPreview || existingCoverUrl) ? (
                <>
                  <img src={coverPreview || existingCoverUrl} alt="Portfolio preview" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  <span className="tn-body" style={{ position: "absolute", right: 12, bottom: 12, background: "rgba(27,16,146,0.85)", color: C.white, fontSize: 12.5, fontWeight: 600, padding: "6px 12px", borderRadius: 999 }}>
                    Change picture
                  </span>
                </>
              ) : (
                <>
                  <Plus size={28} color={C.slateLight} />
                  <span className="tn-body" style={{ fontSize: 14, fontWeight: 600, color: C.slate }}>Click to add a wide picture of your portfolio</span>
                  <span className="tn-body" style={{ fontSize: 12.5, color: C.slateLight }}>Landscape works best, for example 1600 × 900</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleCoverChange} style={{ display: "none" }} />
            </label>
          </Field>
        ) : (
          <Field label="Project picture">
            <input type="file" accept="image/*" onChange={handleCoverChange} className="tn-body" style={{ fontSize: 13.5 }} />
            {(coverPreview || existingCoverUrl) && (
              <img src={coverPreview || existingCoverUrl} alt="Preview" style={{ marginTop: 10, width: "100%", maxHeight: 180, objectFit: "cover", borderRadius: 10, border: `1px solid ${C.line}` }} />
            )}
          </Field>
        )}

        <Field label="Technologies (comma-separated)">
          <input value={techText} onChange={(e) => setTechText(e.target.value)} placeholder="React, Node.js, PostgreSQL" className="tn-body" style={inputStyle} />
        </Field>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="GitHub link">
            <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/…" className="tn-body" style={inputStyle} />
          </Field>
          <Field label={isMentor ? "Live portfolio link *" : "Live demo link"}>
            <input value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder={isMentor ? "https://yourportfolio.com" : "https://…"} className="tn-body" style={inputStyle} />
          </Field>
        </div>

        {error && <p className="tn-body" style={{ fontSize: 13, color: C.danger, margin: 0 }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
          <GhostButton small onClick={() => go("dashboard")}>Cancel</GhostButton>
          <PrimaryButton small disabled={submitting}>{submitting ? "Saving…" : editId ? "Save changes" : isMentor ? "Upload portfolio" : "Submit project"}</PrimaryButton>
        </div>
      </form>
    </div>
  );
}
