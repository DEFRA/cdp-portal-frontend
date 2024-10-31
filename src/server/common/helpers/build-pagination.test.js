import { buildPagination } from '~/src/server/common/helpers/build-pagination.js'

describe('#buildPagination', () => {
  test('Should provide expected pagination', () => {
    expect(buildPagination(1, 20, 2)).toEqual({
      items: [
        {
          current: true,
          href: '?page=1&size=20',
          number: 1
        },
        {
          href: '?page=2&size=20',
          number: 2
        }
      ],
      next: {
        href: '?page=2&size=20'
      }
    })
  })

  describe('With queryParams', () => {
    const mockQueryParams = {
      service: 'cdp-portal-frontend',
      userId: '0ddadf17-beaf-4aef-a415-ca044dbdd18d',
      status: 'RUNNING',
      page: 1,
      size: 20
    }

    test('Should provide expected pagination', () => {
      expect(buildPagination(1, 20, 2, mockQueryParams)).toEqual({
        items: [
          {
            current: true,
            href: '?service=cdp-portal-frontend&userId=0ddadf17-beaf-4aef-a415-ca044dbdd18d&status=RUNNING&page=1&size=20',
            number: 1
          },
          {
            href: '?service=cdp-portal-frontend&userId=0ddadf17-beaf-4aef-a415-ca044dbdd18d&status=RUNNING&page=2&size=20',
            number: 2
          }
        ],
        next: {
          href: '?service=cdp-portal-frontend&userId=0ddadf17-beaf-4aef-a415-ca044dbdd18d&status=RUNNING&page=2&size=20'
        }
      })
    })
  })
})
