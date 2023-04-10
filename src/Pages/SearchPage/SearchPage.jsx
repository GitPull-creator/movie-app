import React, { Component } from 'react'
import { Pagination } from 'antd'

import SearchForm from '../../components/SearchForm'
import AlertMessage from '../../components/AlertMessage'
import Spinner from '../../components/Spinner'
import FilmList from '../../components/FilmList'
import MovieApiService from '../../MovieApiService/MovieApiService'

export default class SearchPage extends Component {
  apiService = new MovieApiService()
  state = {
    searchFormText: 'john wick',
    currentPage: 1,
    countItems: null,
    films: [],
    loading: true,
    error: false,
    genres: '',
  }

  componentDidMount() {
    this.apiService.getGenresDictionary().then((genres) => {
      this.setState({
        genres,
      })
    })
    this.updateFilms(this.state.searchFormText, this.state.currentPage)
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
    this.apiService.getMovies(query, page).then(this.onFilmsLoaded).catch(this.onError)
  }

  handleFilmRateChange = async (filmId, rating) => {
    const { onChangeRatedList } = this.props

    try {
      const { success } = await this.apiService.rateMovies(filmId, rating)
      if (!success) return

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

      onChangeRatedList()
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
