export default class MovieApiService {
  _baseUrl = 'https://api.themoviedb.org/3/search/movie?'
  _apyKey = 'api_key=0771135d11319620bd660054ca05d200'
  getResource = async (url) => {
    let res = await fetch(url)

    if (!res.ok) throw new Error(`Could not fetch ${url} status: ${res.status}`)

    return await res.json()
  }

  getPosterUrl(imagePath) {
    return `https://image.tmdb.org/t/p/original${imagePath}`
  }
  isValidDate = (d) => {
    return d instanceof Date && !isNaN(d)
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

  _transformMovies(arr) {
    return arr.map(({ id, original_title, release_date, /*genres_ids,*/ overview, poster_path }) => {
      return {
        id: id,
        title: original_title,
        date: this.isValidDate(new Date(release_date)) ? new Date(release_date) : false,
        genres: ['Drama', 'Action'],
        description: overview,
        poster: this.getPosterUrl(poster_path),
      }
    })
  }
}
