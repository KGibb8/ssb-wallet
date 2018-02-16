const ipcRenderer = require('electron').ipcRenderer;

var sendCurrencyForm = (event) => {
  event.preventDefault()
  let data = {
    quantity: document.getElementById('quantity').value,
    currency: document.getElementById('currencySelect').value,
    memo: document.getElementById('memo').value
  }
  ipcRenderer.send('sendCurrency', data);
}

ipcRenderer.on('sentCurrency', (event, data) => {
  console.log(data)
  document.getElementById('response').value = data.toString()
})

var getPeeps = (event) => {
  event.preventDefault()
  console.log(event)
  ipcRenderer.send('getPeeps')
}
