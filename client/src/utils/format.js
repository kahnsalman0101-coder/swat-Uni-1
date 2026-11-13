import { BADGE_CLASS, MULTI_FILTER_KEYS } from './constants.js';

/** Resolve the degree-badge modifier class for a badge key. */
export function badgeClass(badgeKey) {
  return BADGE_CLASS[badgeKey] || BADGE_CLASS.muted;
}

/** "1 programme" / "12 programmes" */
export function pluralize(count, singular, plural = `${singular}s`) {
  return `${count.toLocaleString()} ${count === 1 ? singular : plural}`;
}

/**
 * Turn a MySQL `DATE` string (YYYY-MM-DD) into a readable label. Returns the
 * fallback when the value is missing or unparseable.
 */
export function formatDate(isoDate, fallback = 'Date not published') {
  if (!isoDate) return fallback;
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

/** Compact form used inside listing rows: "12 Nov 2026". */
export function formatShortDate(isoDate, fallback = '—') {
  if (!isoDate) return fallback;
  const parsed = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return fallback;
  return parsed.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Split a long-form page body into paragraphs. The database stores the
 * university's own paragraphs separated by a blank line.
 */
export function toParagraphs(body) {
  if (!body) return [];
  return String(body)
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

/**
 * Read the multi-value filter map out of a URLSearchParams instance.
 * Supports both repeated parameters (?degree=A&degree=B) and
 * comma-separated values (?degree=A,B).
 */
export function readMultiFilters(searchParams) {
  const filters = {};
  MULTI_FILTER_KEYS.forEach((key) => {
    const values = searchParams
      .getAll(key)
      .flatMap((value) => String(value).split(','))
      .map((value) => value.trim())
      .filter(Boolean);
    filters[key] = Array.from(new Set(values));
  });
  return filters;
}

/** Build the query object handed to the API layer from URL search params. */
export function buildQueryFromSearchParams(searchParams) {
  const multi = readMultiFilters(searchParams);
  const query = {
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || 'relevance',
    page: Number(searchParams.get('page') || 1),
    limit: Number(searchParams.get('limit') || 9)
  };

  Object.entries(multi).forEach(([key, values]) => {
    if (values.length) query[key] = values;
  });

  return query;
}

/** Serialise a query object back into a URLSearchParams for the API call. */
export function toSearchParams(query) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    if (Array.isArray(value)) {
      if (value.length) params.set(key, value.join(','));
      return;
    }
    params.set(key, String(value));
  });

  return params;
}

/**
 * Merge a single filter change into the current URLSearchParams, resetting the
 * page to 1 so a narrowed list never opens on an empty page.
 */
export function applyFilterChange(searchParams, key, value) {
  const params = new URLSearchParams(searchParams);
  params.delete('page');
  if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) {
    params.delete(key);
  } else if (Array.isArray(value)) {
    params.set(key, value.join(','));
  } else {
    params.set(key, String(value));
  }
  return params;
}
