export const Observable_Events = {
    changed: 'changed'
}

class Observable {
    isChannelOpen = true;
    subscribers = [];

    constructor(value) {
        this.value = value;
    }

    subscribe(event, callback) {
        this.subscribers.push({ event, callback });
    }

    getVal() {
        return {...this.value};
    }
    
    mutate(newValue) {
        if (this.isChannelOpen) {
            let oldValue = {...this.value};

            this.value = {...newValue};

            this.subscribers.forEach(subscriber => {
                if (subscriber.event === Observable_Events.changed) {
                    subscriber.callback(this.value, oldValue);
                }
            });
        }
    }

    closeChannel() {
        this.isChannelOpen = false;
    }
}

export default Observable;