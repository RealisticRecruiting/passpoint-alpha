🧯 Rollback Instructions (PassPoint)
If the latest deployment breaks, follow these steps to revert to the last known working version.

✅ Current Stable Version
Tag: passpoint-stable
Branch: stable

🛠️ Revert to Stable
bash
Copy
Edit
git checkout stable
git reset --hard passpoint-stable
git push origin stable --force
Then re-deploy stable via Vercel or your deployment tool.

🧪 To Re-Test Locally
bash
Copy
Edit
git checkout stable
npm install
npm run dev
Test on http://localhost:3000 using a known good job ID and PDF resume.

📝 Notes
All critical changes after passpoint-stable live on the main branch.

Do not make emergency fixes directly in stable. Hotfix on main, test, tag, and re-assign passpoint-stable.