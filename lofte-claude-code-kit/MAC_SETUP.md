# Mac setup — install in this order

## Essential

1. Xcode Command Line Tools: `xcode-select --install`
2. Homebrew: follow the command on [brew.sh](https://brew.sh/)
3. Node.js LTS: `brew install node`
4. pnpm: `corepack enable && corepack prepare pnpm@latest --activate`
5. Git: `brew install git`
6. Google Chrome
7. Visual Studio Code
8. Claude Code: use the current command in Anthropic’s official Claude Code setup documentation.
9. GitHub CLI: `brew install gh` then `gh auth login`
10. Vercel CLI: `npm install --global vercel`
11. FFmpeg: `brew install ffmpeg`

## Add per project, not globally

- Next.js, TypeScript, Tailwind, GSAP, Lenis, and Playwright
- Sanity CMS dependencies
- Resend/HubSpot packages

## Optional, wait until required

- Figma Desktop: only if a human designer needs a visual approval workflow.
- Adobe After Effects: only for original showreels and motion clips.
- Rive: for a bespoke vector animation that needs to stay interactive on the web.
- Blender: only for a custom 3D project, not routine web animation.

## Recommended Claude Code integrations later

- Playwright/browser MCP for screenshot and responsive QA.
- Figma Dev Mode MCP if working from Figma designs.
- GitHub MCP only when repository operations need to be automated.
- Do not install third-party After Effects MCPs until there is a real AE automation need; they add configuration and security surface.
