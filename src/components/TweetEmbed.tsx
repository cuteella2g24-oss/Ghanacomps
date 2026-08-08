import { useEffect, useRef, useState } from 'react';

/**
 * TweetEmbed — renders an X (Twitter) post inline using X's widgets.js, so a
 * post's native video plays right on the site. The script is injected once and
 * shared. On any failure we degrade to a plain "View post on X" link.
 */

interface TwitterWidgets {
  widgets: { createTweet: (id: string, el: HTMLElement, opts?: Record<string, unknown>) => Promise<HTMLElement | undefined> };
}
declare global {
  interface Window { twttr?: TwitterWidgets }
}

const WIDGETS_SRC = 'https://platform.twitter.com/widgets.js';

function loadWidgets(): Promise<TwitterWidgets> {
  if (window.twttr?.widgets) return Promise.resolve(window.twttr);
  return new Promise((resolve, reject) => {
    let s = document.getElementById('twitter-wjs') as HTMLScriptElement | null;
    if (!s) {
      s = document.createElement('script');
      s.id = 'twitter-wjs';
      s.src = WIDGETS_SRC;
      s.async = true;
      document.body.appendChild(s);
    }
    const started = Date.now();
    const check = () => {
      if (window.twttr?.widgets) resolve(window.twttr);
      else if (Date.now() - started > 12000) reject(new Error('twttr load timeout'));
      else setTimeout(check, 120);
    };
    s.addEventListener('load', check);
    s.addEventListener('error', () => reject(new Error('twttr load error')));
    check();
  });
}

/** Pull the numeric status id out of an x.com / twitter.com post URL. */
export function tweetId(url: string): string | null {
  const m = url.match(/status(?:es)?\/(\d+)/);
  return m ? m[1] : null;
}

interface Props {
  url: string;
  theme?: 'dark' | 'light';
  align?: 'center' | 'left';
}

export default function TweetEmbed({ url, theme = 'dark', align = 'center' }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const id = tweetId(url);

  useEffect(() => {
    if (!id || !ref.current) { setStatus('error'); return; }
    let cancelled = false;
    const host = ref.current;
    host.innerHTML = '';
    setStatus('loading');
    loadWidgets()
      .then(twttr => twttr.widgets.createTweet(id, host, { theme, align, dnt: true, conversation: 'none' }))
      .then(el => { if (!cancelled) setStatus(el ? 'ready' : 'error'); })
      .catch(() => { if (!cancelled) setStatus('error'); });
    return () => { cancelled = true; };
  }, [id, theme, align]);

  if (!id) {
    return url
      ? <a className="tweet-embed-link" href={url} target="_blank" rel="noopener">View post on X ↗</a>
      : null;
  }

  return (
    <div className="tweet-embed">
      <div ref={ref} className="tweet-embed-host" />
      {status === 'loading' && <div className="tweet-embed-status">Loading post…</div>}
      {status === 'error' && (
        <a className="tweet-embed-link" href={url} target="_blank" rel="noopener">View post on X ↗</a>
      )}
    </div>
  );
}
