import {Router} from 'express';
import userModel from '../models/user.model.js';

const router = Router();

router.post("/register", async (req, res) =>{
    const {first_name, last_name, email, age, password} = req.body;
    // console.log("Registrando usuario");
    // console.log(req.body);

    const exist = await userModel.findOne({ email });
    if (exist){
        return res.status(400).send({status: 'error', message: 'Usuario ya existe'})
    }

    const user = {
        first_name, 
        last_name, 
        email, 
        age, 
        password
    }

    const result = await userModel.create(user);
    res.send({status: "Success", message:"Usuario creado correctamente con ID: " + result.id})
})

router.post("/login", async (req,res)=>{
    const {email, password} = req.body;
    const user = await userModel.findOne({email, password});

    if (!user) return res.status(401).send({status: "error", error: "Credenciales incorrectas"})

    req.session.user = {
        name:`${user.last_name}, ${user.first_name}`,
        email: `${user.email}`,
        age: `${user.age}`
    }

    res.send({status: "success", payload: req.session.user, message: "Logueo realizado con exito!"})
})

export default router;