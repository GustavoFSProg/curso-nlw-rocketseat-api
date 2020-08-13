import { Request, Response } from 'express'
import convertHourToMinutes from '../utils/convertHowertoMinutes'
import db from '../database/connection'

interface ScheduleItem {
  week_day: Number
  from: String
  to: String
}

export default class ClassesController {
  static ClassesController(arg0: string, ClassesController: any) {
    throw new Error('Method not implemented.')
  }

  async index(req: Request, res: Response) {
    const filters = req.query

    // const week_day = filters.week_day as string
    // const subject = filters.subject
    // const time = filters.time as  string

    if (!filters.week_day || !filters.subject || !filters.time) {
      return res.status(400).send({ error: 'Missing Filds!' })
    }

    const timeInMinutes = convertHourToMinutes(filters.time as string)

    console.log(timeInMinutes)

    const classes = await db('classes')
      .whereExists(function () {
        this.select('class_schedule.*')
          .from('class_schedule')
          .whereRaw('class_schedule.class_id = classes.id')
          .whereRaw('class_schedule.week_day = ??', [Number(filters.week_day)])
          .whereRaw('class_schedule.from<= ??', [timeInMinutes])
          .whereRaw('class_schedule.to > ??', [timeInMinutes])
      })
      .where('classes.subject', '=', filters.subject as string)
      .join('users', 'classes.users_id', '=', 'users.id')
      .select(['classes.*', 'users.*'])

    return res.json(classes)
  }

  async create(req: Request, res: Response) {
    const { name, avatar, bio, whatsapp, subject, cost, schedule } = req.body

    const trx = await db.transaction()

    try {
      const insertUsersId = await trx('users')
        .insert({
          name,
          avatar,
          whatsapp,
          bio,
        })
        .returning('id')

      const users_id = insertUsersId[0]

      const insert_classesId = await trx('classes')
        .insert({
          subject,
          cost,
          users_id,
        })
        .returning('id')

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
  }
}
