---
name: Imported artifact routing
description: How to handle Replit artifact files preserved from a conversation transition.
---

After a conversation moves into a project, an uploaded Replit workspace may be preserved under .local/conversation-workspace/files. Artifact discovery can register a video there, but the project preview proxy may not route that hidden directory even when its workflow starts successfully.

**Why:** The preserved copy's workflow ran, but the project proxy returned 404 for both its root preview and guessed artifact routes.

**How to apply:** Use preserved files as source material. For a live deliverable, build or copy the artifact into the project's normal artifacts/<slug> path and assign a unique preview route; verify it through the proxy before presenting.
