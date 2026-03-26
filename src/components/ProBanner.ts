import { trackGateHit } from '@/services/analytics';

const BANNER_ENABLED = import.meta.env.VITE_PRO_BANNER_ENABLED !== 'false';
const BANNER_CONTENT = import.meta.env.VITE_PRO_BANNER_CONTENT || '';

let bannerEl: HTMLElement | null = null;

/* TODO: re-enable dismiss after pro launch promotion period
const DISMISS_KEY = 'wm-pro-banner-dismissed';
const DISMISS_MS = 7 * 24 * 60 * 60 * 1000;

function isDismissed(): boolean {
  const ts = localStorage.getItem(DISMISS_KEY);
  if (!ts) return false;
  if (Date.now() - Number(ts) > DISMISS_MS) {
    localStorage.removeItem(DISMISS_KEY);
    return false;
  }
  return true;
}

function dismiss(): void {
  if (!bannerEl) return;
  bannerEl.classList.add('pro-banner-out');
  setTimeout(() => {
    bannerEl?.remove();
    bannerEl = null;
  }, 300);
  localStorage.setItem(DISMISS_KEY, String(Date.now()));
}
*/

const DEFAULT_BANNER_TEXT =
  '<strong>Pro is coming</strong> — More Signal, Less Noise. More AI Briefings. A Geopolitical &amp; Equity Researcher just for you.';

export function showProBanner(container: HTMLElement): void {
  if (!BANNER_ENABLED) return;
  if (bannerEl) return;
  if (window.self !== window.top) return;

  trackGateHit('pro-banner');

  const bannerText = BANNER_CONTENT || DEFAULT_BANNER_TEXT;

  const banner = document.createElement('div');
  banner.className = 'pro-banner';
  banner.innerHTML = `
    <span class="pro-banner-badge">PRO</span>
    <span class="pro-banner-text">
      ${bannerText}
    </span>
    <a class="pro-banner-cta" href="/pro">Reserve your spot →</a>
  `;

  /* TODO: re-enable close button after pro launch promotion period
  banner.innerHTML += `<button class="pro-banner-close" aria-label="Dismiss">×</button>`;
  banner.querySelector('.pro-banner-close')!.addEventListener('click', (e) => {
    e.preventDefault();
    dismiss();
  });
  */

  const header = container.querySelector('.header');
  if (header) {
    header.before(banner);
  } else {
    container.prepend(banner);
  }

  bannerEl = banner;
  requestAnimationFrame(() => banner.classList.add('pro-banner-in'));
}

export function hideProBanner(): void {
  if (!bannerEl) return;
  bannerEl.classList.add('pro-banner-out');
  setTimeout(() => {
    bannerEl?.remove();
    bannerEl = null;
  }, 300);
}

export function isProBannerVisible(): boolean {
  return bannerEl !== null;
}
