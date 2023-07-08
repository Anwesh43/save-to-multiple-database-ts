import amqp from 'amqplib/callback_api'
export default class AmqpPromiseUtil {

    static async connectPromise() : Promise<amqp.Connection> {
        return new Promise((resolve, reject) => {
            amqp.connect((error : any, data : amqp.Connection) => {
                if (error == null) {
                    resolve(data)
                } else {
                    reject(error)
                }
            })
        })
    }

    static async createChannelPromise(connection : amqp.Connection) : Promise<amqp.Channel> {
        return new Promise((resolve, reject) => {
            connection.createChannel((err : any, data : amqp.Channel) => {
                if (err == null) {
                    resolve(data)
                } else {
                    reject(err)
                }
            })
        })
    }

    static consumeChannel(queue : string, channel : amqp.Channel, cb : (arg0 : string) => void) {
        channel.consume(queue, (msg : (amqp.Message | null)) => {
            if (msg) {
                cb(msg.content.toString())
            }
        })
    }
    
}