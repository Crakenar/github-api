const express = require("express");
const { Octokit } = require("octokit");
const fs = require("fs");
const MarkdownIt = require("markdown-it");
require("dotenv").config();

const md = new MarkdownIt();
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/githubREADME/:repoName", async (req, res) => {
  const GITHUB_API_KEY = process.env.GITHUB_API_KEY;
  const octokit = new Octokit({
    auth: GITHUB_API_KEY,
  });
  const {
    data: { login },
  } = await octokit.rest.users.getAuthenticated();
  if (!login) {
    res.status(404).send("User not found");
  }
  const githubResponse = await octokit.request(
    `GET /repos/{owner}/{repo}/contents/{path}`,
    {
      owner: login,
      repo: req.params.repoName,
      path: "README.md",
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (githubResponse.status === 200) {
    const buff = Buffer.from(githubResponse.data.content, "base64");
    fs.writeFileSync("tmp.md", buff);
    res.status(200).send(md.render(fs.readFileSync("tmp.md", "utf8")));
  } else {
    res.status(500).send(githubResponse.data.message);
  }
});

app.listen(PORT, (error) => {
  if (!error) {
    console.log(`Server is running on port ${PORT}`);
  } else {
    console.log("Error occured, server cannot start", error);
  }
});
