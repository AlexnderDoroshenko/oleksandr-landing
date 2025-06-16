/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

module.exports = {
  basePath: isGithubPages ? '/oleksandr-landing' : '',
  assetPrefix: isGithubPages ? '/oleksandr-landing/' : '',
  output: 'export',
};
