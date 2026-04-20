'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Movie, MOVIES } from '@/data/movies';
import { getTrendingMovies, mapToMovie, getDiscoverMovies, getNowPlayingMovies, getRandomMovie } from '@/lib/tmdb';
import Link from 'next/link';
import styles from './discover.module.css';

export default function DiscoverPage() {
  const { userGenres, watchlist, addToWatchlist, removeFromWatchlist } = useUser();
  const [trending, setTrending] = useState<Movie[]>([]);
  const [recommended, setRecommended] = useState<Movie[]>([]);
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffledMovie, setShuffledMovie] = useState<Movie | null>(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const [trendingData, recommendedData, nowPlayingData] = await Promise.all([
          getTrendingMovies(),
          userGenres.length > 0 ? getDiscoverMovies(userGenres.slice(0, 3)) : Promise.resolve([]),
          getNowPlayingMovies()
        ]);

        // Combinar com banco de dados local para máxima variedade
        const tmdbTrending = trendingData.map(mapToMovie);
        const allTrending = [...MOVIES, ...tmdbTrending];
        setTrending(allTrending);

        if (recommendedData && recommendedData.length > 0) {
          setRecommended(recommendedData.map(mapToMovie));
        }

        if (nowPlayingData) {
          setNowPlaying(nowPlayingData.map(mapToMovie));
        }
      } catch (error) {
        console.error('Erro ao carregar filmes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [userGenres]);

  const handleShuffle = async () => {
    setIsShuffling(true);
    setShuffledMovie(null);
    
    try {
      // Buscar um filme realmente aleatório do TMDB (pool grande)
      const randomTMDB = await getRandomMovie();
      const randomMovie = mapToMovie(randomTMDB);
      
      // Animação de dados (2.5 segundos)
      setTimeout(() => {
        setShuffledMovie(randomMovie);
        setIsShuffling(false);
      }, 2500);
    } catch (error) {
      // Fallback para local se API falhar
      const randomLocal = trending[Math.floor(Math.random() * trending.length)];
      setTimeout(() => {
        setShuffledMovie(randomLocal);
        setIsShuffling(false);
      }, 2500);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Projetando o catálogo nas telas...</div>
      </div>
    );
  }

  const featured = nowPlaying[0] || recommended[0] || trending[0];

  return (
    <div className={styles.container}>
      {/* Shuffle FAB */}
      <button className={styles.shuffleFAB} onClick={handleShuffle} disabled={isShuffling}>
        <span className={styles.shuffleIcon}>🎲</span>
        {isShuffling ? 'LANÇANDO DADOS...' : 'SORTEAR FILME'}
      </button>

      {/* 3D DICE ANIMATION OVERLAY */}
      {isShuffling && (
        <div className={styles.shuffleOverlay}>
          <div className={styles.diceContainer}>
            <div className={styles.dice}>
              <div className={`${styles.face} ${styles.front}`}>1</div>
              <div className={`${styles.face} ${styles.back}`}>6</div>
              <div className={`${styles.face} ${styles.right}`}>3</div>
              <div className={`${styles.face} ${styles.left}`}>4</div>
              <div className={`${styles.face} ${styles.top}`}>5</div>
              <div className={`${styles.face} ${styles.bottom}`}>2</div>
            </div>
            <div className={styles.shuffleText}>O Destino decide...</div>
          </div>
        </div>
      )}

      {/* Shuffled Result Modal */}
      {shuffledMovie && !isShuffling && (
        <div className={styles.resultOverlay} onClick={() => setShuffledMovie(null)}>
          <div className={styles.resultCard} onClick={e => e.stopPropagation()}>
            <img src={shuffledMovie.backdrop} alt="" className={styles.resultBackdrop} />
            <div className={styles.resultContent}>
              <span className={styles.resultLabel}>A SORTE LANÇOU:</span>
              <h2>{shuffledMovie.title}</h2>
              <div className={styles.resultMeta}>
                <span>★ {shuffledMovie.rating}</span>
                <span>{shuffledMovie.year}</span>
              </div>
              <p>{shuffledMovie.synopsis.slice(0, 160)}...</p>
              <div className={styles.resultActions}>
                <Link href={`/movie/${shuffledMovie.id}`} className={styles.resultPlayBtn}>
                  DETALHES DO FILME
                </Link>
                <button className={styles.resultCloseBtn} onClick={handleShuffle}>
                  JOGAR NOVAMENTE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {featured && (
        <section className={styles.featured}>
          <div className={styles.featuredCard}>
            <img src={featured.backdrop} alt={featured.title} className={styles.featuredImg} />
            <div className={styles.featuredOverlay} />
            <div className={styles.featuredContent}>
              <span className={styles.categoryTag}>DESTAQUE DA SEMANA</span>
              <h1>{featured.title}</h1>
              <div className={styles.featuredActions}>
                <Link href={`/movie/${featured.id}`} className={styles.playBtn}>
                  <span className={styles.playIcon}>▶</span>
                  Ver Detalhes
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
                >
                  {watchlist.some(m => m.id === featured.id) ? '✓' : '+'}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Now Playing - NOS CINEMAS */}
      {nowPlaying.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Nos Cinemas Agora</h2>
            <Link href="/discover" className={styles.viewAll}>Ver Todos</Link>
          </div>
          <div className={styles.movieGrid}>
            {nowPlaying.slice(0, 6).map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
                <div className={styles.posterWrapper}>
                  <img src={movie.poster} alt={movie.title} />
                  <div className={styles.ratingBadge}>★ {movie.rating}</div>
                  <div className={styles.nowPlayingBadge}>NO CINEMA</div>
                </div>
                <div className={styles.movieInfo}>
                  <h3>{movie.title}</h3>
                  <p>{movie.genres[0]?.toUpperCase() || 'FILME'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {recommended.length > 0 && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>Para Você</h2>
            <Link href="/discover" className={styles.viewAll}>Ver Tudo</Link>
          </div>
          <div className={styles.movieGrid}>
            {recommended.slice(0, 6).map((movie) => (
              <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
                <div className={styles.posterWrapper}>
                  <img src={movie.poster} alt={movie.title} />
                  <div className={styles.ratingBadge}>★ {movie.rating}</div>
                </div>
                <div className={styles.movieInfo}>
                  <h3>{movie.title}</h3>
                  <p>{movie.genres[0]?.toUpperCase() || 'FILME'}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Explorar Catálogo</h2>
          <Link href="/discover" className={styles.viewAll}>Ver Tudo</Link>
        </div>
        <div className={styles.movieGrid}>
          {trending.slice(0, 18).map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.movieCard}>
              <div className={styles.posterWrapper}>
                <img src={movie.poster} alt={movie.title} />
                <div className={styles.ratingBadge}>★ {movie.rating}</div>
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
