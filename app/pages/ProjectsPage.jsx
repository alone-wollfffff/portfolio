import React from 'react';
import { BackgroundCanvas, Header, Preloader, ScrollNav } from '../components/PageChrome.jsx';
import { ProjectContactActions, ProjectSectionList, useProjectVideoSpeed } from '../components/ProjectSections.jsx';
import { projects } from '../data/portfolioContent.js';
import { useSectionPage } from '../hooks/useSectionPage.js';

export default function ProjectsPage() {
  const contactSectionId = `p${projects.length + 1}`;

  useProjectVideoSpeed();
  useSectionPage({
    sectionCameraOffsets: [0].concat(projects.map((_, index) => -0.5 * (index + 1))).concat([0]),
  });

  return (
    <div className="portfolio-page portfolio-page--projects">
      <BackgroundCanvas />
      <Preloader />
      <Header
        links={[
          { label: 'Home', href: 'index.html' },
          { label: 'Certs', href: 'certifications.html' },
        ]}
        logo="OBV"
      />

      <ScrollNav count={projects.length + 2} prefix="p" />

      <div id="app" className="page-app page-app--projects">
        <section className="screen projects-screen projects-screen--hero" id="p0">
          <div className="proj-hero-inner">
            <div className="opp-badge slide-up-elm">
              <span className="opp-icon">&#9889;</span>// Projects...
            </div>
            <div className="slidein">
              <h1 className="built-h2 slidein-elm">What I've Built...</h1>
            </div>
            <div className="slidein">
              <p className="proj-hero-sub slidein-elm">End-to-end ML systems, AI tools, and intelligent web apps - built from scratch and deployed to production.</p>
            </div>
            <div className="slidein">
              <div className="proj-stats slidein-elm">
                <div className="proj-stat-item">
                  <span className="proj-stat-n">{String(projects.length).padStart(2, '0')}</span>
                  <span className="proj-stat-l">Live Projects</span>
                </div>
                <div className="proj-stat-item">
                  <span className="proj-stat-n">&#8734;</span>
                  <span className="proj-stat-l">In Progress</span>
                </div>
              </div>
            </div>
            <div className="proj-scroll-hint">
              <div className="sh-line"></div>
              <span>Scroll to Explore</span>
            </div>
          </div>
        </section>

        <div id="sticky-card" className="page-sticky-card page-sticky-card--projects">
          <ProjectSectionList />
        </div>

        <section className="screen projects-screen projects-screen--contact" id={contactSectionId}>
          <div className="geo-tri" style={{ top: '15%', left: '4%', width: '36px', height: '36px', opacity: '.25' }}></div>
          <div className="geo-tri" style={{ bottom: '20%', right: '6%', width: '28px', height: '28px', opacity: '.2' }}></div>
          <div className="geo-sq" style={{ top: '45%', left: '8%', width: '7px', height: '7px', opacity: '.2' }}></div>
          <div className="geo-sq" style={{ bottom: '35%', right: '5%', width: '9px', height: '9px', opacity: '.18' }}></div>

          <div className="contact-inner">
            <div className="slidein"><p className="cert-sec-label slidein-elm">// What's Next</p></div>
            <div className="slidein">
              <h2 className="contact-h2 slidein-elm">More Projects<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.45)' }}>Coming Soon...</em></h2>
            </div>
            <div className="slidein">
              <p className="contact-sub slidein-elm">New projects are actively in development - from agentic AI systems to advanced data pipelines. Check back soon, or reach out to collaborate.</p>
            </div>
            <div className="slidein">
              <div className="contact-btns slidein-elm"><ProjectContactActions /></div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
