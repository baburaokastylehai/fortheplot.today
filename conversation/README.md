# Conversation Study

An interactive visual prototype for the next fortheplot.today experience.

The existing root homepage is unchanged. This prototype lives in `conversation/` on `codex/curated-conversation`. `npm run build` packages it as a separate preview in `dist/`; the Sites hosting manifest is for that preview, not the existing custom domain.

Run `npm install`, `npm run build`, then `npm run dev` to see it at the local URL printed by the server.

## Scope

The experience opens with a blank chat, not an existing or staged conversation. Two optional openings explore demand versus monetization and judgment after a leadership decision. Choosing one fills an editable draft; it does not send. Openings disappear while the visitor writes. Relevant follow-ups use the same draft-first behavior.

The composition uses a writing surface, the original wordmark, a real Tripboard thumbnail, and music from the existing site. Project evidence opens without disturbing the conversation or draft. The conversation, stop action, reset, copying, focus return, reduced motion, and mobile layout are implemented.

Replies are deliberately scripted and visibly identified as sample replies. The scenarios reflect observations in the supplied project brief, not a validated behavioral model. Arbitrary questions receive a candid fallback. The project panel describes public Tripboard facts, without inventing personal history.

There is no model API, private evidence retrieval, authentication, analytics, persistence, or contact collection. Messages exist only in memory in the current browser tab. This is a design review surface; its illustrative responses must not become behavioral ground truth.

## Design Questions

- Does the opening make it natural to start with a problem or a point of view?
- Can someone experience a position changing when new context arrives?
- Does opening work help the discussion while preserving the reader's place?
- Do the typography, music, and actual work give the experience a recognizable character without competing with the chat?

The next iteration should be driven by Atharva's reactions to these concrete states and his own authored responses.
