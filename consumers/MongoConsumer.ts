import { ChangeStreamDocument } from "mongodb";
import MongoService from "../services/MongoService";
import { Person } from "../typing";
import { Consumer } from "./BaseConsumer";
import { writeFileSync } from "fs";
export default class MongoConsumer {

    consumer : Consumer | null = null 
    mongoService : MongoService

    constructor(private queue: string, username : string, password : string, db : string, collectionName : string) {
        this.mongoService = new MongoService(`mongodb://127.0.0.1:27017/?authMechanism=DEFAULT`, db, collectionName)
    }

    start() {
        this.consumer = new Consumer(this.queue, async (data : string) => {
            const personParts : string[] = data.split(" ")
            const p : Person = {
                name : personParts[0],
                age : personParts[1], 
                job : personParts[2]
            }
            this.mongoService.saveData(p).then((d) => {
                writeFileSync('log.txt', `Written ${data}`)
            })
        })
        this.consumer.start()
    }

    watch(cb : (c : ChangeStreamDocument<Document>) => void) {
        //this.mongoService.watch(cb)
    }

    async close() {
        this.mongoService.close()
    }
}