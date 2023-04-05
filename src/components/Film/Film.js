import React from 'react'
import './Film.css'
import { Col, Row, Space, Typography } from 'antd'
import { format } from 'date-fns'

import { getShortText } from '../../TextUtil/TextUtil'
const { Title, Text } = Typography
const Film = ({ title, description, date, genres, poster }) => {
  return (
    <Row className="film-item">
      <Col flex="2">
        <img src={poster} alt="poster" className="film-item__img" />
      </Col>
      <Col flex="3" className="film-item__content">
        <Title level={4}>{title}</Title>
        <Space size={7} direction="vertical">
          <Text type="secondary">{format(date, 'MMMM d, Y')}</Text>
          <Space size={8}>
            {genres.map((genre) => (
              <Text code key={genre}>
                {genre}zz
              </Text>
            ))}
          </Space>
          <Text>{getShortText(description)}</Text>
        </Space>
      </Col>
    </Row>
  )
}

export default Film
