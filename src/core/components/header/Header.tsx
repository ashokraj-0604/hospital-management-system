import styles from './Header.module.scss';
import { useHeader } from './useHeader';
import type { HeaderProps } from './Header.types';

export function Header({ title }: HeaderProps) {
  const header = useHeader(title);

  return (
    <header className={styles.header}>
      <h1>{header.title}</h1>
    </header>
  );
}
