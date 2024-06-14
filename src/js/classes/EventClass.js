/**
 * Represents an EventClass that allows registering, unregistering, and emitting events.
 */
class EventClass {
    /**
     * Constructs a new EventClass instance.
     */
    constructor() {
        /**
         * A dictionary to store the registered events and their corresponding callbacks.
         * @type {Object.<string, Array.<Function>>}
         */
        this.events = {};
    }

    /**
     * Registers a callback function for the specified event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback function to be executed when the event is emitted.
     */
    on(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    }

    /**
     * Unregisters a callback function for the specified event.
     * @param {string} eventName - The name of the event.
     * @param {Function} callback - The callback function to be unregistered.
     */
    off(eventName, callback) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName] = this.events[eventName].filter(cb => cb !== callback);
    }

    /**
     * Emits an event with the specified name and passes the data to the registered callback functions.
     * @param {string} eventName - The name of the event to be emitted.
     * @param {*} data - The data to be passed to the callback functions.
     */
    emit(eventName, data) {
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach(cb => cb(data));
    }
}

export default EventClass;
