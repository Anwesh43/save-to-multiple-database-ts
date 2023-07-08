import AmqpPromiseUtil from "../utils/AmqpPromiseUtil";


export class Consumer {
    constructor(private queue : string, private cb : (a : string) => void) {

    }
    async start() {
        const connection = await AmqpPromiseUtil.connectPromise()
        const channel = await AmqpPromiseUtil.createChannelPromise(connection)
        AmqpPromiseUtil.consumeChannel(this.queue, channel, this.cb)
    }    
}