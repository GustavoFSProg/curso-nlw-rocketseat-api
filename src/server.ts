import express from 'express'
import cors from 'cors'
import db from './database/connection'
import convertHourToMinutes from './utils/convertHowertoMinutes'
import classController from './controllers/classes_controllers'
import connectionsControllers from './controllers/connectionsController'

const app = express()
app.use(express.json())
app.use(cors())

const classes_controllers = new classController()
const connections_Controllers = new connectionsControllers()

app.get('/', classes_controllers.index)
app.post('/classes', connections_Controllers.create)
app.get('/connections', connections_Controllers.index)
app.post('/connections', connections_Controllers.create)

app.listen(3000, () => {
  console.log('Rodando a api')
})

export default app
