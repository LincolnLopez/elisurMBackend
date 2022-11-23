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
// VER PERMISOS
routes.get('/permisos', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_PERMISOS_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})
//UN PERMISO
routes.get('/permiso',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const { P_COD_PERMISO} = req.body;
            const consulta = `CALL PROCE_CATEGORIA_SELECT_UNO('${ P_COD_PERMISO }')`;
   
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


// INSERTAR PERMISO
routes.post('/insert_permisos',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_ROL,EDITAR_USUARIOS,VER_INVENTARIO,ASIGNAR_TRABAJO,CERRAR_ACTIVIDAD_ASIGNADA,SOLICITAR_PRESUPUESTO,GENERAR_REPORTES,REPORTES_FALLAS} = req.body;
            const consulta = `CALL PROCE_PERMISO_INSERT('${COD_ROL}','${EDITAR_USUARIOS}','${VER_INVENTARIO}','${ASIGNAR_TRABAJO}','${CERRAR_ACTIVIDAD_ASIGNADA}','${SOLICITAR_PRESUPUESTO}','${GENERAR_REPORTES}','${REPORTES_FALLAS}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('PERMISO CREADO')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// ACTUALIZAR PERMISO
routes.put('/actualizar_permisos',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_ROL,EDITAR_USUARIOS,VER_INVENTARIO,ASIGNAR_TRABAJO,CERRAR_ACTIVIDAD_ASIGNADA,SOLICITAR_PRESUPUESTO,GENERAR_REPORTES,REPORTES_FALLAS} = req.body;
            const consulta = `CALL PROCE_PERMISOS_UPDATE('${COD_ROL}','${EDITAR_USUARIOS}','${VER_INVENTARIO}','${ASIGNAR_TRABAJO}','${CERRAR_ACTIVIDAD_ASIGNADA}','${SOLICITAR_PRESUPUESTO}','${GENERAR_REPORTES}','${REPORTES_FALLAS}')`;
   
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('PERMISO ACTUALIZADO')
                else
                    console.log(err)
                 })
            })    
        }
    })
})
 //esta no se usara, solo update
// ELIMINAR PERMISOS
routes.delete('/eliminar_permisos',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_PERMISO} = req.params
            const consulta = `CALL PROCE_PERMISOS_DELETE('${COD_PERMISO }')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_PERMISO ],(err,rows)=>{
                if(!err)
                res.send('ERMISO ELIMINADO')
                else
                console.log(err)
                })
            })
        }
    })
})

module.exports = routes