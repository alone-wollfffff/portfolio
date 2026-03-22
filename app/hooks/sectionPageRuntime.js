import { shared } from '../lib/sharedRuntime.js';
import { createSectionController } from './sectionPageController.js';

export function initializeSectionPage({
  cleanups,
  sectionCameraOffsets,
  navLinkMap = null,
  onSectionEnter = null,
  onSectionLeave = null,
  onReady = null,
}) {
  if (!shared) return;

  const mouse = { x: 0, y: 0 };
  const camTarget = { x: 0, y: 0 };

  shared.initViewport();
  shared.initMouse(mouse);
  shared.initCursor();
  shared.initHamburger();

  const three = shared.initThree(mouse, camTarget, sectionCameraOffsets);

  shared.runPreloader(() => {
    three.triggerEntrance();
    document.getElementById('hdr')?.classList.add('show');
    document.getElementById('scroll-nav')?.classList.add('show');

    const controller = createSectionController({
      navLinkMap,
      onSectionEnter,
      onSectionLeave,
      cleanups,
    }).start(three.setCamSection);

    onReady?.(controller);
  });
}
