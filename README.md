<div align="center">

# GreasyFork Readme Stats

**Dynamically generated GreasyFork install stats cards for your GitHub or other service's README**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

### 📊 My GreasyFork Stats

![GreasyFork Stats](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3)

</div>

---

## ✨ Features

- **Zero config** — no API keys or environment variables needed
- **10 built-in themes** — dark, light, dracula, tokyonight, nord, gruvbox, catppuccin, radical, merko, and default
- **Fully customizable** — colors, borders, animations, sorting, and more
- **Fast** — stats cache for 1 hour on Vercel's CDN, stale-while-revalidate up to 24 hours
- **Two card layouts** — combined stats across all your scripts, or a single-script view

---

## 🚀 Deploy Your Own

No API keys or environment variables needed — just one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Angel2mp3/greasyfork-readme-stats)

---

## 📖 Usage

### All scripts (combined card)

```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=YOUR_GREASYFORK_USER_ID)
```

### Single script card

```md
![Script Stats](https://your-deployment.vercel.app/api?user=YOUR_GREASYFORK_USER_ID&script=SCRIPT_ID)
```

> The script ID is the number in the GreasyFork URL: `greasyfork.org/scripts/`**`12345`**`-script-name`

---

## 🎨 Theme Showcase

**Default**

![Default Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=default)

**Dark**

![Dark Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=dark)

**Tokyo Night**

![Tokyo Night Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=tokyonight)

**Dracula**

![Dracula Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=dracula)

**Nord**

![Nord Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=nord)

**Catppuccin**

![Catppuccin Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=catppuccin)

**Gruvbox**

![Gruvbox Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=gruvbox)

**Radical**

![Radical Theme](https://greasyfork-readme-stats.vercel.app/api?user=1578116-angel2mp3&theme=radical)

---

## ⚙️ Parameters

| Parameter | Description | Default |
|-----------|-------------|---------|
| `user` | GreasyFork user ID (required) | — |
| `script` | Script ID for single-script card | — |
| `theme` | Preset theme name | `default` |
| `title_color` | Card title hex color | theme default |
| `text_color` | Text hex color | theme default |
| `bg_color` | Background hex color | theme default |
| `border_color` | Border hex color | theme default |
| `hide_border` | Hide card border (`true`/`false`) | `false` |
| `border_radius` | Card corner radius (px) | `4.5` |
| `compact` | Compact layout (`true`/`false`) | `false` |
| `sort` | Sort order: `installs`, `daily`, `alpha`, `default` | `default` |
| `show_rank` | Show install rank badge (`true`/`false`) | `true` |
| `animate` | Enable animations (`true`/`false`) | `true` |
| `show_logo` | Show GreasyFork logo (`true`/`false`) | `true` |
| `starred` | Show only starred scripts (`true`/`false`) | `false` |
| `title` | Custom card title | auto |

### Example with custom colors

```md
![GreasyFork Stats](https://your-deployment.vercel.app/api?user=YOUR_ID&bg_color=0d1117&title_color=58a6ff&text_color=c9d1d9&border_color=30363d&hide_border=false)
```

---

## 📦 Caching

Stats cache for **1 hour** on Vercel's CDN and serve stale for up to **24 hours** while revalidating in the background. This keeps load times fast without hammering GreasyFork's servers.

---

## 📄 License

[MIT](LICENSE) © [Angel2mp3](https://github.com/Angel2mp3)
