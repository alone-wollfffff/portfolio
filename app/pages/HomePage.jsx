import React, { useEffect, useRef } from 'react';
import { BackgroundCanvas, Header, Preloader, ScrollNav } from '../components/PageChrome.jsx';
import {
  HomeAboutSection,
  HomeCertLegend,
  HomeCertificateBrowser,
  HomeContactSection,
  HomeHeroSection,
  HomeSkillsSection,
} from '../components/HomeSections.jsx';
import { useSectionPage } from '../hooks/useSectionPage.js';

function setFoldedState(nodes, folded) {
  nodes.forEach((node) => {
    if (node) node.classList.toggle('cb-folded', folded);
  });
}

function getHomeBrowserNodes() {
  return [
    document.getElementById('col1-wrap'),
    document.getElementById('col2-wrap'),
    document.querySelector('#s5 .cb-view-col'),
  ];
}

function shouldAnimateHomeBrowser() {
  return window.matchMedia('(min-width: 769px)').matches;
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

export default function HomePage() {
  const skillTimersRef = useRef([]);
  const browserTimersRef = useRef([]);

  useEffect(() => {
    const element = document.querySelector('.hero-role');
    if (!element) return undefined;

    const roles = ['AI / ML Engineer', 'Data Scientist', 'Prompt Engineer', 'Web Developer'];
    let roleIndex = 0;
    let charIndex = roles[0].length;
    let isDeleting = true;
    let timerId = null;

    function type() {
      const currentText = roles[roleIndex];
      charIndex += isDeleting ? -1 : 1;

      element.innerHTML = `// ${currentText.substring(0, charIndex)}<span class="tw-cursor">|</span>`;

      let typeSpeed = isDeleting ? 40 : 90;

      if (!isDeleting && charIndex === currentText.length) {
        typeSpeed = 2500;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typeSpeed = 400;
      }

      timerId = window.setTimeout(type, typeSpeed);
    }

    timerId = window.setTimeout(type, 2500);

    return () => {
      if (timerId) window.clearTimeout(timerId);
    };
  }, []);

  useEffect(() => () => {
    clearScheduledTimers(skillTimersRef);
    clearScheduledTimers(browserTimersRef);
  }, []);

  useSectionPage({
    sectionCameraOffsets: [0, -0.5, -1, -1.5, -2, -2.5, 0],
    navLinkMap: { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, 5: 4, 6: 5 },
    onSectionEnter: (index) => {
      if (index === 2) {
        clearScheduledTimers(skillTimersRef);
        scheduleTimer(skillTimersRef, () => {
          document.querySelectorAll('.sbf').forEach((bar) => {
            bar.style.transition = 'width 1.4s cubic-bezier(.4,0,.2,1)';
            bar.style.width = `${bar.dataset.w}%`;
          });
        }, 600);
      }

      if (index === 5) {
        const [col1Wrap, col2Wrap, col3Wrap] = getHomeBrowserNodes();
        clearScheduledTimers(browserTimersRef);

        if (!shouldAnimateHomeBrowser()) {
          setFoldedState([col1Wrap, col2Wrap, col3Wrap], false);
          return;
        }

        setFoldedState([col1Wrap, col2Wrap, col3Wrap], true);
        scheduleTimer(browserTimersRef, () => {
          if (col1Wrap) col1Wrap.classList.remove('cb-folded');
          scheduleTimer(browserTimersRef, () => {
            if (col2Wrap) col2Wrap.classList.remove('cb-folded');
          }, 150);
          scheduleTimer(browserTimersRef, () => {
            if (col3Wrap) col3Wrap.classList.remove('cb-folded');
          }, 300);
        }, 650);
      }
    },
    onSectionLeave: (_index, screen) => {
      if (screen?.id === 's2') {
        clearScheduledTimers(skillTimersRef);
        screen.querySelectorAll('.sbf').forEach((bar) => {
          bar.style.transition = 'none';
          bar.style.width = '0';
        });
      }

      if (screen?.id === 's5') {
        const [col1Wrap, col2Wrap, col3Wrap] = getHomeBrowserNodes();
        clearScheduledTimers(browserTimersRef);

        if (!shouldAnimateHomeBrowser()) {
          setFoldedState([col1Wrap, col2Wrap, col3Wrap], false);
          return;
        }

        if (col3Wrap) col3Wrap.classList.add('cb-folded');
        scheduleTimer(browserTimersRef, () => {
          if (col2Wrap) col2Wrap.classList.add('cb-folded');
        }, 120);
        scheduleTimer(browserTimersRef, () => {
          if (col1Wrap) col1Wrap.classList.add('cb-folded');
        }, 240);
      }
    },
  });

  return (
    <div className="portfolio-page portfolio-page--home">
      <BackgroundCanvas />
      <Preloader />
      <Header
        links={[
          { label: 'Home', sec: 0 },
          { label: 'About', sec: 1 },
          { label: 'Skills', sec: 2 },
          { label: 'Projects', href: 'projects.html' },
          { label: 'Certs', href: 'certifications.html' },
          { label: 'Contact', sec: 6 },
        ]}
        logo="OBV"
      />
      <ScrollNav count={7} prefix="s" />

      <div id="app" className="page-app page-app--home">
        <section className="screen home-screen home-screen--hero" id="s0">
          <HomeHeroSection />
          <div className="scroll-hint">
            <div className="sh-line"></div>
            <span>SCROLL</span>
          </div>
        </section>

        <div id="sticky-card" className="page-sticky-card page-sticky-card--home">
          <section className="screen home-screen home-screen--about" id="s1"><HomeAboutSection /></section>
          <section className="screen home-screen home-screen--skills" id="s2"><HomeSkillsSection /></section>

          <section className="screen home-screen home-screen--projects" id="s3">
            <div className="built-inner">
              <div className="slidein">
                <h2 className="built-h2 slidein-elm">
                  <a href="projects.html" className="built-h2-link">What I've Built...</a>
                </h2>
              </div>
              <div className="slidein">
                <a href="projects.html" className="built-view-all slidein-elm">View All Projects -&gt;</a>
              </div>
            </div>
          </section>

          <section className="screen home-screen home-screen--certs" id="s4">
            <div className="cert-head-inner">
              <div className="slidein"><p className="cert-sec-label slidein-elm">04. Certifications</p></div>
              <div className="slidein"><h2 className="cert-head-h2 slidein-elm">Credentials &amp; Learning</h2></div>
              <div className="slidein">
                <div className="cert-legend slidein-elm"><HomeCertLegend /></div>
              </div>
              <div className="slidein">
                <p className="cert-hint slidein-elm">Home shows four category cards with featured certificates by issuer. The full page keeps every issuer series and sub-course certificate together.</p>
              </div>
              <div className="slidein">
                <a href="certifications.html" className="cert-head-link slidein-elm">View All Certifications -&gt;</a>
              </div>
            </div>
          </section>

          <section className="screen home-screen home-screen--browser" id="s5">
            <HomeCertificateBrowser />
            <div className="cert-browser-note">
              <span>Only a few certificates are shown here.</span>
              <a href="certifications.html">For more certificates click here -&gt;</a>
            </div>
          </section>
        </div>

        <section className="screen home-screen home-screen--contact" id="s6"><HomeContactSection /></section>
      </div>
    </div>
  );
}
