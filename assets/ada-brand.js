/*
 * One Ada agent, two brands.
 *
 * Each page sets window.BRAND before loading this file. The same handle is
 * started with that brand's `branding` (what the chat looks like; omitted
 * for a brand that keeps the dashboard defaults) and a
 * `brand` meta field (what the agent can branch on — branding alone is
 * client-side only and never reaches the agent).
 *
 * Both pages live on the same origin, so they share Ada's stored session.
 * Without the reset below, a conversation started on one brand would carry
 * over, transcript and all, when the visitor opens the other.
 */
(function () {
  var HANDLE = "journify-sandbox";
  var KEY = "ada_mock_last_brand";
  var brand = window.BRAND;
  var debug = /[?&]debug\b/.test(location.search);

  function log() {
    if (debug) console.log.apply(console, ["[brand-mockup]"].concat([].slice.call(arguments)));
  }

  var last = null;
  try {
    last = localStorage.getItem(KEY);
    localStorage.setItem(KEY, brand.id);
  } catch (e) {}   // blocked storage: treat as same brand

  var switched = last !== null && last !== brand.id;
  var meta = { brand: brand.id };

  // Embed2 reads adaSettings when it loads; lazy means nothing starts until
  // we call start() ourselves with the brand's settings.
  window.adaSettings = { lazy: true };

  function start() {
    log("start", brand.id, switched ? "(switched from " + last + ")" : "");
    var settings = {
      handle: HANDLE,
      metaFields: meta,
      adaReadyCallback: function () {
        log("ready");
        if (!switched) return;
        // Branding survives reset(); the meta field is re-sent so the fresh
        // chatter starts with the right brand.
        window.adaEmbed.reset({ metaFields: meta, resetChatHistory: true })
          .then(function () { log("reset for new brand"); })
          .catch(function (err) { console.warn("[brand-mockup] reset failed:", err); });
      }
    };
    // A brand without its own branding gets the dashboard appearance.
    if (brand.branding) settings.branding = brand.branding;
    window.adaEmbed.start(settings).catch(function (err) {
      console.warn("[brand-mockup] start failed:", err);
    });
  }

  var s = document.createElement("script");
  s.src = "https://static.ada.support/embed2.js";
  s.async = true;
  s.onload = function () { (function wait(n) {
    if (window.adaEmbed) return start();
    if (n > 50) return console.warn("[brand-mockup] adaEmbed never appeared");
    setTimeout(function () { wait(n + 1); }, 100);
  })(0); };
  document.head.appendChild(s);

  if (debug) setTimeout(function () {
    if (!document.getElementById("ada-chat-frame") && !document.getElementById("ada-button-frame"))
      console.warn("[brand-mockup] No Ada frame after 8s — check the iframe allow list for " + location.origin);
  }, 8000);
})();
