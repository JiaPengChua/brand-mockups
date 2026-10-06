# Journify multi-brand mockups

Two mock storefronts on one Ada agent (`journify-sandbox`, Messaging SDK):

- `journify/`: Journify contact-us page. `brand=journify`. No branding override, so it uses the dashboard's
  default appearance. Carries the idle-nudge demo (formerly `journify-nudge-mockup`): see below.
- `mh-holidays/`: MHholidays. `brand=mh_holidays`. Teal `#007E78` header, tint and launcher, round corners,
  and the crew avatar from `static.ada.support`. Styled after holidays.malaysiaairlines.com.

Live: https://jiapengchua.github.io/journify-brand/

## How it works

MHholidays sets `window.BRAND = { id, branding }` and loads `assets/ada-brand.js`, which:

1. Loads `embed2.js` lazily and calls `adaEmbed.start({ handle, branding, metaFields: { brand } })`.
   - `branding` controls only how the chat looks. The agent never sees it.
   - The `brand` meta field is what playbooks, instructions and handoffs branch on.
2. Remembers the last brand in `localStorage`. Both pages share one origin, so they also share
   Ada's stored session. When the brand changes, it calls
   `reset({ metaFields, resetChatHistory: true })` so the conversation doesn't carry over.
   Branding stays in place after `reset()`.

Add `?debug` to either page to log to the console. After 8s it warns if no Ada frame has loaded,
which usually means the iframe allow list is wrong.

## Swapping the branding

Edit the `window.BRAND.branding` block at the bottom of a page. Leave it out to keep the dashboard defaults. Supported keys are `aiAgentName`,
`aiAgentDescription` (localized maps), `avatarUrl` (absolute HTTPS), `headerColor`,
`headerTextColor`, `tintColor`, `cornerStyle` (`round` / `rectangular`), `textSize` and `launcher`.

Logos and destination photos come from the brands' public sites and
Wikimedia Commons. These are unofficial demo pages.

## Prerequisite

`https://jiapengchua.github.io` (no trailing slash) must be on journify-sandbox's
Settings → Security → Chat iframe allow list.

## Journify: idle nudge and custom launcher

Journify inlines its own embed code instead of using `ada-brand.js`:

- **Background boot, conversation on open.** `start()` runs as soon as `embed2.js` loads, so the SDK
  boots while the visitor reads the page. Ada creates the conversation, and runs the conversation-start
  playbook, only when the drawer first opens. The click then sets `triggerNudge` with `setMetaFields()`
  and calls `toggle()`. Booting on click instead kept the drawer hidden for about 13 s after a nudge
  click in headless Chrome. Now the drawer opens immediately, and the greeting arrives once Ada's chat
  app has loaded (about 6–8 s on first open).
- **Idle nudge.** After 10s with no mouse, key, scroll or touch activity (a hidden tab doesn't count),
  the page shows its own "Choose flypass?" bubble. Once the bubble has shown, opening the chat by the
  bubble *or* the launcher sets `triggerNudge: true`. It fires once per page load and never sends a
  message for the visitor.
- **Own launcher, bigger window.** `#ada-button-frame` is hidden, and the page draws its own orange
  launcher. `#ada-chat-frame` is resized to 400×620 with `!important` CSS. Override `max-width` too,
  because Embed2 sets `max-width: 375px` inline.
- **Why not `parentElement`?** It starts the conversation on page load, can't be combined with
  `lazy`, and disables `toggle()` and proactives.
- **Brand switch.** It uses the same `ada_mock_last_brand` key as `ada-brand.js`. If the visitor was
  last on MHholidays, `reset()` runs during the background boot.

On the agent side, create a variable named exactly `triggerNudge` on journify-sandbox and branch on it.
