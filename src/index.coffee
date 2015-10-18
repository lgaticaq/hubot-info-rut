# Description
#   Obtiene el nombre de la persona o empresa del RUT consultado
#
# Commands:
#   hubot info rut <rut> -> RUT: <rut>, Nombre: <nombre>
#
# Author:
#   lgaticaq

infoRut = require("info-rut")

module.exports = (robot) ->
  robot.respond /info rut (.*)/i, (msg) ->
    rut = msg.match[1]
    infoRut rut, (err, fullName) ->
      if err
        msg.send "RUT no encontrado"
      else
        msg.send "RUT: #{rut}, Nombre: #{fullName}"
