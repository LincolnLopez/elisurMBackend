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

// VER ARTICULO
routes.get('/articulos', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_ARTICULOS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})
//UN ARTICULO
routes.get('/articulo',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {P_COD_ARTICULO } = req.body;
            const consulta = `CALL PROCE_CATEGORIA_SELECT_UNO('${P_COD_ARTICULO }')`;
   
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
routes.post('/articulo/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_ARTICULO, DESCRIPCION_ARTICULO, PRECIO_ARTICULO, COD_CATEGORIA} = req.body;
            const consulta = `CALL PROCE_ARTICULOS_INSERT('${NOMBRE_ARTICULO}','${DESCRIPCION_ARTICULO}','${PRECIO_ARTICULO}','${COD_CATEGORIA}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('ARTICULO CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR CATEGORIA
routes.put('/articulo/actualizar',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_ARTICULO,NOMBRE_ARTICULO, DESCRIPCION_ARTICULO, PRECIO_ARTICULO, COD_CATEGORIA}= req.body
            const consulta = `CALL PROCE_ARTICULOS_UPDATE('${COD_ARTICULO}','${NOMBRE_ARTICULO}','${DESCRIPCION_ARTICULO}','${PRECIO_ARTICULO}','${COD_CATEGORIA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('ARTICULO ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

// ELIMINAR CATEGORIA

routes.delete('/delete_articulo',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO NO PERMITIDO')
        }else{
            const {COD_ARTICULO}= req.body
            const consulta = `CALL PROCE_ARTICULOS_DELETE('${COD_ARTICULO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Articulo desactivado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

module.exports = routes