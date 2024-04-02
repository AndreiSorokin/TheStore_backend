import { MongoMemoryServer } from "mongodb-memory-server"
import mongoose from "mongoose";

async function connect() {
   const mongodb = await MongoMemoryServer.create()
   const url = mongodb.getUri()

   await mongoose.connect(url)

   return {
      closeDatabase: async () => {
         await mongoose.connection.dropDatabase()
         await mongoose.connection.close()
         await mongodb.stop()
      },
      clearDatabase: async () => {
         const collections = mongoose.connection.collections;
         for (const key in collections) {
            const collection = collections[key];
            await collection.deleteMany({})
         }
      }
   }
}