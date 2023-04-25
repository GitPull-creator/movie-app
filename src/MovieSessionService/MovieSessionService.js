export default class MovieSessionService {
  _apyKey = 'api_key=0771135d11319620bd660054ca05d200'
  getResource = async (url) => {
    let res = await fetch(url)
    if (!res.ok) throw new Error(`Could not fetch ${url} status: ${res.status}`)
    return await res.json()
  }

  newGuestSession = async () => {
    return await this.getResource(`https://api.themoviedb.org/3/authentication/guest_session/new?${this._apyKey}`)
      .then((res) => {
        const { guest_session_id: sessionId } = res
        return {
          sessionId,
        }
      })
      .catch((error) => console.log(error))
  }

  getMoviesRating = async (session_id, page = 1) => {
    return await this.getResource(
      `https://api.themoviedb.org/3/guest_session/${session_id}/rated/movies?${this._apyKey}&language=en-US&sort_by=created_at.asc&page=${page}`
    )
      .then((res) => {
        const { page: currentPage, total_pages: countPages, total_results: countItems, results } = res
        return {
          currentPage,
          countPages,
          countItems,
          films: this._transformMovies(results),
        }
      })
      .catch((error) => console.log(error))
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

  getPosterUrl(imagePath) {
    return imagePath && `https://image.tmdb.org/t/p/original${imagePath}`
  }
  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d)
  }
}
