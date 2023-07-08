import AmqpPromiseUtil from "../utils/AmqpPromiseUtil";


export class Consumer {
    constructor(private exchange : string, private cb : (a : string) => void) {

    }
    async start() {
        const connection = await AmqpPromiseUtil.connectPromise()
        const channel = await AmqpPromiseUtil.createChannelPromise(connection)
        channel.assertExchange(this.exchange, 'fanout', {
            durable: false 
        })
        const queue = await AmqpPromiseUtil.createTemporaryQueue(channel)
        channel.bindQueue(queue.queue, this.exchange, '')
        AmqpPromiseUtil.consumeChannel(queue.queue, channel, this.cb)
    }    
}