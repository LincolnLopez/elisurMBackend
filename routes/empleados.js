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

  //SELECCIONAR EMPLEADO
routes.get('/empleados',(req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
 
        conn.query('CALL PROCE_EMPLEADOS_SELECT', (err, rows)=>{
            if(err) return res.send(err)
 
            res.status(200).json(rows[0]);
        })
    })
 })




 //INSERTAR Empleado
routes.post('/empleados/insert',(req, res)=>{
    const {DNI_EMPLEADO, NOMBRE_EMPLEADO, APELLIDOS_EMPLEADO, SEXO_EMPLEADO, ESTADO_CIVIL_EMPLEADO, EDAD_EMPLEADO, TELEFONO_EMPLEADO,CORREO_EMPLEADO} = req.body;
    const consulta = `CALL PROCE_EMPLEADOS_INSERT('${DNI_EMPLEADO}','${NOMBRE_EMPLEADO}','${APELLIDOS_EMPLEADO}','${SEXO_EMPLEADO}','${ESTADO_CIVIL_EMPLEADO}','${ EDAD_EMPLEADO}','${TELEFONO_EMPLEADO}','${CORREO_EMPLEADO}')`;
    
    req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                if(!err)
                res.send('Se Registro Correctamente')
                else
                console.log(err)
            })
        })
    })

   
    
// Actualizar EMPLEADOS
routes.put('/EMPLEADO/:COD_EMPLEADO',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_EMPLEADO,DNI_EMPLEADO,NOMBRE_EMPLEADO,APELLIDOS_EMPLEADO,SEXO_EMPLEADO,ESTADO_CIVIL_EMPLEADO,EDAD_EMPLEADO,TELEFONO_EMPLEADO,CORREO_EMPLEADO}= req.body
            const consulta = `CALL PROCE_EMPLEADOS_UPDATE('${COD_EMPLEADO}','${DNI_EMPLEADO}','${NOMBRE_EMPLEADO}','${APELLIDOS_EMPLEADO}','${SEXO_EMPLEADO}','${ESTADO_CIVIL_EMPLEADO}','${EDAD_EMPLEADO}','${TELEFONO_EMPLEADO}','${CORREO_EMPLEADO}')`;
    
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

//Eliminar persona
routes.delete('/empleado/:COD_EMPLEADO',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_EMPLEADO} = req.params
            const consulta = `CALL PROCE_EMPLEADOS_DELETE('${COD_EMPLEADO}')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_EMPLEADO],(err,rows)=>{
                if(!err)
                res.send('Empleado Eliminado')
                else
                console.log(err)
                })
            })
        }
    })
})  

// seleccionar individual 

routes.get('/empleadoUNO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {cod_rol} = req.body;
            const consulta = `CALL PROCE_EMPLEADOS_SELECT_UNO('${COD_EMPLEADO}')`;
   
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