/**
 * Shared constants for the University of Swat website UI.
 *
 * Every value here was read from the university's own site (uswat.edu.pk).
 * Where the university does not publish a destination for a label it shows,
 * `siteSearch()` builds a URL against the university's own WordPress search so
 * the link still lands on the real domain instead of an invented page.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/** University identity, as published on uswat.edu.pk. */
export const UNIVERSITY = {
  name: 'University of Swat',
  shortName: 'UOS',
  motto: 'Aspiring for Quality Education with Relevance',
  established: 2010,
  address: {
    line1: 'University of Swat, Main Campus',
    line2: 'Charbagh, District Swat',
    line3: 'Khyber Pakhtunkhwa, Pakistan'
  },
  phones: [
    { label: 'Vice Chancellor Secretariat', value: '0946-730510' },
    { label: 'PS to Registrar', value: '0946-920814' },
    { label: 'Admissions', value: '0946-920809' },
    { label: 'Women Campus', value: '0946-920867-68' }
  ],
  emails: [
    { label: 'Vice Chancellor', value: 'vc@uswat.edu.pk' },
    { label: 'Registrar', value: 'registrar@uswat.edu.pk' },
    { label: 'Admissions', value: 'admissions@uswat.edu.pk' },
    { label: 'Web Administrator', value: 'webmaster@uswat.edu.pk' }
  ],
  website: 'https://uswat.edu.pk/'
};

/** Build a URL against the university's own site search. */
export function siteSearch(term) {
  return `https://uswat.edu.pk/?s=${encodeURIComponent(term)}`;
}

/** Utility strip above the main navigation. */
export const TOP_BAR_LINKS = [
  { label: 'CMS', href: 'https://cms1.uswat.edu.pk/' },
  { label: 'SUJRIS', href: 'https://sujris.uswat.edu.pk/' },
  { label: 'e-Office', href: 'https://uswat.edu.pk/e-office/' },
  { label: 'Campus TV', href: 'https://uswat.edu.pk/' }
];

/**
 * Primary navigation. `children` renders a dropdown; the Faculty entry uses
 * `mega: true` so the header expands it with the faculty/department tree that
 * is loaded from the API.
 */
export const MAIN_NAV = [
  { label: 'Home', to: '/' },
  {
    label: 'About University',
    to: '/about',
    children: [
      { label: 'About University', to: '/about' },
      { label: "Vice Chancellor's Message", to: '/vice-chancellor' },
      { label: 'Contact & Administration', to: '/contact' }
    ]
  },
  { label: 'Programmes', to: '/programs' },
  { label: 'Faculties', to: '/faculties', mega: true },
  { label: 'Campuses', to: '/campuses' },
  {
    label: 'News & Events',
    to: '/news',
    children: [
      { label: 'Latest News', to: '/news' },
      { label: 'Announcements', to: '/announcements' },
      { label: 'Events', to: '/events' }
    ]
  },
  {
    label: 'Tenders & Jobs',
    to: '/tenders',
    children: [
      { label: 'Tender', to: '/tenders' },
      { label: 'Jobs Advertisement', to: '/jobs' }
    ]
  }
];

/**
 * Footer "Quick Menu": the same list the university publishes in its footer.
 * `href` entries are external links, `to` entries are internal routes.
 */
export const QUICK_MENU = [
  { label: 'Digital Learning & Skills Enrichment Initiative', href: siteSearch('Digital Learning Skills Enrichment Initiative') },
  { label: 'About University', to: '/about' },
  { label: 'Announcements', to: '/announcements' },
  { label: 'Latest News', to: '/news' },
  { label: 'Jobs', to: '/jobs' },
  { label: 'Events', to: '/events' },
  { label: 'Tender', to: '/tenders' },
  { label: 'Political Map of Pakistan', href: siteSearch('Political Map of Pakistan') },
  { label: 'Hunerkada (Center of Excellence for Art & Culture)', href: siteSearch('Hunerkada') },
  { label: 'Public Sector Affiliated Colleges', href: siteSearch('Public Sector Affiliated Colleges') },
  { label: 'Private Sector Affiliated Colleges', href: siteSearch('Private Sector Affiliated Colleges') },
  { label: 'Faculties & Departments', to: '/faculties' },
  { label: 'Programmes Directory', to: '/programs' },
  { label: 'Contact Us', to: '/contact' }
];

/** External services the university links to from its own footer. */
export const SERVICE_LINKS = [
  { label: 'CMS', href: 'https://cms1.uswat.edu.pk/' },
  { label: 'SUJRIS', href: 'https://sujris.uswat.edu.pk/' },
  { label: 'e-Office', href: 'https://uswat.edu.pk/e-office/' },
  { label: 'Examinations', href: 'http://exam.uswat.edu.pk/' },
  { label: 'ORIC', href: siteSearch('ORIC') },
  { label: 'Quality Enhancement Cell', href: siteSearch('Quality Enhancement Cell') }
];

/** The five editorial sections, in the order the university lists them. */
export const CONTENT_SECTIONS = [
  {
    key: 'news',
    path: '/news',
    label: 'Latest News',
    short: 'News',
    icon: 'bi-newspaper',
    lede: 'Institutional news and campus reporting from the University of Swat.'
  },
  {
    key: 'announcement',
    path: '/announcements',
    label: 'Announcements',
    short: 'Announcements',
    icon: 'bi-megaphone',
    lede: 'Official notices issued by the university.'
  },
  {
    key: 'event',
    path: '/events',
    label: 'Events',
    short: 'Events',
    icon: 'bi-calendar-event',
    lede: 'Seminars, lectures, conferences and campus events.'
  },
  {
    key: 'tender',
    path: '/tenders',
    label: 'Tender',
    short: 'Tenders',
    icon: 'bi-file-earmark-text',
    lede: 'Procurement notices and tender results.'
  },
  {
    key: 'job',
    path: '/jobs',
    label: 'Jobs Advertisement',
    short: 'Jobs',
    icon: 'bi-briefcase',
    lede: 'Faculty and staff vacancies advertised by the university.'
  }
];

/** Resolve a content section descriptor from its API category key. */
export function sectionByKey(key) {
  return CONTENT_SECTIONS.find((section) => section.key === key) || null;
}

export const SORT_OPTIONS = [
  { value: 'relevance', label: 'Best match' },
  { value: 'title', label: 'Programme (A–Z)' },
  { value: 'title_desc', label: 'Programme (Z–A)' },
  { value: 'degree', label: 'Degree type' },
  { value: 'department', label: 'Department' },
  { value: 'campus', label: 'Campus' },
  { value: 'newest', label: 'Recently added' }
];

export const PAGE_SIZE = 9;
export const CONTENT_PAGE_SIZE = 9;

/**
 * Maps the `badgeKey` coming from the API to the modifier class used by
 * DegreeBadge.css. Keeping the map here means the colour rules live in CSS.
 */
export const BADGE_CLASS = {
  red: 'gp-badge--red',
  green: 'gp-badge--green',
  'red-accent': 'gp-badge--red-accent',
  'green-accent': 'gp-badge--green-accent',
  ink: 'gp-badge--ink',
  muted: 'gp-badge--muted',
  dual: 'gp-badge--dual'
};

/** Query-string keys that may hold several values at once. */
export const MULTI_FILTER_KEYS = ['degree', 'level', 'faculty', 'department', 'campus', 'keyword'];

/** Short label for each study level, used on cards and in the counters. */
export const LEVEL_SHORT = {
  Undergraduate: 'UG',
  'MS/MPhil': 'MS/MPhil',
  Doctorate: 'PhD'
};

/** The three study levels in the order the university lists them. */
export const LEVELS = ['Undergraduate', 'MS/MPhil', 'Doctorate'];
