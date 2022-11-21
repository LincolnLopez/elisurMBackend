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

/*--------------------------------Tipo de Clientes---------------------------------*/


// Ver tipos de cliente
routes.get('/tipoClientes', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_TIPOS_CLIENTE_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})


//VER un Tipo de cliente
routes.get('/tipoclienteUNO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_TIPO_CLIENTE } = req.body;
            const consulta = `CALL PROCE_TIPOS_CLIENTE_SELECT_UNO('${COD_TIPO_CLIENTE }')`;
   
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


//Insert Tipo de cliente
routes.post('/tipocl/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE_TIPO_CLIENTE} = req.body;
            const consulta = `CALL PROCE_TIPOS_CLIENTE_INSERT('${NOMBRE_TIPO_CLIENTE}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('TipoCliente CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

//actualizar Tipos de CLiente
routes.put('/tipoclientes/:COD_TIPO_CLIENTE',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_TIPO_CLIENTE,NOMBRE_TIPO_CLIENTE, ESTADO}= req.body
            const consulta = `CALL PROCE_SERVICIOS_UPDATE('${COD_TIPO_CLIENTE}','${NOMBRE_TIPO_CLIENTE}','${ESTADO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Datos actualizados correctamente')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//ELIIMINAR Tipos de cliente

routes.delete('/tipo/:COD_TIPO_CLIENTE',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_TIPO_CLIENTE}= req.body
            const consulta = `CALL PROCE_TIPOS_CLIENTE_DELETE('${COD_TIPO_CLIENTE}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Tipo de CLiente DESACTIVADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})


module.exports = routes;