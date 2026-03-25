import api from './axios'

export const getMovies = (params) => api.get('/api/movies', { params })

export const getMovieById = (id) => api.get(`/api/movies/${id}`)

export const getTrending = () => api.get('/api/movies/trending')

export const getComingSoon = () => api.get('/api/movies/coming-soon')

export const getGenres = () => api.get('/api/genres')
