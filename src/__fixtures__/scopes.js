// Response from userServiceBackend/scopes
const scopesFixture = {
  message: 'success',
  scopes: ['aabe63e7-87ef-4beb-a596-c810631fc474', 'admin', 'tenant'],
  scopeFlags: {
    isAdmin: true,
    isTenant: false
  },
  teamScopes: {
    'aabe63e7-87ef-4beb-a596-c810631fc474': [
      'canGrantProdAccess',
      'serviceOwner'
    ]
  }
}

export { scopesFixture }
