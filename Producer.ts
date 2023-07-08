import AmqpPromiseUtil from "./utils/AmqpPromiseUtil"
import amqp from 'amqplib/callback_api'

process.stdin.resume()

export default class Producer {
    channel : amqp.Channel | null = null 
    constructor(private exchange : string) {

    }

    async connect()  {
        const connection = await AmqpPromiseUtil.connectPromise()
        this.channel = await AmqpPromiseUtil.createChannelPromise(connection)
        this.channel?.assertExchange(this.exchange, 'fanout', {
            durable: false 
        })
    }

    async publish(msg : string) {
        this.channel?.publish(this.exchange,'', Buffer.from(msg), {
            persistent: true 
        })
    }
}
