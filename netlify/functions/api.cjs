const jsonServer = require('json-server')
const serverless = require('serverless-http')
const seedDb = require('../../db.json')

let blobStore = null
async function getDatabase() {
  if (!process.env.NETLIFY || !blobStore) return seedDb

  const { getStore } = require('@netlify/blobs')
  blobStore ||= getStore({ name: 'productpulse', consistency: 'strong' })
  return await blobStore.get('database', { type: 'json' }) || seedDb
}

async function saveDatabase(database) {
  if (process.env.NETLIFY) await blobStore.setJSON('database', database)
}

module.exports.handler = async (event, context) => {
  const database = await getDatabase()
  const server = jsonServer.create()
  const router = jsonServer.router(JSON.parse(JSON.stringify(database)))

  server.use(jsonServer.defaults({ logger: false }))
  server.use((_request, response, next) => {
    response.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.setHeader('Pragma', 'no-cache')
    next()
  })
  server.use((request, _response, next) => {
    const functionPrefix = '/.netlify/functions/api'
    if (request.url.startsWith(functionPrefix)) request.url = request.url.slice(functionPrefix.length) || '/'
    else if (request.url === '/api') request.url = '/'
    else if (request.url.startsWith('/api/')) request.url = request.url.slice(4)
    next()
  })
  server.use((request, response, next) => {
    const mutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
    if (mutation && process.env.NETLIFY) {
      const originalEnd = response.end.bind(response)
      response.end = (chunk, encoding, callback) => {
        if (response.statusCode >= 200 && response.statusCode < 400) {
          saveDatabase(router.db.getState()).then(
            () => originalEnd(chunk, encoding, callback),
            error => {
              console.error('Failed to persist database', error)
              const message = JSON.stringify({ error: 'Failed to persist data' })
              response.statusCode = 500
              response.setHeader('Content-Type', 'application/json')
              response.setHeader('Content-Length', Buffer.byteLength(message))
              originalEnd(message, 'utf8', callback)
            }
          )
        } else {
          originalEnd(chunk, encoding, callback)
        }
      }
    }
    next()
  })
  server.use(router)

  return serverless(server)(event, context)
}
