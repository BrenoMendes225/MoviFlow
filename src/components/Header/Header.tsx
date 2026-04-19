'use client';

import { useUser } from '@/context/UserContext';
import styles from './Header.module.css';
import Link from 'next/link';

export default function Header() {
  const { isLoggedIn } = useUser();

  if (!isLoggedIn) return null;

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <Link href="/discover" className={styles.logo}>CURATOR</Link>
      </div>
      <div className={styles.right}>
        <button className={styles.iconBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
        <Link href="/profile" className={styles.avatar}>
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" />
        </Link>
      </div>
    </header>
  );
}
