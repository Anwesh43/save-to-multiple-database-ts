import { RedisService } from "../services/RedisService";
import { Consumer } from "./BaseConsumer";

export default class RedisConsumer {
    
    service : RedisService 
    consumer : Consumer | null = null 

    constructor(private queue : string) {
        this.service = new RedisService()
    }

    async connect() {
        await this.service.connect()
    }

    start() {
        this.consumer = new Consumer(this.queue, (data : string) => {
            this.service.set(`curr_person`, data)
        })
        this.consumer.start()
    }

    async close() {
        await this.service.disconnect()
    }
}