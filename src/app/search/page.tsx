'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { searchMovies, mapToMovie } from '@/lib/tmdb';
import { Movie } from '@/data/movies';
import Link from 'next/link';
import styles from './search.module.css';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return;
      setLoading(true);
      try {
        const data = await searchMovies(query);
        setMovies(data.map(mapToMovie));
      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Buscando o melhor do cinema...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Resultados para: <span>{query}</span></h1>
        <p>{movies.length} filmes encontrados</p>
      </header>

      {movies.length === 0 ? (
        <div className={styles.empty}>
          <p>Não encontramos nada com esse nome.</p>
          <Link href="/discover" className={styles.backBtn}>Voltar para o Início</Link>
        </div>
      ) : (
        <div className={styles.grid}>
          {movies.map((movie) => (
            <Link href={`/movie/${movie.id}`} key={movie.id} className={styles.card}>
              <div className={styles.poster}>
                <img src={movie.poster} alt={movie.title} />
                <div className={styles.rating}>★ {movie.rating}</div>
              </div>
              <div className={styles.info}>
                <h3>{movie.title}</h3>
                <p>{movie.year} • {movie.genres[0]}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SearchResults />
    </Suspense>
  );
}
