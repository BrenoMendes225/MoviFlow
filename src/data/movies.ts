export interface Movie {
  id: string;
  title: string;
  type: 'movie' | 'series';
  genres: string[];
  poster: string;
  backdrop: string;
  synopsis: string;
  director: string;
  cast: string[];
  rating: number;
  year: number;
}

export const MOVIES: Movie[] = [
  {
    id: '1',
    title: 'Interestelar',
    type: 'movie',
    genres: ['Ficção Científica', 'Drama', 'Aventura'],
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop',
    synopsis: 'Quando a Terra se torna inabitável, uma equipe de ex-pilotos e cientistas viaja através de um buraco de minhoca em busca de um novo lar para a humanidade.',
    director: 'Christopher Nolan',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'],
    rating: 4.8,
    year: 2014,
  },
  {
    id: '2',
    title: 'Batman: O Cavaleiro das Trevas',
    type: 'movie',
    genres: ['Ação', 'Crime', 'Drama'],
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?q=80&w=2000&auto=format&fit=crop',
    synopsis: 'Quando a ameaça conhecida como Coringa causa estragos e caos no povo de Gotham, Batman deve aceitar um dos maiores testes psicológicos e físicos de sua habilidade para combater a injustiça.',
    director: 'Christopher Nolan',
    cast: ['Christian Bale', 'Heath Ledger', 'Aaron Eckhart'],
    rating: 4.9,
    year: 2008,
  },
  {
    id: '3',
    title: 'Stranger Things',
    type: 'series',
    genres: ['Ficção Científica', 'Terror', 'Drama'],
    poster: 'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop',
    synopsis: 'Quando um menino desaparece, uma pequena cidade descobre um mistério envolvendo experimentos secretos, forças sobrenaturais aterrorizantes e uma garota estranha.',
    director: 'Os Irmãos Duffer',
    cast: ['Millie Bobby Brown', 'Finn Wolfhard', 'Winona Ryder'],
    rating: 4.7,
    year: 2016,
  },
  {
    id: '4',
    title: 'A Origem',
    type: 'movie',
    genres: ['Ficção Científica', 'Ação', 'Suspense'],
    poster: 'https://images.unsplash.com/photo-1500462859194-885860bb81ce?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2000&auto=format&fit=crop',
    synopsis: 'Um ladrão que rouba segredos corporativos através do uso da tecnologia de compartilhamento de sonhos recebe a tarefa inversa de plantar uma ideia na mente de um C.E.O.',
    director: 'Christopher Nolan',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'],
    rating: 4.8,
    year: 2010,
  },
  {
    id: '5',
    title: 'O Urso',
    type: 'series',
    genres: ['Drama', 'Comédia'],
    poster: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2000&auto=format&fit=crop',
    synopsis: 'Um jovem chef do mundo da alta gastronomia retorna a Chicago para administrar a lanchonete de sua família.',
    director: 'Christopher Storer',
    cast: ['Jeremy Allen White', 'Ayo Edebiri', 'Ebon Moss-Bachrach'],
    rating: 4.6,
    year: 2022,
  }
];

export const GENRES = [
  'Ação', 'Comédia', 'Drama', 'Terror', 'Ficção Científica', 'Suspense', 'Romance', 'Documentário', 'Aventura', 'Animação'
];
