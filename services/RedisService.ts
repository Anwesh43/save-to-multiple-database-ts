import { RedisClientType } from "@redis/client";
import { createClient } from "redis";
export class RedisService {
    client : RedisClientType
    constructor() {
        this.client = createClient()
    }

    async connect() {
        await this.client.connect()
    }

    async set(key : string, value : string) {
        await this.client.set(key, value)
    }

    async get(key : string) : Promise<any> {
        const value = await this.client.get(key)
        return value 
    }

    async disconnect() {
        await this.client.disconnect

    }
}