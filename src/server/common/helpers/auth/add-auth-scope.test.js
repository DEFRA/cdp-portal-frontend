import { addAuthScope } from '~/src/server/common/helpers/auth/add-auth-scope'

describe('#addAuthScope', () => {
  test('Should add scope to route as expected', () => {
    const addAuthScopeMethod = addAuthScope(['+mockScope'])

    expect(
      addAuthScopeMethod({
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
      const addAuthScopeMethod = addAuthScope(['+mockScope'])

      expect(
        addAuthScopeMethod({
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
