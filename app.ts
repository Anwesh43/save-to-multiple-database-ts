import Producer from "./Producer";
import RedisConsumer from "./consumers/RedisConsumer";
import MongoConsumer from "./consumers/MongoConsumer";
import {config} from 'dotenv'

async function start() {
    config()
    const QUEUE_NAME : string = "PERSON_QUEUE"
    const producer = new Producer(QUEUE_NAME)
    const redisConsumer = new RedisConsumer(QUEUE_NAME)
    const {
        MONGO_USER_NAME =  '',
        MONGO_PASSWORD = '',
        MONGO_DB_NAME = ''
    } = process.env
    const mongoConsumer = new MongoConsumer(QUEUE_NAME, MONGO_USER_NAME, MONGO_PASSWORD, MONGO_DB_NAME, 'persons')
    await producer.connect()
    mongoConsumer.watch(console.log)
    await redisConsumer.connect()

    redisConsumer.start()
    mongoConsumer.start()

    console.log("Started producing and consuming")
    process.stdin.resume()
    
    process.stdin.on('data', (msg : Buffer) => {
        producer.publish(msg.toString())
    })

    process.stdin.on('error', async () => {
        await mongoConsumer.close()
        await redisConsumer.close()
    })

    process.stdin.on('end', async () => {
        await mongoConsumer.close()
        await redisConsumer.close()
    })
}

start()