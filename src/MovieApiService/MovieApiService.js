export default class MovieApiService {
  _baseUrl = 'https://api.themoviedb.org/3/search/movie?'
  _apyKey = 'api_key=0771135d11319620bd660054ca05d200'
  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) throw new Error(`Could not fetch ${url} status: ${res.status}`)

    return await res.json()
  }

  newGuestSession = async () => {
    return await this.getResource(
      'https://api.themoviedb.org/3/authentication/guest_session/new?api_key=0771135d11319620bd660054ca05d200'
    ).then((res) => {
      const { guest_session_id: sessionId } = res
      return {
        sessionId,
      }
    })
  }

  getPosterUrl(imagePath) {
    return imagePath && `https://image.tmdb.org/t/p/original${imagePath}`
  }
  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d)
  }

  rateMovies(filmId, rate) {
    let formData = new FormData()
    formData.append('value', `${rate}`)

    let requestOptions = {
      method: 'POST',
      body: formData,
      redirect: 'follow',
    }

    return fetch(
      `https://api.themoviedb.org/3/movie/${filmId}/rating?api_key=0771135d11319620bd660054ca05d200&guest_session_id=00710bb4934506fd93c1035413fe09f5`,
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log('error', error))
  }

  getMoviesRating = async (page = 1) => {
    return await this.getResource(
      `https://api.themoviedb.org/3/guest_session/00710bb4934506fd93c1035413fe09f5/rated/movies?api_key=0771135d11319620bd660054ca05d200&language=en-US&sort_by=created_at.asc&page=${page}`
    ).then((res) => {
      const { page: currentPage, total_pages: countPages, total_results: countItems, results } = res
      return {
        currentPage,
        countPages,
        countItems,
        films: this._transformMovies(results),
      }
    })
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

  getGenresDictionary = async () => {
    return await this.getResource(
      'https://api.themoviedb.org/3/genre/movie/list?api_key=0771135d11319620bd660054ca05d200&language=en-US'
    ).then((json) => {
      return json.genres.reduce((dictionary, { id, name }) => {
        return {
          ...dictionary,
          [id]: name,
        }
      }, {})
    })
  }

  _transformMovies(arr) {
    return arr.map(({ id, original_title, release_date, genre_ids, overview, poster_path, vote_average }) => {
      return {
        id: id,
        title: original_title,
        date: this.isValidDate(new Date(release_date)) ? new Date(release_date) : false,
        genres: genre_ids,
        description: overview,
        poster: this.getPosterUrl(poster_path),
        rate: vote_average,
      }
    })
  }
}
