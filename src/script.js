// Description
//   Obtiene el nombre de la persona o empresa del RUT consultado y viceversa
//
// Dependencies:
//   "info-rut": "^4.0.0"
//
// Configuration:
//   HUBOT_URL
//
// Commands:
//   hubot info-rut rut <rut> -> Obtiene nombre a partir de un rut
//   hubot info-rut persona <nombre> -> Obtiene rut a partir de un nombre
//   hubot info-rut empresa <nombre> -> Obtiene rut a partir de un nombre
//
// Author:
//   lgaticaq

'use strict'

const querystring = require('querystring')
const infoRut = require('info-rut')

module.exports = robot => {
  robot.respond(/info-rut rut (.*)/i, res => {
    const rut = res.match[1]
    infoRut
      .getFullName(rut)
      .then(fullName => {
        res.send(`${fullName} (${rut})`)
      })
      .catch(err => {
        if (err.message === 'Not found full name') {
          res.reply('rut sin resultados')
        } else {
          res.reply('ocurrio un error al consultar el rut')
          robot.emit('error', err, res)
        }
      })
  })

  robot.respond(/info-rut (persona|empresa) (.*)/i, res => {
    const type = res.match[1]
    const name = res.match[2]
    const url = process.env.HUBOT_URL || 'http://localhost:8080'
    const fn = type === 'persona' ? 'getPersonRut' : 'getEnterpriseRut'
    infoRut[fn](name)
      .then(results => {
        if (results.length > 5) {
          const query = querystring.stringify({ name, type })
          const more = `\nMás resultados en ${url}/info-rut?${query}`
          res.send(
            results
              .slice(0, 5)
              .map(r => `${r.fullName} (${r.rut})`)
              .join('\n')
              .concat(more)
          )
        } else if (results.length > 0) {
          res.send(results.map(r => `${r.fullName} (${r.rut})`).join('\n'))
        } else {
          res.reply(`no hay resultados para ${name}`)
        }
      })
      .catch(err => {
        res.reply('ocurrio un error al consultar el nombre')
        robot.emit('error', err, res)
      })
  })

  robot.router.get('/info-rut', (req, res) => {
    const type = req.query.type || 'persona'
    const name = req.query.name || ''
    const fn = type === 'persona' ? 'getPersonRut' : 'getEnterpriseRut'
    infoRut[fn](name)
      .then(results => {
        if (results.length > 0) {
          res.send(results.map(r => `${r.fullName} (${r.rut})`).join('<br/>'))
        } else {
          res.send(`no hay resultados para ${name}`)
        }
      })
      .catch(err => {
        res.send('Ocurrio un error al consultar el nombre')
        robot.emit('error', err, res)
      })
  })
}
