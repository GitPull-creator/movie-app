import React, { Component } from 'react'
import { Layout, Tabs } from 'antd'
import './App.css'
import 'antd/dist/reset.css'
import { Content } from 'antd/es/layout/layout'
import TabPane from 'antd/es/tabs/TabPane'

import MovieApiService from '../../MovieApiService/MovieApiService'
import SearchPage from '../../Pages/SearchPage'
import { GenresProvider } from '../GenresContext'
import RatedPage from '../../Pages/RatedPage'

export default class MoviesApp extends Component {
  apiService = new MovieApiService()
  state = {
    currentTab: '1',
    sessionId: '',
    savedMovies: [],
  }

  componentDidMount() {
    this.apiService.newGuestSession().then(({ sessionId }) => {
      this.setState({
        sessionId,
      })
    })
    this.apiService.getGenresDictionary().then((genres) => {
      this.setState({
        genres,
      })
    })
  }

  handleTabClick = (key) => {
    this.setState({
      currentTab: key,
    })
  }

  getSavedMovies = () => {
    this.apiService.getMoviesRating(this.state.sessionId).then((films) => {
      this.setState({ savedMovies: films.films })
    })
  }

  render() {
    const { genres, sessionId, currentTab, savedMovies } = this.state
    return (
      <GenresProvider value={genres}>
        <Layout>
          <Content className="movies-container">
            <Tabs
              defaultActiveKey={currentTab}
              destroyInactiveTabPane={false}
              centered
              onTabClick={this.handleTabClick}
            >
              <TabPane tab="Search" key="1" className="movies-container__tab">
                {currentTab === '1' ? (
                  <SearchPage savedMovies={savedMovies} sessionId={sessionId} getSavedMovies={this.getSavedMovies} />
                ) : null}
              </TabPane>
              <TabPane tab="Rated" key="2" className="movies-container__tab">
                {currentTab === '2' ? <RatedPage sessionId={sessionId} /> : null}
              </TabPane>
            </Tabs>
          </Content>
        </Layout>
      </GenresProvider>
    )
  }
}
