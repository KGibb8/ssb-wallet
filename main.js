"use script";

const Config = require('ssb-config/inject')('testnet', {port: 9999})
const Client = require('ssb-client')
const Mutual = require('ssb-mutual')
const schemas = require('ssb-mutual/schemas')
const ssbKeys = require("ssb-keys")
const ref = require('ssb-ref')

const pull = require('pull-stream')
const pullParaMap = require('pull-paramap')
const pullAbortable = require('pull-abortable')
const get = require('lodash/get')

// For Linux distros...
const keys = ssbKeys.loadOrCreateSync(`/home/${process.env.USER}/.ssb-test/secret`)
const Account = schemas.account(keys.id)

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let win

var createWindow = () => {
  win = new BrowserWindow({width: 800, height: 600})

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow()
  }
})

ipcMain.on('sendCurrency', (event, data) => {
  // Publish to sbot
  Client(keys, (err, sbot, Config) => {
    if (err) throw err
    var mutual = Mutual.init(sbot, Config)
    var value = schemas.credit(keys.id, 5, "MMT", "first")
    sbot.publish(value, (err, msg) => {
      event.sender.send('sentCurrency', msg)
    })
  })
})

ipcMain.on('getPeeps', (event) => {
  Client(keys, (err, sbot, Config) => {
    if (err) throw err
  })
})

