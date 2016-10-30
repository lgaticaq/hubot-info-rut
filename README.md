# hubot-info-rut

[![npm version](https://img.shields.io/npm/v/hubot-info-rut.svg?style=flat-square)](https://www.npmjs.com/package/hubot-info-rut)
[![npm downloads](https://img.shields.io/npm/dm/hubot-info-rut.svg?style=flat-square)](https://www.npmjs.com/package/hubot-info-rut)
[![Build Status](https://img.shields.io/travis/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://travis-ci.org/lgaticaq/hubot-info-rut)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/hubot-info-rut/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/hubot-info-rut?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/hubot-info-rut)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-info-rut#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-info-rut.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-info-rut#info=devDependencies)

> Un script hubot para obtener a quien pertenece un determinado RUT

## Instalación

```bash
npm i -S hubot-info-rut
```

agregar `["hubot-info-rut"]` en `external-scripts.json` y setear `HUBOT_URL` en las variables de entorno.

## Ejemplos

`hubot info-rut rut 11111111-1` -> `Juan Perez (11.111.111-1)`

`hubot info-rut persona perez` -> `Juan Perez (11.111.111-1)`

`hubot info-rut empresa sushi` -> `Sushi (11.111.111-1)`

## License

[MIT](https://tldrlegal.com/license/mit-license)
