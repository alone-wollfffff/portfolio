import React, { useEffect, useMemo, useState } from 'react';
import { contactActions } from '../data/portfolioContent.js';
import { certificationCategories } from '../data/certificationsData.js';
import StackWheel from './StackWheel.jsx';
import '../styles/certification-sections.css';

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

function CertificationBrowser({ category }) {
  const [issuerIndex, setIssuerIndex] = useState(0);
  const [certIndex, setCertIndex] = useState(0);
  const activeIssuer = category.issuers[issuerIndex] || category.issuers[0];
  const activeCertificates = useMemo(() => activeIssuer?.certs || [], [activeIssuer]);
  const activeCertificate = activeCertificates[certIndex] || activeCertificates[0];

  useEffect(() => {
    setCertIndex(0);
  }, [issuerIndex]);

  return (
    <div className="cert-browser-panel" data-cert-browser={category.id}>
      <div className="cert-browser-inner cert-browser-inner--desktop">
        <div className="cb-col cb-col-issuer cb-folded">
          <p className="cb-col-label">Issuers</p>
          <div className="cb-wheel-wrap">
            <div className="cb-wheel-highlight"></div>
            <StackWheel
              items={category.issuers}
              activeIndex={issuerIndex}
              onSelect={setIssuerIndex}
              itemClassName="cb-issuer-btn"
              renderTitle={(item) => item.name}
              renderSubtitle={(item) => `${item.certs.length} certificate${item.certs.length > 1 ? 's' : ''}`}
            />
          </div>
        </div>

        <div className="cb-col cb-col-cert cb-folded">
          <p className="cb-col-label">Certificates</p>
          <div className="cb-wheel-wrap">
            <div className="cb-wheel-highlight"></div>
            <StackWheel
              items={activeCertificates}
              activeIndex={certIndex}
              onSelect={setCertIndex}
              itemClassName="cb-list-btn"
              renderTitle={(item) => item.name}
              renderSubtitle={(item) => item.year}
            />
          </div>
        </div>

        <div className="cb-view-col cb-folded">
          <p className="cb-col-label">Preview</p>
          <a
            href={(activeCertificate && (activeCertificate.url || activeCertificate.img)) || '#'}
            target="_blank"
            rel="noopener"
            className="cb-view-card"
          >
            <img
              src={activeCertificate?.img || ''}
              alt={activeCertificate ? `${activeCertificate.name} certificate preview` : ''}
              className="cb-view-img"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </div>

      <div className="cert-browser-inner cert-browser-inner--mobile">
        <div className="cb-mobile-group cb-mobile-group--issuers">
          <div className="cb-mobile-group-head">
            <p className="cb-col-label">Issuers</p>
            <span className="cb-mobile-group-count">
              {category.issuers.length} issuer{category.issuers.length > 1 ? 's' : ''}
            </span>
          </div>
          <MobileSelectionList
            items={category.issuers}
            activeIndex={issuerIndex}
            onSelect={setIssuerIndex}
            getKey={(item, index) => `${item.name}-${index}`}
            getTitle={(item) => item.name}
            getMeta={(item) => `${item.certs.length} cert${item.certs.length > 1 ? 's' : ''}`}
          />
        </div>

        <div className="cb-mobile-group cb-mobile-group--certificates">
          <div className="cb-mobile-group-head">
            <p className="cb-col-label">Certificates</p>
            <span className="cb-mobile-group-count">
              {activeCertificates.length} cert{activeCertificates.length > 1 ? 's' : ''}
            </span>
          </div>
          <MobileSelectionList
            items={activeCertificates}
            activeIndex={certIndex}
            onSelect={setCertIndex}
            getKey={(item, index) => `${item.name}-${item.year}-${index}`}
            getTitle={(item) => item.name}
            getSubtitle={() => ''}
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
            <img
              src={activeCertificate?.img || ''}
              alt={activeCertificate ? `${activeCertificate.name} certificate preview` : ''}
              className="cb-view-img"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export function CertificationSectionList() {
  return certificationCategories.map((category, index) => (
    <section key={category.id} className="screen certification-screen" id={`c${index + 1}`}>
      <div className="cert-stage certification-stage">
        <div className="cert-category-wrap">
          <div className="cert-browser-head slidein">
            <h3 className="cert-browser-title slidein-elm">{category.title}</h3>
          </div>
        </div>

        <div className="cert-browser-wrap">
          <CertificationBrowser category={category} />
        </div>
      </div>

      <div className="tl-bottom-peek">
        <p className="tl-status cert-scroll-label">// SCROLL</p>
        <div className="tl-dot-sm"></div>
      </div>
    </section>
  ));
}

export function CertificationContactActions() {
  return <ContactActions items={contactActions.certifications} />;
}
