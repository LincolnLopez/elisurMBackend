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

 

// VER INVENTARIO
routes.get('/inventarios', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_INVENTARIO_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})

  //VER INVENTARIO UNO
routes.get('/inventario',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_INVENTARIO} = req.body;
            const consulta = `CALL PROCE_INVENTARIO_SELECT_UNO('${COD_INVENTARIO}')`;
   
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


// INSERTAR INVENTARIO
routes.post('/inventario/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_ARTICULO, CANTIDAD_ARTICULO, TIPO_INVENTARIO} = req.body;
            const consulta = `CALL PROCE_INVENTARIOS_INSERT('${COD_ARTICULO}','${CANTIDAD_ARTICULO}','${TIPO_INVENTARIO}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('INVENTARIO CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR CATEGORIA
routes.put('/inventario/actualizar',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_INVENTARIO,COD_ARTICULO,CANTIDAD_ARTICULO,TIPO_INVENTARIO} = req.body;
            const consulta = `CALL PROCE_INVENTARIO_UPDATE('${COD_INVENTARIO}','${COD_ARTICULO}','${CANTIDAD_ARTICULO}','${TIPO_INVENTARIO}')`;
   
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('INVENTARIO ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

// ELIMINAR CATEGORIA
routes.delete('/Inventario/eliminar',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_INVENTARIO } = req.params
            const consulta = `CALL PROCE_INVENTARIO_DELETE('${COD_INVENTARIO }')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_INVENTARIO ],(err,rows)=>{
                if(!err)
                res.send('INVENTARIO ELIMINADO')
                else
                console.log(err)
                })
            })
        }
    })
})

  
  module.exports = routes