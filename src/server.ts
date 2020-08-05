import express from 'express'

const app = express()
app.use(express.json())

const user = [
  { nome: 'Gustavo', idade: 41 },
  { nome: 'Juliana', idade: 10 },
]

app.get('/', (req, res) => {
  return res.json({ Message: 'Ola Mulheres!' })
})

app.listen(3000, () => {
  console.log('Deu cuzona!')
})
