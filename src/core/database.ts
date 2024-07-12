import mongoose from "mongoose"
import dotenv from 'dotenv'
dotenv.config()


const db_url = process.env.DATABASE_URI
export const connect_db = async () => {
    try {
        const connection_instance = await mongoose.connect(db_url.toString())
		console.log(`Database connected on ${connection_instance.connection.host}`)
    } catch (error) {
        console.log('Database connection failed', error.message)
        process.exit(1)
    }
}