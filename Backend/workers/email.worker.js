const { Worker } = require("bullmq")

const { connection } = require("../queues/email.queue")
const { sendMail } = require("../services/resend")
const { sendWelcomeMail } = require("../services/welcomeMail")
const { orderConfirmedMail } = require("../services/OrderConfirmedMail.js")

const emailWorker = new Worker("emailQueue", async (job) => {
    if (job.name === "sendEmail") {
        const {
            to,
            subject,
            text,
            html,
        } = job.data

        await sendMail({
            to,
            subject,
            text,
            html,
        });
    } else if (job.name === "sendWelcomeMail") {
        await sendWelcomeMail(job.data);
    } else if (job.name === "sendOrderConfirmedMail") {
        const { user, order } = job.data
        await orderConfirmedMail(user, order);
    }
}, { connection })

emailWorker.on("failed", (err) => {
    console.log("Error from Email worker", err)
})

emailWorker.on("completed", (job) => {
    console.log("Job Completed", job)
})

module.exports = { emailWorker }