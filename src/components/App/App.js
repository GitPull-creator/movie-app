import React, { Component } from 'react'
import { Layout, Tabs } from 'antd'
import './App.css'
import 'antd/dist/reset.css'
import { Content } from 'antd/es/layout/layout'
import TabPane from 'antd/es/tabs/TabPane'

import MovieApiService from '../../MovieApiService/MovieApiService'
import SearchPage from '../../Pages/SearchPage'
import { GenresProvider } from '../GenresContext'

export default class MoviesApp extends Component {
  apiService = new MovieApiService()
  state = {
    sessionId: '',
  }

  componentDidMount() {
    this.apiService.getGenresDictionary().then((genres) => {
      this.setState({
        genres,
      })
    })

    this.apiService.newGuestSession().then(this.onSessionLoaded)
  }
  onSessionLoaded = ({ sessionId }) => {
    this.setState({ sessionId })
  }

  render() {
    const { genres } = this.state
    return (
      <GenresProvider value={genres}>
        <Layout>
          <Content className="movies-container">
            <Tabs defaultActiveKey="1" centered>
              <TabPane tab="Search" key="1" className="movies-container__tab" destroyInactiveTabPane={false}>
                <SearchPage />
              </TabPane>
              <TabPane tab="Rated" key="2" className="movies-container__tab" destroyInactiveTabPane={false}></TabPane>
            </Tabs>
          </Content>
        </Layout>
      </GenresProvider>
    )
  }
}
