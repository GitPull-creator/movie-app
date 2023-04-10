import { List } from 'antd'

import Film from '../Film'

const FilmList = ({ films, onRateChange }) => {
  return (
    <List
      grid={{ gutter: [32, 16], column: 2, xs: 1, sm: 1, md: 1 }}
      dataSource={films}
      renderItem={({ id, ...film }) => (
        <List.Item key={id}>
          <Film {...film} onRateChange={(rate) => onRateChange(id, rate)} />
        </List.Item>
      )}
    />
  )
}

export default FilmList
