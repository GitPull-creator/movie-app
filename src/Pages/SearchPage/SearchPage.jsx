import React, { Component } from 'react'
import { Pagination } from 'antd'

import SearchForm from '../../components/SearchForm'
import AlertMessage from '../../components/AlertMessage'
import Spinner from '../../components/Spinner'
import FilmList from '../../components/FilmList'
import MovieBaseService from '../../MovieBaseService/MovieBaseService'
import MovieSessionService from '../../MovieSessionService/MovieSessionService'

export default class SearchPage extends Component {
  movieBaseService = new MovieBaseService()
  movieSessionService = new MovieSessionService()
  state = {
    searchFormText: 'a',
    currentPage: 1,
    countItems: null,
    films: [],
    loading: true,
    error: false,
    genres: '',
    sessionId: this.props.sessionId,
    savedMovies: this.props.savedMovies,
  }

  componentDidMount() {
    this.movieBaseService.getGenresDictionary().then((genres) => {
      this.setState({
        genres,
      })
    })
    this.updateFilms(this.state.searchFormText, this.state.currentPage)
    if (localStorage.getItem('savedMovies') !== null) {
      this.setState({
        savedMovies: JSON.parse(localStorage.getItem('savedMovies')),
      })
      this.state.savedMovies.forEach((item) => {
        this.state.films.forEach((film) => {
          if (item.id === film.id && item.rating !== film.rating) {
            this.handleFilmRateChange(item.id, item.rating).catch(this.onError)
          }
        })
      })
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { savedMovies, films } = this.state
    if (prevState.films !== this.state.films) {
      savedMovies.forEach((item) => {
        films.forEach((film) => {
          if (item.id === film.id && item.rating !== film.rating) {
            this.handleFilmRateChange(item.id, item.rating).catch(this.onError)
          }
        })
      })
    }
  }

  componentWillUnmount() {
    localStorage.setItem('savedMovies', JSON.stringify(this.state.savedMovies))
  }

  onSearchTextChange = (searchFormText) => {
    if (searchFormText === '') return

    this.setState({
      loading: true,
      searchFormText,
      currentPage: 1,
      countItems: null,
    })
    this.updateFilms(searchFormText)
  }

  OnCurrentPageChange = (currentPage) => {
    const { searchFormText } = this.state
    this.setState({
      loading: true,
      currentPage,
    })

    this.updateFilms(searchFormText, currentPage)
  }

  onError = () => {
    this.setState({ loading: false, error: true })
  }

  onFilmsLoaded = ({ films, currentPage, countItems }) => {
    this.setState({ films, currentPage, countItems, loading: false })
  }

  updateFilms(query, page) {
    this.movieBaseService.getMovies(query, page).then(this.onFilmsLoaded).catch(this.onError)
  }

  handleFilmRateChange = async (filmId, rating) => {
    const { sessionId, getSavedMovies } = this.props

    try {
      await this.movieBaseService.rateMovies(filmId, rating, sessionId)

      this.setState(({ films }) => {
        return {
          films: films.map((film) => {
            if (film.id === filmId) {
              return {
                ...film,
                rating,
              }
            }
            return film
          }),
        }
      })
      this.movieSessionService.getMoviesRating(sessionId).then((films) => {
        this.setState({ savedMovies: films.films })
      })
      getSavedMovies()
    } catch (error) {
      this.setState({
        hasError: true,
      })
    }
  }

  render() {
    const { films, loading, error, currentPage, countItems } = this.state
    const errorMessage = error ? <AlertMessage /> : null
    const spinner = loading ? <Spinner /> : null
    const content = !(loading || error) ? (
      <View
        films={films}
        currentPage={currentPage}
        countItems={countItems}
        onCurrentPageChange={this.OnCurrentPageChange}
        onRateChange={this.handleFilmRateChange}
      />
    ) : null
    return (
      <>
        <header className="movies-container__search-from">
          <SearchForm onChangeDebounced={this.onSearchTextChange} />
        </header>
        {errorMessage}
        {spinner}
        {content}
      </>
    )
  }
}

const View = ({ films, currentPage, countItems, onCurrentPageChange, onRateChange }) => {
  return (
    <>
      <FilmList films={films} onRateChange={onRateChange} />
      <Pagination
        className="movies-container__pagination"
        size="small"
        hideOnSinglePage
        showSizeChanger={false}
        current={currentPage}
        defaultPageSize={20}
        total={countItems}
        onChange={onCurrentPageChange}
      />
    </>
  )
}
