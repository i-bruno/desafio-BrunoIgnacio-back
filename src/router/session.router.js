import {Router} from 'express';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import passport from 'passport';

const router = Router();

router.get("/github", passport.authenticate('github', { scope: ['user:email'] }), async (req, res) => { });

// githubcallback
router.get("/githubcallback", passport.authenticate('github', { failureRedirect: '/github/error' }), async (req, res) => {
    const user = req.user;
    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age
    };
    req.session.admin = true;
    res.redirect("/users");
});

router.post("/register",passport.authenticate('register', {failureRedirect:'/api/sessions/fail-register'}), async (req, res) =>{
    console.log("Registrando nuevo usuario.");
    res.status(201).send({status: "success", message: "Usuario creado con éxito!"});    
})

router.post("/login",passport.authenticate("login", {failureRedirect:'/api/sessions/fail-login'}), async (req,res)=>{
    console.log("Usuario encontrado para login")
    const user = res.user;
    console.log(user);

    if(!user) return res.status(401).send({status: error, error: "Credenciales incorrectas"});
    req.session.user = {
        name: `${user.last_name} ${user.first_name}`,
        email: user.email,
        age: user.age
    }
    res.send({status: "success", payload: req.session.user, message: "Primer logueo realizado! :) "})
});

router.get("/fail-register", (req, res)=> {
    res.status(401).send({error: "Error en el proceso de registro"});
})

router.get("/fail-login", (req, res)=> {
    res.status(401).send({error: "Error en el proceso de login"});
})

export default router;