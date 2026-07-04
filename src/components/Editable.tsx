import { useRef, useLayoutEffect, type ElementType } from 'react';
import { useAdmin, loadPageEdits } from '../contexts/AdminContext';

interface Props {
  tag?: ElementType;
  eid: string;
  className?: string;
  style?: React.CSSProperties;
  children: string;
}

export default function Editable({ tag: Tag = 'div' as ElementType, eid, className, style, children }: Props) {
  const { isAdmin } = useAdmin();
  const ref = useRef<HTMLElement>(null);
  const initialized = useRef(false);

  useLayoutEffect(() => {
    if (!ref.current || initialized.current) return;
    initialized.current = true;
    ref.current.innerHTML = children;
    const edits = loadPageEdits();
    if (edits[eid]) ref.current.innerHTML = edits[eid];
  }, []);

  const props: Record<string, unknown> = {
    ref,
    className: `editable${className ? ` ${className}` : ''}`,
    'data-eid': eid,
    suppressContentEditableWarning: true,
    style,
  };
  if (isAdmin) props.contentEditable = 'true';

  return <Tag {...props} />;
}
