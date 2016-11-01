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

    Publisher.prototype.on = function (fn, type) {
        type = type || 'any';
        if (typeof this.subscribers[type] === "undefined") {
            this.subscribers[type] = [];
        }
        this.subscribers[type].push(fn);
    };
    Publisher.prototype.remove = function (fn, type) {
        this.visitSubscribers('remove', fn, type);
    };

    Publisher.prototype.trigger = function (publication, type) {
        this.visitSubscribers('trigger', publication, type);
    }

    Publisher.prototype.visitSubscribers = function (action, arg, type) {
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