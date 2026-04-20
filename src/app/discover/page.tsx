'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Movie } from '@/data/movies';
import { getTrendingMovies, mapToMovie } from '@/lib/tmdb';
import Link from 'next/link';
import styles from './discover.module.css';

export default function DiscoverPage() {
  const { userGenres, watchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const trending = await getTrendingMovies();
        setMovies(trending.map(mapToMovie));
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando experiências cinematográficas...</div>
      </div>
    );
  }

  // Featured Movie (Movie of the Day)
  const featured = movies[0];

  const categories = ['Para Você', 'Ação', 'Drama', 'Ficção Científica', 'Terror', 'Comédia'];

  return (
    <div className={styles.container}>
      {featured && (
        <section className={styles.featured}>
          <div className={styles.featuredCard}>
            <img src={featured.backdrop} alt={featured.title} className={styles.featuredImg} />
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredContent}>
              <span className={styles.categoryTag}>EM DESTAQUE</span>
              <h1>{featured.title}</h1>
              <div className={styles.featuredActions}>
                <Link href={`/movie/${featured.id}`} className={styles.playBtn}>
                  <span className={styles.playIcon}>▶</span>
                  Assistir Agora
                </Link>
                <button 
                  className={`${styles.plusBtn} ${watchlist.some(m => m.id === featured.id) ? styles.saved : ''}`}
                  onClick={() => {
                    if (watchlist.some(m => m.id === featured.id)) {
                      removeFromWatchlist(featured.id);
                    } else {
                      addToWatchlist(featured);
                    }
                  }}
                  title="Adicionar à lista"
                >
                  {watchlist.some(m => m.id === featured.id) ? '✓' : '+'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <div className={styles.categoriesRow}>
        {categories.map((cat, i) => (
          <button key={cat} className={`${styles.catBtn} ${i === 0 ? styles.catActive : ''}`}>
            {cat}
          </button>
        ))}
      </div>

      {/* Trending Now */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Em Alta</h2>
          <Link href="/discover" className={styles.viewAll}>Ver Tudo</Link>
        </div>
        <div className={styles.movieGrid}>
          {movies.slice(1).map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
              <div className={styles.posterWrapper}>
                <img src={movie.poster} alt={movie.title} />
                <div className={styles.ratingBadge}>
                  <span className={styles.star}>★</span>
                  {movie.rating}
                </div>
              </div>
              <div className={styles.movieInfo}>
                <h3>{movie.title}</h3>
                <p>{movie.genres[0]?.toUpperCase() || 'FILME'}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
