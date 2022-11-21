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

/*--------------------------------VENTAS---------------------------------*/


// Ver venta
routes.get('/ventas', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_VENTAS_SELECT_TRANSACCIONAL', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})


//Una venta
routes.get('/ventaUNA',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {cod_venta } = req.body;
            const consulta = `CALL PROCE_VENTAS_SELECT_UNO_TRANSACCIONAL('${cod_venta }')`;
   
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


//Insert venta
routes.post('/ventas/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SERVICIO, COD_CLIENTE, COD_USUARIO, PRECIO, DESCRIPCION} = req.body;
            const consulta = `CALL PROCE_VENTAS_INSERT_TRANSACCIONAL('${COD_SERVICIO}','${COD_CLIENTE}','${COD_USUARIO}','${PRECIO}','${DESCRIPCION}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('VENTA CREADA')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR VENTA
routes.put('/VENTA/:COD_VENTA',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_VENTA,COD_SERVICIO,COD_CLIENTE,COD_USUARIO,COD_ESTADO,PRECIO,DESCRIPCION}= req.body
            const consulta = `CALL PROCE_VENTAS_UPDATE_TRANSACCIONAL('${COD_VENTA}','${COD_SERVICIO}','${COD_CLIENTE}','${COD_USUARIO}','${COD_ESTADO}','${PRECIO}','${DESCRIPCION}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('VENTA ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//Eliminar venta


routes.delete('/venta/:COD_VENTA',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_VENTA}= req.body
            const consulta = `CALL PROCE_VENTAS_DELETE_TRANSACCIONAL('${COD_VENTA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Venta Eliminada')
                else
                    console.log(err)
                 })
            })    
        }
    })
})



module.exports = routes;