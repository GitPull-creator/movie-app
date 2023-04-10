import './FilmRate.css'
import classNames from 'classnames'

const FilmRate = ({ value, className }) => {
  const classes = classNames(
    {
      'film-rate--color-1': value < 3,
      'film-rate--color-2': value >= 3 && value < 5,
      'film-rate--color-3': value >= 5 && value < 7,
      'film-rate--color-4': value >= 7,
    },
    'film-rate',
    className
  )

  return <div className={classes}>{value}</div>
}

export default FilmRate
