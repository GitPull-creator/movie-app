import React, { Component } from 'react'
import { Layout } from 'antd'
import './App.css'
import 'antd/dist/reset.css'
import { Content } from 'antd/es/layout/layout'

import FilmList from '../FilmList'
import MovieApiService from '../../MovieApiService/MovieApiService'

export default class MoviesApp extends Component {
  apiService = new MovieApiService()
  state = {
    films: [],
  }

  constructor(props) {
    super(props)
    this.updateFilms('john wick')
  }

  onFilmsLoaded = (films) => {
    this.setState({ films })
  }

  updateFilms(query) {
    this.apiService.getMovies(query).then(this.onFilmsLoaded)
  }

  render() {
    const { films } = this.state
    console.log(films)
    return (
      <Layout>
        <Content className="movies-container">
          <FilmList films={films} />
        </Content>
      </Layout>
    )
  }
}
