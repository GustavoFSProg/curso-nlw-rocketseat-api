import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

module.exports = {
  client: 'pg',
  connection: 'postgresql://gustavo:jogu3340@localhost:5432/proffy',
  migrations: {
    directory: path.resolve(__dirname, 'src', 'database', 'migrations'),
  },
  useNullAsDefault: true,
}
