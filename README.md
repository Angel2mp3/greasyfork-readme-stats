# greasyfork-readme-stats

Dynamically generated GreasyFork install stats cards for your GitHub README.

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Angel2mp3/greasyfork-readme-stats)

No API keys or environment variables needed — works out of the box.

---

## Usage

### Combined card (all scripts)

```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=1578116-angel2mp3)
```

### Single script card

```md
![Script Name](https://your-deployment.vercel.app/api?user=1578116-angel2mp3&script=568833)
```

Find your script ID in the GreasyFork URL: `greasyfork.org/en/scripts/`**568833**`-script-name`

---

## Parameters

| Parameter | Default | Description |
|---|---|---|
| `user` | required | GreasyFork user ID (e.g. `1578116` or `1578116-angel2mp3`) |
| `script` | — | Script ID for a single-script card. Omit for the combined card. |
| `theme` | `default` | Preset color theme (see below) |
| `title_color` | theme default | Hex color for the title and stat numbers (without `#`) |
| `text_color` | theme default | Hex color for body text |
| `bg_color` | theme default | Hex color for the card background |
| `border_color` | theme default | Hex color for the border |
| `hide_border` | `false` | Set to `true` to remove the border |
| `border_radius` | `10` | Corner radius of the card (0–30) |
| `custom_title` | — | Override the card title text |
| `name_color` | same as `text_color` | Hex color for all script name labels |
| `script_colors` | same as `text_color` | Comma-separated hex colors per script row (e.g. `ffffff,d14e5c,f00814`) |
| `stat_color` | same as `text_color` | Hex color for the install numbers on the right |
| `divider_color` | same as `border_color` | Hex color for the divider line |
| `starred` | — | Comma-separated 0-based row indexes to mark with a ★ (e.g. `0,2`) |
| `show_rank` | `false` | Show `#1`, `#2`… rank prefix on each script row |
| `animate` | `true` | Set to `false` to disable the slide-in animation |
| `compact` | `false` | Set to `true` for a smaller, tighter card |
| `show_logo` | `false` | Show the GreasyFork logo flanking the title |
| `sort` | `installs` | Order scripts: `installs` (most downloads first), `daily` (most daily first), `name`, `name_desc`, `none` (GreasyFork order) |

---

## Themes

| Name | Preview |
|---|---|
| `default` | dark bg, purple accent |
| `dark` | GitHub dark, blue accent |
| `light` | white bg, purple accent |
| `radical` | dark purple, pink + cyan |
| `dracula` | dracula palette |
| `tokyonight` | tokyo night palette |
| `merko` | dark green palette |
| `gruvbox` | gruvbox palette |
| `catppuccin` | catppuccin mocha |
| `nord` | nord palette |

```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=1578116-angel2mp3&theme=dracula)
```

---

## Examples

Default:
```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=1578116-angel2mp3)
```

Light theme, no border:
```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=1578116-angel2mp3&theme=light&hide_border=true)
```

Custom colors:
```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=1578116-angel2mp3&bg_color=0d1117&title_color=ff6b6b&text_color=ffffff)
```

Single script with custom title:
```md
![My Script](https://your-deployment.vercel.app/api?user=1578116-angel2mp3&script=568833&custom_title=Grok+Enhancer&theme=tokyonight)
```

---

## Caching

Stats cache for **1 hour** on Vercel's CDN and serve stale for up to **24 hours** while revalidating in the background.
