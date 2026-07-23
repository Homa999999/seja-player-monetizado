/**
 * Player Monetizado — Meta Pixel, GA4 e eventos de checkout
 */
(function () {
  'use strict';

  const config = window.PM_CONFIG || {};
  const pixelId = (config.metaPixelId || '').trim();
  const ga4Id = (config.ga4Id || '').trim();
  const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];

  function getUtmParams() {
    const params = new URLSearchParams(window.location.search);
    const utms = {};
    UTM_KEYS.forEach((key) => {
      const value = params.get(key);
      if (value) utms[key] = value;
    });
    return utms;
  }

  function appendUtms(url) {
    if (!url || url.startsWith('#')) return url;
    try {
      const next = new URL(url, window.location.origin);
      Object.entries(getUtmParams()).forEach(([key, value]) => {
        next.searchParams.set(key, value);
      });
      return next.toString();
    } catch {
      return url;
    }
  }

  function loadMetaPixel() {
    if (!pixelId || window.fbq) return;

    window.fbq = function () {
      window.fbq.callMethod
        ? window.fbq.callMethod.apply(window.fbq, arguments)
        : window.fbq.queue.push(arguments);
    };
    window.fbq.queue = [];
    window.fbq.loaded = true;
    window.fbq.version = '2.0';
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    document.head.appendChild(script);
  }

  function loadGa4() {
    if (!ga4Id || window.gtag) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
    window.gtag('js', new Date());
    window.gtag('config', ga4Id, { send_page_view: true });

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`;
    document.head.appendChild(script);
  }

  function trackCheckout() {
    if (pixelId && window.fbq) {
      window.fbq('track', 'InitiateCheckout');
    }
    if (ga4Id && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'BRL',
        value: 97
      });
    }
  }

  function bindCheckoutLinks(root) {
    (root || document).querySelectorAll('.checkout-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        link.href = appendUtms(href);
      }
      if (link.dataset.pmCheckoutBound === '1') return;
      link.dataset.pmCheckoutBound = '1';
      link.addEventListener('click', trackCheckout);
    });
  }

  loadMetaPixel();
  loadGa4();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => bindCheckoutLinks());
  } else {
    bindCheckoutLinks();
  }

  window.addEventListener('cms:applied', () => bindCheckoutLinks());
})();
