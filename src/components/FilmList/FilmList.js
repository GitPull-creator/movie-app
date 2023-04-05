import React from 'react'
import { List } from 'antd'

import Film from '../Film'

const FilmList = ({ films }) => {
  return (
    <List
      grid={{ gutter: [32, 32], column: 2 }}
      dataSource={films}
      renderItem={({ id, ...film }) => (
        <List.Item key={id}>
          <Film {...film} />
        </List.Item>
      )}
    />
  )
}

export default FilmList
