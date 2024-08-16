// TODO add other decorations
declare module '@hapi/hapi' {
  interface Request {
    isXhr: () => boolean
    saveStepData: (
      id: string,
      data: object,
      h: ResponseToolkit
    ) => Promise<void>
  }

  interface Server {}
}
