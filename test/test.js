'use strict'

const { describe, it, beforeEach, afterEach } = require('mocha')
const Helper = require('hubot-test-helper')
const { expect } = require('chai')
const mock = require('mock-require')
const http = require('http')

const sleep = m => new Promise(resolve => setTimeout(() => resolve(), m))
const request = uri => {
  return new Promise((resolve, reject) => {
    http.get(uri, response => resolve(response)).on('error', err => reject(err))
  })
}

const infoRutStub = {
  getFullName (rut) {
    return new Promise((resolve, reject) => {
      if (rut === '11111111-1') {
        return resolve('Anonymous')
      } else if (rut === '22222222-2') {
        return reject(new Error('Not found full name'))
      }
      reject(new Error('Not found'))
    })
  },
  getPersonRut (name) {
    return new Promise((resolve, reject) => {
      if (name === 'juan perez perez') {
        return resolve([
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' }
        ])
      } else if (name === 'soto') {
        return resolve([
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' },
          { rut: '11.111.111-1', fullName: 'Anonymous' }
        ])
      } else if (name === 'info-rut') {
        return resolve([])
      }
      reject(new Error('Not found'))
    })
  },
  getEnterpriseRut (name) {
    return new Promise((resolve, reject) => {
      if (name === 'perez') {
        return resolve([{ rut: '11.111.111-1', fullName: 'Anonymous' }])
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

  describe('rut valid', () => {
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
        'http://localhost:8080/info-rut?name=perez&type=persona'
      )
    })

    it('responds with status 200 and results', () => {
      expect(this.response.statusCode).to.equal(200)
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
    })
  })
})
