// Response from userServiceBackend/scopes
const scopesFixture = {
  message: 'success',
  scopes: [
    'team:aabe63e7-87ef-4beb-a596-c810631fc474',
    'permission:admin',
    'permission:tenant',
    'permission:canGrantProdAccess:team:aabe63e7-87ef-4beb-a596-c810631fc474',
    'permission:serviceOwner:team:aabe63e7-87ef-4beb-a596-c810631fc474'
  ],
  scopeFlags: {
    isAdmin: true,
    isTenant: false
  }
}

export { scopesFixture }
