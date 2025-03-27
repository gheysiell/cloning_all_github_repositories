require("dotenv").config();
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const USERNAME = process.env.GITHUB_USERNAME;
const TOKEN = process.env.GITHUB_TOKEN;
const PER_PAGE = 100;
const REPO_DIR = path.join(__dirname, "repositories");

if (!fs.existsSync(REPO_DIR)) {
    fs.mkdirSync(REPO_DIR, { recursive: true });
}

async function getRepos(page = 1, repos = []) {
    const response = await fetch(`https://api.github.com/user/repos?per_page=${PER_PAGE}&page=${page}&affiliation=owner`, {
        headers: { 
            "Authorization": `Bearer ${TOKEN}`,
            "Accept": "application/vnd.github.v3+json",
        }
    });

    if (!response.ok) {
        console.error(`Error fetching repositories: ${response.statusText}`);
        return [];
    }

    const data = await response.json();
    if (data.length === 0) return repos;

    return getRepos(page + 1, repos.concat(data));
}

async function cloneRepos() {
    console.log("Searching for repositories...");
    const repos = await getRepos();

    if (repos.length === 0) {
        console.log("No repositories found.");
        return;
    }

    console.log(`Found ${repos.length} repositories. Cloning...`);

    for (const repo of repos) {
        const cloneUrl = `https://${USERNAME}:${TOKEN}@github.com/${USERNAME}/${repo.name}.git`;
        const repoPath = path.join(REPO_DIR, repo.name);

        if (fs.existsSync(repoPath)) {
            console.log(`The folder ${repo.name} already exists in repositories, skiping...`);
            continue;
        }

        console.log(`Cloning ${repo.name} to repositories...`);
        exec(`git clone ${cloneUrl} "${repoPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error in cloning ${repo.name}:`, error.message);
                return;
            }
            console.log(stdout);
        });
    }
}

cloneRepos().catch(console.error);
