import { addScope } from '~/src/server/common/helpers/auth/add-scope'

describe('#addScope', () => {
  test('Should add scope to route as expected', () => {
    const addScopeMethod = addScope(['+mockScope'])

    expect(
      addScopeMethod({
        method: 'GET',
        path: '/admin/teams/{teamId}'
      })
    ).toEqual({
      method: 'GET',
      options: {
        auth: {
          access: {
            scope: ['+mockScope']
          },
          mode: 'required'
        }
      },
      path: '/admin/teams/{teamId}'
    })
  })
  describe('When route has existing options', () => {
    test('Should add scope to route as expected', () => {
      const addScopeMethod = addScope(['+mockScope'])

      expect(
        addScopeMethod({
          method: 'POST',
          path: '/admin/teams/{teamId}',
          options: {
            pre: []
          }
        })
      ).toEqual({
        method: 'POST',
        options: {
          auth: {
            access: {
              scope: ['+mockScope']
            },
            mode: 'required'
          },
          pre: []
        },
        path: '/admin/teams/{teamId}'
      })
    })
  })
})
