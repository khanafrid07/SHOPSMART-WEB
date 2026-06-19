const { Queue } = require("bullmq")



const connection = {
    host: "localhost",
    port: 6379,

}

const emailQueue = new Queue("emailQueue", {
    connection
});


module.exports = { emailQueue, connection }