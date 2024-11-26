import express from 'express'
import cors from 'cors' //importa los paquetes cors-- permisos de acceso
import path from 'path'
import { fileURLToPath } from 'url'
import clientesRoutes from './routes/clientes.routes.js'
import usuariosRoutes from './routes/usuarios.routes.js'
import productosRoutes from './routes/productos.routes.js'
import pedidosRoutes from './routes/pedidos.routes.js'
import pedidos_detalleRoutes from './routes/pedidos_detalle.routes.js'

//definir modulo de ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app=express();
const corsOptions={
    origin:'http://localhost:8100',//la direccion ip/dominio del servidor     Se cambió de * a http://localhost:8100
    methods:['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],  //Se agregó 'OPTIONS'
    allowedHeaders: ['Authorization', 'Content-Type'], // Incluye 'Authorization'   (SA)
    credentials:true
}

app.set('json spaces', 2); // Define la sangría para JSON en modo de desarrollo

app.use(cors(corsOptions))
app.use(express.json());//para que interprete los objetos json
app.use(express.urlencoded({extended:true}));  //se añade para poder receptar formularios
//app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));
//app.use('/uploads', express.static(path.resolve('uploads')));
//rutas
app.use('/api',clientesRoutes)
app.use('/api',usuariosRoutes)
app.use('/api',productosRoutes)
app.use('/api',pedidosRoutes)
app.use('/api',pedidos_detalleRoutes)

app.use((req,res,next)=>{
    res.status(400).json({
        message: 'Endpoint not found'
    })
})
export default app;
