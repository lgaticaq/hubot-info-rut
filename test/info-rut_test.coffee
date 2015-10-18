path = require("path")
Helper = require("hubot-test-helper")
expect = require("chai").expect
nock = require("nock")

helper = new Helper("./../src/index.coffee")

describe "info rut", ->
  room = null

  beforeEach ->
    room = helper.createRoom()
    do nock.disableNetConnect

  afterEach ->
    room.destroy()
    nock.cleanAll()

  context "rut valido", ->
    rut = "11111111-1"

    beforeEach (done) ->
      nock("http://datos.24x7.cl")
        .get("/rut/#{rut}/")
        .replyWithFile(200, path.join(__dirname, "valid.html"))
      room.user.say("pepito", "hubot info rut #{rut}")
      setTimeout(done, 100)

    it "se espera que obtenga el nombre", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info rut #{rut}"],
        ["hubot", "RUT: #{rut}, Nombre: Anonymous"]
      ])

  context "rut invalido", ->
    rut = "1"

    beforeEach (done) ->
      nock("http://datos.24x7.cl")
        .get("/rut/#{rut}/")
        .replyWithFile(404, path.join(__dirname, "invalid.html"))
      room.user.say("pepito", "hubot info rut #{rut}")
      setTimeout(done, 100)

    it "se espera que obtenga mensaje de error", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info rut #{rut}"],
        ["hubot", "RUT no encontrado"]
      ])
