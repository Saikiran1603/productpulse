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
  server.use((request, _response, next) => {
    const functionPrefix = '/.netlify/functions/api'
    if (request.url.startsWith(functionPrefix)) request.url = request.url.slice(functionPrefix.length) || '/'
    else if (request.url === '/api') request.url = '/'
    else if (request.url.startsWith('/api/')) request.url = request.url.slice(4)
    next()
  })
  server.use((request, response, next) => {
    const mutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)
    if (mutation) response.once('finish', () => saveDatabase(router.db.getState()))
    next()
  })
  server.use(router)

  return serverless(server)(event, context)
}
