const express = require("express")
const router = new express.Router()
const multer = require("multer");

const User = require('../models/user')
const auth = require("../middleware/auth")
const sharp = require("sharp")

const { sendWelcomeEmail, cancellationEmail } = require("../email/accounts")


/* Users routes */
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})

router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    }
    catch (e) {
        res.status(400).send(e);
    }
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch (e) {
        res.status(500).send(e)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        sendWelcomeEmail(user.name, user.email)

        const token = await user.generateAuthToken();

        res.status(201).send({ user, token })
    }
    catch (e) {
        res.status(400).send(e)
    }
})

router.patch('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedKeys = ["name", "password", "email", "age"];
    const updateAllowed = updates.every((updateKey) => allowedKeys.includes(updateKey));
    if (!updateAllowed) {
        return res.status(406).send({
            error: "Invalid operation"
        })
    }
    try {
        const user = req.user
        updates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.status(200).send(user)
    }
    catch (e) {
        res.status(404).send(e);
    }
})

router.delete('/users/me', auth, async (req, res) => {
    await req.user.remove();
    cancellationEmail(req.user.name, req.user.email)
    res.send(req.user)
})

const upload = multer({
    limits: {
        fileSize: 1000000,

    },
    fileFilter: function (req, file, cb) {
        console.log(file)
        if (!file.originalname.match(/\w+.(jpeg|jpg|png)/)) {
            return cb(new Error("Please upload an image"))
        }
        cb(undefined, true);
    }
})

router.post("/users/me/avatar", auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({
        width: 250,
        height: 250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({})
}, (err, req, res, next) => {
    res.status(400).send({ error: err.message })
})

router.delete("/users/me/avatar", auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({})
})

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.id })
        if (!user || !user.avatar) {
            throw new Error("User avatar not found")
        }
        res.set('Content-Type', "image/png")
        res.send(user.avatar)
    }
    catch (err) {
        res.status(400).send(err);
    }
})



module.exports = router