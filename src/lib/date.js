/** Parse `YYYY-MM-DD` as a local date so no timezone ever shifts an event a day. */
export function parseDay(iso) {
	const [y, m, d] = String(iso ?? '')
		.slice(0, 10)
		.split('-')
		.map(Number);
	if (!y || !m || !d) return null;
	return new Date(y, m - 1, d);
}

const weekday = new Intl.DateTimeFormat('de-CH', { weekday: 'short' });
const monthShort = new Intl.DateTimeFormat('de-CH', { month: 'short' });
const full = new Intl.DateTimeFormat('de-CH', {
	weekday: 'long',
	day: 'numeric',
	month: 'long',
	year: 'numeric'
});

export function formatEventDate(iso) {
	const date = parseDay(iso);
	if (!date) return { day: '', month: '', weekday: '', year: '', full: '' };
	return {
		day: String(date.getDate()).padStart(2, '0'),
		month: monthShort.format(date).replace('.', ''),
		weekday: weekday.format(date).replace('.', ''),
		year: String(date.getFullYear()),
		full: full.format(date)
	};
}

export function isUpcoming(iso, now = new Date()) {
	const date = parseDay(iso);
	if (!date) return false;
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	return date >= today;
}
