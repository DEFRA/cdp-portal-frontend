import disinfect from 'disinfect'

const sanitise = {
  plugin: {
    name: 'sanitise',
    ...disinfect
  },
  options: {
    disinfectQuery: false,
    disinfectParams: false,
    disinfectPayload: false
  }
}

export { sanitise }
