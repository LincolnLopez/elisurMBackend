const express = require('express');
const routes = express.Router();
const jwt = require('jsonwebtoken');


function ensureToken(req , res , next){
    const bearerHeader = req.headers["authorization"]
     if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
     }
     else{
        res.send('ACCESO DENEGADO!')
     }
  }

  //SELECCIONAR reporte
routes.get('/fallas',(req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
 
        conn.query('CALL PROCE_REPORTE_FALLAS_SELECT', (err, rows)=>{
            if(err) return res.send(err)
 
            res.status(200).json(rows[0]);
        })
    })
 })




 //INSERTAR Reporte de falla
routes.post('/falla/insert',(req, res)=>{
    const {COD_SERVICIO, NOMBRE, TELEFONO, CORREO_ELECTRONICO, TEMA, DESCRIPCION, UBICACION} = req.body;
    const consulta = `CALL PROCE_REPORTE_FALLAS_INSERT('${COD_SERVICIO}','${NOMBRE}','${TELEFONO}','${CORREO_ELECTRONICO}','${TEMA}','${ DESCRIPCION}','${UBICACION}')`;
    
    req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                if(!err)
                res.send('Se ingreso reporte Correctamente')
                else
                console.log(err)
            })
        })
    })

   
    
// Actualizar REPORTE DALLA
routes.put('/falla_Update',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_REPORTE_FALLA,COD_SERVICIO, NOMBRE, TELEFONO, CORREO_ELECTRONICO, TEMA, DESCRIPCION, UBICACION, COD_ESTADO,NOMBRE_EMPLEADO}= req.body
            const consulta = `CALL PROCE_REPORTE_FALLAS_UPDATE('${COD_REPORTE_FALLA}','${COD_SERVICIO}','${NOMBRE}','${TELEFONO}','${CORREO_ELECTRONICO}','${TEMA}','${DESCRIPCION}','${UBICACION}','${COD_ESTADO}','${NOMBRE_EMPLEADO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('reporte actualizado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})


// seleccionar individual 

routes.get('/FALLA',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_REPORTE_FALLA} = req.body;
            const consulta = `CALL PROCE_REPORTE_FALLAS_SELECT_UNO('${COD_REPORTE_FALLA}')`;
   
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






//Eliminar falla
routes.delete('/fallas/delete',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_REPORTE_FALLA}= req.body
            const consulta = `call PROCE_REPORTE_FALLAS_DELETE('${COD_REPORTE_FALLA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send(' Eliminada')
                else
                    console.log(err)
                 })
            })    
        }
    })
})




routes.delete('/fallas/proceso',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_REPORTE_FALLA}= req.body
            const consulta = `call PROCE_REPORTE_FALLAS_PRO('${COD_REPORTE_FALLA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send(' Eliminada')
                else
                    console.log(err)
                 })
            })    
        }
    })
})



module.exports = routes