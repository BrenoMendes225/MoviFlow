'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { Movie } from '@/data/movies';
import { getTrendingMovies, mapToMovie, getDiscoverMovies, getNowPlayingMovies, searchMovies } from '@/lib/tmdb';
import { getAIRecommendations } from '@/lib/ai';
import Link from 'next/link';
import styles from './discover.module.css';

// Rotação diária: chave muda a cada 24h
function getDailyKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function getCachedRecommendations(): Movie[] | null {
  try {
    const cached = localStorage.getItem('curator_recommendations_v2'); // Versão 2 para forçar reset
    if (!cached) return null;
    const { key, movies } = JSON.parse(cached);
    if (key !== getDailyKey()) return null; // Expirado — novo dia
    return movies as Movie[];
  } catch {
    return null;
  }
}

function setCachedRecommendations(movies: Movie[]) {
  try {
    localStorage.setItem('curator_recommendations_v2', JSON.stringify({
      key: getDailyKey(),
      movies,
    }));
  } catch {}
}

export default function DiscoverPage() {
  const { 
    userGenres, 
    favoriteMovies, 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist 
  } = useUser();
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // ── 1. Buscar filmes nos cinemas para filtragem (não serão exibidos) ──
        const nowPlayingData = await getNowPlayingMovies();
        const nowPlayingIds = nowPlayingData ? nowPlayingData.map(m => m.id.toString()) : [];

        // ── 2. Recomendações com cache de 24h (Filtradas por Gênero e SEM cinema) ──
        const cached = getCachedRecommendations();
        if (cached && cached.length > 0) {
          setRecommended(cached.filter(m => !nowPlayingIds.includes(m.id)));
        } else if (userGenres.length > 0 || favoriteMovies.length > 0) {
          let fresh: any[] = [];
          
          // ── Tenta Recomendações de IA (GROQ) ──
          const aiTitles = await getAIRecommendations(userGenres, favoriteMovies);
          
          if (aiTitles.length > 0) {
            const aiResults = await Promise.all(
              aiTitles.map(async (title) => {
                try {
                  const searchData = await searchMovies(title);
                  return searchData[0] || null;
                } catch {
                  return null;
                }
              })
            );
            fresh = aiResults.filter(m => m !== null);
          }

          // ── Fallback se IA falhar ou não houver recomendações ──
          if (fresh.length === 0 && userGenres.length > 0) {
            const randomPage = Math.floor(Math.random() * 5) + 1;
            fresh = await getDiscoverMovies(userGenres, randomPage.toString(), nowPlayingIds);
          }

          const mapped = fresh
            .filter(m => 
              m.poster_path && 
              m.backdrop_path && 
              m.overview && 
              m.overview.trim() !== '' &&
              !m.title?.toLowerCase().includes('too many cooks') &&
              !m.title?.toLowerCase().includes('cooks')
            )
            .map(mapToMovie);
          
          const finalSelection = mapped.slice(0, 18);
          setCachedRecommendations(finalSelection);
          setRecommended(finalSelection);
        } else {
          // Fallback se não houver gêneros ou recomendações
          const trendingData = await getTrendingMovies();
          const tmdbTrending = trendingData
            .filter((m: any) => 
              m.poster_path && 
              m.backdrop_path && 
              m.overview && 
              m.overview.trim() !== '' &&
              !m.title?.toLowerCase().includes('too many cooks') &&
              !m.title?.toLowerCase().includes('cooks')
            )
            .map(mapToMovie);
          setRecommended(tmdbTrending.slice(0, 18));
        }
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [userGenres]);



  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Preparando seu cinema...</div>
      </div>
    );
  }

  const featured = recommended[0];


  return (
    <div className={styles.container}>

      {/* ── Featured ── */}
      {featured && (
        <section className={styles.featured}>
          <div className={styles.featuredCard}>
            <img src={featured.backdrop} alt={featured.title} className={styles.featuredImg} />
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredContent}>
              <span className={styles.categoryTag}>DESTAQUE DO DIA</span>
              <h1>{featured.title}</h1>
              <div className={styles.featuredActions}>
                <Link href={`/movie/${featured.id}`} className={styles.playBtn}>
                  <span>▶</span> Ver Detalhes
                </Link>
                <button
                  className={`${styles.plusBtn} ${watchlist.some(m => m.id === featured.id) ? styles.saved : ''}`}
                  onClick={() => watchlist.some(m => m.id === featured.id)
                    ? removeFromWatchlist(featured.id)
                    : addToWatchlist(featured)}
                >
                  {watchlist.some(m => m.id === featured.id) ? '✓' : '+'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}




      {/* ── Recomendados Para Você (18 filmes, rotação diária) ── */}
      {recommended.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Recomendados Para Você</h2>
            <span className={styles.refreshBadge}>🔄 Novos filmes todo dia</span>
          </div>
          <div className={styles.movieGrid}>
            {recommended.map(movie => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
                <div className={styles.posterWrapper}>
                  <img src={movie.poster} alt={movie.title} />
                  <div className={styles.ratingBadge}>★ {movie.rating}</div>
                </div>
                <div className={styles.movieInfo}>
                  <h3>{movie.title}</h3>
                  <p>{(movie.genres[0] || 'FILME').toUpperCase()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
