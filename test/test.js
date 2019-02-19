'use strict'

const { describe, it, beforeEach, afterEach } = require('mocha')
const Helper = require('hubot-test-helper')
const { expect } = require('chai')
const mock = require('mock-require')
const http = require('http')

const sleep = m => new Promise(resolve => setTimeout(() => resolve(), m))
const request = uri => {
  return new Promise((resolve, reject) => {
    http
      .get(uri, res => {
        const result = { statusCode: res.statusCode }
        if (res.statusCode !== 200) {
          resolve(result)
        } else {
          res.setEncoding('utf8')
          let rawData = ''
          res.on('data', chunk => {
            rawData += chunk
          })
          res.on('end', () => {
            result.body = rawData
            resolve(result)
          })
        }
      })
      .on('error', err => reject(err))
  })
}

const infoRutStub = {
  getPersonByRut (rut) {
    return new Promise((resolve, reject) => {
      if (rut === '11111111-1') {
        return resolve({ name: 'Anonymous', rut })
      } else if (rut === '77777777-7') {
        return resolve({ name: 'Sushi', rut })
      } else if (rut === '22222222-2') {
        return resolve(null)
      }
      reject(new Error('Not found'))
    })
  },
  getEnterpriseByRut (rut) {
    return new Promise((resolve, reject) => {
      if (rut === '11111111-1') {
        return resolve({ name: 'Anonymous', rut })
      } else if (rut === '77777777-7') {
        return resolve({ name: 'Sushi', rut })
      } else if (rut === '22222222-2') {
        return resolve(null)
      }
      reject(new Error('Not found'))
    })
  },
  getPersonByName (name) {
    return new Promise((resolve, reject) => {
      if (name === 'juan perez perez') {
        return resolve([
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' }
        ])
      } else if (name === 'soto') {
        return resolve([
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' },
          { rut: '11.111.111-1', name: 'Anonymous' }
        ])
      } else if (name === 'info-rut') {
        return resolve([])
      }
      reject(new Error('Not found'))
    })
  },
  getEnterpriseByName (name) {
    return new Promise((resolve, reject) => {
      if (name === 'perez') {
        return resolve([{ rut: '11.111.111-1', name: 'Anonymous' }])
      } else if (name === 'info-rut') {
        return resolve([])
      }
      reject(new Error('Not found'))
    })
  }
}
mock('info-rut', infoRutStub)

const helper = new Helper('./../src/index.js')

describe('info rut', function () {
  beforeEach(() => {
    this.room = helper.createRoom()
  })

  afterEach(() => this.room.destroy())

  describe('person rut valid', () => {
    const rut = '11111111-1'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut rut ${rut}`)
      await sleep(1000)
    })

    it('should return a full name', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut rut ${rut}`],
        ['hubot', `Anonymous (${rut})`]
      ])
    })
  })

  describe('enterprise rut valid', () => {
    const rut = '77777777-7'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut rut ${rut}`)
      await sleep(1000)
    })

    it('should return a full name', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut rut ${rut}`],
        ['hubot', `Sushi (${rut})`]
      ])
    })
  })

  describe('rut invalid', () => {
    const rut = '22222222-2'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut rut ${rut}`)
      await sleep(1000)
    })

    it('should return a error', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut rut ${rut}`],
        ['hubot', '@user rut sin resultados']
      ])
    })
  })

  describe('rut error', () => {
    const rut = '1'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut rut ${rut}`)
      await sleep(1000)
    })

    it('should return a error', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut rut ${rut}`],
        ['hubot', '@user ocurrio un error al consultar el rut']
      ])
    })
  })

  describe('name valid', () => {
    const name = 'juan perez perez'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut persona ${name}`)
      await sleep(1000)
    })

    it('should return a array of results with link', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut persona ${name}`],
        [
          'hubot',
          'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Más resultados en ' +
            'http://localhost:8080/info-rut?name=juan%20perez%20perez&' +
            'type=persona'
        ]
      ])
    })
  })

  describe('name valid', () => {
    const name = 'soto'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut persona ${name}`)
      await sleep(500)
    })

    it('should return a array of results', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut persona ${name}`],
        [
          'hubot',
          'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)\n' +
            'Anonymous (11.111.111-1)'
        ]
      ])
    })
  })

  describe('name without results', () => {
    const name = 'info-rut'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut empresa ${name}`)
      await sleep(500)
    })

    it('should return a empty results', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut empresa ${name}`],
        ['hubot', `@user no hay resultados para ${name}`]
      ])
    })
  })

  describe('name invalid', () => {
    const name = 'asdf'

    beforeEach(async () => {
      this.room.user.say('user', `hubot info-rut persona ${name}`)
      await sleep(500)
    })

    it('should return a empty results', () => {
      expect(this.room.messages).to.eql([
        ['user', `hubot info-rut persona ${name}`],
        ['hubot', '@user ocurrio un error al consultar el nombre']
      ])
    })
  })

  describe('GET /info-rut?name=perez&type=persona', () => {
    beforeEach(async () => {
      this.response = await request(
        'http://localhost:8080/info-rut?name=juan%20perez%20perez&type=persona'
      )
    })

    it('responds with status 200 and results', () => {
      expect(this.response.statusCode).to.equal(200)
      expect(this.response.body).to.equal(
        'Anonymous (11.111.111-1)<br/>' +
          'Anonymous (11.111.111-1)<br/>' +
          'Anonymous (11.111.111-1)<br/>' +
          'Anonymous (11.111.111-1)<br/>' +
          'Anonymous (11.111.111-1)<br/>' +
          'Anonymous (11.111.111-1)'
      )
    })
  })

  describe('GET /info-rut?name=perez&type=empresa', () => {
    beforeEach(async () => {
      this.response = await request(
        'http://localhost:8080/info-rut?name=perez&type=empresa'
      )
    })

    it('responds with status 200 and results', () => {
      expect(this.response.statusCode).to.equal(200)
      expect(this.response.body).to.equal('Anonymous (11.111.111-1)')
    })
  })

  describe('GET /info-rut?name=info-rut&type=persona', () => {
    beforeEach(async () => {
      this.response = await request(
        'http://localhost:8080/info-rut?name=info-rut&type=persona'
      )
    })

    it('responds with status 200 and not results', () => {
      expect(this.response.statusCode).to.equal(200)
      expect(this.response.body).to.equal('no hay resultados para info-rut')
    })
  })

  describe('GET /info-rut', () => {
    beforeEach(async () => {
      this.response = await request('http://localhost:8080/info-rut')
    })

    it('responds with status 200 and not results', () => {
      expect(this.response.statusCode).to.equal(200)
      expect(this.response.body).to.equal('faltan los parametros type y name')
    })
  })

  describe('GET /info-rut?name=asdf&type=persona', () => {
    beforeEach(async () => {
      this.response = await request(
        'http://localhost:8080/info-rut?name=asdf&type=persona'
      )
    })

    it('responds with status 200 and not results', () => {
      expect(this.response.statusCode).to.equal(200)
      expect(this.response.body).to.equal(
        'Ocurrio un error al consultar el nombre'
      )
    })
  })
})
