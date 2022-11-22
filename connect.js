const { MongoClient } = require("mongodb");

module.exports={
    selectedDb:{},
    async connect(){
       try {
        const client = await MongoClient.connect(process.env.mongodb_url);
        console.log("connected");
        this.selectedDb = await client.db("accounts");
       } catch (err) {
        console.error(err);
       }
    }
}