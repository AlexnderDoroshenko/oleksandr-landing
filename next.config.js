/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const basePath = isGithubPages ? '/oleksandr-landing' : '';

module.exports = {
  basePath,
  assetPrefix: isGithubPages ? '/oleksandr-landing/' : '',
  // Static export is only used for GitHub Pages; the server mode enables API
  // routes and dynamic pages required for authentication.
  ...(isGithubPages ? { output: 'export' } : {}),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};
