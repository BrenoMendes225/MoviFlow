'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/data/movies';
import { getTrendingMovies, mapToMovie, getRandomMovie } from '@/lib/tmdb';
import Link from 'next/link';
import styles from './shuffler.module.css';

export default function ShufflerPage() {
  const [randomMovie, setRandomMovie] = useState<Movie | null>(null);
  const [isShuffling, setIsShuffling] = useState(false);

  const handleShuffle = async () => {
    setIsShuffling(true);
    setRandomMovie(null);
    
    try {
      const tmdbMovie = await getRandomMovie();
      const movie = mapToMovie(tmdbMovie);
      
      // Animação de sorteio (Dados 3D)
      setTimeout(() => {
        setRandomMovie(movie);
        setIsShuffling(false);
      }, 2500);
    } catch (error) {
      console.error('Erro ao sortear:', error);
      setIsShuffling(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundBlur} />
      
      <div className={styles.header}>
        <span className={styles.badge}>DÚVIDA CRUEL?</span>
        <h1>Cine<span>Sorteio</span></h1>
        <p>A sorte está lançada. Deixe o destino escolher por você.</p>
      </div>

      <div className={styles.shufflerContainer}>
        <div className={styles.slotMachine}>
          <div className={`${styles.display} ${isShuffling ? styles.isShuffling : ''}`}>
            {isShuffling ? (
              <div className={styles.diceContainer}>
                <div className={styles.dice}>
                  <div className={`${styles.face} ${styles.front}`}>1</div>
                  <div className={`${styles.face} ${styles.back}`}>6</div>
                  <div className={`${styles.face} ${styles.right}`}>3</div>
                  <div className={`${styles.face} ${styles.left}`}>4</div>
                  <div className={`${styles.face} ${styles.top}`}>5</div>
                  <div className={`${styles.face} ${styles.bottom}`}>2</div>
                </div>
              </div>
            ) : randomMovie ? (
              <div className={styles.resultContainer}>
                <div className={styles.posterWrapper}>
                  <img src={randomMovie.poster} alt={randomMovie.title} />
                  <div className={styles.ratingBadge}>★ {randomMovie.rating}</div>
                </div>
                <div className={styles.resultInfo}>
                  <span className={styles.matchTag}>RESULTADO DOS DADOS</span>
                  <h2>{randomMovie.title}</h2>
                  <p>{randomMovie.genres.join(' • ')}</p>
                  <Link href={`/movie/${randomMovie.id}`} className={styles.viewBtn}>
                    DETALHES DO FILME
                  </Link>
                </div>
              </div>
            ) : (
              <div className={styles.placeholder}>
                <div className={styles.questionMark}>?</div>
                <p>LANÇAR OS DADOS</p>
              </div>
            )}
          </div>
        </div>

        <button 
          className={styles.shuffleBtn} 
          onClick={handleShuffle}
          disabled={isShuffling}
        >
          <span className={styles.btnIcon}>🎲</span>
          {isShuffling ? 'LANÇANDO...' : 'JOGAR DADOS'}
        </button>
      </div>
    </div>
  );
}
