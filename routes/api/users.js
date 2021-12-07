const express = require('express')
const router = express.Router()
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

// Generate web token function
const generateToken = (user, secretKey, expiry) => {
    return jwt.sign({
        'username': user.username,
        'id': user.id,
        'email': user.email
    }, secretKey, {
        'expiresIn': expiry // 1000ms = 1000 milliseconds, 1h = 1 hour, 3d = 3 days, 4m = 4 minutes, 1y = 1 year
    })
}

// const getHashedPassword = (password) => {
//     const sha256 = crypto.createHash('sha256');
//     const hash = sha256.update(password).digest('base64');
//     return hash;
// }

const { User, BlacklistedToken } = require('../../models')
const { checkIfAuthenticatedJWT } = require('../../middlewares');


// Post route for user register
router.post('/register', async function (req, res) {

    try {
        let user = new User({
            'username': req.body.username,
            'email': req.body.email,
            'password': req.body.password,
            'role_type': req.body.role_type
        })

        if (req.body.role_type == "user") {
            await user.save()
            res.status(200)
        } else {
            res.status(400)
            res.json({
                'error': "Registration Failed"
            })
        }
    }
    catch (e) {
        res.status(500);
        res.send({
            'error': "We have encountered an internal server error"
        })
    }

})

// Post route for user login 
router.post('/login', async function (req, res) {

    try {
        let user = await User.where({
            'email': req.body.email
        }).fetch({
            'require': false
        })

        if (user && user.get('password') == req.body.password) {
            let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h');
            let refreshToken = generateToken(user, process.env.REFRESH_TOKEN_SECRET, '3h')
            let id = user.id
            res.status(200)
            res.json({
                accessToken,
                refreshToken,
                id
            });
        } else {
            res.status(400)
            res.json({
                'error': "Wrong email or password"
            })
        }
    }
    catch (e) {
        res.status(500)
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

router.get('/profile', [checkIfAuthenticatedJWT], async function (req, res) {

    try {
        let user = await User.where({
            'id': req.user.id
        }).fetch({
            'require': false
        })
        res.status(200)
        res.send(user)
    }
    catch (e) {
        res.status(500)
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})


router.post('/refresh', async function (req, res) {
    let refreshToken = req.body.refreshToken

    // refreshToken does not exist
    if (!refreshToken) {
        res.sendStatus(401)
    }

    // Check refresh token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.sendStatus(403)
        } else {

            // Check if the token has been blacklisted
            let blacklistedToken = await BlacklistedToken.where({
                'token': refreshToken
            }).fetch({
                'require': false
            })

            // If token in blacklisted_token table
            if (blacklistedToken) {
                res.status(401);
                res.send({
                    'error': 'This token has been expired'
                })
            } else {
                // Generate new token
                let accessToken = generateToken(user, process.env.TOKEN_SECRET, '1h');
                res.json({
                    accessToken
                })
            }
        }
    })
})

// logout route post
router.post('/logout', async function (req, res) {
    let refreshToken = req.body.refreshToken

    try {
        // refreshToken does not exist
        if (!refreshToken) {
            res.status(401)
        } else {
            // Check refresh token
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
                if (err) {
                    res.sendStatus(403)
                } else {
                    // save refreshToken inside blacklisted_token table
                    const token = new BlacklistedToken()
                    token.set({
                        'token': refreshToken,
                        'date_created': new Date()
                    })
                    await token.save()
                    res.status(200)
                    res.json({
                        'message': "Logged out"
                    })
                }
            })
        }
    } catch (e) {
        res.status(500)
        res.send({
            'error': "We have encountered an internal server error"
        })
    }
})

module.exports = router