"use strict";
const https = require("https");

function requestJson(path, token) {
  const options = {
    hostname: "api.github.com",
    path,
    method: "GET",
    headers: {
      "User-Agent": "node.js",
      Accept: "application/vnd.github+json",
    },
  };
  if (token) options.headers.Authorization = `token ${token}`;

  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (d) => (data += d));
      res.on("end", () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (err) {
            reject(err);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode} ${data}`));
        }
      });
    });
    req.on("error", reject);
    req.end();
  });
}

function getPulls(owner, repo, token) {
  return requestJson(`/repos/${owner}/${repo}/pulls?per_page=10&state=all`, token);
}

function parseCodeowners(content) {
  const owners = new Set();
  content.split(/\r?\n/).forEach((line) => {
    const l = line.trim();
    if (!l || l.startsWith("#")) return;
    const parts = l.split(/\s+/);
    if (parts.length > 1) {
      for (let i = 1; i < parts.length; i++) owners.add(parts[i]);
    }
  });
  return Array.from(owners);
}

function getCodeowners(owner, repo, token) {
  const paths = [".github/CODEOWNERS", "CODEOWNERS", "docs/CODEOWNERS"];
  return new Promise(async (resolve, reject) => {
    for (const p of paths) {
      try {
        const res = await requestJson(`/repos/${owner}/${repo}/contents/${p}`, token);
        if (res && res.content) {
          const content = Buffer.from(res.content, "base64").toString("utf8");
          return resolve({ path: p, owners: parseCodeowners(content) });
        }
      } catch (e) {
        // try next path
      }
    }
    reject(new Error("CODEOWNERS not found"));
  });
}

async function main() {
  const owner = "ComplianceCow-Demo";
  const repo = "PolicyCow";
  const token = process.env.GITHUB_TOKEN;

  try {
    const [prs, codeowners] = await Promise.all([
      getPulls(owner, repo, token),
      getCodeowners(owner, repo, token).catch(() => ({ path: null, owners: [] })),
    ]);

    const out = {
      repo: `${owner}/${repo}`,
      codeowners_path: codeowners.path || null,
      codeowners: codeowners.owners || [],
      pulls: Array.isArray(prs)
        ? prs.map((p) => ({
            number: p.number,
            title: p.title,
            user: p.user && p.user.login,
            state: p.state,
            created_at: p.created_at,
            html_url: p.html_url,
          }))
        : [],
    };

    console.log(JSON.stringify(out, null, 2));
    return out;
  } catch (err) {
    console.error("Error:", err.message);
    process.exitCode = 1;
  }
}
async function fetchPRsAndCodeowners({ owner = "ComplianceCow-Demo", repo = "PolicyCow", token = process.env.GITHUB_TOKEN } = {}) {
  try {
    const [prs, codeowners] = await Promise.all([
      getPulls(owner, repo, token),
      getCodeowners(owner, repo, token).catch(() => ({ path: null, owners: [] })),
    ]);

    const out = {
      repo: `${owner}/${repo}`,
      codeowners_path: codeowners.path || null,
      codeowners: codeowners.owners || [],
      pulls: Array.isArray(prs)
        ? prs.map((p) => ({
            number: p.number,
            title: p.title,
            user: p.user && p.user.login,
            state: p.state,
            created_at: p.created_at,
            html_url: p.html_url,
          }))
        : [],
    };

    return out;
  } catch (err) {
    throw err;
  }
}

if (require.main === module) main();

module.exports = { fetchPRsAndCodeowners };
