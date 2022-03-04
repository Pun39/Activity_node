const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const knex = require('knex')
const app = express()
const multer = require('multer')

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST || '127.0.0.1',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASS || '',
    database: process.env.MYSQL_DB || 'smart',
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
app.post('/P_login', async (req, res) => {
  console.log(req.body)
  try {
    let rows = await db('sp_user')
      .where('u_username', '=', req.body.username)
      .where('u_password', '=', req.body.password)
    if (rows.length === 0) {
      res.send({
        ok: false,
        message: 'ชื่อหรือรหัสผ่าน ไม่ถูกต้อง',
      })
    } else {
      res.send({
        ok: true,
        datas: rows[0],
      })
    }
  } catch (error) {
    console.log('error')
    console.log(e.message)
    res.send({
      ok: false,
      error: e.message,
    })
  }
})

app.post('/Save', async (req, res) => {
  console.log('data=', req.body)
  try {
    let row = await db('register').insert({
      fullname: req.body.username,
      baccount: req.body.baccount,
      tel: req.body.tel,
      email: req.body.email,
      passwd: req.body.passwd,
    })
    res.send({
      status: 1,
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
app.get('/list', async (req, res) => {
  console.log('r_id=', req.query)
  let row = await db('register').where({r_id: req.query.rid})
  res.send({
    datas: row[0],
    status: 1,
  })
})

app.get('/lists', async (req, res) => {
  let row = await db('register')
  res.send({
    datas: row,
    status: 1,
  })
})

app.get('/list_user', async (req, res) => {
  console.log(req.query.user)
  console.log(req.query.pass)
  try {
    let row = await db('users_student')
      .where({ student_id: req.query.user, major_id: req.query.pass })
      .then(rows => rows[0])
    if (!row) {
      throw new Error('user / pass ไม่ถูกต้อง')
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

app.listen(7001, () => {
  console.log('ready:7001')
})
