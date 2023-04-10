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
    sessionId: '00710bb4934506fd93c1035413fe09f',
    currentTab: '1',
  }

  componentDidMount() {
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
  onSessionLoaded = ({ sessionId }) => {
    this.setState({ sessionId })
  }

  render() {
    const { genres, sessionId, currentTab } = this.state
    return (
      <GenresProvider value={genres}>
        <Layout>
          <Content className="movies-container">
            <Tabs defaultActiveKey={currentTab} centered onTabClick={this.handleTabClick}>
              <TabPane tab="Search" key="1" className="movies-container__tab">
                {currentTab === '1' ? <SearchPage /> : null}
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
