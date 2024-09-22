const express = require("express");
const router = express.Router();
const sceneryController = require("../controllers/sceneryController");

/**
 * @openapi
 * /api/scenery:
 *   get:
 *     summary: obtiene todos los asientos
 *     description: Obtiene todas los asientos.
 *     tags:
 *       - Scenery
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
 *                   escenario_id:
 *                     type: integer
 *                     example: 1
 *                   asiento:
 *                     type: integer
 *                     example: 100
 *                   forma:
 *                     type: string
 *                     example: "Redondo"
 *                   evento_id:
 *                     type: int
 *                     example: 1
 *                   asientos:
 *                     type: array
 *                     example: []
 *       500:
 *         description: Error al obtener las notificaciones.
 */
router.get("/", sceneryController.getAllScenery);

/**
 * @openapi
 * /api/scenery/{id}:
 *   get:
 *     summary: obtiene el escenario por id
 *     description: Obtiene un escenario por su ID.
 *     tags:
 *       - Scenery
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
 *                   escenario_id:
 *                     type: integer
 *                     example: 1
 *                   asiento:
 *                     type: integer
 *                     example: 100
 *                   forma:
 *                     type: string
 *                     example: "Redondo"
 *                   evento_id:
 *                     type: int
 *                     example: 1
 *                   asientos:
 *                     type: array
 *                     example: []
 *       404:
 *         description: asiento no encontrado.
 *       500:
 *         description: Error al obtener el asiento.
 */
router.get("/:id", sceneryController.getSceneryById);

/**
 * @swagger
 * /api/scenery:
 *   post:
 *     summary: Registrar un nuevo Escenario
 *     tags:
 *       - Scenery
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - asiento
 *               - forma
 *               - evento_id
 *             properties:
 *               asiento:
 *                 type: int
 *                 example: 50
 *               forma:
 *                 type: string
 *                 example: "Redondo"
 *               evento_id:
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
router.post("/", sceneryController.createScenery);

/**
 * @openapi
 * /api/scenery/{id}:
 *   delete:
 *     summary: Elimina un escenario por su ID.
 *     tags:
 *       - Scenery
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: escenario eliminado correctamente.
 *       404:
 *         description: escenario no encontrado.
 *       500:
 *         description: Error al eliminar el escenario.
 */
router.delete("/:id", sceneryController.deleteScenery);

/**
 * @openapi
 * /api/scenery/{id}:
 *   put:
 *     summary: edita un escenario, solo se puede editar la forma y evento_id
 *     tags:
 *       - Scenery
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: id de escenario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - forma
 *               - evento_id
 *             properties:
 *               forma:
 *                 type: string
 *                 example: "Formas válidas: Redondo, Cuadrado, Triangular"
 *               evento_id:
 *                 type: int
 *                 example: 1
 *     responses:
 *       200:
 *         description: escenario updated successfully
 *       404:
 *         description: escenario not found
 *       500:
 *         description: Internal server error
 */
router.put("/:id", sceneryController.updateScenery);

module.exports = router;
