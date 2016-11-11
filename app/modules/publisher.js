var _publisher = {
        subscribers : {
            'any': []
        },
        makePublisher: function (obj) {
            var i;
            for (i in this) {
                if (this.hasOwnProperty(i) && typeof this[i] === "function") {
                    obj[i] = this[i];
                }
            }
            obj.subscribers = {any: []};
        },
        on: function (type, callback) {
            type = type || 'any';
            if (typeof this.subscribers[type] === "undefined") {
                this.subscribers[type] = [];
            }
            this.subscribers[type].push(callback);
        },
        remove: function (type, callback) {
            this.visitSubscribers('remove',type, callback);
        },
        trigger: function (type, publication) {
            this.visitSubscribers('trigger', type, publication);
        },
        visitSubscribers: function (action, type, arg) {
            var pubtype = type || 'any',
                subscribers = this.subscribers[pubtype],
                i,
                max;
            if (!this.subscribers[pubtype]) {
                console.log("Not subscribers on: ", pubtype);
                return;
            }
                max = subscribers.length;
            for (i = 0; i < max; i += 1) {
                if (action === 'trigger') {
                    subscribers[i](arg);
                } else {
                    if (subscribers[i] === arg ) {
                        subscribers.splice(i, 1);
                    }
                }
            }
        }
}

module.exports = _publisher;