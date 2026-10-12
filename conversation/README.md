# Conversation Study

An interactive visual prototype for the next fortheplot.today experience.

The existing root homepage is unchanged. This prototype lives in `conversation/` on `codex/curated-conversation`. `npm run build` packages it as a separate preview in `dist/`; the Sites hosting manifest is for that preview, not the existing custom domain.

Run `npm install`, `npm run build`, then `npm run dev` to see it at the local URL printed by the server.

## Scope

The experience opens with a blank chat, not an existing or staged conversation. Two optional openings explore demand versus monetization and judgment after a leadership decision. Choosing one fills an editable draft; it does not send. Openings disappear while the visitor writes. Relevant follow-ups use the same draft-first behavior.

The opening removes the large personal-name header, subtitle, and textual about action. A small site wordmark provides orientation; an information icon opens the model and privacy disclosure. The footer contains an actual Vienna playback control and a real Tripboard thumbnail, without decorative captions. Project evidence opens without disturbing the conversation or draft. The conversation, stop action, reset, copying, focus return, reduced motion, and mobile layout are implemented.

Replies are deliberately scripted and visibly identified as sample replies. The scenarios reflect observations in the supplied project brief, not a validated behavioral model. Arbitrary questions receive a candid fallback. The project panel describes public Tripboard facts, without inventing personal history.

There is no model API, private evidence retrieval, authentication, first-party analytics, persistence, or contact collection. Messages exist only in memory in the current browser tab. This is a design review surface; its illustrative responses must not become behavioral ground truth.

## Music

Selecting Vienna lazily loads Spotify's iframe API and its track player. No player requests or playback occur before that action. Play/pause states follow provider playback events, not click assumptions; closing destroys the player and preserves the chat draft. A player control remains available in the header during a conversation. Spotify may supply a preview rather than full-track playback. The preview played and its position advanced in browser QA; pause, resume, and close were exercised.

The original YouTube audio upload and the newer official Vienna video both returned error 150 (embedding disabled) in local testing. The final version uses Spotify, not a hidden YouTube iframe. There is no downloaded or redistributed song asset. For uninterrupted, audio-only background playback, an authorized audio source still needs to be supplied. [Spotify iframe API](https://developer.spotify.com/documentation/embeds/references/iframe-api).

## Color Direction

The current direction tests Atharva's midnight navy, warm gray, and crimson proposal. `--canvas` is midnight navy; `--ink` and `--body` are warm light neutrals; `--accent` is crimson for input focus, the caret, and the enabled send action. The wordmark and secondary links use warm neutral ink. Evidence uses a slightly raised dark surface. Disabled actions do not retain the active accent. Hover underlines, icons, labels, native disabled states, and focus outlines keep meaning independent of hue. There is no cinematic image or gradient.

This is a testable art-direction choice, not a psychological claim about Atharva. [Albers's contextual approach](https://www.albersfoundation.org/alberses/teaching/interaction-of-color) and [Schloss and Palmer's distinction between harmony, preference, and figure/background preference](https://palmerlab.berkeley.edu/pdf/Schloss%26Palmer%282011%29.pdf) informed composition. [IBM's purposeful color roles](https://www.ibm.com/design/language/color/) informed consistent application, not the selection of IBM's palette. [WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html) and [non-text contrast](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) provide the measurable constraints.

Computed foreground/background ratios: reading text 15.42:1, reply body 12.69:1, secondary text 7.50:1, placeholder 10.40:1, enabled send icon 4.08:1, and input boundary 4.58:1. Text clears 4.5:1; icon/boundary roles clear 3:1. These are focused palette checks, not a claim of complete accessibility compliance.

## Design Questions

- Does the opening make it natural to start with a problem or a point of view?
- Can someone experience a position changing when new context arrives?
- Does opening work help the discussion while preserving the reader's place?
- Do the typography, music, and actual work give the experience a recognizable character without competing with the chat?

The next iteration should be driven by Atharva's reactions to these concrete states and his own authored responses.
