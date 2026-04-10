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
						{ slug: 'docs/echo-quest', label: '概览', translations: { en: 'Overview' } },
						{ slug: 'docs/echo-quest/gas-system', label: '一、GAS 技能框架', translations: { en: '1. GAS Ability Framework' } },
						{ slug: 'docs/echo-quest/combat-system', label: '二、战斗系统', translations: { en: '2. Combat System' } },
						{ slug: 'docs/echo-quest/hit-feedback', label: '三、打击感', translations: { en: '3. Hit Feedback' } },
						{ slug: 'docs/echo-quest/animation', label: '四、动画系统', translations: { en: '4. Animation System' } },
						{ slug: 'docs/echo-quest/motion-warping', label: '五、Motion Warping', translations: { en: '5. Motion Warping' } },
						{ slug: 'docs/echo-quest/enemy-ai', label: '六、敌人 AI', translations: { en: '6. Enemy AI' } },
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