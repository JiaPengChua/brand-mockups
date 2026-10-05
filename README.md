# Ada multi-brand mockups

Two mock storefronts on one Ada agent (`journify-sandbox`, Messaging SDK):

- `journify/`: Journify. `brand=journify`. No branding override, so it uses the dashboard's default appearance.
- `mh-holidays/`: MHholidays. `brand=mh_holidays`. Teal `#007E78` header, tint and launcher, round corners,
  and the crew avatar from `static.ada.support`. Styled after holidays.malaysiaairlines.com.

Live: https://jiapengchua.github.io/brand-mockups/

## How it works

Each page sets `window.BRAND = { id, branding }` and loads `assets/ada-brand.js`, which:

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
