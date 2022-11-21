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
// Seleccionar categoria
routes.get('/categoria', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_CATEGORIAS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})
//UNA CATEGORIA
routes.get('/categoria',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_CATEGORIA } = req.body;
            const consulta = `CALL PROCE_CATEGORIA_SELECT_UNO('${COD_CATEGORIA }')`;
   
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


// INSERTAR CATEGORIA
routes.post('/categoria/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_CATEGORIA} = req.body;
            const consulta = `CALL PROCE_CATEGORIAS_INSERT('${NOMBRE_CATEGORIA}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('Categoria Creada')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR CATEGORIA
routes.put('/categoria/actualizar',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_CATEGORIA, NOMBRE_CATEGORIA,}= req.body
            const consulta = `CALL PROCE_CATEGORIAS_UPDATE('${COD_CATEGORIA}','${NOMBRE_CATEGORIA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('CATEGORIA ACTUALIZADA')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

// ELIMINAR CATEGORIA
routes.delete('/categoria/eliminar',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_CATEGORIA } = req.params
            const consulta = `CALL PROCE_CATEGORIA_DELETE('${COD_CATEGORIA }')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_CATEGORIA ],(err,rows)=>{
                if(!err)
                res.send('CATEGORIA ELIMINADA')
                else
                console.log(err)
                })
            })
        }
    })
})

module.exports = routes