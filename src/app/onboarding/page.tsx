'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { GENRES } from '@/data/movies';
import styles from './onboarding.module.css';

export default function GenreSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setUserGenres } = useUser();
  const router = useRouter();

  const toggleGenre = (genre: string) => {
    if (selected.includes(genre)) {
      setSelected(selected.filter((g) => g !== genre));
    } else {
      setSelected([...selected, genre]);
    }
  };

  const handleNext = async () => {
    if (selected.length >= 3) {
      await setUserGenres(selected);
      router.push('/discover');
    }
  };

  const genreData = [
    { name: 'Ação', icon: '⚡', image: 'https://images.unsplash.com/photo-1566433311776-8c39f471451c?auto=format&fit=crop&q=80&w=400', grid: 'large' },
    { name: 'Comédia', icon: '😊', image: 'https://images.unsplash.com/photo-1527224857853-e3df217fb423?auto=format&fit=crop&q=80&w=400', grid: 'small' },
    { name: 'Terror', icon: '💀', image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?auto=format&fit=crop&q=80&w=400', grid: 'small' },
    { name: 'Sci-Fi', icon: '🚀', image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=400', grid: 'small' },
    { name: 'Drama', icon: '🎭', image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=400', grid: 'small' },
    { name: 'Animação', icon: '✨', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600', grid: 'large' },
  ];

  return (
    <div className={styles.container}>
      <h1 className="animate-fade-in">O que você gosta de <span>assistir?</span></h1>
      <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Selecione seus gêneros favoritos para personalizarmos sua experiência.</p>
      
      <div className={`${styles.genreGrid} animate-fade-in`} style={{ animationDelay: '0.2s' }}>
        {genreData.map((genre) => (
          <div 
            key={genre.name} 
            className={`${styles.genreCard} ${selected.includes(genre.name) ? styles.selected : ''} ${styles[genre.grid]}`}
            onClick={() => toggleGenre(genre.name)}
          >
            <img src={genre.image} alt={genre.name} className={styles.cardImage} />
            <div className={styles.cardOverlay} />
            <div className={styles.cardContent}>
              <span className={styles.genreIcon}>{genre.icon}</span>
              <span className={styles.genreName}>{genre.name}</span>
            </div>
            {selected.includes(genre.name) && <div className={styles.checkMark}>✓</div>}
          </div>
        ))}
      </div>

      <button 
        className={`${styles.nextBtn} animate-fade-in`} 
        style={{ animationDelay: '0.4s' }}
        onClick={handleNext}
      >
        Continuar
      </button>
      <p className={styles.disclaimer}>VOCÊ PODE ALTERAR ISSO DEPOIS NAS CONFIGURAÇÕES</p>
    </div>
  );
}
