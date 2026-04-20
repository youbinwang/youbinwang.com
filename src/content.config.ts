import { defineCollection, z } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { glob } from 'astro/loaders';

export const collections = {
	docs: defineCollection({ loader: docsLoader(), schema: docsSchema() }),
	i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
	'inline-features': defineCollection({
		loader: glob({ pattern: '**/*.mdx', base: './src/content/inline-features' }),
		schema: z.object({
			title: z.string(),
			description: z.string().optional(),
		}),
	}),
};
