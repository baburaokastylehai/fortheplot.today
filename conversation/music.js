let apiPromise;
let spotifyAPI;

function loadPlayerAPI() {
  if (spotifyAPI) return Promise.resolve(spotifyAPI);
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const timer = setTimeout(() => fail(), 12000);
    function fail() {
      clearTimeout(timer);
      script.remove();
      apiPromise = null;
      reject(new Error('Spotify could not load'));
    }
    window.onSpotifyIframeApiReady = api => {
      clearTimeout(timer);
      spotifyAPI = api;
      resolve(api);
    };
    script.src = 'https://open.spotify.com/embed/iframe-api/v1';
    script.onerror = fail;
    document.head.append(script);
  });
  return apiPromise;
}

export function initializeMusic(renderIcons) {
  const panel = document.querySelector('.music-panel');
  const frame = document.querySelector('.music-frame');
  const status = document.querySelector('.music-status');
  const fallback = document.querySelector('.music-fallback');
  const toggles = [...document.querySelectorAll('.music-toggle')];
  let player = null;
  let sequence = 0;
  let desiredPlaying = false;
  let playbackState = 'idle';
  let loadingTimer;
  let trigger;

  function setState(value, message = '') {
    playbackState = value;
    panel.dataset.playback = value;
    status.textContent = message;
    status.hidden = !message;
    fallback.hidden = value !== 'error';
    for (const button of toggles) {
      const label = value === 'playing' ? 'Pause Vienna' : 'Play Vienna';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-expanded', String(!panel.hidden));
      button.dataset.tooltip = label;
      button.dataset.playback = value;
      const old = button.querySelector('svg, [data-icon]');
      const icon = document.createElement('i');
      icon.dataset.icon = value === 'playing' ? 'pause' : 'play';
      old.replaceWith(icon);
    }
    renderIcons();
  }

  function close() {
    sequence++;
    desiredPlaying = false;
    clearTimeout(loadingTimer);
    player?.destroy();
    player = null;
    frame.replaceChildren();
    panel.hidden = true;
    document.body.classList.remove('music-open');
    setState('idle');
    const nextTrigger = trigger?.getClientRects().length ? trigger : toggles.find(button => button.getClientRects().length);
    nextTrigger?.focus({ preventScroll: true });
  }

  async function open(button) {
    const current = ++sequence;
    trigger = button;
    desiredPlaying = true;
    panel.hidden = false;
    document.body.classList.add('music-open');
    setState('loading', 'Loading Vienna...');
    clearTimeout(loadingTimer);
    loadingTimer = setTimeout(() => {
      if (current === sequence && playbackState === 'loading') setState('error', 'Spotify did not respond.');
    }, 18000);
    try {
      const api = await loadPlayerAPI();
      if (current !== sequence) return;
      const mount = document.createElement('div');
      frame.replaceChildren(mount);
      api.createController(mount, { uri: 'spotify:track:4U45aEWtQhrm8A5mxPaFZ7', width: '100%', height: 152 }, controller => {
        if (current !== sequence) { controller.destroy(); return; }
        player = controller;
        const iframe = frame.querySelector('iframe');
        if (iframe) {
          iframe.title = 'Vienna by Billy Joel on Spotify';
          iframe.loading = 'eager';
          iframe.referrerPolicy = 'strict-origin-when-cross-origin';
        }
        controller.addListener('ready', () => {
          if (current !== sequence) return;
          clearTimeout(loadingTimer);
          setState('paused');
          if (desiredPlaying) controller.play();
        });
        controller.addListener('playback_update', event => {
          if (current !== sequence) return;
          clearTimeout(loadingTimer);
          panel.dataset.position = String(event.data.position);
          if (event.data.isBuffering) setState('buffering', 'Buffering...');
          else setState(event.data.isPaused ? 'paused' : 'playing');
        });
      });
    } catch {
      if (current !== sequence) return;
      clearTimeout(loadingTimer);
      setState('error', 'Spotify could not load here.');
    }
  }

  for (const button of toggles) {
    button.addEventListener('click', () => {
      if (panel.hidden) return open(button);
      trigger = button;
      if (playbackState === 'error') {
        close();
        return open(button);
      }
      desiredPlaying = playbackState !== 'playing';
      if (!player) return;
      if (desiredPlaying) player.play();
      else player.pause();
    });
  }
  document.querySelector('.close-music').addEventListener('click', close);
  panel.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); close(); }
  });
}
