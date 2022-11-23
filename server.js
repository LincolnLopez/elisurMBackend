const express = require('express')
const mysql = require ('mysql')
const myconn = require ('express-myconnection')

const app=express()
app.set('port',process.env.PORT || 3000)
const dboptions ={
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'elisur'
}


//middlewares
app.use(myconn(mysql, dboptions, 'single'))
app.use(express.json())

//Routes---- APIs
//app.use(require('./routes/login'))
app.use(require('./routes/roles'))
app.use(require('./routes/servicios'))
app.use(require('./routes/solicitudes'))
app.use(require('./routes/tipocliente'))
app.use(require('./routes/personas'))
app.use(require('./routes/ventas'))
app.use(require('./routes/articulos'))
app.use(require('./routes/categorias'))
app.use(require('./routes/clientes'))
app.use(require('./routes/permisos'))
app.use(require('./routes/inventario'))
app.use(require('./routes/empleados'))
app.use(require('./routes/inventarioH'))
app.use(require('./routes/preguntas_encuesta'))
app.use(require('./routes/reporte__fallas'))
app.use(require('./routes/presupuesto'))
app.use(require('./routes/login'))

//server running
app.listen(app.get('port'), ( )=>{
    console.log('server running on port',app.get('port'))
})