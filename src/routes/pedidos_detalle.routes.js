import { Router } from "express";
import { getPedidos_Detalle, getpedidos_detallexid, getPedidosResumen, postPedido_Detalle, putPedido_Detalle, patchPedido_Detalle, deletePedido_Detalle, deletePedidoPorPedidoID } from "../controladores/pedidos_detalleCtrl.js"
import { verificarToken } from "../middlewares/authJWT.js";

const router=Router()

router.get('/pedidos_detalle',getPedidos_Detalle)  //select
router.get('/pedidos_detalle/resumen', verificarToken, getPedidosResumen);
router.get('/pedidos_detalle/:id',getpedidos_detallexid)  //select x id
router.post('/pedidos_detalle',postPedido_Detalle)  //insert
router.put('/pedidos_detalle/:id',putPedido_Detalle)  //update
router.patch('/pedidos_detalle/:id',patchPedido_Detalle)  //update
router.delete('/pedidos_detalle/:id',deletePedido_Detalle)  //delete
router.delete('/pedidos/:id', verificarToken, deletePedidoPorPedidoID); //delete xd id pedido

export default router
