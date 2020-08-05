import express from 'express'
import db from './database/connection'
import convertHourToMinutes from './utils/convertHowertoMinutes'

const app = express()
app.use(express.json())

interface ScheduleItem {
  week_day: Number
  from: String
  to: String
}

app.post('/classes', async (req, res) => {
  const { name, avatar, bio, whatsapp, subject, cost, schedule } = req.body

  const insertUsersId = await db('users').insert({
    name,
    avatar,
    whatsapp,
    bio,
  })

  const users_id = insertUsersId[0]

  const insert_classesId = await db('classes').insert({
    subject,
    cost,
    users_id,
  })

  const class_id = insert_classesId[0]

  const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
    return {
      class_id,
      week_day: scheduleItem.week_day,
      from: convertHourToMinutes(scheduleItem.from),
      to: convertHourToMinutes(scheduleItem.to),
    }
  })

  await db('class_schedule').insert(classSchedule)

  return res.send('Cadastro registered Success!')
})

app.listen(3000, () => {
  console.log('Rodando a api')
})

export default app
