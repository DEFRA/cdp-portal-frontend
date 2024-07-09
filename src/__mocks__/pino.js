import pino from 'pino'

const mockPino = {
  levels: {
    labels: {
      10: 'trace',
      20: 'debug',
      30: 'info',
      40: 'warn',
      50: 'error',
      60: 'fatal'
    },
    values: {
      trace: 10,
      debug: 20,
      info: 30,
      warn: 40,
      error: 50,
      fatal: 60
    }
  },
  trace: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  fatal: jest.fn(),
  silent: jest.fn()
}
mockPino.child = () => mockPino

const mockPinoFunc = () => mockPino
mockPinoFunc.stdSerializers = pino.stdSerializers

jest.doMock('pino', () => mockPinoFunc)

export default () => pino
