import { format } from 'date-fns'
import { Row, Col, Typography, Space } from 'antd'

import FilmRate from '../FilmRate/FilmRate'
import { getShortText } from '../../TextUtil/TextUtil'

import './Film.css'

const Film = ({ title, description, date, /* genres,*/ poster, rate }) => {
  return (
    <Row className="film-item">
      <Col xs={24} sm={24} md={9} className="film-item__img-wrapper">
        {poster && <img src={poster} alt="poster" className="film-item__img" />}
      </Col>
      <Col xs={24} sm={24} md={15} className="film-item__content">
        <Typography.Title level={4} className="film-item__title">
          {title}
        </Typography.Title>
        <FilmRate className="film-item__rating" value={rate} />
        <Space size={7} direction="vertical">
          <Typography.Text type="secondary">{date && format(date, 'MMMM d, Y')}</Typography.Text>
          <Space size={8}>
            {/*{genres.map((genre) => (
              <Typography.Text code key={genre}>
                {genre}
              </Typography.Text>
            ))}*/}
          </Space>
          <Typography.Text>{getShortText(description)}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Film
