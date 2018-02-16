"use script";
const pry = require('pryjs')
const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const url = require('url');

const Config = require('ssb-config/inject')('testnet', {port: 9999})
const Client = require('ssb-client')
const Mutual = require('ssb-mutual')
const schemas = require('ssb-mutual/schemas')
const ssbKeys = require("ssb-keys")
const ref = require('ssb-ref')

var pull = require('pull-stream')
var pullParaMap = require('pull-paramap')
var pullAbortable = require('pull-abortable')
var get = require('lodash/get')

var keys = ssbKeys.loadOrCreateSync('./app-private.key')

Client(keys, (err, sbot, Config) => {
  if (err) throw err

  var mutual = Mutual.init(sbot, Config)
  var account = schemas.account(keys.id)
  sbot.publish(account)

  var transaction = {
    type: "mutual/credit",
    account: keys.id,
    amount: 5,
    currency: "MMT",
    memo: "first"
  }

  var value = schemas.credit(keys.id, 5, "MMT", "first")
  sbot.publish(value, (err, msg) => {
    console.log(msg)
  })

  var value = schemas.credit(keys.id, 50, "MMT", "second")
  sbot.publish(value, (err, msg) => {
    console.log(msg)
  })

  mutual.getAccountBalances(keys.id, (err, amount) => {
    console.log(amount)
  })
})
