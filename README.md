# Welcome to Cytio API 👋
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Twitter: noelrock333](https://img.shields.io/twitter/follow/noelrock333.svg?style=social)](https://twitter.com/noelrock333)

> The whole backend for Cytio APP

### 🏠 [What is Cytio??](https://www.cytio.com.mx/)

## Install

Before starting to install dependencies, have to be sure that you already have
`Postgress 9.x` or higher, has to be up an running, also you'll need to create an
empty database called `taxidb`.

Another thing is you'll need `node` and `npm` installed in your computer, so, at the
moment I'm writing this README I have installed `node 10.16.3` and `npm 6.9.0` and
everything works perfect.

So it's time to install dependencies, you can run the commands below

```sh
npm install -g knex
npm install -g nodemon
npm install
```

You'll need to run this commands for migrations and seeds

```sh
knex migrate:latest
knex seed:run
```
## Usage

IMPORTANT: To run the project properly, has to ask for some environment files as the `.env` and `firebaseconfig.json`, and put it in root project,
whitout whis important files, the project just won't run.

If you're ready, run

```sh
nodemon
```
That's it !!!

## Author

👤 **Noel Escobedo**

* Twitter: [@noelrock333](https://twitter.com/noelrock333)
* Github: [@noelrock333](https://github.com/noelrock333)

👤 **Salvador Jiménez**

* Github: [@salvadorJimenez](https://github.com/salvadorJimenez)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to contact with @noelrock333 on twitter if you want to contribute
(There are a lot of work to do).
