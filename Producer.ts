import AmqpPromiseUtil from "./utils/AmqpPromiseUtil"
import amqp from 'amqplib/callback_api'

process.stdin.resume()

export default class Producer {
    channel : amqp.Channel | null = null 
    constructor(private queue : string) {

    }

    async connect()  {
        const connection = await AmqpPromiseUtil.connectPromise()
        this.channel = await AmqpPromiseUtil.createChannelPromise(connection)
        this.channel?.assertQueue(this.queue, {
            durable: true 
        })
    }

    async publish(msg : string) {
        this.channel?.sendToQueue(this.queue, Buffer.from(msg), {
            persistent: true 
        })
    }
}
