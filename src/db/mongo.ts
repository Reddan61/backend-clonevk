import mongoose from "mongoose"


function connectToDataBase() {
    console.log("Connect to the DATABASE")
    return mongoose.connect(process.env.DATABASE as string)
}

mongoose.connection.on('error', async (err) => {
    console.log("DATABASE CONNECTION ERROR\n" + err)
    await connectToDataBase()
})

export default connectToDataBase