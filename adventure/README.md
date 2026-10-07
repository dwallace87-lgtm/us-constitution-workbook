# Can the New Country Survive?

A standalone historical decision adventure about the Articles of Confederation and Shays’ Rebellion. Serve `adventure/index.html` through the repository’s static server. No build, package installation, backend, or remote assets are needed.

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

The new adventure is served at `/adventure/`. The existing workbook remains at `/`.

## Learning design

35 authored scenes: five introductory screens, six scenes for each of three roles, seven concluding screens, and five corrective loops. A normal path contains 18 substantive screens. Allow about 35 minutes plus discussion. Characters and personal choices are fictional; History Checks preserve documented events. Meter effects are simplified modeling, not historical measurements or grades.

Mastery is separate from strategy: Articles revenue (1), Massachusetts causes versus national context (2), Knox/Jefferson source interpretation (1), reform chronology (1), constitutional comparison (2), causal chain (3). Retries have no penalty. Constitutional comparison explicitly preserves Congress’s existing war-related powers under the Articles. Jefferson’s November 1787 letter is labeled as a later reflection, not a pre-Springfield communication.

Content and source metadata are in `scenes.js`, navigation and assessments in `app.js`, styling in `style.css`. Historical source links point to the National Archives, Library of Congress, and National Park Service. Quotations and plain-language paraphrases are labeled separately. Sources open only when requested; the adventure itself does not fetch external resources. The sidebar map is decorative and explicitly schematic. No manuscript facsimiles or invented archival imagery are included.

## Classroom use and accessibility

Choose Farmer/Veteran for a concrete first journey, or assign all three roles across a class. Debrief why Massachusetts grievances caused the rebellion and why the rebellion intensified an existing national reform movement. Role-play choices have no “good” or “bad” grade.

Buttons, form labels, native dialogs, visible focus, textual meter values, reduced-motion support, responsive layouts, and untimed decisions support keyboard and mobile use. “Read to me” uses browser speech synthesis and supports pause/stop; installed voices and browser support vary. This is not a claim of an independently audited WCAG certification.

Progress and the exit reflection are saved anonymously in this browser’s localStorage. Storage failure falls back to session-only state. No accounts, analytics, teacher dashboard, or LMS grade submission are implemented. Students may print a summary or download a JSON learning record for their teacher. Start over asks before clearing only this adventure’s progress. For sensitive reflections on shared devices, download or print the result and then start over.

The optional source links require access to `archives.gov`, `www.archives.gov`, `www.loc.gov`, `founders.archives.gov`, and `www.nps.gov`; those domains are unnecessary for the offline story. No deployment or push to GitHub is performed by this implementation.
