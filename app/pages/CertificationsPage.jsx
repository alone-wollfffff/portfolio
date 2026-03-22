import React, { useEffect, useRef } from 'react';
import { BackgroundCanvas, Header, Preloader, ScrollNav } from '../components/PageChrome.jsx';
import { CertificationContactActions, CertificationSectionList } from '../components/CertificationSections.jsx';
import { certificationCategories, getCertificationStats } from '../data/certificationsData.js';
import { useSectionPage } from '../hooks/useSectionPage.js';

function getSectionBrowserColumns(screen) {
  if (!screen) return null;

  return {
    issuerCol: screen.querySelector('.cb-col-issuer'),
    certCol: screen.querySelector('.cb-col-cert'),
    viewCol: screen.querySelector('.cb-view-col'),
  };
}

function clearScheduledTimers(ref) {
  ref.current.forEach((timerId) => {
    window.clearTimeout(timerId);
  });
  ref.current = [];
}

function scheduleTimer(ref, callback, delay) {
  const timerId = window.setTimeout(() => {
    ref.current = ref.current.filter((pendingId) => pendingId !== timerId);
    callback();
  }, delay);

  ref.current.push(timerId);
  return timerId;
}

export default function CertificationsPage() {
  const stats = getCertificationStats();
  const browserTimersRef = useRef([]);
  const readyTimersRef = useRef([]);

  useEffect(() => () => {
    clearScheduledTimers(browserTimersRef);
    clearScheduledTimers(readyTimersRef);
  }, []);

  useSectionPage({
    sectionCameraOffsets: [0].concat(certificationCategories.map((_, index) => -0.45 * (index + 1))).concat([0]),
    onSectionEnter: (_index, screen) => {
      const columns = getSectionBrowserColumns(screen);
      if (!columns) return;
      clearScheduledTimers(browserTimersRef);

      [columns.issuerCol, columns.certCol, columns.viewCol].forEach((node) => {
        if (node) node.classList.add('cb-folded');
      });

      scheduleTimer(browserTimersRef, () => {
        if (columns.issuerCol) columns.issuerCol.classList.remove('cb-folded');
        scheduleTimer(browserTimersRef, () => {
          if (columns.certCol) columns.certCol.classList.remove('cb-folded');
        }, 150);
        scheduleTimer(browserTimersRef, () => {
          if (columns.viewCol) columns.viewCol.classList.remove('cb-folded');
        }, 300);
      }, 650);
    },
    onSectionLeave: (_index, screen) => {
      const columns = getSectionBrowserColumns(screen);
      if (!columns) return;
      clearScheduledTimers(browserTimersRef);

      if (columns.viewCol) columns.viewCol.classList.add('cb-folded');
      scheduleTimer(browserTimersRef, () => {
        if (columns.certCol) columns.certCol.classList.add('cb-folded');
      }, 120);
      scheduleTimer(browserTimersRef, () => {
        if (columns.issuerCol) columns.issuerCol.classList.add('cb-folded');
      }, 240);
    },
    onReady: (controller) => {
      const match = window.location.hash.match(/^#c(\d+)$/i);
      if (!match) return;
      const index = Number.parseInt(match[1], 10);
      if (Number.isNaN(index) || index < 0 || index >= controller.total) return;
      clearScheduledTimers(readyTimersRef);
      scheduleTimer(readyTimersRef, () => controller.goTo(index), 650);
    },
  });

  return (
    <div className="portfolio-page portfolio-page--certifications">
      <BackgroundCanvas />
      <Preloader />
      <Header
        links={[
          { label: 'Home', href: 'index.html' },
          { label: 'Projects', href: 'projects.html' },
        ]}
        logo="OBV"
      />

      <ScrollNav count={certificationCategories.length + 2} prefix="c" />

      <div id="app" className="page-app page-app--certifications">
        <section className="screen certifications-screen certifications-screen--hero" id="c0">
          <div className="proj-hero-inner cert-hero-inner">
            <div className="opp-badge slide-up-elm">
              <span className="opp-icon">&#9889;</span>// Certifications...
            </div>
            <div className="slidein">
              <h1 className="built-h2 slidein-elm">Credentials &amp; Learning</h1>
            </div>
            <div className="slidein">
              <p className="proj-hero-sub cert-hero-sub slidein-elm">Four focused categories. Each card uses the original certificate browser interaction, but the first wheel is issuer so course series stay together.</p>
            </div>
            <div className="slidein">
              <div className="proj-stats slidein-elm">
                <div className="proj-stat-item">
                  <span className="proj-stat-n">{String(stats.categories).padStart(2, '0')}</span>
                  <span className="proj-stat-l">Categories</span>
                </div>
                <div className="proj-stat-item">
                  <span className="proj-stat-n">{String(stats.issuers).padStart(2, '0')}</span>
                  <span className="proj-stat-l">Issuers</span>
                </div>
                <div className="proj-stat-item">
                  <span className="proj-stat-n">{String(stats.certificates).padStart(2, '0')}</span>
                  <span className="proj-stat-l">Certificates</span>
                </div>
              </div>
            </div>
            <div className="proj-scroll-hint">
              <div className="sh-line"></div>
              <span>Scroll to Explore</span>
            </div>
          </div>
        </section>

        <div id="sticky-card" className="page-sticky-card page-sticky-card--certifications">
          <CertificationSectionList />
        </div>

        <section className="screen certifications-screen certifications-screen--contact" id="c5">
          <div className="geo-tri" style={{ top: '15%', left: '4%', width: '36px', height: '36px', opacity: '.25' }}></div>
          <div className="geo-tri" style={{ bottom: '20%', right: '6%', width: '28px', height: '28px', opacity: '.2' }}></div>
          <div className="geo-sq" style={{ top: '45%', left: '8%', width: '7px', height: '7px', opacity: '.2' }}></div>
          <div className="geo-sq" style={{ bottom: '35%', right: '5%', width: '9px', height: '9px', opacity: '.18' }}></div>

          <div className="contact-inner">
            <div className="slidein"><p className="cert-sec-label slidein-elm">// Keep Exploring</p></div>
            <div className="slidein">
              <h2 className="contact-h2 slidein-elm">Projects Still Matter<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.45)' }}>Most.</em></h2>
            </div>
            <div className="slidein">
              <p className="contact-sub slidein-elm">The homepage keeps the highlights short. This page holds the full category, issuer, and sub-course trail.</p>
            </div>
            <div className="slidein">
              <div className="contact-btns slidein-elm"><CertificationContactActions /></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
