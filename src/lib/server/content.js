import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import { marked } from 'marked';

const CONTENT_DIR = path.resolve('content');

function readYaml(file) {
	const full = path.join(CONTENT_DIR, file);
	if (!fs.existsSync(full)) return {};
	return yaml.load(fs.readFileSync(full, 'utf-8')) ?? {};
}

function readMarkdown(file) {
	const full = path.join(CONTENT_DIR, file);
	if (!fs.existsSync(full)) return { body: '' };
	const { data, content } = matter(fs.readFileSync(full, 'utf-8'));
	return { ...data, body: marked.parse(content.trim()) };
}

/** Decap writes dates as `2026-09-23`; keep them as plain strings so the
 *  client and the prerender agree on what day an event is on. */
function toIsoDay(value) {
	if (!value) return '';
	if (value instanceof Date) return value.toISOString().slice(0, 10);
	return String(value).slice(0, 10);
}

function readEvents() {
	const dir = path.join(CONTENT_DIR, 'events');
	if (!fs.existsSync(dir)) return [];

	return fs
		.readdirSync(dir)
		.filter((name) => name.endsWith('.md'))
		.map((name) => {
			const { data, content } = matter(fs.readFileSync(path.join(dir, name), 'utf-8'));
			return {
				slug: name.replace(/\.md$/, ''),
				title: data.title ?? '',
				date: toIsoDay(data.date),
				time: data.time ? String(data.time) : '',
				category: data.category ?? '',
				image: data.image || '',
				image_alt: data.image_alt || data.title || '',
				location: data.location ?? '',
				link_url: data.link_url ?? '',
				link_label: data.link_label ?? '',
				body: marked.parse(content.trim())
			};
		})
		.sort((a, b) => a.date.localeCompare(b.date));
}

export function loadContent() {
	return {
		site: readYaml('site.yml'),
		besuch: readYaml('besuch.yml'),
		eventsMeta: readYaml('events.yml'),
		events: readEvents(),
		verein: readMarkdown('verein.md'),
		eindruecke: readYaml('eindruecke.yml'),
		newsletter: readMarkdown('newsletter.md'),
		footer: readYaml('footer.yml')
	};
}
