import { release } from './site-config.js';
import { initGlobe } from './globe.js';

const topics = {
  food: { question: '« Et si je partais au Japon pour bien manger ? »', answer: 'Là, tu me parles. On peut commencer par les ramen de Tokyo, passer par les izakaya, puis garder une place pour les spécialités d’Osaka. Tu préfères les petites adresses ou les grands classiques ?' },
  culture: { question: '« J’aimerais découvrir un Japon un peu plus calme. »', answer: 'On peut chercher du côté des quartiers résidentiels, des jardins et des petites villes. Un matin à Yanaka, à Tokyo, puis une escapade vers les Alpes japonaises ? Dis-moi si tu préfères les ruelles, la nature ou les deux.' },
  season: { question: '« Plutôt le printemps ou l’automne au Japon ? »', answer: 'Les deux ont leurs charmes : floraisons au printemps, feuillages à l’automne. Les dates et l’ambiance varient selon les régions. Tu vises plutôt Tokyo, Kyoto ou les montagnes ? On peut affiner à partir de là.' }
};

const tabs = [...document.querySelectorAll('[data-topic]')];
function selectTopic(button) {
  const topic = topics[button.dataset.topic];
  document.querySelector('#demo-question').textContent = topic.question;
  document.querySelector('#demo-answer').textContent = topic.answer;
  document.querySelector('#topic-panel').setAttribute('aria-labelledby', button.id);
  tabs.forEach(tab => { const selected = tab === button; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; });
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectTopic(button));
  button.addEventListener('keydown', event => {
    const next = event.key === 'ArrowRight' ? (index + 1) % tabs.length : event.key === 'ArrowLeft' ? (index - 1 + tabs.length) % tabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : null;
    if (next !== null) { event.preventDefault(); tabs[next].focus(); selectTopic(tabs[next]); }
  });
});

const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('#mobile-nav');
function closeMenu() { mobileNav.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); menuToggle.setAttribute('aria-label', 'Ouvrir le menu'); }
menuToggle.addEventListener('click', () => {
  const opening = mobileNav.hidden; mobileNav.hidden = !opening; menuToggle.setAttribute('aria-expanded', String(opening)); menuToggle.setAttribute('aria-label', opening ? 'Fermer le menu' : 'Ouvrir le menu');
});
mobileNav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); } });
matchMedia('(min-width: 768px)').addEventListener('change', event => { if (event.matches) closeMenu(); });

const dialog = document.querySelector('#privacy-dialog');
document.querySelectorAll('[data-open-privacy]').forEach(button => button.addEventListener('click', () => dialog.showModal()));
dialog.querySelectorAll('.dialog-close,.dialog-done').forEach(button => button.addEventListener('click', () => dialog.close()));
dialog.addEventListener('click', event => {
  const rect = dialog.getBoundingClientRect();
  if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
});

const audio = document.querySelector('#voice-audio');
const playButton = document.querySelector('#play-voice');
const orb = document.querySelector('#voice-orb');
const voiceSection = document.querySelector('.voice-section');
const audioError = document.querySelector('#audio-error');
audio.volume = .75;
function setAudioState(playing) {
  voiceSection.classList.toggle('is-playing', playing);
  playButton.setAttribute('aria-pressed', String(playing)); orb.setAttribute('aria-pressed', String(playing));
  orb.setAttribute('aria-label', playing ? 'Mettre l’extrait vocal en pause' : 'Écouter un extrait de la voix de SKAI');
  document.querySelector('#voice-button-label').textContent = playing ? 'Mettre en pause' : 'Écouter SKAI';
  document.querySelector('#voice-button-icon').src = playing ? 'assets/player-pause.svg' : 'assets/player-play.svg';
  document.querySelector('#voice-state').textContent = playing ? 'Lecture en cours' : 'Extrait vocal';
}
async function toggleAudio() {
  audioError.hidden = true;
  if (!audio.paused) { audio.pause(); return; }
  try { await audio.play(); }
  catch { setAudioState(false); audioError.textContent = 'L’extrait n’a pas pu être lu. Réessaie ou consulte sa transcription juste en dessous.'; audioError.hidden = false; }
}
playButton.addEventListener('click', toggleAudio); orb.addEventListener('click', toggleAudio);
audio.addEventListener('play', () => setAudioState(true));
audio.addEventListener('pause', () => setAudioState(false));
audio.addEventListener('ended', () => { setAudioState(false); audio.currentTime = 0; });
document.addEventListener('visibilitychange', () => { if (document.hidden) audio.pause(); });
fetch('assets/voice-transcript.txt').then(response => response.ok ? response.text() : '').then(text => { if (text.trim()) document.querySelector('#voice-transcript').textContent = text.trim(); }).catch(() => {});

const releasesUrl = `${release.repository}/releases/tag/${encodeURIComponent(release.tag)}`;
document.querySelector('#release-link').href = releasesUrl;
if (release.published) {
  const link = document.createElement('a');
  link.className = 'button button-primary';
  link.href = `${release.repository}/releases/download/${encodeURIComponent(release.tag)}/${encodeURIComponent(release.assetName)}`;
  link.textContent = 'Télécharger pour Windows';
  const icon = document.createElement('img'); icon.src = 'assets/arrow-down.svg'; icon.alt = ''; icon.width = 18; icon.height = 18; link.append(icon);
  document.querySelector('#download-action').replaceChildren(link);
  document.querySelector('#release-status').lastChild.textContent = `Préversion ${release.version} disponible`;
  document.querySelector('.download-copy>p').textContent = 'Télécharge l’application pour Windows 10 et 11.';
  document.querySelector('#release-link').firstChild.textContent = 'Voir la release sur GitHub';
} else {
  const button = document.createElement('button');
  button.className = 'button button-primary'; button.disabled = true; button.textContent = 'Bientôt sur Windows';
  document.querySelector('#download-action').replaceChildren(button);
  document.querySelector('#release-status').lastChild.textContent = 'Téléchargement à venir';
  document.querySelector('#release-link').href = `${release.repository}/releases`;
  document.querySelector('#release-link').firstChild.textContent = 'Voir les versions sur GitHub';
}

if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('js');
  const reveals = new IntersectionObserver(entries => { for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveals.unobserve(entry.target); } }, { threshold: .08 });
  document.querySelectorAll('.reveal').forEach(section => reveals.observe(section));
}
initGlobe().catch(() => { document.querySelector('#globe').hidden = true; document.querySelector('.globe-fallback').hidden = false; });
