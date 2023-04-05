function getShortText(text, length = 190) {
  if (text.length < 190) return text

  const shortText = text.substring(0, length).split(' ').slice(0, -1).join(' ')

  return `${shortText}...`
}

export { getShortText }
