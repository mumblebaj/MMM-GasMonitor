var NodeHelper = require('node_helper')
const fs = require('fs')

module.exports = NodeHelper.create({
    requiresVersion: '2.22.0',

    start: function(){
        console.log('Starting NodeHelper for ' + this.name)
    },

    calculateUsage: function(payload) {
        let usage = payload.dailyUsage.toFixed(2);

        const file = `${__dirname}/input.txt`

        let laststored = fs.readFileSync(file, 'utf8')

        let todaysRemaining = parseFloat(laststored) - usage

        let newRemain = todaysRemaining.toFixed(2)

        let refreshNum = 100 + usage

        if(newRemain <= 0) {
            fs.writeFileSync(file, refreshNum.toString(), 'utf8')
        } else {
            fs.writeFileSync(file, newRemain.toString(), 'utf8')
            console.log(`Writing ${newRemain} to ${file}`)
        }
               
        this.sendSocketNotification('GAS_MONITOR_SEND', newRemain.toString())
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GAS_MONITOR_GET') {
            this.calculateUsage(payload)
        }
    }
})