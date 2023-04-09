import React, { Component } from 'react'
import { Pagination } from 'antd'

import MovieApiService from '../../MovieApiService/MovieApiService'
import AlertMessage from '../../components/AlertMessage'
import Spinner from '../../components/Spinner'
import FilmList from '../../components/FilmList'
import SearchForm from "../../components/SearchForm"

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
    this.apiService.getMovies(page).then(this.onFilmsLoaded).catch(this.onError)
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

const View = ({ films, currentPage, countItems, onCurrentPageChange }) => {
  return (
    <>
      <FilmList films={films} />
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
