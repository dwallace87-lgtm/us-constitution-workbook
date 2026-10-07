# Can the New Country Survive?

The arcade-style historical decision adventure supplied by the user, adopted as the baseline for this site. It combines animated pixel-art scenes, role-selection portraits, a sticky simulation HUD, optional sound cues, source cards, an evidence notebook, keyboard shortcuts, and a final mission report.

## Run

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit the `/adventure/` path on that server. Everything is in `adventure/index.html`; no installation, build, or backend is needed. Google Fonts are optional; local font fallbacks keep the adventure playable when those requests are unavailable. The original workbook remains at `/`.

## Historical and classroom design

35 authored nodes: five introductory screens, six for each of three roles, seven concluding screens, and five corrective loops. A typical route contains 18 substantive scenes plus the title and mission report. Characters and personal decisions are fictional. History Checks preserve the documented outcome at Springfield and distinguish Massachusetts grievances from national fiscal and coordination problems. Sources present both Knox and Jefferson's interpretations, not one definitive verdict.

Use Farmer/Veteran for a concrete first journey or assign all three roles across a class. Allow about 35 minutes plus debrief. The teacher guide is available from the title screen.

Knowledge, not role-play strategy, earns the ten mastery points: Articles revenue (1), causes/context (2), source interpretation (1), chronology (1), constitutional sort (2), and causal chain (3). The uploaded version's first-attempt-only scoring has been corrected: retries can earn full mastery, including revisions to the sort and causal chain. Simulation indicators are not historical statistics or grades. Congress already possessed important war-related powers under the Articles; the Constitution comparison acknowledges this.

## Browser features

Progress, name, and exit reflection stay in this browser's localStorage. No accounts, analytics, teacher dashboard, or automatic LMS submission are included. Copy the mission report to share it where the teacher requests. Storage failures show a warning and allow continued play for the current visit; malformed saved state is ignored safely. Shared-device users should clear their saved game when finished.

Tab and Enter operate buttons; number keys 1–4 choose available story options; Escape closes popovers and source/notebook dialogs. Reduced-motion preferences disable pixel-art animation. Optional sound starts off. Read-to-me uses browser speech synthesis with pause/resume and stop controls; installed voices and browser support vary.

The site was tested with Chromium through all three paths and all 35 nodes, including wrong answers, retries, source gates, save/resume, input escaping, mobile layout, keyboard navigation, and unavailable storage. This does not constitute an independently audited accessibility certification.

Source links require external network access only when opened. The main adventure, artwork, story, assessments, and excerpts render locally. See source-card metadata and links for National Archives and Founders Online records.
