path = require("path")
Helper = require("hubot-test-helper")
expect = require("chai").expect
proxyquire = require("proxyquire")
infoRutStub =
  getFullName: (rut) ->
    return new Promise (resolve, reject) ->
      if rut is "11111111-1"
        resolve("Anonymous")
      else
        reject(new Error("Not found"))
  getRut: (name) ->
    return new Promise (resolve, reject) ->
      if name is "perez"
        results = [{rut: "11111111-1", fullName: "Anonymous"}]
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
        ["hubot", "RUT: #{rut}, Nombre: Anonymous"]
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
    name = "perez"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut nombre #{name}")
      setTimeout(done, 1000)

    it "should return a array of results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut nombre #{name}"]
      ])

  context "name without results", ->
    name = "info-rut"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut nombre #{name}")
      setTimeout(done, 100)

    it "should return a empty results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut nombre #{name}"],
        ["hubot", "@user no hay resultados para #{name}"]
      ])

  context "name invalid", ->
    name = "asdf"

    beforeEach (done) ->
      room.user.say("user", "hubot info-rut nombre #{name}")
      setTimeout(done, 100)

    it "should return a empty results", ->
      expect(room.messages).to.eql([
        ["user", "hubot info-rut nombre #{name}"],
        ["hubot", "@user ocurrio un error al consultar el nombre"]
      ])
