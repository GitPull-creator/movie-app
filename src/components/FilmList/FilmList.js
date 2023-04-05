import React from 'react'
import { List } from 'antd'

import Film from '../Film'

const FilmList = ({ films }) => {
  return (
    <List grid={{ gutter: [32, 16], column: 2 }} dataSource={films}>
      <List.Item>
        <Film films={films} />
      </List.Item>
    </List>
  )
}

export default FilmList
