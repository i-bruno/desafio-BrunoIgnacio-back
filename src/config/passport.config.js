import passport from 'passport';
import passportLocal from 'passport-local';
import userModel from '../models/user.model.js';
import { createHash, isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2'

//Declaramos nuestra estrategia:
const localStrategy = passportLocal.Strategy;
const initializePassport = () => {

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.35c3b66ab7662d9c',
            clientSecret: 'f7a4a1393f92a050befd95500ebc34f02d61db12',
            callbackUrl: 'http://localhost:8080/api/sessions/githubcallback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log("Profile obtenido del usuario: ");
            console.log(profile);

            try {
                const user = await userModel.findOne({ email: profile._json.email })
                console.log("Usuario encontrado para login:");
                console.log(user);

                if (!user) {
                    console.warn("User doesn't exists with username: " + profile._json.email);
                    let newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        age: '',
                        email: profile._json.email,
                        password: '',
                        loggedBy: "GitHub"
                    }
                    const result = await userModel.create(newUser)
                    done(null, result)
                }
                else {
                    return done(null, user)
                }
            } catch (error) {
                return done(error)
            }
        }))

    //Estrategia de registro de usuario
    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { first_name, last_name, email, age } = req.body;
            try {
                const exists = await userModel.findOne({ email });
                if (exists) {
                    console.log("El usuario ya existe.");
                    return done(null, false);
                }
                const user = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    loggedBy: "App"
                };
                const result = await userModel.create(user);
                //Todo sale OK
                return done(null, result);
            } catch (error) {
                return done("Error registrando el usuario: " + error);
            }
        }
    ));

    //Estrategia de Login de la app:
    passport.use('login', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ email: username });
                console.log("Usuario encontrado para login:");
                console.log(user);
                if (!user) {
                    console.warn("User doesn't exists with username: " + username);
                    return done(null, false);
                }
                if (!isValidPassword(user, password)) {
                    console.warn("Invalid credentials for user: " + username);
                    return done(null, false);
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            let user = await userModel.findById(id);
            done(null, user);
        } catch (error) {
            console.error("Error deserializando el usuario: " + error);
        }
    });
};

export default initializePassport;


// //Implementación de passport
// const localStrategy = passportLocal.Strategy;

// const initializePassport = () => {

//     //Register
//     passport.use('register', new localStrategy(
        
//         { passReqToCallback: true, usernameField: 'email' },

//         async (req, username, password, done) => {
//             const { first_name, last_name, email, age} = req.body;
//             try {
//                 const exist = await userModel.findOne({ email });
//                 if (exist) {
//                     return res.status(400).send({ status: 'error', message: 'Usuario ya existe' })
//                 }

//                 const user = {
//                     first_name,
//                     last_name,
//                     email,
//                     age,
//                     password: createHash(password)
//                 }

//                 const result = await userModel.create(user);

//                 return done(null, result)

//             } catch (error) {
//                 return done("Error registrando el usuario:" + error)
//             }
//         }
//     ))

//     //Login

//     passport.use("login", new localStrategy(
//         { passReqToCallback: true, usernameField: 'email' },

//         async (req, username, password, done) => {
//             try {
//                 const user = await userModel.findOne({ email: username })
//                 console.log("Usuario encontrado para login");
//                 console.log(user);

//                 if (!user) {
//                     console.warn("El usuario con ese username no existe:" + username);
//                     return done(null, false);
//                 }
//                 //Validación de password
//                 if (!isValidPassword(user, password)) {
//                     return res.status(401).send({ status: "error", error: "Credenciales incorrectas" })
//                 }

//                 return done(null, user)
//             } catch (error) {
//                 return done(error)
//             }
//         }
//     ))

//         passport.serializeUser((user, done)=>{
//             done(null, user._id);
//         })

//         passport.deserializeUser(async (id, done)=>{
//             try{
//                 let user = await userModel.findOne(id);
//                 done(null, user);
//             } catch(error){
//                 console.error("Error deserializando el usuario" + error)
//             }
//         })

// }

// export default initializePassport;