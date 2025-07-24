import { beforeAll, describe, expect, test } from 'vitest'
import Hapi from '@hapi/hapi'
import Boom from '@hapi/boom'

import { searchHandlerController } from './search-handler.js'

const search = (server) => (payload) =>
  server.inject({
    method: 'POST',
    url: '/search',
    payload
  })

describe('#searchHandlerController', () => {
  let searchPost
  let server

  beforeAll(() => {
    server = Hapi.server()
    server.route({
      method: 'POST',
      path: '/search',
      options: searchHandlerController.options,
      handler: searchHandlerController.handler
    })
    searchPost = search(server)
  })

  test('Should redirect to search results page if qText is provided and pageUrl does not end with .md', async () => {
    const response = await searchPost({
      q: 'some-page',
      qText: 'search query'
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(
      '/documentation/search-results?q=search%20query'
    )
  })

  test('Should redirect to search results page if pageUrl does not end with .md and qText is empty', async () => {
    const response = await searchPost({
      q: 'some-page',
      qText: ''
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(
      '/documentation/search-results?q=some-page'
    )
  })

  test('Should redirect to the pageUrl with qText as query if pageUrl ends with .md', async () => {
    const response = await searchPost({
      q: 'some-page.md',
      qText: 'search query'
    })

    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('some-page.md?q=search%20query')
  })

  test('Should return 400 if payload validation fails', async () => {
    const response = await searchPost({})

    expect(response.statusCode).toBe(400)
    expect(response.result).toEqual(Boom.badRequest().output.payload)
  })
})
