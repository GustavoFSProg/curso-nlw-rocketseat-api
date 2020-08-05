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

  const trx = await db.transaction()

  try {
    const insertUsersId = await trx('users').insert({
      name,
      avatar,
      whatsapp,
      bio,
    })

    const users_id = insertUsersId[0]

    const insert_classesId = await trx('classes').insert({
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

    await trx('class_schedule').insert(classSchedule)

    await trx.commit()

    return res.status(201).send({ mensagem: 'Cadastro registered Success!' })
  } catch (error) {
    await trx.rollback()
    return res.status(400).send({ error })
  }
})

app.listen(3000, () => {
  console.log('Rodando a api')
})

export default app
