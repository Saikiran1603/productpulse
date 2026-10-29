const path = require('path')
const jsonServer = require('json-server')
const serverless = require('serverless-http')

const server = jsonServer.create()
const middlewares = jsonServer.defaults({ logger: false })
const router = jsonServer.router(path.join(__dirname, '../../db.json'))

server.use(middlewares)
server.use((request, _response, next) => {
  if (request.url === '/api') request.url = '/'
  else if (request.url.startsWith('/api/')) request.url = request.url.slice(4)

  const functionPrefix = '/.netlify/functions/api'
  if (request.url.startsWith(functionPrefix)) request.url = request.url.slice(functionPrefix.length) || '/'
  next()
})
server.use(router)

module.exports.handler = serverless(server)
