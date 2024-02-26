function optionsWithMessage(message) {
  return [
    {
      text: ` - - ${message} - - `,
      value: '',
      disabled: true,
      attributes: { selected: true }
    }
  ]
}

export { optionsWithMessage }
