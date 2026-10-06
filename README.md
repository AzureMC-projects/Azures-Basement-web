# Azure's Basement Web

A Netlify-ready Discord community portal for server **1547346058051584172**.

## Features

- Discord OAuth2 sign-in
- Verifies that the signed-in account is a member of the configured Discord server
- Shows the member's Discord roles
- Live server member/presence counts
- Pulls announcements and rules from Discord channels
- Authenticated VIP giveaway claim endpoint
- Responsive dark/purple community UI
- Netlify Functions for OAuth and Discord API access

## Netlify environment variables

Set these in **Netlify → Site configuration → Environment variables**:

- `DISCORD_CLIENT_ID` — Discord application client ID
- `DISCORD_CLIENT_SECRET` — Discord application client secret
- `DISCORD_REDIRECT_URI` — exact OAuth callback URL, e.g. `https://YOUR-SITE.netlify.app/api/callback`
- `DISCORD_BOT_TOKEN` — bot token for the server
- `DISCORD_GUILD_ID` — defaults to `1547346058051584172`
- `SESSION_SECRET` — long random secret used to sign sessions

## Discord setup

1. Create/configure a Discord application and OAuth2 redirect.
2. Add the redirect URI above.
3. Enable the bot and invite it to the server with permissions to view the relevant channels and read message history.
4. OAuth scopes used by the site are `identify` and `guilds.members.read`.

The site automatically looks for channels whose names contain **announcement**, **news**, **update**, or **rule**. For a production setup, you can replace that discovery with fixed channel IDs.

## Deploy

Connect the repository to Netlify and deploy the `main` branch. No build command is required.

