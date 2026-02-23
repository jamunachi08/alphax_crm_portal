# AlphaX CRM Portal (v0.0.5 - Frappe v15 build-safe)

Route:
- `/app/alphax-crm`

Highlights:
- Pixel-style CRM landing page similar to your screenshot
- Arabic / English toggle
- Per-user language preference (updates only current user's User.language)
- **Cloud build-safe**: uses **root build.json** entrypoints (no app_include_js/css)

Install:
```bash
bench get-app <repo_url>
bench --site <site> install-app alphax_crm_portal
bench build --app alphax_crm_portal
bench --site <site> migrate
bench --site <site> clear-cache
```
