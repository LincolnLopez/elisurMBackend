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

  //SELECCIONAR Herramientas
routes.get('/herramientas',(req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
 
        conn.query('CALL PROCE_INVENTARIO_HERRAMIENTAS_SELECT', (err, rows)=>{
            if(err) return res.send(err)
 
            res.status(200).json(rows[0]);
        })
    })
 })




 //INSERTAR Herramienta
routes.post('/herramienta/insert',(req, res)=>{
    const {NOMBRE_HERRAMIENTA,DESCRIPCION_HERRAMIENTA,NUM_EXISTENCIA,COD_EMPLEADO} = req.body;
    const consulta = `CALL PROCE_EMPLEADOS_INSERT('${NOMBRE_HERRAMIENTA}','${DESCRIPCION_HERRAMIENTA}','${NUM_EXISTENCIA}','${COD_EMPLEADO}')`;
    
    req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                if(!err)
                res.send('Se Registro Correctamente')
                else
                console.log(err)
            })
        })
    })

   
    
// Actualizar   Herramienta
routes.put('/herramienta/actualizar',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_HERRAMIENTA,NOMBRE_HERRAMIENTA,DESCRIPCION_HERRAMIENTA,NUM_EXISTENCIA,COD_EMPLEADO}= req.body
            const consulta = `CALL PROCE_EMPLEADOS_UPDATE('${COD_HERRAMIENTA}','${NOMBRE_HERRAMIENTA}','${DESCRIPCION_HERRAMIENTA}','${NUM_EXISTENCIA}','${COD_EMPLEADO}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Empleado actualizado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

//Eliminar herramienta
routes.delete('/herramienta/eliminar',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_HERRAMIENTA } = req.params
            const consulta = `CALL PROCE_INVENTARIO_HERRAMIENTAS_DELETE('${COD_HERRAMIENTA }')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_HERRAMIENTA ],(err,rows)=>{
                if(!err)
                res.send('Herramienta Eliminada')
                else
                console.log(err)
                })
            })
        }
    })
})  

// seleccionar individual herramienta

routes.get('/herramientasUNO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {cod_rol} = req.body;
            const consulta = `CALL PROCE_INVENTARIO_HERRAMIENTAS_UNO('${COD_HERRAMIENTA}')`;
   
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












module.exports = routes