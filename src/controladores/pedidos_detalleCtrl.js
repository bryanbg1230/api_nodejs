import {conmysql} from '../db.js'
export const getPedidos_Detalle=
async (req,res)=>{
    try {
        const [result] = await conmysql.query(' select * from pedidos_detalle ')
        res.json(result)
    } catch (error) {
        return res.status(500).json({message:"Error al consultar detalles del pedido"})
    }
}

export const getpedidos_detallexid=
async (req,res)=>{
    try {
        const[result]=await conmysql.query('select * from pedidos_detalle where det_id=?',[req.params.id])
        if (result.length<=0)return res.status(404).json({
            cli_id:0,
            message:"Detalle del pedido no encontrado"
        })
        res.json(result[0])
    } catch (error) {
        return res.status(500).json({message:'error de lado del servidor'})        
    }
}

export const getPedidosResumen = async (req, res) => {
    try {
        const usr_id = req.user?.id; // Asegúrate de que `req.user` existe
        if (!usr_id) {
            return res.status(400).json({ message: 'Usuario no autenticado' });
        }

        const [result] = await conmysql.query(`
            SELECT 
                p.ped_id,
                p.ped_fecha,
                CASE WHEN p.ped_estado = 1 THEN 'Activo' ELSE 'Inactivo' END AS ped_estado_texto,
                c.cli_nombre,
                u.usr_nombre
            FROM pedidos p
            INNER JOIN clientes c ON p.cli_id = c.cli_id
            INNER JOIN usuarios u ON p.usr_id = u.usr_id
            WHERE u.usr_id = ?
        `, [usr_id]);

        res.json(result);
    } catch (error) {
        console.error('Error en getPedidosResumen:', error.message);
        res.status(500).json({ message: 'Error al obtener el resumen de pedidos' });
    }
};

export const postPedido_Detalle=
async (req,res)=>{
    try {
        console.log("Datos recibidos en postPedido_Detalle:", req.body); // Muestra los datos de los detalles del pedido
        const {prod_id, ped_id, det_cantidad, det_precio}=req.body
        //console.log(cli_nombre)
        const [rows]=await conmysql.query('insert into pedidos_detalle (prod_id, ped_id, det_cantidad, det_precio) values(?,?,?,?)',
            [prod_id, ped_id, det_cantidad, det_precio])

        console.log("Detalle de pedido creado con ID:", rows.insertId); // Confirma que el detalle se creó y muestra su ID
        res.send({
            id:rows.insertId
        })
    } catch (error) {
        console.error("Error en postPedido_Detalle:", error); // Muestra el error si algo sale mal
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const putPedido_Detalle=
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {prod_id, ped_id, det_cantidad, det_precio}=req.body
        //console.log(cli_nombre)
        const [result]=await conmysql.query('update pedidos_detalle set prod_id=?, ped_id=?, det_cantidad=?, det_precio=? where det_id=?',
            [prod_id, ped_id, det_cantidad, det_precio, id])

        if(result.affectedRows<=0)return res.status(404).json({
            message:'Detalle del pedido no encontrado'
        })
        const[rows]=await conmysql.query('select * from pedidos_detalle where det_id=?',[id])
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const patchPedido_Detalle=
async (req,res)=>{
    try {
        const {id}=req.params
        //console.log(req.body)
        const {prod_id, ped_id, det_cantidad, det_precio}=req.body
        //console.log(cli_nombre)
        const [result]=await conmysql.query('update pedidos_detalle set prod_id = IFNULL(?, prod_id), ped_id = IFNULL(?, ped_id), det_cantidad = IFNULL(?, det_cantidad), det_precio = IFNULL(?, det_precio) where det_id=?',
            [prod_id, ped_id, det_cantidad, det_precio, id])

        if(result.affectedRows<=0)return res.status(404).json({
            message:'Detalle del pedido no encontrado'
        })
        const[rows]=await conmysql.query('select * from pedidos_detalle where det_id=?',[id])
        res.json(rows[0])
        /* res.send({
            id:rows.insertId
        }) */
    } catch (error) {
        return res.status(500).json({message:'error del lado del servidor'})
    }
}

export const deletePedido_Detalle=
async(req,res)=>{
    try {
        //const {miid}=req.params
        const [rows]=await conmysql.query(' delete from pedidos_detalle where det_id=?',[req.params.id])
        if(rows.affectedRows<=0)return res.status(404).json({
            id:0,
            message: "No pudo eliminar el detalle del pedido"
        })
        res.sendStatus(202)
    } catch (error) {
        return res.status(500).json({message:"Error del lado del servidor"})
    }
}

/* export const deletePedidoPorPedidoID = async (req, res) => {
    try {
        const { id } = req.params; // Aquí recibiremos el ped_id
        // Eliminamos primero los detalles del pedido
        const [detalles] = await conmysql.query(
            'DELETE FROM pedidos_detalle WHERE ped_id = ?',
            [id]
        );

        if (detalles.affectedRows === 0) {
            return res.status(404).json({ message: "No se encontraron detalles del pedido para eliminar" });
        }

        // Luego eliminamos el pedido en sí
        const [pedido] = await conmysql.query(
            'DELETE FROM pedidos WHERE ped_id = ?',
            [id]
        );

        if (pedido.affectedRows === 0) {
            return res.status(404).json({ message: "Pedido no encontrado para eliminar" });
        }

        res.sendStatus(202); // Eliminación exitosa
    } catch (error) {
        console.error("Error en deletePedidoPorPedidoID:", error);
        res.status(500).json({ message: "Error del lado del servidor" });
    }
}; */

export const deletePedidoPorPedidoID = async (req, res) => {
    try {
        const { id } = req.params; // Aquí recibimos el ped_id
        
        // Verificar si el pedido existe antes de intentar eliminar
        const [pedidoExistente] = await conmysql.query(
            'SELECT ped_id FROM pedidos WHERE ped_id = ?',
            [id]
        );
        
        if (pedidoExistente.length === 0) {
            return res.status(404).json({ message: "Pedido no encontrado" });
        }
        
        // Intentar eliminar detalles asociados (si existen)
        const [detalles] = await conmysql.query(
            'DELETE FROM pedidos_detalle WHERE ped_id = ?',
            [id]
        );

        // Eliminar el pedido en sí
        const [pedido] = await conmysql.query(
            'DELETE FROM pedidos WHERE ped_id = ?',
            [id]
        );

        res.status(202).json({
            message: "Pedido eliminado correctamente",
            detallesEliminados: detalles.affectedRows, // Puede ser 0 si no había detalles
        });
    } catch (error) {
        console.error("Error en deletePedidoPorPedidoID:", error);
        res.status(500).json({ message: "Error del lado del servidor" });
    }
};
