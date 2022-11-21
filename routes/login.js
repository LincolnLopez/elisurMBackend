const express = require('express');
const routes = express.Router();
var jwt = require('jsonwebtoken');



//Token--------------------------------------------------------------------
routes.post('/login', (req,res) => {
   const user = {id: 0}
   const token = jwt.sign({user}, 'my_secret_key');
   
      res.json({
      token : token
      })
   });


  module.exports = routes