# Conversation Study

An interactive visual prototype for the next fortheplot.today experience.

The existing root homepage is unchanged. This prototype lives in `conversation/` on `codex/curated-conversation`. `npm run build` packages it as a separate preview in `dist/`; the Sites hosting manifest is for that preview, not the existing custom domain.

Run `npm install`, `npm run build`, then `npm run dev` to see it at the local URL printed by the server.

## Scope

The experience opens with a blank chat, not an existing or staged conversation. Two optional openings explore demand versus monetization and judgment after a leadership decision. Choosing one fills an editable draft; it does not send. Openings disappear while the visitor writes. Relevant follow-ups use the same draft-first behavior.

The composition uses a writing surface, the original wordmark, a real Tripboard thumbnail, and music from the existing site. Project evidence opens without disturbing the conversation or draft. The conversation, stop action, reset, copying, focus return, reduced motion, and mobile layout are implemented.

Replies are deliberately scripted and visibly identified as sample replies. The scenarios reflect observations in the supplied project brief, not a validated behavioral model. Arbitrary questions receive a candid fallback. The project panel describes public Tripboard facts, without inventing personal history.

There is no model API, private evidence retrieval, authentication, analytics, persistence, or contact collection. Messages exist only in memory in the current browser tab. This is a design review surface; its illustrative responses must not become behavioral ground truth.

## Color Direction

The color pass separates surface, reading, identity, and interaction roles instead of tinting every element with the same hue. `--canvas` is a low-chroma cool background; `--signature` is blue ink for the name, wordmark, and secondary links; `--accent` is warm vermilion for input focus, the caret, and the enabled send action. Body text stays neutral. Evidence is shown on white, and disabled actions do not retain the active accent. Hover underlines, icons, labels, native disabled states, and focus outlines keep meaning independent of hue.

This is a testable art-direction choice, not a psychological claim about Atharva. [Albers's contextual approach](https://www.albersfoundation.org/alberses/teaching/interaction-of-color) and [Schloss and Palmer's distinction between harmony, preference, and figure/background preference](https://palmerlab.berkeley.edu/pdf/Schloss%26Palmer%282011%29.pdf) informed composition. [IBM's purposeful color roles](https://www.ibm.com/design/language/color/) informed consistent application, not the selection of IBM's palette. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) provide the measurable constraints.

Computed foreground/background ratios: reading text 13.98:1, reply body 9.98:1, secondary text 5.88:1, signature 6.77:1, placeholder 7.53:1, enabled send icon 5.03:1, and the input boundary 3.06:1. These are focused palette checks, not a claim of complete accessibility compliance.

## Design Questions

- Does the opening make it natural to start with a problem or a point of view?
- Can someone experience a position changing when new context arrives?
- Does opening work help the discussion while preserving the reader's place?
- Do the typography, music, and actual work give the experience a recognizable character without competing with the chat?

The next iteration should be driven by Atharva's reactions to these concrete states and his own authored responses.
