Module.register("MMM-GasMonitor", {

    defaults: {
        updateInterval: 86400000,
        dailyUsage: 0.997
    },

    getStyles: function() {
        return ["MMM-GasMonitor.css"]
    },

    start: function() {
        Log.info(`Starting module: ${this.name}`);
        this.suspended = false;
        this.timer = null;
        this.payload = null;

        this.getData();
        this.scheduleUpdate();
    },

    stop: function() {
        Log.info(`Stopping module ${this.name}`)
    },

    getData: function() {
        this.sendSocketNotification("GAS_MONITOR_GET", this.config)
    },

    scheduleUpdate: function(delay) {
        var nextUpdate = this.config.updateInterval
        if (typeof delay != "undefined" && delay >= 0) {
            nextUpdate = delay
        }

        var self = this;
        setInterval(function () {
            self.getData();
        }, nextUpdate)
    },
    
    socketNotificationReceived: function(notification, payload) {
        if (notification === "GAS_MONITOR_SEND") {
            // do something with the data here
            this.payload = payload;
            this.updateWrapper(this.payload)
        }
    },

    getDom: function() {
        const wrapper = document.createElement("section");
        wrapper.id = "gmId"
        wrapper.className = "gas"

        const gas_card = document.createElement("div");
        gas_card.className = "gas__card"

        const gas_data = document.createElement("div")
        gas_data.className = "gas__data"

        const gas_text = document.createElement("p")
        gas_text.className = "gas__text"
        gas_text.innerHTML = "Gas Monitor"

        const gas_percentage = document.createElement("h1")
        gas_percentage.className = "gas__percentage"
        gas_percentage.innerHTML = "20%"

        const gas_status = document.createElement("p")
        gas_status.className = "gas__status"
        gas_status.innerHTML = "Low Gas Level"

        gas_data.appendChild(gas_text)
        gas_data.appendChild(gas_percentage)
        gas_data.appendChild(gas_status)
        // gas_card.appendChild(gas_data)

        const gas_pill = document.createElement("div")
        gas_pill.className = "gas__pill"

        const gas_level = document.createElement("div")
        gas_level.className = "gas__level"

        const gas_liquid = document.createElement("div")
        gas_liquid.className = "gas__liquid"

        gas_level.appendChild(gas_liquid)

        gas_pill.appendChild(gas_level)

        gas_card.appendChild(gas_data)
        gas_card.appendChild(gas_pill)

        wrapper.appendChild(gas_card)

        return wrapper
    },

    updateWrapper: function (payload) {
        payload = this.payload;
        let wrapper = document.getElementById("gmId");
        const gasLiquid = document.querySelector('.gas__liquid');
        const gasStatus = document.querySelector('.gas__status');
        const gasPercentage = document.querySelector('.gas__percentage');
        let level1 = parseFloat(payload) //Math.floor(0.95 * 100)
        let level = level1.toFixed(2);
        gasPercentage.innerHTML = level + '%'

        gasLiquid.style.height = `${level}%` //${parseInt(level * 100)}%

        if (level == 100) {
            gasStatus.innerHTML = 'Gas Level Full'
            gasLiquid.style.height = '103%'
        } else if (level >= 20 || level <= 99) {
            gasStatus.innerHTML = 'Gas Level Ok'
        }
        else if(level <= 21) {
            gasStatus.innerHTML = 'Low Gas Level'
        }
        else {
            gasStatus.innerHTML = 'Something went wrong!'
        }

        if(level <= 20) {
            gasLiquid.classList.add('gradient-color-red')
            gasLiquid.classList.remove('gradient-color-orange', 'gradient-color-yellow', 'gradient-color-green')
        } else if(level >= 21 || level <= 40) {
            gasLiquid.classList.add('gradient-color-orange')
            gasLiquid.classList.remove('gradient-color-red', 'gradient-color-yellow', 'gradient-color-green')
        } else if(level >= 41 || level <= 80) {
            gasLiquid.classList.add('gradient-color-yellow')
            gasLiquid.classList.remove('gradient-color-red', 'gradient-color-orange', 'gradient-color-green')
        } else {
            gasLiquid.classList.add('gradient-color-green')
            gasLiquid.classList.remove('gradient-color-red', 'gradient-color-orange', 'gradient-color-yellow')
        }        
    }
})