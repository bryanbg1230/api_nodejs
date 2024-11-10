import {conmysql} from '../db.js'
import { v2 as cloudinary } from 'cloudinary';

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'ddvrhqgsm',  // Reemplaza con tu Cloud Name
  api_key: '113551118694466',        // Reemplaza con tu API Key
  api_secret: '4zk8XUMg2Fkc2Hk0qJMlbLtCZh4'   // Reemplaza con tu API Secret
})

export const getProductos=
    async (req,res)=>{
        try {
            const [result] = await conmysql.query(' select * from productos ')
            res.json(result)
        } catch (error) {
            return res.status(500).json({message:"Error al consultar productos"})
        }
    }

export const getproductosxid=
async (req,res)=>{
    try {
        const[result]=await conmysql.query('select * from productos where prod_id=?',[req.params.id])
        if (result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Producto no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'error de lado del servidor'})        
    }
}

export const postProducto=
async (req,res)=>{
    try {
        //console.log(req.body)
        const {prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo}=req.body
        //const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null; //capturar la imagen que se envie en un formulario
        console.log("Datos del producto:",req.body);
        console.log("Archivo de imagen:",req.file);

        let prod_imagen = null; // Inicia la variable para la imagen

        // Verificar si se subió una imagen
        if (req.file) {
            console.log("Imagen recibida:", req.file);
            // Subir la imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads', // Puedes agregar un folder en Cloudinary si lo deseas
                public_id: `${Date.now()}-${req.file.originalname}` // Usamos el timestamp para garantizar un nombre único
            });

            console.log("Resultado de la carga en Cloudinary:", uploadResult);
            // Obtener la URL segura de la imagen subida
            prod_imagen = uploadResult.secure_url;
        } else {
            console.log("No se recibió ninguna imagen.");
        }

        // Preparar datos para insertar en la base de datos
        const productoData = [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen];
        
        // Log para confirmar los datos que se intentarán guardar en la base de datos
        console.log("Guardando producto en la base de datos:", productoData);
        
        //console.log(cli_nombre)
        const [rows]=await conmysql.query('insert into productos (prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen) values(?,?,?,?,?,?)',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen])

        /* res.send({
            id:rows.insertId
        }) */

        // Responder con el id del producto insertado
        res.status(201).json({
            mensaje: 'Producto guardado correctamente.',
            prod_id: rows.insertId,
            prod_imagen: prod_imagen // Se incluye la URL de la imagen (si existe)
        });
    } catch (error) {
        console.log("Error en postProducto:", error);
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const putProducto=
async (req,res)=>{
    try {
        const {id}=req.params
        console.log("ID del producto a actualizar:", id);  //CONSOLA PUESTA
        console.log("Datos recibidos en el cuerpo de la solicitud:", req.body);   //CONSOLA PUESTA
        console.log("Archivo de imagen recibido:", req.file);   //CONSOLA PUESTA
        //console.log(req.body)
        // Extraer los campos de req.body y manejar la imagen si existe
        const { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo } = req.body;
        //const prod_imagen = req.file ? /uploads/${req.file.filename} : null;       Estaba esto antes de modificar

        // Actualiza prod_imagen solo si hay una imagen nueva
        /* let prod_imagen;                                                      //------------------De aquí
        if (req.file) {
            prod_imagen = `/uploads/${req.file.filename}`;
        } */

        // Declarar `newProd_imagen` y asignarlo al valor actual o `null`
        let newProd_imagen = null;

        // Verificar si se subió una nueva imagen
        if (req.file) {
            // Subir la nueva imagen a Cloudinary
            const uploadResult = await cloudinary.uploader.upload(req.file.path, {
                folder: 'uploads',
                public_id: `${Date.now()}-${req.file.originalname}` // Usar un nombre único
            });

            // Obtener la URL segura de la imagen subida
            newProd_imagen = uploadResult.secure_url;
        } else if (req.body.prod_imagen) {
            // Usar la URL de la imagen existente si no hay una nueva imagen subida
            newProd_imagen = req.body.prod_imagen;
        }

        // Prepara la consulta SQL según la disponibilidad de prod_imagen
        let query, values;
        if (prod_imagen) {
            // Si hay imagen nueva, incluimos prod_imagen en la consulta
            query = 'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? WHERE prod_id=?';
            values = [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, newProd_imagen, id];
        } else {
            // Si no hay imagen nueva, omitimos prod_imagen de la consulta
            query = 'UPDATE productos SET prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=? WHERE prod_id=?';
            values = [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, id];
        } 

        // Ejecuta la consulta
        const [result] = await conmysql.query(query, values);                                 //------------------Hasta aqui se puso esto nuevo

        // Log de datos para confirmar los datos que se enviarán en la consulta
        console.log("Datos para actualizar en la base de datos:", { prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, });
        
        //console.log(cli_nombre)
        /* const [result]=await conmysql.query('update productos set prod_codigo=?, prod_nombre=?, prod_stock=?, prod_precio=?, prod_activo=?, prod_imagen=? where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id])       Estaba antes de modificar    */

        console.log("Resultado de la actualización:", result);   //CONSOLA PUESTA
        if (result.affectedRows <= 0) {
          console.warn("No se encontró el producto o no se realizaron cambios.");   //CONSOLA PUESTA
          return res.status(404).json({ message: 'Producto no encontrado' });
        }
        const[rows]=await conmysql.query('select * from productos where prod_id=?',[id])
        console.log("Datos del producto después de la actualización:", rows[0]);   //CONSOLA PUESTA
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        console.error("Error en putProducto:", error);   //CONSOLA PUESTA
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const patchProducto=
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo}=req.body
        // Obtener la nueva imagen si se envía; si no, se conserva la actual
        const prod_imagen = req.file ? `/uploads/${req.file.filename}` : null;
        console.log("Datos del producto:", req.body);
        console.log("Archivo de imagen:", req.file);
        //console.log(prod_nombre)
        const [result]=await conmysql.query('update productos set prod_codigo=IFNULL(?,prod_codigo), prod_nombre=IFNULL(?,prod_nombre), prod_stock=IFNULL(?,prod_stock), prod_precio=IFNULL(?,prod_precio), prod_activo=IFNULL(?,prod_activo), prod_imagen=IFNULL(?,prod_imagen) where prod_id=?',
            [prod_codigo, prod_nombre, prod_stock, prod_precio, prod_activo, prod_imagen, id])

        if(result.affectedRows<=0)return res.status(404).json({
            message:'Producto no encontrado'
        })
        const[rows]=await conmysql.query('select * from productos where prod_id=?',[id])
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const deleteProducto=
async(req, res)=>{
    try {
        console.log("ID recibido para eliminación:", req.params.id);  //CONSOLA PUESTA
        const [rows]=await conmysql.query('delete from productos where prod_id=?',[req.params.id])
        console.log("Resultado de la consulta:", rows);   //CONSOLA PUESTA
        if (rows.affectedRows <= 0) {
            console.log("No se encontró el producto para eliminar.");  //CONSOLA PUESTA
            return res.status(404).json({
                id: 0,
                message: "No pudo eliminar el producto"
            });
        }
        console.log("Producto eliminado con éxito.");   //CONSOLA PUESTA
        //res.sendStatus(202)
        res.status(202).json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("Error en el servidor:", error);   //CONSOLA PUESTA
        return res.status(500).json({
            message:error
        
        })
    }
}
