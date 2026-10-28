'use client';

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

const captions = ['De ervaring', 'De ontmoeting', 'Het verhaal'];

// Only presentation state: the phone contents remain static, fictional examples.
export function PhoneCarousel({ children }: { children: ReactNode }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(0);
  const settleRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [selected, setSelected] = useState(0);
  const [mobile, setMobile] = useState(false);

  function select(index: number, animate = true) {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const next = Math.max(0, Math.min(slides.length - 1, index));
    const slide = slides[next];
    if (!slide) return;
    selectedRef.current = next;
    setSelected(next);
    const viewport = track.getBoundingClientRect();
    const bounds = slide.getBoundingClientRect();
    const left = track.scrollLeft + bounds.left - viewport.left - (track.clientWidth - bounds.width) / 2;
    track.scrollTo({ left, behavior: animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' });
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const query = window.matchMedia('(max-width: 650px)');
    let frame = 0;
    const resize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setMobile(query.matches);
        if (query.matches) select(selectedRef.current, false);
        else track.scrollTo({ left: 0, behavior: 'instant' });
      });
    };
    const observer = new ResizeObserver(resize);
    observer.observe(track);
    query.addEventListener('change', resize);
    resize();
    return () => {
      observer.disconnect();
      query.removeEventListener('change', resize);
      cancelAnimationFrame(frame);
      clearTimeout(settleRef.current);
    };
  }, []);

  function synchronizeAfterScroll() {
    clearTimeout(settleRef.current);
    settleRef.current = setTimeout(() => {
      const track = trackRef.current;
      if (!track || !window.matchMedia('(max-width: 650px)').matches) return;
      const bounds = track.getBoundingClientRect();
      const centre = bounds.left + track.clientWidth / 2;
      const distances = Array.from(track.children).map(slide => {
        const rect = slide.getBoundingClientRect();
        return Math.abs(rect.left + rect.width / 2 - centre);
      });
      const nearest = distances.indexOf(Math.min(...distances));
      selectedRef.current = nearest;
      setSelected(nearest);
    }, 120);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!mobile || event.target !== event.currentTarget || event.altKey || event.ctrlKey || event.metaKey) return;
    const destinations: Record<string, number> = {
      ArrowLeft: selectedRef.current - 1,
      ArrowRight: selectedRef.current + 1,
      Home: 0,
      End: captions.length - 1,
    };
    if (!(event.key in destinations)) return;
    event.preventDefault();
    select(destinations[event.key]);
  }

  return (
    <>
      <p id="phone-help" className="sr-only">Drie fictieve appvoorbeelden. Gebruik op mobiel de pijltjestoetsen, Home en End, de knoppen of swipe om te bladeren.</p>
      <div
        ref={trackRef}
        id="phone-track"
        className="phone-track"
        role={mobile ? 'region' : 'group'}
        aria-roledescription={mobile ? 'carrousel' : undefined}
        aria-label="Drie appvoorbeelden"
        aria-describedby="phone-help app-fiction-note"
        tabIndex={mobile ? 0 : -1}
        onKeyDown={handleKeyDown}
        onScroll={synchronizeAfterScroll}
      >
        {children}
      </div>
      <div className="swipe-controls">
        <button type="button" aria-label="Vorig appvoorbeeld" aria-controls="phone-track" aria-disabled={selected === 0} onClick={() => select(selectedRef.current - 1)}>←</button>
        <span aria-hidden="true">Swipe of tik om te ontdekken</span>
        <p className="carousel-status sr-only" role="status" aria-live="polite" aria-atomic="true">{selected + 1} van {captions.length} · {captions[selected]}</p>
        <button type="button" aria-label="Volgend appvoorbeeld" aria-controls="phone-track" aria-disabled={selected === captions.length - 1} onClick={() => select(selectedRef.current + 1)}>→</button>
      </div>
    </>
  );
}
