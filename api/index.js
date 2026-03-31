// @ts-check
import axios from "axios";

// Module-level logo cache — fetched once per cold start
let logoDataUri = null;
async function getLogo() {
  if (logoDataUri) return logoDataUri;
  try {
    const res = await axios.get(
      "https://greasyfork.org/vite/assets/blacklogo96-CxYTSM_T.png",
      { responseType: "arraybuffer", timeout: 5000 }
    );
    const b64 = Buffer.from(res.data).toString("base64");
    logoDataUri = `data:image/png;base64,${b64}`;
  } catch {
    logoDataUri = null;
  }
  return logoDataUri;
}

// ─── Preset themes ────────────────────────────────────────────────────────────
const THEMES = {
  default:    { bg: "0d1117", title: "6e40c9", text: "c9d1d9", border: "6e40c9" },
  dark:       { bg: "161b22", title: "58a6ff", text: "8b949e", border: "30363d" },
  light:      { bg: "ffffff", title: "6e40c9", text: "444444", border: "e0e0e0" },
  radical:    { bg: "141321", title: "fe428e", text: "a9fef7", border: "fe428e" },
  dracula:    { bg: "282a36", title: "ff79c6", text: "f8f8f2", border: "ff79c6" },
  tokyonight: { bg: "1a1b27", title: "70a5fd", text: "38bdae", border: "70a5fd" },
  merko:      { bg: "0a0f0b", title: "b7d364", text: "68b587", border: "b7d364" },
  gruvbox:    { bg: "282828", title: "fabd2f", text: "ebdbb2", border: "fabd2f" },
  catppuccin: { bg: "1e1e2e", title: "cba6f7", text: "cdd6f4", border: "cba6f7" },
  nord:       { bg: "2e3440", title: "88c0d0", text: "d8dee9", border: "88c0d0" },
};

// ─── GreasyFork scraper ───────────────────────────────────────────────────────
async function fetchUserScripts(userId) {
  const url = `https://greasyfork.org/en/users/${userId}`;
  const { data: html } = await axios.get(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; greasyfork-readme-stats/1.0)",
      Accept: "text/html",
    },
    timeout: 8000,
  });

  const scripts = [];
  const liTagRegex = /<li([\s\S]*?)>/g;
  let tagMatch;
  while ((tagMatch = liTagRegex.exec(html)) !== null) {
    const tag = tagMatch[1];
    if (!tag.includes("data-script-id")) continue;
    const id    = attrVal(tag, "data-script-id");
    const name  = attrVal(tag, "data-script-name");
    const daily = attrVal(tag, "data-script-daily-installs");
    const total = attrVal(tag, "data-script-total-installs");
    if (id && name && daily !== null && total !== null) {
      scripts.push({
        id,
        name: decodeHtmlEntities(name),
        dailyInstalls: parseInt(daily, 10),
        totalInstalls: parseInt(total, 10),
      });
    }
  }
  return scripts;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function attrVal(tag, attr) {
  const m = tag.match(new RegExp(`${attr}="([^"]*)"`));
  return m ? m[1] : null;
}

function decodeHtmlEntities(str) {
  return str
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
}

function escSvg(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function fmt(n) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString("en-US");
}

function toHex(val, fallback) {
  if (!val) return `#${fallback}`;
  return val.startsWith("#") ? val : `#${val}`;
}

function resolveOpts(query) {
  const theme = THEMES[query.theme] || THEMES.default;
  const text = toHex(query.text_color, theme.text);
  return {
    bg_color:      toHex(query.bg_color,      theme.bg),
    title_color:   toHex(query.title_color,   theme.title),
    text_color:    text,
    stat_color:    toHex(query.stat_color,    query.text_color || theme.text),
    border_color:  toHex(query.border_color,  theme.border),
    divider_color: toHex(query.divider_color, query.border_color || theme.border),
    hide_border:   query.hide_border === "true",
    custom_title:  query.custom_title || "",
    border_radius: Math.min(Math.max(parseInt(query.border_radius || "10", 10), 0), 30),
    show_logo:     query.show_logo === "true",
    show_rank:     query.show_rank === "true",
    animate:       query.animate !== "false",
    compact:       query.compact === "true",
    name_color:    toHex(query.name_color, query.text_color || theme.text),
    script_colors: query.script_colors
      ? query.script_colors.split(",").map(c => toHex(c.trim(), query.text_color || theme.text))
      : [],
    starred: query.starred
      ? new Set(query.starred.split(",").map(s => parseInt(s.trim(), 10)))
      : new Set(),
    sort: query.sort || "installs",
  };
}

// ─── Animation CSS ────────────────────────────────────────────────────────────
function buildAnimationCSS(rowCount, animate) {
  if (!animate) return "";
  const rows = Array.from({ length: rowCount }, (_, i) =>
    `.row-${i} { animation: slideIn 0.35s ease both; animation-delay: ${0.1 + i * 0.08}s; }`
  ).join("\n    ");
  return `<style>
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
    .header { animation: fadeIn 0.4s ease both; }
    ${rows}
  </style>`;
}

// ─── Card renderers ───────────────────────────────────────────────────────────
function sortScripts(scripts, sort) {
  const sorted = [...scripts];
  if (sort === "daily")   return sorted.sort((a, b) => b.dailyInstalls - a.dailyInstalls);
  if (sort === "name")    return sorted.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "name_desc") return sorted.sort((a, b) => b.name.localeCompare(a.name));
  if (sort === "none")    return sorted;
  // default: "installs" — highest total first
  return sorted.sort((a, b) => b.totalInstalls - a.totalInstalls);
}

function renderTotalCard(scripts, opts, logo = null) {
  const {
    bg_color, title_color, text_color, stat_color, border_color, divider_color,
    hide_border, custom_title, border_radius: r, show_logo, show_rank,
    animate, compact, name_color, script_colors, starred, sort,
  } = opts;

  scripts = sortScripts(scripts, sort);
  const totalInstalls = scripts.reduce((s, x) => s + x.totalInstalls, 0);
  const dailyInstalls = scripts.reduce((s, x) => s + x.dailyInstalls, 0);

  const W = 460;
  const PAD = 22;
  const LOGO_SIZE = 22;
  const LOGO_GAP = 8;
  const HEADER_H = compact ? 80 : 92;
  const ROW_H = compact ? 20 : 24;
  const cardH = HEADER_H + scripts.length * ROW_H + (compact ? 8 : 10);
  const title = escSvg(custom_title || "GreasyFork Downloads");
  const titleY = show_logo && logo ? (compact ? 28 : 33) : (compact ? 32 : 38);
  const summaryY = compact ? 62 : 74;
  const dividerY = compact ? 44 : 50;

  const border = hide_border ? "" :
    `<rect x="0.5" y="0.5" width="${W-1}" height="${cardH-1}" rx="${r - 0.5}"
      fill="none" stroke="${border_color}" stroke-opacity="0.3"/>`;

  const logoY = titleY - LOGO_SIZE;
  const logoBlock = (show_logo && logo) ? `
  <image x="${W / 2 - 105}" y="${logoY}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" href="${logo}"/>
  <image x="${W / 2 + 105 - LOGO_SIZE + LOGO_GAP}" y="${logoY}" width="${LOGO_SIZE}" height="${LOGO_SIZE}" href="${logo}"/>` : "";

  const rows = scripts.map((s, i) => {
    const y = HEADER_H + i * ROW_H;
    const nameCol = script_colors[i] || name_color;
    const isStarred = starred.has(i);
    const starIcon = isStarred ? `<tspan fill="${title_color}">★ </tspan>` : "";
    const rankPrefix = show_rank ? `<tspan fill="${border_color}" font-size="11">#${i + 1}  </tspan>` : "";
    return `
  <g class="row-${i}">
    <text x="${PAD}" y="${y}" fill="${nameCol}" font-size="${compact ? 12 : 13}"
      font-family="'Segoe UI',Ubuntu,sans-serif">${rankPrefix}${starIcon}${escSvg(s.name)}</text>
    <text x="${W - PAD}" y="${y}" fill="${stat_color}" font-size="${compact ? 12 : 13}"
      font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="end">${fmt(s.totalInstalls)} total  ·  ${fmt(s.dailyInstalls)}/day</text>
  </g>`;
  }).join("");

  const css = buildAnimationCSS(scripts.length, animate);

  return `<svg width="${W}" height="${cardH}" viewBox="0 0 ${W} ${cardH}"
  fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
  ${css}
  <rect width="${W}" height="${cardH}" rx="${r}" fill="${bg_color}"/>
  ${border}
  <g class="header">
    ${logoBlock}
    <text x="${W / 2}" y="${titleY}" fill="${title_color}" font-size="${compact ? 15 : 17}" font-weight="600"
      font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">${title}</text>
    <line x1="${PAD}" y1="${dividerY}" x2="${W - PAD}" y2="${dividerY}" stroke="${divider_color}" stroke-opacity="0.2" stroke-width="1"/>
    <text x="${W / 2}" y="${summaryY}" fill="${text_color}" font-size="${compact ? 12 : 14}" font-family="'Segoe UI',Ubuntu,sans-serif" text-anchor="middle">
      <tspan fill="${title_color}" font-weight="600">${fmt(totalInstalls)}</tspan>
      <tspan> total</tspan>
      <tspan dx="14" fill="${title_color}" font-weight="600">${fmt(dailyInstalls)}</tspan>
      <tspan> daily</tspan>
      <tspan dx="14" fill="${title_color}" font-weight="600">${scripts.length}</tspan>
      <tspan> scripts</tspan>
    </text>
  </g>
  ${rows}
</svg>`;
}

function renderScriptCard(script, opts) {
  const {
    bg_color, title_color, text_color, stat_color, border_color, divider_color,
    hide_border, custom_title, border_radius: r, animate, compact,
  } = opts;
  const W = 340;
  const H = compact ? 76 : 90;
  const PAD = 18;
  const title = escSvg(custom_title || script.name);

  const border = hide_border ? "" :
    `<rect x="0.5" y="0.5" width="${W-1}" height="${H-1}" rx="${r - 0.5}"
      fill="none" stroke="${border_color}" stroke-opacity="0.3"/>`;

  const css = animate ? `<style>
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .header { animation: fadeIn 0.4s ease both; }
    .row-0 { animation: fadeIn 0.4s ease 0.15s both; }
  </style>` : "";

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"
  fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title} stats">
  ${css}
  <rect width="${W}" height="${H}" rx="${r}" fill="${bg_color}"/>
  ${border}
  <g class="header">
    <text x="${PAD}" y="${compact ? 26 : 32}" fill="${title_color}" font-size="${compact ? 13 : 15}" font-weight="600"
      font-family="'Segoe UI',Ubuntu,sans-serif">${title}</text>
    <line x1="${PAD}" y1="${compact ? 34 : 42}" x2="${W - PAD}" y2="${compact ? 34 : 42}" stroke="${divider_color}" stroke-opacity="0.2" stroke-width="1"/>
  </g>
  <g class="row-0">
    <text x="${PAD}" y="${compact ? 58 : 68}" fill="${text_color}" font-size="${compact ? 12 : 13}" font-family="'Segoe UI',Ubuntu,sans-serif">
      <tspan fill="${stat_color}" font-weight="600">${fmt(script.totalInstalls)}</tspan>
      <tspan> total installs</tspan>
      <tspan dx="12" fill="${stat_color}" font-weight="600">${fmt(script.dailyInstalls)}</tspan>
      <tspan> daily</tspan>
    </text>
  </g>
</svg>`;
}

function renderError(message, bg = "#0d1117") {
  return `<svg width="340" height="60" viewBox="0 0 340 60" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="340" height="60" rx="10" fill="${bg}"/>
  <text x="18" y="36" fill="#e05252" font-size="13" font-family="'Segoe UI',Ubuntu,sans-serif">${escSvg(message)}</text>
</svg>`;
}

// ─── Handler ──────────────────────────────────────────────────────────────────
// @ts-ignore
export default async (req, res) => {
  const { user, script: scriptId } = req.query;
  const opts = resolveOpts(req.query);

  res.setHeader("Content-Type", "image/svg+xml");

  if (!user) {
    return res.status(400).send(renderError("Missing ?user= parameter", opts.bg_color));
  }

  try {
    const scripts = await fetchUserScripts(user);

    if (scripts.length === 0) {
      return res.status(404).send(renderError("No scripts found for this user", opts.bg_color));
    }

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

    if (scriptId) {
      const script = scripts.find((s) => s.id === scriptId);
      if (!script) {
        return res.status(404).send(renderError(`Script ID ${scriptId} not found`, opts.bg_color));
      }
      return res.send(renderScriptCard(script, opts));
    }

    const logo = opts.show_logo ? await getLogo() : null;
    return res.send(renderTotalCard(scripts, opts, logo));
  } catch {
    res.setHeader("Cache-Control", "s-maxage=60");
    return res.status(500).send(renderError("Failed to fetch GreasyFork data", opts.bg_color));
  }
};
