import { useRef, useLayoutEffect, type ElementType } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useContent } from '../contexts/ContentContext';

interface Props {
  tag?: ElementType;
  eid: string;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

export default function Editable({ tag: Tag = 'div' as ElementType, eid, className, style, children }: Props) {
  const { isAdmin } = useAdmin();
  const { loaded, getEdit, setEdit } = useContent();
  const ref = useRef<HTMLElement>(null);
  const seeded = useRef(false);
  const applied = useRef(false);

  // Phase 1 — show the default copy immediately (no empty flash while content loads).
  useLayoutEffect(() => {
    if (!ref.current || seeded.current) return;
    seeded.current = true;
    ref.current.innerHTML = children;
  }, [children]);

  // Phase 2 — once server content arrives, apply any saved edit for this element.
  useLayoutEffect(() => {
    if (!ref.current || applied.current || !loaded) return;
    applied.current = true;
    const saved = getEdit(window.location.pathname, eid);
    if (saved != null) ref.current.innerHTML = saved;
  }, [loaded]);

  const props: Record<string, unknown> = {
    ref,
    className: `editable${className ? ` ${className}` : ''}`,
    'data-eid': eid,
    suppressContentEditableWarning: true,
    style,
  };
  if (isAdmin) {
    props.contentEditable = 'true';
    // Write through on blur so an edit is captured even if the admin navigates
    // to another page (client-side routing unmounts this node) before Saving.
    props.onBlur = () => {
      if (ref.current) setEdit(window.location.pathname, eid, ref.current.innerHTML);
    };
  }

  return <Tag {...props} />;
}
