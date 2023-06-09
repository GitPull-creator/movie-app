export default class MovieBaseService {
  _baseUrl = 'https://api.themoviedb.org/3/search/movie?'
  _apyKey = 'api_key=0771135d11319620bd660054ca05d200'
  getResource = async (url) => {
    let res = await fetch(url)
    if (!res.ok) throw new Error(`Could not fetch ${url} status: ${res.status}`)
    return await res.json()
  }

  getMovies = async (query, page = 1) => {
    return await this.getResource(`${this._baseUrl}${this._apyKey}&language=en-US&query=${query}&page=${page}`).then(
      (res) => {
        const { page: currentPage, total_pages: countPages, total_results: countItems, results } = res
        return {
          currentPage,
          countPages,
          countItems,
          films: this._transformMovies(results),
        }
      }
    )
  }

  async rateMovies(filmId, rate, session_id) {
    let postData = new URLSearchParams({
      value: rate,
    })

    let res = await fetch(
      `https://api.themoviedb.org/3/movie/${filmId}/rating?${this._apyKey}&guest_session_id=${session_id}`,
      {
        method: 'POST',
        body: postData,
      }
    )
    if (!res.ok) throw new Error(`Could not post, status: ${res.status}`)
    return res
  }

  getGenresDictionary = async () => {
    return await this.getResource(`https://api.themoviedb.org/3/genre/movie/list?${this._apyKey}&language=en-US`)
      .then((json) => {
        return json.genres.reduce((dictionary, { id, name }) => {
          return {
            ...dictionary,
            [id]: name,
          }
        }, {})
      })
      .catch((error) => console.log(error))
  }

  getPosterUrl(imagePath) {
    return imagePath && `https://image.tmdb.org/t/p/original${imagePath}`
  }
  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d)
  }

  _transformMovies(arr) {
    return arr.map(({ id, original_title, release_date, genre_ids, overview, poster_path, vote_average, rating }) => {
      return {
        id: id,
        title: original_title,
        date: this.isValidDate(new Date(release_date)) ? new Date(release_date) : false,
        genres: genre_ids,
        description: overview,
        poster: this.getPosterUrl(poster_path),
        rate: vote_average,
        rating: rating,
      }
    })
  }
}
