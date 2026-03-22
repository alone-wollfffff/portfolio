import { canScrollWithin, registerListener, registerWheelListener } from './sectionPageUtils.js';

export function createSectionController({
  navLinkMap = null,
  onSectionEnter = null,
  onSectionLeave = null,
  cleanups,
}) {
  const screens = [];
  const navDots = [];
  const navLinks = [];

  let current = 0;
  let animating = false;

  function getUnlockDelayMs(screen, mobileViewport) {
    const revealElementCount = screen?.querySelectorAll('.slidein-elm').length || 0;
    const revealDurationMs = 720 + Math.max(0, revealElementCount - 1) * 80;

    if (mobileViewport) {
      return Math.min(Math.max(revealDurationMs + 60, 520), 760);
    }

    return Math.min(Math.max(revealDurationMs + 80, 780), 1120);
  }

  function initializeScreenState() {
    document.querySelectorAll('#app > .screen, #sticky-card > .screen').forEach((screen) => {
      screens.push(screen);
    });

    document.querySelectorAll('.sn-dot').forEach((dot) => {
      navDots.push(dot);
    });

    document.querySelectorAll('#main-nav a').forEach((link) => {
      navLinks.push(link);
    });

    screens.forEach((screen) => {
      screen.querySelectorAll('.slidein-elm').forEach((element, order) => {
        element.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${order * 0.09}s`;
      });
    });
  }

  function updateNav(index) {
    navDots.forEach((dot, dotIndex) => {
      dot.classList.toggle('active', dotIndex === index);
    });

    if (navLinkMap) {
      navLinks.forEach((link, linkIndex) => {
        link.classList.toggle('active', linkIndex === navLinkMap[index]);
      });
    }
  }

  function leaveScreen(screen, direction) {
    screen.classList.add('is-leaving');
    screen.classList.remove('is-visible');
    screen.querySelectorAll('.slidein-elm').forEach((element, order) => {
      element.style.transition = `transform .46s cubic-bezier(.4,0,.2,1) ${order * 0.03}s`;
      element.style.transform = direction > 0 ? 'translateY(-110%)' : 'translateY(110%)';
    });
  }

  function resetScreen(screen, direction) {
    screen.querySelectorAll('.slidein-elm').forEach((element) => {
      element.style.transition = 'none';
      element.style.transform = direction > 0 ? 'translateY(110%)' : 'translateY(-110%)';
    });
  }

  function showScreen(index, direction) {
    const screen = screens[index];
    const elements = screen.querySelectorAll('.slidein-elm');

    elements.forEach((element) => {
      element.style.transition = 'none';
      element.style.transform = direction === -1 ? 'translateY(-110%)' : 'translateY(110%)';
    });

    screen.classList.add('show');
    screen.classList.remove('is-leaving');

    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        elements.forEach((element, order) => {
          element.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${order * 0.08}s`;
          element.style.transform = 'translateY(0)';
        });
        screen.classList.add('is-visible');
      }),
    );
  }

  function revealFirstScreen() {
    const firstScreen = screens[0];
    if (!firstScreen) return;

    firstScreen.classList.add('show');
    firstScreen.querySelectorAll('.slidein-elm').forEach((element) => {
      element.style.transition = 'none';
      element.style.transform = 'translateY(110%)';
    });

    setTimeout(() => {
      firstScreen.querySelectorAll('.slidein-elm').forEach((element, order) => {
        element.style.transition = `transform .72s cubic-bezier(.4,0,.2,1) ${order * 0.08}s`;
        element.style.transform = 'translateY(0)';
      });
      firstScreen.classList.add('is-visible');
    }, 300);
  }

  function mountInputBindings(goTo) {
    let scrollConsumed = false;
    let scrollIdleTimer = null;
    const idleMs = 420;

    registerWheelListener(cleanups, (event) => {
      if (canScrollWithin(event.target, event.deltaY)) return;

      event.preventDefault();
      clearTimeout(scrollIdleTimer);

      if (!animating && !scrollConsumed) {
        scrollConsumed = true;
        goTo(current + (event.deltaY > 0 ? 1 : -1));
      }

      scrollIdleTimer = setTimeout(() => {
        scrollConsumed = false;
      }, idleMs);
    });
    cleanups.push(() => {
      if (scrollIdleTimer) clearTimeout(scrollIdleTimer);
    });

    registerListener(cleanups, window, 'keydown', (event) => {
      if (animating) return;
      if (event.key === 'ArrowDown' || event.key === 'PageDown') goTo(current + 1);
      if (event.key === 'ArrowUp' || event.key === 'PageUp') goTo(current - 1);
    });

    let touchStartY = 0;
    let touchStartX = 0;
    let touchConsumed = false;

    registerListener(
      cleanups,
      window,
      'touchstart',
      (event) => {
        touchStartY = event.touches[0].clientY;
        touchStartX = event.touches[0].clientX;
        touchConsumed = false;
      },
      { passive: true },
    );

    registerListener(
      cleanups,
      window,
      'touchend',
      (event) => {
        if (touchConsumed || animating) return;

        const deltaY = touchStartY - event.changedTouches[0].clientY;
        const deltaX = touchStartX - event.changedTouches[0].clientX;

        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 55) {
          touchConsumed = true;
          goTo(current + (deltaY > 0 ? 1 : -1));
        }
      },
      { passive: true },
    );

    document.querySelectorAll('[data-sec]').forEach((element) => {
      const handler = (event) => {
        if (element.tagName === 'A') event.preventDefault();
        const index = Number.parseInt(element.dataset.sec, 10);
        if (!Number.isNaN(index)) goTo(index);
      };

      element.addEventListener('click', handler);
      cleanups.push(() => element.removeEventListener('click', handler));
    });
  }

  function start(setCamSection) {
    initializeScreenState();

    const total = screens.length;
    const stickyCard = document.getElementById('sticky-card');
    const inCard = (index) => index >= 1 && index <= total - 2;
    const isMobileViewport = () => window.matchMedia('(max-width: 768px)').matches;

    function goTo(index) {
      if (index < 0 || index >= total || index === current || animating) return;

      animating = true;
      const previous = current;
      const direction = index > current ? 1 : -1;
      current = index;

      setCamSection(index);

      if (stickyCard && inCard(index) && !inCard(previous)) stickyCard.classList.add('show');

      const previousScreen = screens[previous];
      const nextScreen = screens[index];
      const mobileViewport = isMobileViewport();
      const insideStickyCard = inCard(previous) && inCard(index);
      const leaveDelayMs = mobileViewport ? (insideStickyCard ? 180 : 240) : 520;
      const unlockDelayMs = getUnlockDelayMs(nextScreen, mobileViewport);

      onSectionLeave?.(previous, previousScreen, direction);
      leaveScreen(previousScreen, direction);

      setTimeout(() => {
        previousScreen.classList.remove('show', 'is-visible', 'is-leaving');
        resetScreen(previousScreen, direction);

        if (stickyCard && !inCard(index) && inCard(previous)) stickyCard.classList.remove('show');

        showScreen(index, direction);
        onSectionEnter?.(index, nextScreen);

        setTimeout(() => {
          animating = false;
        }, unlockDelayMs);
      }, leaveDelayMs);

      updateNav(index);
    }

    revealFirstScreen();
    updateNav(0);
    mountInputBindings(goTo);

    return { goTo, total };
  }

  return { start };
}
