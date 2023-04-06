import React, { Component } from 'react'
import { Layout } from 'antd'
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
    films: [],
    loading: true,
    error: false,
  }

  componentDidMount() {
    this.updateFilms('john wick')
  }

  onSearchTextChange = (searchFormText) => {
    if (searchFormText === '') return

    this.setState({
      loading: true,
      searchFormText,
    })
    this.updateFilms(searchFormText)
  }

  onError = () => {
    this.setState({ loading: false, error: true })
  }

  onFilmsLoaded = (films) => {
    this.setState({ films, loading: false })
  }

  updateFilms(query) {
    this.apiService.getMovies(query).then(this.onFilmsLoaded).catch(this.onError)
  }

  render() {
    const { films, loading, error } = this.state
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
        </Content>
      </Layout>
    )
  }
}
