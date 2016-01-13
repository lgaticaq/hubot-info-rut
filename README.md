# hubot-info-rut

[![npm version](https://img.shields.io/npm/v/hubot-info-rut.svg?style=flat-square)](https://www.npmjs.com/package/hubot-info-rut)
[![npm downloads](https://img.shields.io/npm/dm/hubot-info-rut.svg?style=flat-square)](https://www.npmjs.com/package/hubot-info-rut)
[![Build Status](https://img.shields.io/travis/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://travis-ci.org/lgaticaq/hubot-info-rut)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-info-rut#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-info-rut#info=devDependencies)
[![Join the chat at https://gitter.im/lgaticaq/hubot-info-rut](https://img.shields.io/badge/gitter-join%20chat%20%E2%86%92-brightgreen.svg?style=flat-square)](https://gitter.im/lgaticaq/hubot-info-rut?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

Un script hubot para obtener a quien pertenece un determinado RUT

## Instalación
```bash
npm i -S hubot-info-rut
```

agregar `["hubot-info-rut"]` en `external-scripts.json`.

## Ejemplos
`hubot info-rut rut 11111111-1` -> `RUT: 11111111-1, Nombre: Anonymous`
`hubot info-rut nombre perez` -> `RUT: 11111111-1, Nombre: JUAN PEREZ`
