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


// Ver servicios
routes.get('/servicios', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_SERVICIOS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})


//UN SERVICIO
routes.get('/SERVICIO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SERVICIO } = req.body;
            const consulta = `CALL PROCE_SERVICIOS_SELECT_UNO('${COD_SERVICIO }')`;
   
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


// INSERTAR SERVICIO
routes.post('/servicios/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_SERVICIO, PRECIO_SERVICIO} = req.body;
            const consulta = `CALL PROCE_SERVICIOS_INSERT('${NOMBRE_SERVICIO}','${PRECIO_SERVICIO}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('SERVICIO CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR SERVICIO
routes.put('/servicios/:COD_SERVICIO',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SERVICIO, NOMBRE_SERVICIO, PRECIO_SERVICIO, ESTADO_SERVICIO}= req.body
            const consulta = `CALL PROCE_SERVICIOS_UPDATE('${COD_SERVICIO}','${NOMBRE_SERVICIO}','${PRECIO_SERVICIO}','${ESTADO_SERVICIO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('SERVICIO ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//Eliminar SERVICIO

routes.delete('/servicios/:ELIMINAR',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SERVICIO}= req.body
            const consulta = `CALL PROCE_SERVICIOS_DELETE('${COD_SERVICIO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('SERVICIO Eliminado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})



module.exports = routes;