path = require("path")
Helper = require("hubot-test-helper")
expect = require("chai").expect
proxyquire = require("proxyquire")
http = require("http")
infoRutStub =
  getFullName: (rut) ->
    return new Promise (resolve, reject) ->
      if rut is "11111111-1"
        resolve("Anonymous")
      else
        reject(new Error("Not found"))
  getPersonRut: (name) ->
    return new Promise (resolve, reject) ->
      if name is "juan perez perez"
        results = [
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"}
        ]
        resolve(results)
      else if name is "soto"
        results = [
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"},
          {rut: "11.111.111-1", fullName: "Anonymous"}
        ]
        resolve(results)
      else if name is "info-rut"
        resolve([])
      else
        reject(new Error("Not found"))
  getEnterpriseRut: (name) ->
    return new Promise (resolve, reject) ->
      if name is "perez"
        results = [{rut: "11.111.111-1", fullName: "Anonymous"}]
        resolve(results)
      else if name is "info-rut"
        resolve([])
      else
        reject(new Error("Not found"))
proxyquire("./../src/script.coffee", {"info-rut": infoRutStub})

helper = new Helper("./../src/index.coffee")

describe "info rut", ->
  room = null
  @timeout(2000)

  beforeEach ->
    room = helper.createRoom()

  afterEach ->
    room.destroy()

  context "rut valid", ->
    rut = "11111111-1"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut rut #{rut}")
      setTimeout(done, 1000)

    it "should return a full name", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut rut #{rut}"],
        ["hubot", "Anonymous (#{rut})"]
      ])

  context "rut invalid", ->
    rut = "1"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut rut #{rut}")
      setTimeout(done, 1000)

    it "should return a error", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut rut #{rut}"],
        ["hubot", "@user ocurrio un error al consultar el rut"]
      ])

  context "name valid", ->
    name = "juan perez perez"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut persona #{name}")
      setTimeout(done, 1000)

    it "should return a array of results with link", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut persona #{name}"],
        [
          "hubot",
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Más resultados en " +
          "http://localhost:8080/info-rut?name=juan%20perez%20perez&" +
          "type=persona"
        ]
      ])

  context "name valid", ->
    name = "soto"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut persona #{name}")
      setTimeout(done, 1000)

    it "should return a array of results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut persona #{name}"],
        [
          "hubot",
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)\n" +
          "Anonymous (11.111.111-1)"
        ]
      ])

  context "name without results", ->
    name = "info-rut"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut empresa #{name}")
      setTimeout(done, 100)

    it "should return a empty results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut empresa #{name}"],
        ["hubot", "@user no hay resultados para #{name}"]
      ])

  context "name invalid", ->
    name = "asdf"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut persona #{name}")
      setTimeout(done, 100)

    it "should return a empty results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut persona #{name}"],
        ["hubot", "@user ocurrio un error al consultar el nombre"]
      ])

  context "GET /info-rut?name=perez&type=persona", ->
    beforeEach (done) ->
      url = "http://localhost:8080/info-rut?name=perez&type=persona"
      http.get url, (@response) => done()
      .on 'error', done

    it "responds with status 200 and results", ->
      expect(@response.statusCode).to.equal 200

  context "GET /info-rut?name=perez&type=empresa", ->
    beforeEach (done) ->
      url = "http://localhost:8080/info-rut?name=perez&type=empresa"
      http.get url, (@response) => done()
      .on 'error', done

    it "responds with status 200 and results", ->
      expect(@response.statusCode).to.equal 200

  context "GET /info-rut?name=info-rut&type=persona", ->
    beforeEach (done) ->
      url = "http://localhost:8080/info-rut?name=info-rut&type=persona"
      http.get url, (@response) => done()
      .on 'error', done

    it "responds with status 200 and not results", ->
      expect(@response.statusCode).to.equal 200
