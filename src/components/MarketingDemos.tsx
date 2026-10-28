'use client';

import Image from 'next/image';
import { useRef, useState, type ReactNode, type MouseEvent } from 'react';
import { demoViews } from './DemoViews';

type View = keyof typeof demoViews | 'result';
type Story = 'post' | 'one' | 'two';

export function MarketingDemos({ children }: { children: ReactNode }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);
  const [view, setView] = useState<View>('offer');
  const [story, setStory] = useState<Story>('post');

  function open(event: MouseEvent<HTMLElement>) {
    if (!(event.target instanceof Element)) return;
    const button = event.target.closest<HTMLElement>('[data-demo]');
    const next = button?.dataset.demo;
    if (!next || !(next === 'result' || next in demoViews)) return;
    if (!dialog.current?.open) trigger.current = button;
    setView(next as View);
    setStory('post');
    if (!dialog.current?.open) dialog.current?.showModal();
    if (dialog.current) {
      dialog.current.scrollTop = 0;
      dialog.current.querySelector<HTMLButtonElement>('.close')?.focus();
    }
  }

  const storyData = {
    post: ['dining.jpg', 'Een avond om te delen.', 'sanne.creates · Samenwerking'],
    one: ['venue.jpg', 'Deze plek wil je kennen.', '@voorbeeldrestaurant · Samenwerking'],
    two: ['dining.jpg', 'Good things. Worth sharing.', 'Een diner voor twee · Samenwerking'],
  }[story];

  return <div id="top" onClick={open}>
    {children}
    <dialog ref={dialog} aria-label="Fictief GetIt voorbeeld" onClose={() => trigger.current?.focus()} onClick={event => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) event.currentTarget.close();
    }}>
      <button type="button" className="close" aria-label="Sluiten" onClick={() => dialog.current?.close()}>×</button>
      {view !== 'result' ? demoViews[view] : <>
        <div className="eyebrow">Het verhaal · fictief resultaat</div><h2>Van tafel naar tijdlijn.</h2>
        <p>Zo kan een creator jouw plek laten zien.</p>
        <div className="result-tabs" role="group" aria-label="Contentvoorbeeld">
          {(['post', 'one', 'two'] as const).map((key, i) => <button type="button" key={key} aria-pressed={story === key} onClick={() => setStory(key)}>{i === 0 ? 'Post' : `Story ${i}`}</button>)}
        </div>
        <div aria-live="polite" aria-atomic="true">
          {story === 'post' ? <div className="demo-post"><div className="post-meta"><Image className="avatar" src="/images/creator.jpg" width={58} height={58} alt="" /><strong>{storyData[2]}</strong></div><Image src={'/images/' + storyData[0]} width={1400} height={933} sizes="500px" alt="Voorbeeldpost van een diner" /><p>{storyData[1]}<br /><small>Een tafel om nog eens voor terug te komen. @voorbeeldrestaurant</small></p></div>
            : <div className="demo-story"><Image src={'/images/' + storyData[0]} width={1400} height={933} sizes="315px" alt="Fictief storyvoorbeeld" /><span className="story-label">{storyData[2]}</span><strong>{storyData[1]}</strong></div>}
        </div>
        <p className="fine">Fictieve content en tags. Geen echte publicatie of bereikcijfers. Hergebruik en advertenties worden apart afgesproken.</p>
      </>}
    </dialog>
  </div>;
}
