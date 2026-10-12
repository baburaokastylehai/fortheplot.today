import { createIcons, ArrowUp, ArrowUpRight, ArrowRight, ArrowDown, Square, SquarePen, X, Copy, Check, Info } from 'lucide';
import { openings, respond } from './scenarios.js';

const icons = { ArrowUp, ArrowUpRight, ArrowRight, ArrowDown, Square, SquarePen, X, Copy, Check, Info };
const $ = selector => document.querySelector(selector);
const messages = $('#messages');
const input = $('#message-input');
const send = $('.send-button');
const stop = $('.stop-button');
const followups = $('.followups');
const latest = $('.latest-button');
const projectDialog = $('.evidence-dialog');
const aboutDialog = $('.about-dialog');
const state = { topic: null, running: false, follows: true, controller: null, id: 0 };
let lastScroll = window.scrollY;
let dialogTrigger = null;

function renderIcons() {
  document.querySelectorAll('[data-icon]').forEach(node => node.setAttribute('data-lucide', node.dataset.icon));
  createIcons({ icons, attrs: { 'aria-hidden': 'true' } });
}

function icon(name) {
  const el = document.createElement('i');
  el.dataset.icon = name;
  return el;
}

function announce(text) { $('#announcement').textContent = text; }

function resizeInput() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
  send.disabled = !input.value.trim();
  $('.welcome').hidden = document.body.classList.contains('is-conversing') || Boolean(input.value.trim());
  followups.hidden = state.running || Boolean(input.value.trim());
}

function bottom() { return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 70; }
function follow() {
  if (state.follows) window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' });
  latest.hidden = state.follows || bottom();
}

window.addEventListener('scroll', () => {
  if (window.scrollY < lastScroll - 3) state.follows = false;
  if (bottom()) state.follows = true;
  lastScroll = window.scrollY;
  latest.hidden = state.follows || !state.running && bottom();
}, { passive: true });

latest.addEventListener('click', () => { state.follows = true; follow(); });

function setRunning(running) {
  state.running = running;
  send.hidden = running;
  stop.hidden = !running;
  followups.hidden = running;
  resizeInput();
}

function addMessage(role, text = '') {
  const article = document.createElement('article');
  article.className = `message ${role}`;
  article.dataset.messageId = String(++state.id);
  const label = document.createElement('div');
  label.className = 'message-label';
  label.textContent = role === 'user' ? 'You' : 'Atharva / sample reply';
  const content = document.createElement('div');
  content.className = 'message-content';
  content.textContent = text;
  article.append(label, content);
  messages.append(article);
  return { article, content };
}

function showFollowups(items) {
  followups.replaceChildren();
  for (const text of items) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'followup';
    const label = document.createElement('span');
    label.textContent = text;
    button.append(label, icon('arrow-right'));
    button.addEventListener('click', () => setDraft(text));
    followups.append(button);
  }
  renderIcons();
}

function openDialog(dialog, trigger) {
  dialogTrigger = trigger || document.activeElement;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}

function closeDialog(dialog) { dialog.close(); }

for (const dialog of [projectDialog, aboutDialog]) {
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    dialogTrigger?.focus({ preventScroll: true });
    dialogTrigger = null;
  });
  dialog.addEventListener('click', event => {
    const bounds = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom)) closeDialog(dialog);
  });
}
$('.about-button').addEventListener('click', event => openDialog(aboutDialog, event.currentTarget));
$('.close-about').addEventListener('click', () => closeDialog(aboutDialog));
$('.close-evidence').addEventListener('click', () => closeDialog(projectDialog));
$('.discuss-project').addEventListener('click', () => {
  dialogTrigger = input;
  closeDialog(projectDialog);
  setDraft("Isn't no login a security risk?");
});

function addReplyActions(article, text, evidence) {
  const context = document.createElement('div');
  context.className = 'reply-context';
  if (evidence) {
    const source = document.createElement('button');
    source.type = 'button';
    source.className = 'evidence-link';
    source.append(document.createTextNode('A closer look at Tripboard'), icon('arrow-up-right'));
    source.addEventListener('click', event => { state.follows = false; openDialog(projectDialog, event.currentTarget); });
    context.append(source);
  }
  const copy = document.createElement('button');
  copy.type = 'button';
  copy.className = 'copy-reply icon-button';
  copy.setAttribute('aria-label', 'Copy reply');
  copy.dataset.tooltip = 'Copy reply';
  copy.append(icon('copy'));
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      copy.replaceChildren(icon('check'));
      copy.setAttribute('aria-label', 'Reply copied');
      copy.dataset.tooltip = 'Copied';
      announce('Reply copied');
      renderIcons();
      setTimeout(() => { copy.replaceChildren(icon('copy')); copy.setAttribute('aria-label', 'Copy reply'); copy.dataset.tooltip = 'Copy reply'; renderIcons(); }, 1700);
    } catch { announce('Copy unavailable. You can select and copy the reply.'); }
  });
  context.append(copy);
  article.append(context);
  renderIcons();
}

function tick(signal) {
  return new Promise(resolve => {
    const finish = () => { clearTimeout(timer); signal.removeEventListener('abort', finish); resolve(); };
    const timer = setTimeout(finish, 30);
    signal.addEventListener('abort', finish, { once: true });
  });
}

async function submitMessage(text) {
  text = text.trim();
  if (!text || text.length > 3000) return;
  if (state.running) cancelReply();
  const controller = new AbortController();
  state.controller = controller;
  state.follows = true;
  document.body.classList.add('is-conversing');
  $('.welcome').hidden = true;
  $('.conversation').hidden = false;
  if (input.value.trim() === text) input.value = '';
  resizeInput();
  followups.replaceChildren();
  addMessage('user', text);
  const { article, content } = addMessage('assistant');
  content.setAttribute('aria-hidden', 'true');
  setRunning(true);
  const result = respond(text, state);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (const paragraph of result.paragraphs) {
    if (controller.signal.aborted) break;
    const p = document.createElement('p');
    content.append(p);
    const words = paragraph.split(' ');
    for (let at = 0; at < words.length; at += reduced ? words.length : 5) {
      if (controller.signal.aborted) break;
      p.textContent = words.slice(0, at + (reduced ? words.length : 5)).join(' ');
      follow();
      if (!reduced) await tick(controller.signal);
    }
  }
  content.removeAttribute('aria-hidden');
  if (controller.signal.aborted) {
    const note = document.createElement('div');
    note.className = 'status-line';
    note.textContent = 'Reply stopped.';
    article.append(note);
  } else {
    addReplyActions(article, result.paragraphs.join('\n\n'), result.evidence);
    showFollowups(result.followups);
  }
  if (state.controller !== controller) return;
  setRunning(false);
  follow();
  announce(controller.signal.aborted ? 'Reply stopped' : 'Reply ready');
}

function cancelReply() { state.controller?.abort(); }
stop.addEventListener('click', cancelReply);
$('.composer').addEventListener('submit', event => { event.preventDefault(); submitMessage(input.value); });
input.addEventListener('input', resizeInput);
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey && !event.isComposing && !matchMedia('(pointer: coarse)').matches) {
    event.preventDefault();
    submitMessage(input.value);
  }
});
function setDraft(text) {
  input.value = text;
  resizeInput();
  input.focus({ preventScroll: true });
  input.setSelectionRange(text.length, text.length);
}
document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => setDraft(openings[button.dataset.scenario])));
$('.reset-button').addEventListener('click', () => {
  cancelReply();
  state.controller = null;
  state.topic = null;
  state.follows = true;
  input.value = '';
  messages.replaceChildren();
  followups.replaceChildren();
  document.body.classList.remove('is-conversing');
  $('.welcome').hidden = false;
  $('.conversation').hidden = true;
  latest.hidden = true;
  announce('New conversation');
  setRunning(false);
  window.scrollTo({ top: 0, behavior: 'instant' });
  input.focus({ preventScroll: true });
});

// Keep the composer above a mobile keyboard without resizing the reading surface.
function keyboardOffset() {
  const viewport = window.visualViewport;
  if (!viewport) return;
  const offset = Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop);
  $('.composer-dock').style.bottom = `${offset}px`;
}
window.visualViewport?.addEventListener('resize', keyboardOffset);
window.visualViewport?.addEventListener('scroll', keyboardOffset);
renderIcons();
resizeInput();
