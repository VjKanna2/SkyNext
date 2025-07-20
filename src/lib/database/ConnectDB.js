import mongoose from "mongoose";

const URL = process.env.DATABASE_URL

if (!URL) throw new Error('DB Connection Failed')

let cache = global.mongoose

if (!cache) {
    cache = global.mongoose = { connection: null, promise: null };
}

export async function ConnectDB () {
    if(cache.connection) return cache.connection
    if(!cache.promise){
        cache.promise = mongoose.connect(URL,{
            dbName: 'SkyNext',
            bufferCommands: false
        })
    }

    cache.connection = await cache.promise
    return cache.connection
}
