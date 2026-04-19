'use client';

import { useState } from 'react';
import { Movie } from '@/data/movies';
import { getRandomMovie, mapToMovie } from '@/lib/tmdb';
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
      // Need details for director/cast
      setRandomMovie(mapToMovie(tmdbMovie));
    } catch (error) {
      console.error('Erro ao sortear:', error);
    } finally {
      setIsShuffling(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.badge}>ESCOLHA DA SORTE</span>
        <h1>Não consegue decidir o que <span>assistir?</span></h1>
        <p>Deixe o destino escolher sua próxima experiência cinematográfica.</p>
      </div>

      <div className={styles.slotMachine}>
        <div className={`${styles.display} ${isShuffling ? styles.shuffling : ''}`}>
          {isShuffling ? (
            <div className={styles.shufflingAnimation}>
              <div className={styles.filmStrip}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className={styles.shufflingPoster} />
                ))}
              </div>
            </div>
          ) : randomMovie ? (
            <div className={`${styles.result} animate-fade-in`}>
              <div className={styles.posterWrapper}>
                <img src={randomMovie.poster} alt={randomMovie.title} />
                <div className={styles.neonGlow} />
              </div>
              <div className={styles.resultInfo}>
                <span className={styles.matchTag}>COMBINAÇÃO PERFEITA</span>
                <h2>{randomMovie.title}</h2>
                <div className={styles.meta}>
                  <span>{randomMovie.year}</span>
                  <span>•</span>
                  <span>{randomMovie.genres[0]}</span>
                </div>
                <Link href={`/movie/${randomMovie.id}`} className={styles.viewBtn}>Ver Detalhes</Link>
              </div>
            </div>
          ) : (
            <div className={styles.placeholder}>
              <div className={styles.questionMark}>?</div>
              <p>TOQUE NO BOTÃO PARA SORTEAR</p>
            </div>
          )}
        </div>

        <button 
          className={styles.shuffleBtn} 
          onClick={handleShuffle}
          disabled={isShuffling}
        >
          <span className={styles.btnIcon}>⚡</span>
          {isShuffling ? 'SORTEANDO...' : 'SORTEAR AGORA'}
        </button>
      </div>
    </div>
  );
}
