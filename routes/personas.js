const express = require('express');
const routes = express.Router();
var jwt = require('jsonwebtoken');


function ensureToken(req , res , next){
    const bearerHeader = req.headers["authorization"]
     if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
     }
     else{
        res.send('ACCESO DENEGADO')
     }
  }

//************SERVICIOS*********** */ 


// Ver usuarios
routes.get('/usuarios', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_USUARIOS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})


//UN usuario
routes.get('/USUARIO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_USUARIO } = req.body;
            const consulta = `CALL PROCE_USUARIOS_SELECT_UNO('${COD_USUARIO }')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                 res.status(200).json(rows[0]);
                 else
                console.log(err)
                })         
            })
        }
    })

})


//validar usuario y password
routes.get('/validar_usuario',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_USUARIO,PASSWORD_USUARIO} = req.body;
            const consulta = `CALL PROCE_VALIDACION_LOGIN('${NOMBRE_USUARIO}','${PASSWORD_USUARIO}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                 res.status(200).json(rows[0]);
                 else
                console.log(err)
                })         
            })
        }
    })

})


// INSERTAR usuarios
routes.post('/insert_usuarios',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_USUARIO, CORREO_USUARIO, PASSWORD_USUARIO, COD_ROL} = req.body;
            const consulta = `CALL PROCE_USUARIOS_INSERT('${NOMBRE_USUARIO}','${CORREO_USUARIO}','${PASSWORD_USUARIO}','${COD_ROL}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('Usuario CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR usuarios
routes.put('/actualizar_usuarios',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_USUARIO,NOMBRE_USUARIO,CORREO_USUARIO, PASSWORD_USUARIO, COD_ROL}= req.body
            const consulta = `CALL PROCE_USUARIOS_UPDATE('${COD_USUARIO}','${NOMBRE_USUARIO}','${CORREO_USUARIO}','${PASSWORD_USUARIO}','${COD_ROL}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Datos actualizados')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//Eliminar usuarios


routes.delete('/eliminar_usuario',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_USUARIO}= req.body
            const consulta = `CALL PROCE_USUARIOS_DELETE('${COD_USUARIO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Usuario desactivado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




module.exports = routes;