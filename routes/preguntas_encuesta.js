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

  //SELECCIONAR Preguntas
routes.get('/preguntas',(req, res)=>{
    req.getConnection((err, conn)=>{
        if(err) return res.send(err)
 
        conn.query('CALL PROCE_PREGUNTAS_SELECT', (err, rows)=>{
            if(err) return res.send(err)
 
            res.status(200).json(rows[0]);
        })
    })
 })




 //INSERTAR pregunta
routes.post('/preguntas/insert',(req, res)=>{
    const {Npregunta} = req.body;
    const consulta = `CALL PROCE_PREGUNTAS_INSER('${pregunta}')`;
    
    req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                if(!err)
                res.send('Se Registro Correctamente')
                else
                console.log(err)
            })
        })
    })

   
    
// Actualizar   pregunta
routes.put('/pregunta/:COD_PREGUNTA',ensureToken, function  (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_PREGUNTA, PREGUNTA, ESTADO_PREGUNTA}= req.body
            const consulta = `CALL PROCE_EMPLEADOS_UPDATE('${COD_PREGUNTA}','${PREGUNTA}','${ESTADO_PREGUNTA}')`;
    
            req.getConnection((err,conn)=>{
            conn.query(consulta,(err,rows)=>{
                if(!err)
                res.send('Pregunta actualizado')
                else
                    console.log(err)
                 })
            })    
        }
    })
})

//Eliminar pregunta
routes.delete('preguntas/:COD_PREGUNTA/eliminar',ensureToken, function (req,res){
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {COD_PREGUNTA } = req.params
            const consulta = `CALL PROCE_PREGUNTAS_DELETE('${COD_PREGUNTA }')`;

             req.getConnection((err,conn)=>{
             conn.query(consulta,[COD_HERRAMIENTA ],(err,rows)=>{
                if(!err)
                res.send('Pregunta Eliminada')
                else
                console.log(err)
                })
            })
        }
    })
})  

// seleccionar individual PREGUNTA

routes.get('/preguntaUNO',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {cod_rol} = req.body;
            const consulta = `CALL PROCE_PREGUNTAS_SELECT_UNO('${COD_PREGUNTA}')`;
   
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