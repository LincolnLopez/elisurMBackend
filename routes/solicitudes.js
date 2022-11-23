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

/*--------------------------------SOLICITUDES---------------------------------*/


// Ver SOLICITUDES
routes.get('/solicitudes', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_SOLICITUDES_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})


//UNA SOLICITUD
routes.get('/solicitud',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SOLICITUD} = req.body;
            const consulta = `CALL PROCE_SOLICITUDES_SELECT_UNO('${COD_SOLICITUD }')`;
   
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


// INSERTAR SOLICITUD
routes.post('/solicitudes/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {NOMBRE,APELLIDO, TELEFONO, CORREO_ELECTRONICO, TIPO_SOLICITANTE, TELEFONO_OPCIONAL, DIRECCION_SOLICITANTE , NOMBRE_E_C,RTN_DNI, CIUDAD, COD_SERVICIO, DESCRIPCION_SOLICITUD} = req.body;
            const consulta = `CALL PROCE_SOLICITUDES_INSERT('${NOMBRE}','${APELLIDO}','${TELEFONO}','${CORREO_ELECTRONICO}','${TIPO_SOLICITANTE}','${TELEFONO_OPCIONAL}','${DIRECCION_SOLICITANTE}','${NOMBRE_E_C}','${RTN_DNI}','${CIUDAD}','${COD_SERVICIO}','${DESCRIPCION_SOLICITUD}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('SOLICITUD CREADA')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR SOLICITUD
routes.put('/solicitudes/update',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SOLICITUD,NOMBRE,APELLIDO, TELEFONO, CORREO_ELECTRONICO, TIPO_SOLICITANTE, TELEFONO_OPCIONAL, DIRECCION_SOLICITANTE, NOMBRE_E_C,RTN_DNI, CIUDAD, COD_SERVICIO, DESCRIPCION_SOLICITUD,COD_ESTADO}= req.body
            const consulta = `CALL PROCE_SOLICITUDES_UPDATE('${COD_SOLICITUD}','${NOMBRE}','${APELLIDO}','${TELEFONO}','${CORREO_ELECTRONICO}','${TIPO_SOLICITANTE}','${TELEFONO_OPCIONAL}','${DIRECCION_SOLICITANTE}','${NOMBRE_E_C}','${RTN_DNI}','${CIUDAD}','${COD_SERVICIO}','${DESCRIPCION_SOLICITUD}','${COD_ESTADO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('SOLICITUD ACTUALIZADA')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




//Eliminar SOLICITUD

routes.delete('/solicitudes/delete',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_SOLICITUD}= req.body
            const consulta = `CALL PROCE_SOLICITUDES_DELETE('${COD_SOLICITUD}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('SOLICITUD Eliminada')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




module.exports = routes;