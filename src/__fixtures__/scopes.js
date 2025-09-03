// Response from userServiceBackend/scopes
const scopesFixture = {
  scopes: [
    'team:platform',
    'permission:admin',
    'permission:tenant',
    'permission:canGrantBreakGlass:team:platform',
    'permission:serviceOwner:team:platform'
  ],
  scopeFlags: {
    isAdmin: true,
    isTenant: false
  }
}

export { scopesFixture }
