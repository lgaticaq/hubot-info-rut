# Description
#   Obtiene el nombre de la persona o empresa del RUT consultado y viceversa
#
# Dependencies:
#   "info-rut": "^1.0.0"
#
# Commands:
#   hubot info-rut rut <rut> -> Obtiene nombre a partir de un rut
#   hubot info-rut nombre <nombre> -> Obtiene rut a partir de un nombre
#
# Author:
#   lgaticaq

infoRut = require("info-rut")

module.exports = (robot) ->
  robot.respond /info-rut rut (.*)/i, (res) ->
    rut = res.match[1]
    infoRut.getFullName(rut)
      .then (fullName) ->
        res.send "RUT: #{rut}, Nombre: #{fullName}"
      .catch (err) ->
        res.reply "ocurrio un error al consultar el rut"
        robot.emit "error", err, res

  robot.respond /info-rut nombre (.*)/i, (res) ->
    name = res.match[1]
    infoRut.getRut(name)
      .then (results) ->
        if results.length > 0
          for r in results
            res.send "RUT: #{r.rut}, Nombre: #{r.fullName}"
        else
          res.reply "no hay resultados para #{name}"
      .catch (err) ->
        res.reply "ocurrio un error al consultar el nombre"
        robot.emit "error", err, res
