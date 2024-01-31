const { connect } = require('mongoose')

exports.connectDb = async () => {
    await connect('mongodb+srv://melanybolivarf:Artilleros1917@cluster0.jmxy9aq.mongodb.net/ecommerce?retryWrites=true&w=majority')
    console.log("base de datos conectada")
}
