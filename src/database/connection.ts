import knex from 'knex'
import dotenv from 'dotenv'

const db = knex({
  client: 'pg',
  connection: 'postgresql://gustavo:jogu3340@localhost:5432/proffy',
  useNullAsDefault: true,
})

export default db
