import React, { Component } from 'react'
import { Layout, Pagination } from 'antd'
import './App.css'
import 'antd/dist/reset.css'
import { Content } from 'antd/es/layout/layout'

import FilmList from '../FilmList'
import MovieApiService from '../../MovieApiService/MovieApiService'
import Spinner from '../Spinner'
import AlertMessage from '../AlertMessage'
import SearchForm from '../SearchForm'

export default class MoviesApp extends Component {
  apiService = new MovieApiService()
  state = {
    searchFormText: 'john wick',
    currentPage: 1,
    countItems: null,
    films: [],
    loading: true,
    error: false,
  }

  componentDidMount() {
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

  handleCurrentPageChange = (currentPage) => {
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

  render() {
    const { films, loading, error, currentPage, countItems } = this.state
    console.log(films)
    const errorMessage = error ? <AlertMessage /> : null
    const spinner = loading ? <Spinner /> : null
    const content = !(loading || error) ? <FilmList films={films} /> : null
    return (
      <Layout>
        <Content className="movies-container">
          <header className="movies-container__search-from">
            <SearchForm onChangeDebounced={this.onSearchTextChange} />
          </header>
          {errorMessage}
          {spinner}
          {content}
          <Pagination
            className="movies-container__pagination"
            size="small"
            hideOnSinglePage
            showSizeChanger={false}
            current={currentPage}
            defaultPageSize={20}
            total={countItems}
            onChange={this.handleCurrentPageChange}
          />
        </Content>
      </Layout>
    )
  }
}
