// Response from userServiceBackend/scopes
const scopesFixture = {
  message: 'success',
  scopes: [
    'team:platform',
    'permission:admin',
    'permission:tenant',
    'permission:canGrantProdAccess:team:platform',
    'permission:serviceOwner:team:platform'
  ],
  scopeFlags: {
    isAdmin: true,
    isTenant: false
  }
}

export { scopesFixture }
