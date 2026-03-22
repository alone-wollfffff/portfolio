import React, { useEffect } from 'react';
import { contactActions, projects } from '../data/portfolioContent.js';
import '../styles/project-sections.css';

function ContactActions({ items }) {
  return items.map((item) => (
    <a
      key={`${item.href}-${item.label}`}
      href={item.href}
      className="cta-btn"
      target={item.external ? '_blank' : undefined}
      rel={item.external ? 'noopener' : undefined}
    >
      <span className="cta-icon" dangerouslySetInnerHTML={{ __html: item.iconHtml }} />
      {item.label}
    </a>
  ));
}

export function useProjectVideoSpeed() {
  useEffect(() => {
    const screens = Array.from(document.querySelectorAll('.project-screen'));

    function syncProjectVideos() {
      screens.forEach((screen) => {
        const video = screen.querySelector('.bm-video-wrap video');
        if (!video) return;

        video.playbackRate = 0.75;

        const isActive =
          !document.hidden &&
          screen.classList.contains('show') &&
          screen.classList.contains('is-visible');

        video.preload = isActive ? 'auto' : 'metadata';

        if (isActive) {
          const playAttempt = video.play();
          if (playAttempt && typeof playAttempt.catch === 'function') {
            playAttempt.catch(() => {});
          }
          return;
        }

        if (!video.paused) {
          video.pause();
        }
      });
    }

    const observer = new MutationObserver(() => {
      syncProjectVideos();
    });

    screens.forEach((screen) => {
      observer.observe(screen, { attributes: true, attributeFilter: ['class'] });
    });

    document.addEventListener('visibilitychange', syncProjectVideos);
    syncProjectVideos();

    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', syncProjectVideos);
      screens.forEach((screen) => {
        const video = screen.querySelector('.bm-video-wrap video');
        if (video && !video.paused) {
          video.pause();
        }
      });
    };
  }, []);
}

export function ProjectSectionList() {
  return projects.map((project) => (
    <section key={project.id} className="screen project-screen" id={project.id}>
      <div className="tl-line"></div>
      <div className="tl-top">
        <div className="slide-up"><p className="tl-status slide-up-elm">{project.status}</p></div>
        <div className="slide-up"><p className="tl-num slide-up-elm">{project.number}</p></div>
        <div className="slide-up"><div className="tl-play slide-up-elm">&#9654;</div></div>
      </div>
      <div className={`tl-card-zone project-card-zone ${project.cardSide}`}>
        <div className="tl-dot"></div>
        <div className={`slide-${project.cardSide}`}>
          <div className={`tl-card slide-${project.cardSide}-elm`}>
            <p className="pcb-meta">{project.meta}</p>
            <h3 className="pcb-title" dangerouslySetInnerHTML={{ __html: project.titleHtml }} />
            <p className="pcb-desc">{project.description}</p>
            <div className="pcb-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className={`tl-mockup-zone project-mockup-zone ${project.mockupSide}`}>
        <div className={`slide-${project.mockupSide}`}>
          <div className={`tl-mockup slide-${project.mockupSide}-elm`}>
            <div className="bm-chrome">
              <span className="bm-dot rd"></span>
              <span className="bm-dot yw"></span>
              <span className="bm-dot gn"></span>
              <div className="bm-url">{project.demoHost}</div>
            </div>
            <a href={project.demoUrl} target="_blank" rel="noopener" className="bm-video-wrap">
              <video src={project.mediaSrc} preload="metadata" loop muted playsInline></video>
            </a>
          </div>
        </div>
      </div>
      <div className="tl-bottom-peek">
        <div className="slide-up"><p className="tl-status slide-up-elm" style={{ opacity: '.35' }}>{project.nextStatus}</p></div>
        <div className="slide-up"><p className="tl-num slide-up-elm" style={{ opacity: '.2' }}>{project.nextNumber}</p></div>
        <div className="tl-dot-sm"></div>
      </div>
    </section>
  ));
}

export function ProjectContactActions() {
  return <ContactActions items={contactActions.projects} />;
}
