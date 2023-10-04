interface Message {
    data: any;
    attributes?: Record<string, string>;
    messageId?: string;
    publishTime?: string;
}

export interface Publisher {
    publish: (topic: string, message: Message) => Promise<void | Error>;
}

export interface Subscriber {
    subscribe: (topic: string, callback: (message: Message) => void) => Promise<void | Error>;
    unsubscribe: (topic: string) => Promise<void | Error>;
}


class PubSub implements Publisher, Subscriber {
    async publish(topic: string, message: Message): Promise<void | Error> {
        try {
            // Implementation will go here
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error("Publishing failed"));
        }
    }

    async subscribe(topic: string, callback: (message: Message) => void): Promise<void | Error> {
        try {
            // Implementation will go here
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error("Subscription failed"));
        }
    }

    async unsubscribe(topic: string): Promise<void | Error> {
        try {
            // Implementation will go here
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(new Error("Unsubscription failed"));
        }
    }
}

export const pubsub = new PubSub();