# hubot-info-rut

[![npm version](https://img.shields.io/npm/v/hubot-info-rut.svg)](https://www.npmjs.com/package/hubot-info-rut)
[![npm downloads](https://img.shields.io/npm/dm/hubot-info-rut.svg)](https://www.npmjs.com/package/hubot-info-rut)
[![Build Status](https://travis-ci.org/lgaticaq/hubot-info-rut.svg?branch=master)](https://travis-ci.org/lgaticaq/hubot-info-rut)
[![Coverage Status](https://coveralls.io/repos/github/lgaticaq/hubot-info-rut/badge.svg?branch=master)](https://coveralls.io/github/lgaticaq/hubot-info-rut?branch=master)
[![Maintainability](https://api.codeclimate.com/v1/badges/aa1fd59f706e5065cfd4/maintainability)](https://codeclimate.com/github/lgaticaq/hubot-info-rut/maintainability)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-info-rut.svg)](https://david-dm.org/lgaticaq/hubot-info-rut#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-info-rut.svg)](https://david-dm.org/lgaticaq/hubot-info-rut#info=devDependencies)

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
