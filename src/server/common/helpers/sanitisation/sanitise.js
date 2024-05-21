import disinfect from 'disinfect'

const sanitise = {
  plugin: {
    name: 'sanitise',
    ...disinfect
  },
  options: {
    disinfectQuery: true,
    disinfectParams: true,
    disinfectPayload: true
  }
}

export { sanitise }
