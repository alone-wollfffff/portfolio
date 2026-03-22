import { useEffect } from 'react';
import { initializeSectionPage } from './sectionPageRuntime.js';

export function useSectionPage({
  sectionCameraOffsets,
  navLinkMap = null,
  onSectionEnter = null,
  onSectionLeave = null,
  onReady = null,
}) {
  useEffect(() => {
    const cleanups = [];

    initializeSectionPage({
      cleanups,
      sectionCameraOffsets,
      navLinkMap,
      onSectionEnter,
      onSectionLeave,
      onReady,
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);
}
