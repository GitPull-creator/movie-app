import React from 'react'
import { format } from 'date-fns'
import { Row, Col, Typography, Space } from 'antd'

import { getShortText } from '../../TextUtil/TextUtil'

import './Film.css'

const Film = ({ title, description, date, genres, poster }) => {
  return (
    <Row className="film-item">
      <Col flex="2">
        <img src={poster} alt="poster" className="film-item__img" />
      </Col>
      <Col flex="3" className="film-item__content">
        <Typography.Title level={4}>{title}</Typography.Title>
        <Space size={7} direction="vertical">
          <Typography.Text type="secondary">{format(date, 'MMMM d, Y')}</Typography.Text>
          <Space size={8}>
            {genres.map((genre) => (
              <Typography.Text code key={genre}>
                {genre}
              </Typography.Text>
            ))}
          </Space>
          <Typography.Text>{getShortText(description)}</Typography.Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Film
