# Description
#   Obtiene el nombre de la persona o empresa del RUT consultado y viceversa
#
# Dependencies:
#   "info-rut": "^3.0.0"
#
# Configuration:
#   HUBOT_URL
#
# Commands:
#   hubot info-rut rut <rut> -> Obtiene nombre a partir de un rut
#   hubot info-rut persona <nombre> -> Obtiene rut a partir de un nombre
#   hubot info-rut empresa <nombre> -> Obtiene rut a partir de un nombre
#
# Author:
#   lgaticaq

querystring = require("querystring")
infoRut = require("info-rut")

module.exports = (robot) ->
  robot.respond /info-rut rut (.*)/i, (res) ->
    rut = res.match[1]
    infoRut.getFullName(rut)
      .then (fullName) ->
        res.send "#{fullName} (#{rut})"
      .catch (err) ->
        res.reply "ocurrio un error al consultar el rut"
        robot.emit "error", err, res

  robot.respond /info-rut (persona|empresa) (.*)/i, (res) ->
    type = res.match[1]
    name = res.match[2]
    url = process.env.HUBOT_URL or "http://localhost:8080"
    fn = if type == "persona" then "getPersonRut" else "getEnterpriseRut"
    infoRut[fn](name)
      .then (results) ->
        if results.length > 5
          query = querystring.stringify({name: name, type: type})
          more = "\nMás resultados en #{url}/info-rut?#{query}"
          res.send results.slice(0, 5).map((r) ->
            "#{r.fullName} (#{r.rut})"
          ).join("\n").concat(more)
        else if results.length > 0
          res.send results.map((r) -> "#{r.fullName} (#{r.rut})").join("\n")
        else
          res.reply "no hay resultados para #{name}"
      .catch (err) ->
        res.reply "ocurrio un error al consultar el nombre"
        robot.emit "error", err, res

  robot.router.get "/info-rut", (req, res) ->
    type = req.query.type or "persona"
    name = req.query.name or ""
    fn = if type == "persona" then "getPersonRut" else "getEnterpriseRut"
    infoRut[fn](name)
      .then (results) ->
        if results.length > 0
          res.send results.map((r) -> "#{r.fullName} (#{r.rut})").join("<br/>")
        else
          res.reply "no hay resultados para #{name}"
      .catch (err) ->
        res.send "Ocurrio un error al consultar el nombre"
        robot.emit "error", err, res
