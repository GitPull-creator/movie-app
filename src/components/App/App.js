import React, { Component } from 'react'
import { Layout } from 'antd'
import './App.css'
import 'antd/dist/reset.css'
import { Content } from 'antd/es/layout/layout'

import FilmList from '../FilmList'
import MovieApiService from '../../MovieApiService/MovieApiService'
import Spinner from '../Spinner'
import AlertMessage from '../AlertMessage'

export default class MoviesApp extends Component {
  apiService = new MovieApiService()
  state = {
    films: [],
    loading: true,
    error: false,
  }

  constructor(props) {
    super(props)
    this.updateFilms('john wick')
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
          {errorMessage}
          {spinner}
          {content}
        </Content>
      </Layout>
    )
  }
}
