import React, { Component } from 'react'
import { Pagination } from 'antd'

import MovieApiService from '../../MovieApiService/MovieApiService'
import AlertMessage from '../../components/AlertMessage'
import Spinner from '../../components/Spinner'
import FilmList from '../../components/FilmList'

export default class RatedPage extends Component {
  apiService = new MovieApiService()
  state = {
    currentPage: 1,
    countItems: null,
    films: [],
    loading: true,
    error: false,
  }

  componentDidMount() {
    this.updateFilms(this.state.currentPage)
  }

  componentDidUpdate({ ratedListChanged: prevRatedListChanged }) {
    const { ratedListChanged } = this.props

    if (ratedListChanged !== prevRatedListChanged) {
      this.updateFilms()
    }
  }

  OnCurrentPageChange = (currentPage) => {
    this.setState({
      loading: true,
      currentPage,
    })

    this.updateFilms(currentPage)
  }

  onError = () => {
    this.setState({ loading: false, error: true })
  }

  onFilmsLoaded = ({ films, currentPage, countItems }) => {
    this.setState({ films, currentPage, countItems, loading: false })
  }

  updateFilms(page) {
    const { sessionId } = this.props
    this.apiService.getMoviesRating(page, sessionId).then(this.onFilmsLoaded).catch(this.onError)
  }
  handleFilmRateChange = async (filmId, rating) => {
    const { onChangeRatedList, sessionId } = this.props

    try {
      const { success } = await this.apiService.rateMovies(filmId, rating, sessionId)
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
