/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/oleksandr-landing' : '';

module.exports = {
  basePath,
  assetPrefix: isGithubPages ? '/oleksandr-landing/' : '',
  output: 'export',
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
