const KEYWORD_URL = "https://api.themoviedb.org/3/search/keyword?query=h&page=1";


const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer'
  }
};

const keywordData = await fetch(KEYWORD_URL, options).then(res => res.json());
const keywordId = keywordData.results[0].id;
console.log(keywordId)
const MOVIE_URL = `https://api.themoviedb.org/3/keyword/${keywordId}/movies`;
const movieData = await fetch(MOVIE_URL, options).then(res => res.json());

console.log(movieData);



