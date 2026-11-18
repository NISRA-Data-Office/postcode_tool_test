import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isGitHubPagesBuild = process.env.GITHUB_ACTIONS === 'true';
const isUserOrOrganisationSite = repositoryName.endsWith('.github.io');
const base = isGitHubPagesBuild && !isUserOrOrganisationSite ? `/${repositoryName}` : '';

export default defineConfig({
    plugins: [
        sveltekit({
            compilerOptions: {
                // Force runes mode for the project, except for libraries. Can be removed in Svelte 6.
                runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
            },
            adapter: adapter({
                pages: 'build',
                assets: 'build',
                fallback: undefined,
                precompress: false,
                strict: true
            }),
            paths: {
                base
            }
        })
    ]
});
