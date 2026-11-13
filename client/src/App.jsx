import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import SiteHeader from './components/layout/SiteHeader.jsx';
import SiteFooter from './components/layout/SiteFooter.jsx';
import HomePage from './pages/HomePage.jsx';
import DirectoryPage from './pages/DirectoryPage.jsx';
import ProgramDetailPage from './pages/ProgramDetailPage.jsx';
import ContentListPage from './pages/ContentListPage.jsx';
import AboutPage from './pages/AboutPage.jsx';
import ViceChancellorPage from './pages/ViceChancellorPage.jsx';
import FacultiesPage from './pages/FacultiesPage.jsx';
import CampusesPage from './pages/CampusesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

/**
 * Reset the scroll position on every navigation so deep links to a programme
 * page do not land mid-page.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <div className="gp-app">
      <a className="gp-skip-link" href="#main-content">
        Skip to main content
      </a>
      <ScrollToTop />
      <SiteHeader />

      <main id="main-content" className="gp-page">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/programs" element={<DirectoryPage />} />
          <Route path="/programs/:slug" element={<ProgramDetailPage />} />
          <Route path="/news" element={<ContentListPage category="news" />} />
          <Route path="/announcements" element={<ContentListPage category="announcement" />} />
          <Route path="/events" element={<ContentListPage category="event" />} />
          <Route path="/tenders" element={<ContentListPage category="tender" />} />
          <Route path="/jobs" element={<ContentListPage category="job" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/vice-chancellor" element={<ViceChancellorPage />} />
          <Route path="/faculties" element={<FacultiesPage />} />
          <Route path="/campuses" element={<CampusesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <SiteFooter />
    </div>
  );
}
