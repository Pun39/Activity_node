const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'std_pro',
    supportBigNumber: true,
    timezone: '+7:00',
    dateStrings: true,
    charset: 'utf8mb4_unicode_ci',
  },
})
const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send({ ok: 1 })
})
// login
app.get('/list', async (req, res) => {
  console.log(req.query.std_id)
  console.log(req.query.pass)
  try {
    let row = await db('user')
      .where({ std_id: req.query.std_id, pass: req.query.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user/pass ไม่ถูกต้อง')
    }
    res.send({
      status: 1,
      data: row,
    })
  } catch (e) {
    console.log('error')
    console.log(e.message)
    res.send({
      status: 0,
      error: e.message,
    })
  }
})
app.get('/list_t', async (req, res) => {
  console.log('user_id user=', req.query)
  let row = await db.raw('SELECT * FROM user WHERE user_id = ' + req.query.user_id)
  console.log('row', row[0])
  res.send({
    status: 'ok',
    rows: row,
  })
})
app.get('/list_p', async (req, res) => {
  console.log('user_id admin=', req.query)
  let row = await db.raw('SELECT * FROM user WHERE user_id = ' + req.query.user_id)
  console.log('row', row[0])
  res.send({
    status: 'ok',
    rows: row,
  })
})

app.listen(7002, () => {
  console.log('ready:7002')
})
