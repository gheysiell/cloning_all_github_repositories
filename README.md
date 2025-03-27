# cloning_all_github_repositories

## Description

This project automates the process of cloning all GitHub repositories 
(both public and private) of a given user. It fetches all repositories
using the GitHub API and clones them into a local directory.

## Running

### Create a .env file in the project root and add your GitHub Token and your UserName
    GITHUB_USERNAME=your_personal_user_name
    GITHUB_TOKEN=your_personal_access_token    

### Install dependencies
    npm install

### Execute
    node main.js