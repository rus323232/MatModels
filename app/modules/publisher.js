var _publisher = (function () {
    function Publisher () {
        this.subscribers = {
            'any': []
        };
    }
    Publisher.makePublisher = function (obj) {
        var i;
        for (i in this.prototype) {
            if (this.prototype.hasOwnProperty(i) && typeof this.prototype[i] === "function") {
                obj.prototype[i] = this.prototype[i];
            }
        }
        obj.subscribers = {any: []};
    };

    Publisher.prototype.on = function (type, callback) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(callback);
    };
    Publisher.prototype.remove = function (type, callback) {
        this.visitSubscribers('remove',type, callback);
    };

    Publisher.prototype.trigger = function (type, publication) {
        this.visitSubscribers('trigger', type, publication);
    }

    Publisher.prototype.visitSubscribers = function (action, type, arg) {
        var pubtype = type || 'any',
            subscribers = this.subscribers[pubtype],
            i,
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

    return Publisher;
}());

module.exports = _publisher;