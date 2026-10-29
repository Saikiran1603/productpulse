const jsonServer = require('json-server')
const serverless = require('serverless-http')
const seedDb = require('../../db.json')

let blobStore = null
let memoryDatabase = null
async function getDatabase() {
  if (!process.env.NETLIFY) return memoryDatabase || (memoryDatabase = JSON.parse(JSON.stringify(seedDb)))
  if (!blobStore) {
    const { getStore } = require('@netlify/blobs')
    blobStore = getStore('productpulse')
  }
  return await blobStore.get('database', { type: 'json', consistency: 'strong' }) || seedDb
}

async function saveDatabase(database) {
  if (process.env.NETLIFY) await blobStore.setJSON('database', database)
  else memoryDatabase = JSON.parse(JSON.stringify(database))
}

module.exports.handler = async (event, context) => {
  const database = await getDatabase()
  const server = jsonServer.create()
  const router = jsonServer.router(JSON.parse(JSON.stringify(database)))

  server.use(jsonServer.defaults({ logger: false }))
  server.use(jsonServer.bodyParser)
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
    const match = request.url.match(/^\/([^/?]+)(?:\/([^/?]+))?/)
    if (!match || !['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) return next()

    const resource = match[1]
    const itemId = match[2]
    if (!Object.prototype.hasOwnProperty.call(router.db.getState(), resource)) return next()

    Promise.resolve().then(async () => {
      const state = JSON.parse(JSON.stringify(router.db.getState()))
      const collection = state[resource]
      let result

      if (request.method === 'POST') {
        result = { ...request.body }
        result.id = result.id || Math.max(0, ...collection.map(item => Number(item.id) || 0)) + 1
        collection.push(result)
      } else if (request.method === 'DELETE') {
        const index = collection.findIndex(item => String(item.id) === itemId)
        if (index === -1) return response.status(404).end()
        result = collection.splice(index, 1)[0]
      } else {
        const item = collection.find(entry => String(entry.id) === itemId)
        if (!item) return response.status(404).end()
        Object.assign(item, request.method === 'PUT' ? request.body : request.body)
        result = item
      }

      await saveDatabase(state)
      router.db.setState(state)
      response.status(request.method === 'POST' ? 201 : 200).json(result)
    }).catch(error => {
      console.error('Failed to persist database mutation', error)
      response.status(500).json({ error: 'Failed to persist data' })
    })
  })
  server.use(router)

  return serverless(server)(event, context)
}
