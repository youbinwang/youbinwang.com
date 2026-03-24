// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	site: 'https://youbinwang.com',
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		starlight({
			title: 'Youbin Wang',
			favicon: '/favicon.png',
			defaultLocale: 'root',
			locales: {
				root: { label: '中文', lang: 'zh-CN' },
				en: { label: 'English', lang: 'en' },
			},
			sidebar: [
				{
					label: '📚 Docs Home',
					link: '/docs/',
				},
				{
					label: 'Echo Quest',
					collapsed: true,
					items: [
						{ slug: 'docs/echo-quest' },
						{ slug: 'docs/echo-quest/gas-system' },
						{ slug: 'docs/echo-quest/combat-system' },
						{ slug: 'docs/echo-quest/hit-feedback' },
						{ slug: 'docs/echo-quest/animation' },
						{ slug: 'docs/echo-quest/motion-warping' },
						{ slug: 'docs/echo-quest/enemy-ai' },
					],
				},
				{
					label: 'Elemental Realm',
					collapsed: true,
					items: [
						{ slug: 'docs/elemental-realm' },
					],
				},
				{
					label: "The Scholar's Side Quest",
					collapsed: true,
					items: [
						{ slug: 'docs/the-scholars-side-quest' },
					],
				},
				{
					label: 'Baihua Pavilion',
					collapsed: true,
					items: [
						{ slug: 'docs/baihua-pavilion' },
					],
				},
				{
					label: 'The Camera',
					collapsed: true,
					items: [
						{ slug: 'docs/the-camera' },
					],
				},
				{
					label: 'On the Road',
					collapsed: true,
					items: [
						{ slug: 'docs/on-the-road' },
					],
				},
				{
					label: 'Elliot Fig',
					collapsed: true,
					items: [
						{ slug: 'docs/elliot-fig' },
					],
				},
				{
					label: 'Stars Chat',
					collapsed: true,
					items: [
						{ slug: 'docs/stars-chat' },
					],
				},
				{
					label: 'Greedy Roots',
					collapsed: true,
					items: [
						{ slug: 'docs/greedy-roots' },
					],
				},
				{
					label: 'Shepherds',
					collapsed: true,
					items: [
						{ slug: 'docs/shepherds' },
					],
				},
				{
					label: 'Aid Master',
					collapsed: true,
					items: [
						{ slug: 'docs/aid-master' },
					],
				},
			],
			customCss: [
				'./src/styles/starlight-tailwind.css',
				'./src/styles/starlight-overrides.css',
			],
			components: {
				Head: './src/components/starlight/Head.astro',
				Header: './src/components/starlight/Header.astro',
				Sidebar: './src/components/starlight/Sidebar.astro',
			},
		}),
		react(),
	],
});