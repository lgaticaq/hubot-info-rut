path = require("path")
Helper = require("hubot-test-helper")
expect = require("chai").expect
nock = require("nock")

helper = new Helper("./../src/index.coffee")

describe "info rut", ->
  room = null
  @timeout(2000)

  beforeEach ->
    room = helper.createRoom()
    nock.disableNetConnect()

  afterEach ->
    room.destroy()
    nock.cleanAll()

  context "rut valid", ->
    rut = "11111111-1"

    beforeEach (done) ->
      nock("http://datos.24x7.cl")
        .get("/rut/#{rut}/")
        .replyWithFile(200, path.join(__dirname, "valid.html"))
      room.user.say("pepito", "hubot info-rut rut #{rut}")
      setTimeout(done, 1000)

    it "should return a full name", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info-rut rut #{rut}"],
        ["hubot", "RUT: #{rut}, Nombre: Anonymous"]
      ])

  context "rut invalid", ->
    rut = "1"

    beforeEach (done) ->
      nock("http://datos.24x7.cl")
        .get("/rut/#{rut}/")
        .replyWithFile(404, path.join(__dirname, "invalid.html"))
      room.user.say("pepito", "hubot info-rut rut #{rut}")
      setTimeout(done, 1000)

    it "should return a error", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info-rut rut #{rut}"],
        ["hubot", "@pepito ocurrio un error al consultar el rut"]
      ])

  context "name valid", ->
    name = "perez"

    beforeEach (done) ->
      form =
        entrada: name,
        csrfmiddlewaretoken: "asdf"
      nock("http://datos.24x7.cl")
        .get("/")
        .replyWithFile(200, path.join(__dirname, "form.html"))
        .post("/get_generic_ajax/", form)
        .reply(200, {
          status: "success",
          value: [
            {name: "JUAN PEREZ", rut: 111111111},
            {name: "PEDRO PEREZ", rut: 222222222}
          ]
        })
      room.user.say("pepito", "hubot info-rut nombre #{name}")
      setTimeout(done, 1000)

    it "should return a array of results", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info-rut nombre #{name}"]
      ])

  context "name invalid", ->
    name = "asdf"

    beforeEach (done) ->
      form =
        entrada: name,
        csrfmiddlewaretoken: "asdf"
      nock("http://datos.24x7.cl")
        .get("/")
        .replyWithFile(200, path.join(__dirname, "form.html"))
        .post("/get_generic_ajax/", form)
        .reply(200, {status: 'fail', value: []})
      room.user.say("pepito", "hubot info-rut nombre #{name}")
      setTimeout(done, 100)

    it "should return a empty results", ->
      expect(room.messages).to.eql([
        ["pepito", "hubot info-rut nombre #{name}"],
        ["hubot", "@pepito no hay resultados para #{name}"]
      ])
