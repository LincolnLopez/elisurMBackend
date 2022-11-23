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

//************ROLES*********** */ 
// Seleccionar roles


routes.get('/roles', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_ROLES_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})

//Roles y permisos con Join
routes.get('/roles_permisos', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_ROLES_PERMISOS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})

//UN ROL
routes.get('/rol',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_ROL } = req.body;
            const consulta = `CALL PROCE_ROLES_SELECT_UNO('${COD_ROL }')`;
   
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


// INSERTAR ROL
routes.post('/insert_roles',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {NOMBRE_ROL} = req.body;
            const consulta = `CALL PROCE_ROLES_INSERT('${NOMBRE_ROL}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('ROL CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR ROL
routes.put('/actualizar_roles',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_ROL, NOMBRE_ROL}= req.body
            const consulta = `CALL PROCE_ROL_UPDATE('${COD_ROL}','${NOMBRE_ROL}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('ROL ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//Eliminar rol

routes.delete('/eliminar_roles',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_ROL}= req.body
            const consulta = `CALL PROCE_ROL_DELETE('${COD_ROL}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('ROL Eliminado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})



module.exports = routes;