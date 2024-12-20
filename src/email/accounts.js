const sgmail = require("@sendgrid/mail")

sgmail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (name, email) => {
    sgmail.send(
        {
            to: email,
            from: "techie.vigneshramesh@gmail.com",
            subject: "Thanks for joining",
            text: `Welcome to the app ${name}`
        }
    )
}

const cancellationEmail = (name, email) => {
    sgmail.send(
        {
            to: email,
            from: "techie.vigneshramesh@gmail.com",
            subject: "Cancellation",
            text: `Sorry ${name}, We did not meet your expectation.`
        }
    )
}

module.exports = { sendWelcomeEmail, cancellationEmail}