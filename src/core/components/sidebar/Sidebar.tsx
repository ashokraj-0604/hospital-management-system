import Link from 'next/link';
import styles from './Sidebar.module.scss';
import { useSidebar } from './useSidebar';
import type { SidebarProps } from './Sidebar.types';

export function Sidebar({ items }: SidebarProps) {
  const { isCollapsed } = useSidebar();

  return (
    <aside className={styles.sidebar} data-collapsed={isCollapsed}>
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={styles.link}>
          {item.label}
        </Link>
      ))}
    </aside>
  );
}
