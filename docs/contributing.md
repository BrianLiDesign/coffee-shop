# Contributing

Here are all of the steps you should follow whenever contributing to this repo!

## Making Changes

1. Before you start making changes, always make sure you're on the main branch, then `git pull` and `npm i` to make sure your code is up to date
2. Open the GitHub issue assigned to you and create a branch from that issue when GitHub offers the **Create a branch for this issue** option. If that option is unavailable, create one locally with `git checkout -b <name-of-branch>`
3. Make changes only for the assigned issue
4. `npm run lint` to ensure code standards. (running `npm run lint:fix` will fix most of the styling errors)

## Commiting Changes

When interacting with Git/GitHub, feel free to use the command line, VSCode extension, or Github desktop. These steps assume you have already made a branch using `git checkout -b <branch-name>` and you have made all neccessary code changes for the provided task.

1. View diffs of each file you changed using the VSCode Github extension (3rd icon on far left bar of VSCode) or GitHub Desktop
2. `git add .` (to stage all files) or `git add <file-name>` (to stage specific file)
3. `git commit -m "<type>[optional scope]: <description>"` or
   `git commit -m "<type>[optional scope]: <description>" -m "[optional body]"` or
   `git commit` to get a message prompt
4. `git push -u origin <name-of-branch>`

## Making Pull Requests

1. Go to the Pull Requests tab on [github.com](https://github.com/)
2. Open a pull request from your issue branch into `main` and fill out the PR template
3. (If applicable, provide a screenshot of your work in the comment area)
4. Link your PR to the corresponding **Issue** (for example, add `Closes #123` to the description)
5. Request a reviewer to check your code
6. Once approved, your code is ready to be merged in 🎉

Never commit directly to `main`. Every issue contribution should go through its own
branch and pull request.
