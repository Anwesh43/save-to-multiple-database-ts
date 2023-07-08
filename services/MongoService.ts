import { MongoClient, Db, Collection, Document, ChangeStreamDocument } from "mongodb";


export default class MongoService {

    client : MongoClient 
    db : Db 
    collection : Collection<Document>
    constructor(url : string,  dbName : string,  collectionName : string) {
        console.log("URL", url);
        this.client = new MongoClient(url)
        this.db = this.client.db(dbName)
        this.collection = this.db.collection(collectionName)
    }

    async saveData(data : any) {
        await this.collection.insertOne(data)
    }

    async batchPut(data : Array<any>) {
        this.collection.insertMany(data)
    }

    async watch(cb : (a : any) => void) {
        const stream = this.collection.watch([
            { $match: { operationType: "insert" } }
        ])

        stream.on('change', (document : ChangeStreamDocument<Document>) => {
            cb(document)
        })
        
    }

    async close() {
        try {
            this.client.close()
            console.log("Closed client successfully")
        } catch(ex) {
            console.log("Failed to successfully close mongodb")
        }
    }
}