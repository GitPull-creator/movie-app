import { format } from 'date-fns'
import { Row, Col, Typography, Space, Rate } from 'antd'

import FilmRate from '../FilmRate/FilmRate'
import { getShortText } from '../../TextUtil/TextUtil'
import './Film.css'
import { GenresConsumer } from '../GenresContext'

const Film = ({ title, description, date, genres, poster, rate, rating, onRateChange }) => {
  return (
    <Row className="film-item">
      <Col xs={24} sm={24} md={9} className="film-item__img-wrapper">
        {poster && <img src={poster} alt="poster" className="film-item__img" />}
      </Col>
      <Col xs={24} sm={24} md={15} className="film-item__content">
        <Typography.Title level={4} className="film-item__title">
          {title}
        </Typography.Title>
        <FilmRate className="film-item__rating test" value={rate} />
        <Space size={7} direction="vertical">
          <Typography.Text type="secondary">{date && format(date, 'MMMM d, Y')}</Typography.Text>
          <Space size={8}>
            <GenresConsumer>
              {(dictionaryGenres) => {
                return genres.map((genreId) => (
                  <Typography.Text code key={genreId} className="film-item__genre">
                    <nobr>{dictionaryGenres[genreId]}</nobr>
                  </Typography.Text>
                ))
              }}
            </GenresConsumer>
          </Space>
          <Typography.Text>{getShortText(description)}</Typography.Text>
        </Space>
        <Rate className="film-item__rate" allowHalf count={10} value={rating} onChange={onRateChange} />
      </Col>
    </Row>
  )
}

export default Film
