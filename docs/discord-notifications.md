# Discord notifications

Related issues: #3, #4, #10

## What sends a DM
| Event | Who gets it |
|---|---|
| New Head of Campus request | Site owner(s) |
| New fellow project submitted | Mentors of that campus |
| Project approved / declined | The fellow who submitted it |

## How it works
1. A database trigger (pg_net) calls the Supabase Edge Function.
2. The function checks the webhook secret, finds the person's Discord account, and sends a DM through the bot.
3. 'Connect Discord' (OAuth: identify + guilds.join) adds people to the server and stores their exact Discord ID.

## Secrets (Supabase > Edge Functions > Secrets)
DISCORD_BOT_TOKEN, DISCORD_GUILD_ID, DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, WEBHOOK_SECRET, SITE_URL
