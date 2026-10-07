# Can the New Country Survive?

The newest user-supplied arcade adventure, with a conversational American-English revision across 52 narrative passages and selected fictional dialogue/choices. Primary-source definitions and the glossary remain exactly as supplied. The pixel art, character files, expanded historical aftermath, feelings checks, values choices, and journals are retained.

## Run

From the repository root:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit `/adventure/` on that server. Everything is in `adventure/index.html`; no installation, build, or backend is needed. Google Fonts are optional, with local fallbacks. The original workbook remains at `/`.

## Learning design

53 authored scenes across three perspectives, including a Daniel Shays prologue, productive dead ends, role-play conversations, feelings/values choices, journals, historical convergence, evidence checks, and a personal connection. Allow about 50–55 minutes plus discussion; the title-screen teacher guide suggests a two-day option.

Fictional dialogue uses a contemporary voice, while key terms such as sovereignty, requisition, legislature, militia, arsenal, amnesty, and Articles of Confederation retain their historical meaning. Primary-source quotations are unchanged. Player choices cannot reopen the historically closed Northampton court or change the Springfield outcome. The Constitution comparison preserves Congress’s existing war-related powers under the Articles.

Ten mastery points come from knowledge: Articles revenue (1), causes/context (1), financing the state response (1), source interpretation (1), reform chronology (1), constitutional comparison (2), causal chain (3). Retries can earn full mastery. Feelings, values, Hope/Trust/Tension simulation indicators, and role-play decisions are never graded.

## Progress, reflection, and accessibility

Progress, names, feelings, values, and writing stay in this browser’s localStorage. Nothing is automatically sent to a teacher or server. “Copy my report” includes role-play journals and the exit ticket; the final personal reflection is excluded unless the learner checks its explicit inclusion box. It may also be skipped. Shared-device users should clear their saved game after copying their results.

Malformed saved data is ignored safely. Storage failures show a notice and still allow play for the current visit. Names and writing are escaped when rendered.

Tab and Enter operate buttons. Number keys 1–4 choose available story options; Escape closes dialogs and popovers. Reduced-motion preferences disable pixel-art animation. Sound starts off. Browser speech synthesis offers read, pause/resume, and stop; browser voices vary.

All three paths and all 53 scenes were tested, including corrective loops, source/character-file gates, feelings/values/journals, mastery retries, private-reflection inclusion and exclusion, save/resume, input escaping, keyboard navigation, mobile layout, and malformed/unavailable storage. This is not an independently audited accessibility certification.

Source links are optional external references to archival records and historical research. The story, excerpts, assessments, and pixel art render locally. The Moses Sash source links to the Worthington Historical Society.
