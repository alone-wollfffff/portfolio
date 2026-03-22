export function canScrollWithin(target, deltaY) {
  let element = target;

  while (element && element !== document.body) {
    if (!(element instanceof HTMLElement)) {
      element = element.parentElement;
      continue;
    }

    const style = window.getComputedStyle(element);
    const overflowY = style.overflowY;
    const isScrollable =
      (overflowY === 'auto' || overflowY === 'scroll') &&
      element.scrollHeight > element.clientHeight + 1;

    if (isScrollable) {
      const maxScrollTop = element.scrollHeight - element.clientHeight;
      if (deltaY > 0 && element.scrollTop < maxScrollTop - 1) return true;
      if (deltaY < 0 && element.scrollTop > 1) return true;
    }

    element = element.parentElement;
  }

  return false;
}

export function registerListener(cleanups, target, eventName, handler, options) {
  target.addEventListener(eventName, handler, options);
  cleanups.push(() => target.removeEventListener(eventName, handler, options));
}

export function registerWheelListener(cleanups, handler) {
  const options = { passive: false };
  window.addEventListener('wheel', handler, options);
  cleanups.push(() => window.removeEventListener('wheel', handler, options));
}
