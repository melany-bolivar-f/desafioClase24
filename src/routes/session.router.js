const { Router } = require('express')
const { userModel } = require('../daos/mongo/models/user.model')
const { createHash, isValidPassword } = require('../util/hashPassword')
const passport = require('passport')
const userDaoMongo = require('../daos/mongo/userDaoMongo')
const cartDaoMongo = require('../daos/mongo/cartDaoMongo')
const { generateToken } = require('../util/createToken')
const { passportCall } = require('../passport-jwt/passportCall.middleware')
const { authorization } = require('../passport-jwt/authorization.middleware')

const userService = new userDaoMongo()
const cartService = new cartDaoMongo()

const router = Router()

router.post('/register', async (req,res) =>{
    const { first_name, last_name, date, email, password} = req.body
    //console.log(first_name, last_name, date, email, password)

    if(first_name === '' || last_name === '' || email === '' || password === '') {
        return res.send('All fields must be required')
    }
    
    try {
        const existingUser = await userService.getUserBy({email})

        console.log(existingUser)
        if (existingUser) {
            return res.send({ status: 'error', error: 'This user already exists' })
        }

        const cart = await cartService.createCart()

        const newUser = {
            first_name,
            last_name,
            date,
            email,
            password: createHash(password),
            cart: cart._id,
            role: 'user'
        }

        const result = await userService.createUser(newUser)

        const token = generateToken({
            id: result._id,
            role: result.role
        })

        res.cookie('token', token, {
            maxAge: 60*60*1000*24,
            httpOnly: true,
        }).send({
            status: 'success',
            payload: {
                id: result._id,
                first_name: result.first_name,
                last_name: result.last_name,
                email: result.email
            }
        })
    } catch (error) {
        console.error('Error during user registration:', error)
        res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
})

router.post('/login', async (req,res) => {
    const { email, password } = req.body

    if(email === '' || password === '') {
        return res.send('All fields must be required')
    }

    try{
        const user = await userService.getUserBy({ email })

        if(user.email === 'adminCoder@coder.com' && password === user.password){

            await userService.updateUserRole(user._id, 'admin')
            console.log('-----------')
            req.session.user = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: 'admin'
            }
            const token = generateToken({
                id: user._id,
                role: user.role
            })

            res.cookie('token', token, {
                maxAge: 60*60*1000*24,
                httpOnly: true,
            }).redirect('/products')
        }
        else{

            if (!user) {
                return res.send('email o contraseña invalidos')
            }

            if (!isValidPassword(password, { password: user.password })) {
                return res.send('email o contraseña invalidos')
            }

            req.session.user = {
                user: user._id,
                role: user.role
            }

            const token = generateToken({
                id: user._id,
                role: user.role
            })

            res.cookie('token', token, {
                maxAge: 60*60*1000*24,
                httpOnly: true,
            }).redirect('/products')
        }

    } catch(error) {
        console.error('Error during user login:', error)
        res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
})

router.get('/logout', async (req,res) =>{
    try{
        req.session.destroy((err) =>{
            if(err){
                console.error('Error during session destruction:', err)
                return res.status(500).send({ status: 'error', error: 'Internal Server Error' })
            }

            res.redirect('/login')
        })
    }catch(error) {
        console.error('Error during logout:', error)
        res.status(500).send({ status: 'error', error: 'Internal Server Error' })
    }
})

router.get('/current', [passportCall('jwt'), authorization(['ADMIN'])], (req,res) => {
    res.send('informacion sensible')
})

router.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req,res)=>{})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}),(req, res) => {
    req.session.user = req.user
    res.redirect('/products')
})

module.exports = router