/* ---------------------------------- tokens --------------------------------- */

export const C = {
  // Talent Nation palette: exact brand blue #1B1092 (sampled from the Learn2Earn dashboard) with orange accent.
  ink: "#1B1092", inkSoft: "#2629B7",
  paper: "#F9F9FB", paperDeep: "#EEEEF6",
  gold: "#FF6000", goldDeep: "#CC4D00", goldPale: "#FFEADB",
  teal: "#1B1092", tealDeep: "#130A6B", tealPale: "#E9E7F7",
  slate: "#45466B", slateLight: "#7B7D9C",
  line: "#E1E1E2", white: "#FFFFFF",
  danger: "#C24545", dangerPale: "#FBEAEA",
};

export const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  .tn-display { font-family: 'Space Grotesk', sans-serif; }
  .tn-body { font-family: 'Inter', sans-serif; }

  /* Use the whole screen. The starter CSS that came with Vite squeezed the
     site into a narrow, centred box; these rules undo that. */
  html, body { margin: 0; padding: 0; width: 100%; }
  body { display: block !important; place-items: initial !important; min-width: 0 !important; background: #F9F9FB; }
  #root { max-width: none !important; width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
  img { max-width: 100%; }

  /* Tablets: fixed grids drop to two columns */
  @media (max-width: 900px) {
    [style*="grid-template-columns"]:not([style*="auto-fi"]) { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
  }
  /* Phones: one column, a little less padding */
  @media (max-width: 560px) {
    [style*="grid-template-columns"]:not([style*="auto-fi"]) { grid-template-columns: minmax(0, 1fr) !important; }
    [style*="grid-template-columns: repeat(4"]:not([style*="auto-fi"]) { grid-template-columns: repeat(2, minmax(0, 1fr)) !important; }
    h1.tn-display { font-size: 28px !important; }
    h2.tn-display { font-size: 26px !important; }
  }
`;
