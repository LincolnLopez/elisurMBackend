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

// Proveedores
// Seleccionar proveedores
routes.get('/proveedores', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_PROVEEDORES_SELECT', (err,rows)=>{
                    if(err) return res.send(err)
                    
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})

//INSERTAR proveedores
routes.post('/insertar_proveedores',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {nombre_proveedor, banco_proveedor, cuenta_proveedor,telefono_proveedor,EXTENSION_PROVEEDOR,celular_proveedor,contacto_proveedor,cargo_contacto,direccion_proveedor,pais_proveedor,CIUDAD_PROVEEDOR,correo_proveedor,fecha_registro_prov,estado_proveedor} = req.body;
            const consulta = `call proc_insertar_proveedores('${nombre_proveedor}','${banco_proveedor}','${cuenta_proveedor}','${telefono_proveedor}','${EXTENSION_PROVEEDOR}','${celular_proveedor}','${contacto_proveedor}','${cargo_contacto}','${direccion_proveedor}'  ,'${pais_proveedor}','${CIUDAD_PROVEEDOR}' ,'${correo_proveedor}', '${fecha_registro_prov}', '${estado_proveedor}' )`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('Se registró correctamente')
                 else
                console.log(err)
                })         
            })
        }
    })

})

// Actualizar proveedores
routes.put('/actualizar_proveedores',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_PROVEEDOR,NOMBRE_PROVEEDOR, BANCO_PROVEEDOR,CUENTA_PROVEEDOR, TELEFONO_PROVEEDOR,EXTENSION_PROVEEDOR,CELULAR_PROVEEDOR,CONTACTO_PROVEEDOR,CARGO_CONTACTO,DIRECCION_PROVEEDOR,PAIS_PROVEEDOR,CIUDAD_PROVEEDOR,CORREO_PROVEEDOR, estado_proveedor}= req.body;
            const consulta = `call proc_actualizar_proveedores(
             '${COD_PROVEEDOR}',
             '${NOMBRE_PROVEEDOR}',
             '${BANCO_PROVEEDOR}',
             '${CUENTA_PROVEEDOR}',
             '${TELEFONO_PROVEEDOR}',
             '${EXTENSION_PROVEEDOR}',
             '${CELULAR_PROVEEDOR}',
             '${CONTACTO_PROVEEDOR}',
             '${CARGO_CONTACTO}',
             '${DIRECCION_PROVEEDOR}',
             '${PAIS_PROVEEDOR}',
             '${CIUDAD_PROVEEDOR}',
             '${CORREO_PROVEEDOR}',
             '${estado_proveedor}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Proveedor actualizado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

//Eliminar proveedor
routes.delete('/eliminar_proveedores/:cod_proveedor',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_PROVEEDOR} = req.params
            const consulta = `COD_PROVEEDOR('${COD_PROVEEDOR}'`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_PROVEEDOR],(err,rows)=>{
                if(!err)
                res.send('Proveedor Eliminado')
                else
                console.log(err)
                })
            })
        }
    })
})


// seleccionar individual PREGUNTA

routes.get('//proveedor/UNO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {cod_rol} = req.body;
            const consulta = `CALL PROCE_PROVEEDORES_SELECT_UNO('${COD_PROVEEDOR }')`;
   
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