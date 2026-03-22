import React, { useEffect, useMemo, useState } from 'react';
import { contactActions, homeContent } from '../data/portfolioContent.js';
import { certificationCategories } from '../data/certificationsData.js';
import StackWheel from './StackWheel.jsx';
import '../styles/home-sections.css';

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

function MobileSelectionList({
  items,
  activeIndex,
  onSelect,
  getKey,
  getTitle,
  getMeta = () => '',
  getSubtitle = () => '',
}) {
  return (
    <div className="cb-mobile-list">
      {items.map((item, index) => {
        const meta = getMeta(item);
        const subtitle = getSubtitle(item);

        return (
          <button
            key={getKey(item, index)}
            type="button"
            className={`cb-mobile-item${index === activeIndex ? ' is-active' : ''}`}
            onClick={() => onSelect(index)}
          >
            <span className="cb-mobile-item-main">
              <strong>{getTitle(item)}</strong>
              {meta ? <span className="cb-mobile-meta">{meta}</span> : null}
            </span>
            {subtitle ? <span className="cb-mobile-subtitle">{subtitle}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function getHomeIssuerItems(issuer) {
  const homeSelectedCerts = issuer.certs.filter((cert) => cert.showOnHome === true);
  if (homeSelectedCerts.length) return homeSelectedCerts;

  const featuredCerts = issuer.certs.filter((cert) => cert.featured === true);
  if (featuredCerts.length) return featuredCerts;

  return issuer.certs.slice(0, 2);
}

function getHomeCategoryItems(category) {
  return category.issuers
    .flatMap((issuer) =>
      getHomeIssuerItems(issuer).map((cert) => ({
        ...cert,
        issuer: issuer.name,
      })),
    )
    .slice(0, 5);
}

export function HomeHeroSection() {
  const hero = homeContent.hero;

  return (
    <div className="s-inner hero-inner home-hero-layout">
      <div className="hero-left">
        <div className="slide-up delay-0">
          <div className="opp-badge slide-up-elm">
            <span className="opp-icon">&#9889;</span>
            {hero.badge}
          </div>
        </div>
        <div className="slide-left delay-1">
          <h1 className="hero-h1 slide-left-elm">
            {hero.firstName}
            <br />
            {hero.lastName}
          </h1>
        </div>
        <div className="slide-left delay-2">
          <p className="hero-role slide-left-elm">{hero.role}</p>
        </div>
        <div className="slide-left delay-3">
          <p className="hero-desc slide-left-elm">{hero.description}</p>
        </div>
        <div className="slide-up delay-4">
          <div className="hero-btns slide-up-elm">
            <a href={hero.primaryCta.href} className="btn-fill">
              <span dangerouslySetInnerHTML={{ __html: hero.primaryCta.iconHtml }} /> {hero.primaryCta.label}
            </a>
            <button className="btn-outline" data-sec="6">
              <span dangerouslySetInnerHTML={{ __html: hero.secondaryCta.iconHtml }} /> {hero.secondaryCta.label}
            </button>
          </div>
        </div>
      </div>
      <div className="hero-right">
        <div className="hero-photo-wrap float-up-enter">
          <img src={hero.portraitSrc} alt="Om Balaji Varpe" className="hero-photo-img" decoding="async" fetchPriority="high" />
          {hero.badges.map((badge, index) => (
            <div key={badge} className={`skill-badge sb-${index + 1} slide-right delay-${index + 3}`}>
              <span className="sb-dot"></span>
              {badge}
            </div>
          ))}
          <div className="hero-sparkle">&#10022;</div>
        </div>
      </div>
    </div>
  );
}

export function HomeAboutSection() {
  const about = homeContent.about;

  return (
    <div className="s-inner about-inner home-about-layout">
      <div className="about-left">
        <div className="slidein">
          <h2 className="sec-h2 slidein-elm" dangerouslySetInnerHTML={{ __html: about.headingHtml }} />
        </div>
      </div>
      <div className="about-right">
        <div className="slidein">
          <p className="body-lg slidein-elm" dangerouslySetInnerHTML={{ __html: about.lead }} />
        </div>
        {about.paragraphs.map((paragraph) => (
          <div key={paragraph} className="slidein">
            <p className="body-text slidein-elm" dangerouslySetInnerHTML={{ __html: paragraph }} />
          </div>
        ))}
        <div className="slidein">
          <div className="stat-row slidein-elm">
            {about.stats.map((stat) => (
              <div key={stat.label} className="stat">
                <span className="stat-n" dangerouslySetInnerHTML={{ __html: stat.value }} />
                <span className="stat-l">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="slidein">
          <div className="edu-list slidein-elm">
            {about.education.map((item) => (
              <div key={`${item.year}-${item.degree}`} className="edu-item">
                <span className="edu-yr">{item.year}</span>
                <span className="edu-deg">{item.degree}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeSkillsSection() {
  const skills = homeContent.skills;

  return (
    <div className="s-inner skills-inner home-skills-layout">
      <div className="skills-left">
        <div className="slidein">
          <h2 className="sec-h2 slidein-elm" dangerouslySetInnerHTML={{ __html: skills.headingHtml }} />
        </div>
      </div>
      <div className="skills-right">
        {skills.groups.map((group) => (
          <div key={group.label} className="slidein">
            <div className="skill-group slidein-elm">
              <p className="sg-label" dangerouslySetInnerHTML={{ __html: group.label }} />
              <div className="tags">
                {group.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="slidein">
          <div className="skill-bars slidein-elm">
            {skills.bars.map((bar) => (
              <div key={bar.label} className="sb-row">
                <span className="sbl">{bar.label}</span>
                <div className="sbt">
                  <div className="sbf" data-w={bar.value}></div>
                </div>
                <span className="sbp">{bar.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function HomeCertLegend() {
  return certificationCategories.map((category) => (
    <span key={category.id}>
      <i className="cleg-dot" style={{ background: category.accent }}></i>
      {category.title}
    </span>
  ));
}

export function HomeCertificateBrowser() {
  const [categoryIndex, setCategoryIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const homeCategories = useMemo(
    () =>
      certificationCategories.map((category) => ({
        ...category,
        certificateCount: getHomeCategoryItems(category).length,
      })),
    [],
  );
  const activeCategory = homeCategories[categoryIndex] || homeCategories[0];
  const homeCertificates = useMemo(() => getHomeCategoryItems(activeCategory), [activeCategory]);
  const activeCertificate = homeCertificates[certIndex] || homeCertificates[0];

  useEffect(() => {
    setCertIndex(0);
  }, [categoryIndex]);

  return (
    <div className="cert-browser-shell">
      <div className="cert-browser-inner cert-browser-inner--desktop home-cert-browser">
        <div className="cb-col cb-wheel-wrap cb-folded" id="col1-wrap">
          <div className="cb-wheel-highlight"></div>
          <StackWheel
            items={homeCategories}
            activeIndex={categoryIndex}
            onSelect={setCategoryIndex}
            itemClassName="cb-cat-btn"
            renderTitle={(item) => item.title}
            renderSubtitle={(item) => `${item.certificateCount} certificate${item.certificateCount > 1 ? 's' : ''}`}
          />
        </div>

        <div className="cb-col cb-wheel-wrap cb-folded" id="col2-wrap">
          <div className="cb-wheel-highlight"></div>
          <StackWheel
            items={homeCertificates}
            activeIndex={certIndex}
            onSelect={setCertIndex}
            itemClassName="cb-list-btn"
            renderTitle={(item) => item.name}
            renderSubtitle={(item) => `${item.issuer} | ${item.year}`}
          />
        </div>

        <div className="cb-col cb-view-col cb-folded">
          <a
            href={(activeCertificate && (activeCertificate.url || activeCertificate.img)) || '#'}
            target="_blank"
            rel="noopener"
            id="cb-view-link"
            className="cb-view-card"
          >
            <img src={activeCertificate?.img || ''} id="cb-view-img" alt="Certificate Preview" loading="lazy" decoding="async" />
          </a>
        </div>
      </div>

      <div className="cert-browser-inner cert-browser-inner--mobile home-cert-browser">
        <div className="cb-mobile-group cb-mobile-group--issuers">
          <p className="cb-col-label">Categories</p>
          <MobileSelectionList
            items={homeCategories}
            activeIndex={categoryIndex}
            onSelect={setCategoryIndex}
            getKey={(item, index) => `${item.title}-${index}`}
            getTitle={(item) => item.title}
            getMeta={(item) => `${item.certificateCount} cert${item.certificateCount > 1 ? 's' : ''}`}
          />
        </div>

        <div className="cb-mobile-group cb-mobile-group--certificates">
          <p className="cb-col-label">Certificates</p>
          <MobileSelectionList
            items={homeCertificates}
            activeIndex={certIndex}
            onSelect={setCertIndex}
            getKey={(item, index) => `${item.name}-${item.issuer}-${index}`}
            getTitle={(item) => item.name}
            getMeta={(item) => item.issuer}
          />
        </div>

        <div className="cb-mobile-group cb-mobile-group--preview">
          <p className="cb-col-label">Preview</p>
          <a
            href={(activeCertificate && (activeCertificate.url || activeCertificate.img)) || '#'}
            target="_blank"
            rel="noopener"
            className="cb-view-card cb-view-card--mobile"
          >
            <img src={activeCertificate?.img || ''} alt="Certificate Preview" className="cb-view-img" loading="lazy" decoding="async" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function HomeContactSection() {
  const contact = homeContent.contact;

  return (
    <div className="home-contact-layout">
      <div className="geo-tri" style={{ bottom: '10%', left: '3%', width: '40px', height: '40px', opacity: '.3' }}></div>
      <div className="geo-tri" style={{ top: '20%', right: '5%', width: '30px', height: '30px', opacity: '.2' }}></div>
      <div className="geo-sq" style={{ top: '40%', right: '8%', width: '8px', height: '8px', opacity: '.25' }}></div>
      <div className="geo-sq" style={{ bottom: '30%', left: '6%', width: '7px', height: '7px', opacity: '.2' }}></div>
      <div className="contact-inner">
        <div className="slidein">
          <p className="cert-sec-label slidein-elm">{contact.label}</p>
        </div>
        <div className="slidein">
          <h2 className="contact-h2 slidein-elm">{contact.title}</h2>
        </div>
        <div className="slidein">
          <p className="contact-sub slidein-elm" dangerouslySetInnerHTML={{ __html: contact.subtitle }} />
        </div>
        <div className="slidein">
          <div className="contact-btns slidein-elm">
            <ContactActions items={contactActions.home} />
          </div>
        </div>
      </div>
    </div>
  );
}
