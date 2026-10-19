import { C } from "./theme";

/* --------------------------------- auth pages ----------------------------------- */

/* password strength: returns 0-4 plus a label and colour */
export function passwordStrength(pw) {
  if (!pw) return { score: 0, label: "", color: C.line };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (/^(.)\1+$/.test(pw) || /^(123456|password|qwerty|abcdef)\d*$/i.test(pw)) score = Math.min(score, 1);
  if (pw.length < 8) score = Math.min(score, 1);
  const level = Math.min(4, score);
  const map = [
    { label: "Too weak", color: C.danger },
    { label: "Weak", color: C.danger },
    { label: "Fair, add more variety", color: C.gold },
    { label: "Good", color: C.teal },
    { label: "Strong", color: "#1E8E5A" },
  ];
  return { score: level, ...map[level] };
}
