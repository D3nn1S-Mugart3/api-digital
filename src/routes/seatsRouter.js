const express = require("express");
const router = express.Router();
const seatsController = require("../controllers/seatsController");

/**
 * @openapi
 * /api/seats:
 *   get:
 *     summary: obtiene todos los asientos
 *     description: Obtiene todas los asientos.
 *     tags:
 *       - Seats
 *     responses:
 *       200:
 *         description: Lista de de comentarios.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   asiento_id:
 *                     type: integer
 *                     example: 1
 *                   numero_asiento:
 *                     type: string
 *                     example: "a1"
 *                   estado:
 *                     type: string
 *                     example: "reservado"
 *                   usuario_id:
 *                     type: int
 *                     example: 1
 *       500:
 *         description: Error al obtener las notificaciones.
 */
router.get("/", seatsController.getAllSeats);

/**
 * @openapi
 * /api/seats/{id}:
 *   get:
 *     summary: obtiene el asiento por id
 *     description: Obtiene un asiento por su ID.
 *     tags:
 *       - Seats
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalles del usuario encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                   asiento_id:
 *                     type: integer
 *                     example: 1
 *                   numero_asiento:
 *                     type: string
 *                     example: "a1"
 *                   estado:
 *                     type: string
 *                     example: "reservado"
 *                   usuario_id:
 *                     type: int
 *                     example: 1
 *       404:
 *         description: asiento no encontrado.
 *       500:
 *         description: Error al obtener el asiento.
 */
router.get("/:id", seatsController.getSeatById);

/**
 * @swagger
 * /api/seats:
 *   post:
 *     summary: Registrar un nuevo Asiento
 *     tags:
 *       - Seats
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_asiento
 *               - estado
 *               - usuario_id
 *             properties:
 *               numero_asiento:
 *                 type: string
 *                 example: "a1"
 *               estado:
 *                 type: string
 *                 example: "Reservado"
 *               usuario_id:
 *                 type: int
 *                 example: 1
 *     responses:
 *       201:
 *         description: Asiento created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Error creating user
 */
router.post("/", seatsController.createSeat);

/**
 * @openapi
 * /api/seats/{id}:
 *   put:
 *     summary: edita un asiento
 *     tags:
 *       - Seats
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: membresia id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_asiento
 *               - estado
 *               - usuario_id
 *             properties:
 *               numero_asiento:
 *                 type: string
 *                 example: "A1"
 *               estado:
 *                 type: string
 *                 example: "Reservado"
 *               usuario_id:
 *                 type: int
 *                 example: 1
 *     responses:
 *       200:
 *         description: asiento updated successfully
 *       404:
 *         description: asiento not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", seatsController.updateSeat);

/**
 * @openapi
 * /api/seats/{id}:
 *   delete:
 *     summary: Elimina un asiento por su ID.
 *     tags:
 *       - Seats
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: asiento eliminado correctamente.
 *       404:
 *         description: asiento no encontrado.
 *       500:
 *         description: Error al eliminar el usuario.
 */
router.delete("/:id", seatsController.deleteSeat);

module.exports = router;
