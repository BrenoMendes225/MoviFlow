'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';
import styles from './watchlist.module.css';

export default function WatchlistPage() {
  const { watchlist, removeFromWatchlist } = useUser();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Minha Lista</h1>
        <p>Sua coleção curada de filmes para vivenciar.</p>
      </div>

      {watchlist.length > 0 ? (
        <div className={styles.movieGrid}>
          {watchlist.map((movie) => (
            <div key={movie.id} className={styles.movieCard}>
              <div className={styles.posterWrapper}>
                <Link href={`/movie/${movie.id}`}>
                  <img src={movie.poster} alt={movie.title} />
                </Link>
                <button 
                  className={styles.removeBtn}
                  onClick={() => removeFromWatchlist(movie.id)}
                  title="Remover da lista"
                >
                  ✕
                </button>
                <div className={styles.ratingBadge}>
                  <span className={styles.star}>★</span>
                  {movie.rating}
                </div>
              </div>
              <div className={styles.movieInfo}>
                <h3>{movie.title}</h3>
                <p>{movie.genres[0].toUpperCase()}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎬</div>
          <h2>Sua lista está vazia</h2>
          <p>Comece a explorar e crie sua própria biblioteca de cinema.</p>
          <Link href="/discover" className={styles.discoverBtn}>Descobrir Filmes</Link>
        </div>
      )}
    </div>
  );
}
