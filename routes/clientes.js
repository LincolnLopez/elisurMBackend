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

  
//  CLIENTES
routes.get('/clientes', ensureToken, function (req,res){
     
   jwt.verify(req.token, 'my_secret_key', (err,data)=>{
       if(err) {
           res.send('ACCESO DENEGADO')
       }else{

           req.getConnection((err,conn) =>{
               if(err)return res.send(err)
               conn.query('CALL PROCE_CLIENTES_SELECT', (err,rows)=>{
                   if(err) return res.send(err)
                   res.status(200).json(rows[0]);
               })
       
           })
       }
   })
})
//UNA CATEGORIA
routes.get('/cliente',ensureToken, function (req, res){

   jwt.verify(req.token, 'my_secret_key', (err,data)=>{
       if(err) {
           res.send('ACCESO DENEGADO')
       }else{
           const {P_COD_CLIENTE } = req.body;
           const consulta = `CALL PROCE_CLIENTES_SELECT_UNO('${P_COD_CLIENTE }')`;
  
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


// INSERTAR CLIENTE
routes.post('/insert_cliente',ensureToken, function (req, res){

   jwt.verify(req.token, 'my_secret_key', (err,data)=>{
       if(err) {
           res.send('ACCESO DENEGADO')
       }else{
           const {DNI_CLIENTE, NOMBRE_CLIENTE, APELLIDOS_CLIENTE, DIRECCION_CLIENTE, RTN_CLIENTE,TELEFONO_CLIENTE,CORREO_CLIENTE, COD_TIPO_CLIENTE} = req.body;
           const consulta = `CALL PROCE_CLIENTES_INSERT('${DNI_CLIENTE}','${NOMBRE_CLIENTE}','${APELLIDOS_CLIENTE}','${DIRECCION_CLIENTE}','${RTN_CLIENTE}','${TELEFONO_CLIENTE}','${CORREO_CLIENTE}','${COD_TIPO_CLIENTE}')`;
  
           req.getConnection((err, conn)=>{
           conn.query(consulta, (err, rows)=>{
                if(!err)
               res.send('CLIENTE CREADO')
                else
               console.log(err)
               })         
           })
       }
   })

})

// ACTUALIZAR CATEGORIA
routes.put('/update_cliente',ensureToken, function  (req,res){
   jwt.verify(req.token, 'my_secret_key', (err,data)=>{
       if(err) {
           res.send('ACCESO DENEGADO')
       }else{
         const {COD_CLIENTE,DNI_CLIENTE, NOMBRE_CLIENTE, APELLIDOS_CLIENTE, DIRECCION_CLIENTE,RTN_CLIENTE,TELEFONO_CLIENTE,CORREO_CLIENTE , COD_TIPO_CLIENTE} = req.body;
           const consulta = `CALL PROCE_CLIENTES_UPDATE('${COD_CLIENTE}','${DNI_CLIENTE}','${NOMBRE_CLIENTE}','${APELLIDOS_CLIENTE}','${DIRECCION_CLIENTE}','${RTN_CLIENTE}','${TELEFONO_CLIENTE}','${CORREO_CLIENTE}','${COD_TIPO_CLIENTE}')`;
  
           req.getConnection((err,conn)=>{
           conn.query(consulta,(err,rows)=>{
               if(!err)
               res.send('CLIENTE ACTUALIZADO')
               else
                   console.log(err)
                })
           })    
       }
   })
})

// ELIMINAR CATEGORIA


routes.delete('/cliente/eliminar',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_CLIENTE}= req.body
            const consulta = `CALL PROCE_CLIENTES_DELETE('${COD_CLIENTE}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Cliente desactivado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

  
  module.exports = routes