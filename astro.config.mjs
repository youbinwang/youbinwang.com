// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [
		starlight({
			title: 'Youbin Wang',
			defaultLocale: 'root',
			locales: {
				root: { label: '中文', lang: 'zh-CN' },
				en: { label: 'English', lang: 'en' },
			},
			sidebar: [
				{
					label: 'Echo Quest',
					items: [
						{ slug: 'echo-quest' },
						{ slug: 'echo-quest/gas-system' },
						{ slug: 'echo-quest/combat-system' },
						{ slug: 'echo-quest/hit-feedback' },
						{ slug: 'echo-quest/animation' },
						{ slug: 'echo-quest/motion-warping' },
						{ slug: 'echo-quest/enemy-ai' },
					],
				},
				{ slug: 'elemental-realm' },
				{ slug: 'the-camera' },
				{ slug: 'on-the-road' },
				{ slug: 'the-scholars-side-quest' },
				{ slug: 'shepherds' },
				{ slug: 'aid-master' },
				{ slug: 'baihua-pavilion' },
				{ slug: 'elliot-fig' },
				{ slug: 'greedy-roots' },
				{ slug: 'stars-chat' },
			],
			customCss: [
				'./src/styles/starlight-tailwind.css',
				'./src/styles/starlight-overrides.css',
			],
			components: {
				Header: './src/components/starlight/Header.astro',
			},
		}),
		react(),
	],
});
