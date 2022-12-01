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
routes.get('/encuesta', ensureToken, function (req,res){
     
    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{

            req.getConnection((err,conn) =>{
                if(err)return res.send(err)
                conn.query('CALL PROCE_SELECT_ENCUESTA', (err,rows)=>{
                    if(err) return res.send(err)
                    res.status(200).json(rows[0]);
                })
        
            })
        }
    })
})



// INSERTAR CATEGORIA
routes.post('/encuesta/insert',ensureToken, function (req, res){

    jwt.verify(req.token, 'my_secret_key', (err,data)=>{
        if(err) {
            res.send('ACCESO DENEGADO')
        }else{
            const {P1,P2,P3,P4,P5,P6,P7} = req.body;
            const consulta = `CALL PROCE_INSERT_ENCUESTA('${P1}','${P2}','${P3}','${P4}','${P5}','${P6}','${P7}')`;
   
            req.getConnection((err, conn)=>{
            conn.query(consulta, (err, rows)=>{
                 if(!err)
                res.send('RESPUESTAS INGRESADAS')
                 else
                console.log(err)
                })         
            })
        }
    })

})





module.exports = routes