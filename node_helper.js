var NodeHelper = require('node_helper')
const fs = require('fs')

module.exports = NodeHelper.create({
    requiresVersion: '2.22.0',

    start: function(){
        console.log('Starting NodeHelper for ' + this.name)
    },

    calculateUsage: function(payload) {
        let usage = payload.dailyUsage
        let laststored = fs.readFileSync('./input.txt', { encoding: 'utf8', flag: 'r'})
        let todaysRemaining = laststored - usage
        console.log(todaysRemaining)
        fs.writeFileSync('./input.txt', todaysRemaining)
        this.sendSocketNotification('GAS_MONITOR_SEND', todaysRemaining)
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GAS_MONITOR_GET') {
            this.calculateUsage(payload)
        }
    }
})