import './FilmRate.css'

const getColorClassNameByValue = (value) => {
  if (value < 3) {
    return 'film-rate--color-1'
  }

  if (value >= 3 && value < 5) {
    return 'film-rate--color-2'
  }

  if (value >= 5 && value < 7) {
    return 'film-rate--color-3'
  }

  if (value >= 7) {
    return 'film-rate--color-4'
  }

  return ''
}

const FilmRate = ({ value, className }) => {
  const colorClass = getColorClassNameByValue(value)

  const classNames = className.split(' ').concat(['film-rate', colorClass]).join(' ')

  return <div className={classNames}>{value}</div>
}

export default FilmRate
