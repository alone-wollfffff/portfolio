import React from 'react';
import '../styles/page-chrome.css';

export function Preloader() {
  return (
    <div id="preloader">
      <div className="pl-cover left"></div>
      <div className="pl-cover right"></div>
      <div id="pl-num">0</div>
    </div>
  );
}

export function BackgroundCanvas() {
  return <canvas id="bg"></canvas>;
}

export function Header({ links, logo = 'OBV' }) {
  return (
    <header id="hdr">
      <div className="header-left">
        <div className="logo">{logo}</div>
      </div>
      <nav id="main-nav">
        {links.map((link) => (
          <a key={`${link.label}-${link.href || link.sec}`} href={link.href || '#'} data-sec={link.sec}>
            {link.label}
          </a>
        ))}
      </nav>
      <button id="hamburger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </header>
  );
}

export function ScrollNav({ count, prefix = '' }) {
  return (
    <div id="scroll-nav">
      {Array.from({ length: count }, (_, index) => (
        <div key={`${prefix}${index}`} className={`sn-dot${index === 0 ? ' active' : ''}`} data-sec={index}>
          <span></span>
        </div>
      ))}
    </div>
  );
}
