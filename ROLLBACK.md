# Rollback & Recovery Documentation

## Stable Version Info  
**Tag:** `stable-2025-06-21`  
This is the current known stable state of the code and deployment. Use this tag to revert back anytime.

---

## How to Rollback Code Locally  

1. Fetch all tags from remote:

\`\`\`bash
git fetch --all --tags
\`\`\`

2. Reset your local code to the stable tag (WARNING: This discards all local changes):

\`\`\`bash
git reset --hard stable-2025-06-21
\`\`\`

3. Verify your local HEAD is at the stable tag:

\`\`\`bash
git status
git log -1
\`\`\`

4. (Optional) Push stable state to your main branch (force push **only if you want to overwrite remote**):

\`\`\`bash
git push origin HEAD:main --force
\`\`\`

---

## How to Rollback Deployment in Vercel  

1. Go to your Vercel Dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. Select your project (PassPoint).

3. Click on the **Deployments** tab on the left sidebar.

4. Find the deployment associated with tag \`stable-2025-06-21\` or the one you want to revert to.

5. Click the **Redeploy** button for that deployment to redeploy that stable version.

6. Alternatively, configure your project to deploy from a stable branch (like \`stable\`), and push that branch when you want to roll back.

---

## Database Backups  

- Your Supabase database backups can be found in your Supabase dashboard under:

  \`https://app.supabase.com/project/[your-project-id]/database/backups\`

- Check backup frequency and retention policy.

- You can manually create backups or restore from a previous backup if data gets corrupted.

- Always verify your latest backups are intact before a major deployment.

---

## Additional Recommendations  

- **Create a stable branch:** Create and protect a branch named \`stable\` in GitHub that always tracks stable releases.

- **Tag releases:** Always tag stable releases with a meaningful tag like \`stable-YYYY-MM-DD\` or \`v1.0.0\`.

- **Write deployment notes:** Every deployment or push to \`main\` or \`stable\` should include notes in your commit or PR describing the changes.

- **Set up automated backups:** Enable automated backups and export them regularly.

- **Logging:** Make sure you have error logging and monitoring in place (e.g., Vercel logs, Supabase logs).

---
