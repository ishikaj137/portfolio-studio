import { useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import Lenis from 'lenis';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%',
  baseScale = 0.85,
  scaleDuration = 0.5,
  rotationAmount = 0,
  blurAmount = 0,
  useWindowScroll = false,
  onStackComplete
}) => {
  const scrollerRef = useRef(null);
  const stackCompletedRef = useRef(false);
  const animationFrameRef = useRef(null);
  const lenisRef = useRef(null);
  const cardsRef = useRef([]);
  const cardTopsRef = useRef([]);
  const endElementTopRef = useRef(0);

  const calculateProgress = useCallback((scrollTop, start, end) => {
    if (scrollTop <= start) return 0;
    if (scrollTop >= end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  // Compute exact layout top relative to document or scroller root without reflow
  const getOffsetTop = useCallback(
    element => {
      if (!element) return 0;
      let top = 0;
      let curr = element;
      const root = useWindowScroll ? null : scrollerRef.current;

      while (curr && curr !== root && curr !== document.body && curr !== document.documentElement) {
        top += curr.offsetTop;
        curr = curr.offsetParent;
      }
      return top;
    },
    [useWindowScroll]
  );

  const measurePositions = useCallback(() => {
    if (!cardsRef.current.length) return;

    cardTopsRef.current = cardsRef.current.map(card => getOffsetTop(card));

    const endEl = scrollerRef.current
      ? scrollerRef.current.querySelector('.scroll-stack-end')
      : document.querySelector('.scroll-stack-end');

    endElementTopRef.current = endEl ? getOffsetTop(endEl) : 0;
  }, [getOffsetTop]);

  const updateCardTransforms = useCallback(
    currentScroll => {
      const cards = cardsRef.current;
      if (!cards.length) return;

      const scrollTop =
        currentScroll !== undefined
          ? currentScroll
          : useWindowScroll
            ? window.scrollY
            : scrollerRef.current
              ? scrollerRef.current.scrollTop
              : 0;

      const containerHeight = useWindowScroll
        ? window.innerHeight
        : scrollerRef.current
          ? scrollerRef.current.clientHeight
          : window.innerHeight;

      const stackPositionPx = parsePercentage(stackPosition, containerHeight);
      const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);
      const endElementTop = endElementTopRef.current;

      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        if (!card) continue;

        const cardTop = cardTopsRef.current[i] || 0;
        const triggerStart = cardTop - stackPositionPx - itemStackDistance * i;
        const triggerEnd = cardTop - scaleEndPositionPx;
        const pinStart = cardTop - stackPositionPx - itemStackDistance * i;
        const pinEnd = endElementTop - containerHeight / 2;

        const scaleProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);
        const targetScale = baseScale + i * itemScale;
        const scale = 1 - scaleProgress * (1 - targetScale);
        const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;

        let translateY = 0;
        if (scrollTop >= pinStart && scrollTop <= pinEnd) {
          translateY = scrollTop - cardTop + stackPositionPx + itemStackDistance * i;
        } else if (scrollTop > pinEnd) {
          translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i;
        }

        const rotStr = rotation ? ` rotate(${rotation}deg)` : '';
        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${scale})${rotStr}`;

        if (i === cards.length - 1) {
          const isInView = scrollTop >= pinStart && scrollTop <= pinEnd;
          if (isInView && !stackCompletedRef.current) {
            stackCompletedRef.current = true;
            onStackComplete?.();
          } else if (!isInView && stackCompletedRef.current) {
            stackCompletedRef.current = false;
          }
        }
      }
    },
    [
      useWindowScroll,
      stackPosition,
      scaleEndPosition,
      itemStackDistance,
      itemScale,
      baseScale,
      rotationAmount,
      calculateProgress,
      parsePercentage,
      onStackComplete
    ]
  );

  const scrollListenerCleanupRef = useRef(null);

  const setupLenis = useCallback(() => {
    if (useWindowScroll) {
      if (window.__lenis) {
        const onScroll = ({ scroll }) => {
          updateCardTransforms(scroll);
        };
        window.__lenis.on('scroll', onScroll);
        scrollListenerCleanupRef.current = () => {
          window.__lenis?.off('scroll', onScroll);
        };
        lenisRef.current = window.__lenis;
        return window.__lenis;
      }

      const lenis = new Lenis({
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
        infinite: false,
        wheelMultiplier: 1.0,
      });

      lenis.on('scroll', ({ scroll }) => {
        updateCardTransforms(scroll);
      });

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    } else {
      const scroller = scrollerRef.current;
      if (!scroller) return;

      const lenis = new Lenis({
        wrapper: scroller,
        content: scroller.querySelector('.scroll-stack-inner'),
        duration: 1.2,
        easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.2,
        infinite: false,
        gestureOrientationHandler: true,
        normalizeWheel: true,
        wheelMultiplier: 1.0,
      });

      lenis.on('scroll', ({ scroll }) => {
        updateCardTransforms(scroll);
      });

      const raf = time => {
        lenis.raf(time);
        animationFrameRef.current = requestAnimationFrame(raf);
      };
      animationFrameRef.current = requestAnimationFrame(raf);

      lenisRef.current = lenis;
      return lenis;
    }
  }, [updateCardTransforms, useWindowScroll]);

  const getDistancePx = useCallback(
    dist => {
      if (typeof dist === 'string' && dist.endsWith('vh')) {
        return (parseFloat(dist) / 100) * window.innerHeight;
      }
      if (typeof dist === 'string' && dist.endsWith('px')) {
        return parseFloat(dist);
      }
      return typeof dist === 'number' ? dist : parseFloat(dist) || 0;
    },
    []
  );

  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller && !useWindowScroll) return;

    const cards = Array.from(
      scroller
        ? scroller.querySelectorAll('.scroll-stack-card')
        : document.querySelectorAll('.scroll-stack-card')
    );

    cardsRef.current = cards;
    const distancePx = getDistancePx(itemDistance);

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${distancePx}px`;
      }
      card.style.zIndex = i + 1;
      card.style.willChange = 'transform';
      card.style.transformOrigin = 'top center';
      card.style.backfaceVisibility = 'hidden';
      card.style.webkitBackfaceVisibility = 'hidden';
    });

    measurePositions();
    setupLenis();
    updateCardTransforms();

    return () => {
      if (scrollListenerCleanupRef.current) {
        scrollListenerCleanupRef.current();
        scrollListenerCleanupRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (lenisRef.current && lenisRef.current !== window.__lenis) {
        lenisRef.current.destroy();
      }
      lenisRef.current = null;
      stackCompletedRef.current = false;
      cardsRef.current = [];
    };
  }, [
    itemDistance,
    useWindowScroll,
    getDistancePx,
    measurePositions,
    setupLenis,
    updateCardTransforms
  ]);

  // Recalculate baseline offsets on window resize without affecting scroll
  useEffect(() => {
    const handleResize = () => {
      const distancePx = getDistancePx(itemDistance);
      cardsRef.current.forEach((card, i) => {
        if (i < cardsRef.current.length - 1) {
          card.style.marginBottom = `${distancePx}px`;
        }
      });
      measurePositions();
      updateCardTransforms();
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [getDistancePx, itemDistance, measurePositions, updateCardTransforms]);

  return (
    <div
      className={`scroll-stack-scroller ${useWindowScroll ? 'window-scroll' : ''} ${className}`.trim()}
      ref={scrollerRef}
    >
      <div className="scroll-stack-inner">
        {children}
        {/* Spacer so the last pin can release cleanly */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  );
};

export default ScrollStack;
