'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { MOVIES } from '@/data/movies';
import styles from '../onboarding.module.css';

export default function MovieSelection() {
  const { userGenres } = useUser();
  const [selectedMovies, setSelectedMovies] = useState<string[]>([]);
  const router = useRouter();

  // Filter movies that match user's selected genres
  const filteredMovies = MOVIES.filter((movie) => 
    movie.genres.some((g) => userGenres.includes(g))
  );

  const toggleMovie = (id: string) => {
    if (selectedMovies.includes(id)) {
      setSelectedMovies(selectedMovies.filter((m) => m !== id));
    } else {
      setSelectedMovies([...selectedMovies, id]);
    }
  };

  const handleFinish = () => {
    router.push('/discover');
  };

  return (
    <div className={styles.container}>
      <h1 className="animate-fade-in">Diga-nos o que você <span>ama</span></h1>
      <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Selecione filmes que você já viu e gostou para nos ajudar a recomendar melhor.</p>
      
      <div className={`${styles.movieGrid} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        {filteredMovies.map((movie) => (
          <div 
            key={movie.id} 
            className={`${styles.movieCard} ${selectedMovies.includes(movie.id) ? styles.selected : ''}`}
            onClick={() => toggleMovie(movie.id)}
          >
            <img src={movie.poster} alt={movie.title} />
            <div className={styles.movieOverlay}>
              <span className={styles.movieTitle}>{movie.title}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        className={`${styles.nextBtn} animate-fade-in`} 
        style={{ animationDelay: '0.4s' }}
        onClick={handleFinish}
      >
        Começar a Explorar
      </button>
    </div>
  );
}
