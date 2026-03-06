'use client';

import * as React from 'react';

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updatePreference = () => {
      setReduced(mediaQuery.matches);
    };

    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => {
        mediaQuery.removeEventListener('change', updatePreference);
      };
    }

    mediaQuery.addListener(updatePreference);
    return () => {
      mediaQuery.removeListener(updatePreference);
    };
  }, []);

  return reduced;
}

export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setInView(true);
      }
    }, options);

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return { ref, inView };
}

type HtmlTag = keyof HTMLElementTagNameMap;

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: HtmlTag;
};

export function Reveal({
  children,
  className,
  delayMs = 0,
  as = 'div',
}: RevealProps) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.12,
  });

  const style: React.CSSProperties | undefined =
    reduced || delayMs === 0
      ? undefined
      : { transitionDelay: `${delayMs}ms` };

  const Tag = as as HtmlTag;

  return React.createElement(
    Tag,
    {
      ref,
      className: [
        'cluba-reveal',
        inView ? 'cluba-reveal--in' : 'cluba-reveal--out',
        className ?? '',
      ].join(' '),
      style,
    },
    children
  );
}