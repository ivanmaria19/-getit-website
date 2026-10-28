'use client';

import { useRef, useState, type MouseEvent, type ReactNode } from 'react';
import type { Audience } from '@/lib/enquiries/validation';

export function EnquiryPopups({ children, creator, horeca }: { children: ReactNode; creator: ReactNode; horeca: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const previousOverflow = useRef('');
  const previousGutter = useRef('');
  const [audience, setAudience] = useState<Audience | null>(null);
  const [session, setSession] = useState(0);

  function open(event: MouseEvent<HTMLDivElement>) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLElement>('[data-enquiry], a[href="/interesse/creator"], a[href="/interesse/horeca"]');
    if (!link) return;
    event.preventDefault();
    trigger.current = link;
    setAudience(link.dataset.enquiry === 'creator' || link.getAttribute('href') === '/interesse/creator' ? 'creator' : 'horeca');
    setSession(value => value + 1);
    previousOverflow.current = document.body.style.overflow;
    previousGutter.current = document.documentElement.style.scrollbarGutter;
    document.documentElement.style.scrollbarGutter = 'stable';
    document.body.style.overflow = 'hidden';
    dialog.current?.showModal();
    if (dialog.current) dialog.current.scrollTop = 0;
  }

  return <div onClick={open}>
    {children}
    <dialog ref={dialog} className="enquiry-dialog" aria-label={audience === 'creator' ? 'Interesse als creator' : 'Interesse als horecazaak'} onClose={() => {
      document.body.style.overflow = previousOverflow.current;
      document.documentElement.style.scrollbarGutter = previousGutter.current;
      trigger.current?.focus({ preventScroll: true });
      setAudience(null);
    }} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const rect = event.currentTarget.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) event.currentTarget.close();
    }}>
      <button type="button" className="close" aria-label="Sluiten" autoFocus onClick={() => dialog.current?.close()}>×</button>
      <div key={session}>{audience === 'creator' ? creator : audience === 'horeca' ? horeca : null}</div>
    </dialog>
  </div>;
}
