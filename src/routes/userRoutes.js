const express = require("express");
const {
  userController,
  getAllUsuarios,
  getUsuarioById,
  updateUsuarioById,
  deleteUsuarioById,
} = require("../controllers/userController");
const pool = require("../config/connection");
const Stripe = require("stripe");
const stripe = new Stripe("sk_test_4eC39HqLyjWDarjtT1zdp7dc");

const router = express.Router();

const {
  comparePasswords,
  hashPassword,
} = require("../middlewares/bcryptPassword");

router.post("/payment", async (req, res) => {
  const { amount, title, userId } = req.body;
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `http://localhost:3000/dashboard/membresia?session_id={CHECKOUT_SESSION_ID}&user_id=${userId}`,
      cancel_url: `http://localhost:3000/dashboard/membresia`,
    });
    res.json({
      url: session.url,
      session,
    });
  } catch (error) {
    res.json({
      error: error.raw,
    });
    console.log(error);
  }
});

router.post("/paymentTest", async (req, res) => {
  const { amount, title, userId } = req.body;

  // Convertir amount y userId a números
  const amountNumber = parseFloat(amount) * 100; // Convertir a centavos
  const userIdNumber = parseInt(userId, 10);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
            },
            unit_amount: Math.round(amountNumber), // Asegurarse de que sea un número entero
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `https://api-digitalevent.onrender.com/api/users/success?session_id={CHECKOUT_SESSION_ID}&user_id=${userIdNumber}`,
      cancel_url: `https://api-digitalevent.onrender.com/api/user/cancel`,
    });
    res.json({
      url: session.url,
      session,
    });
  } catch (error) {
    res.json({
      error: error.raw,
    });
    console.log(error);
  }
});

router.get("/success", async (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Gracias por tu compra</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: auto;
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #333;
        }
        p {
          color: #666;
        }
        .button {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          font-size: 16px;
          color: white;
          background-color: #007bff;
          border: none;
          border-radius: 5px;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Gracias por tu compra</h1>
        <p>Tu transacción ha sido completada con éxito.</p>
        <a href="javascript:window.close();" class="button">Cerrar</a>
      </div>
    </body>
    </html>
  `);
});

router.get("/cancel", async (req, res) => {
  res.json({
    message: "Cancel",
  });
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - last_name
 *               - contrasena
 *               - telefono
 *               - rol_id
 *             properties:
 *               nombre:
 *                 type: string
 *               email:
 *                 type: string
 *               last_name:
 *                 type: string
 *               contrasena:
 *                 type: string
 *               telefono:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: All fields are required
 *       500:
 *         description: Error creating user
 */
router.post("/register", userController.register);

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: obtiene todos los usuarios
 *     description: Obtiene todas las notificaciones.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista de notificaciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   usuario_id:
 *                     type: integer
 *                     example: 1
 *                   nombre:
 *                     type: string
 *                     example: "ejemplo"
 *                   email:
 *                     type: string
 *                     example: "ejemplo@gmail.com"
 *                   contrasena:
 *                     type: string
 *                     example: "ejemplo"
 *                   telefono:
 *                     type: int
 *                     example: 123
 *                   rol_id:
 *                     type: int
 *                     example: 1
 *                   membresia_id:
 *                     type: int
 *                     example: 1
 *                   activo:
 *                     type: boolean
 *                     example: true
 *                   last_name:
 *                     type: string
 *                     example: ejemplo
 *                   resetPasswordExpire:
 *                     type: string
 *                     format: date-time
 *                     example: "2024-07-10T14:48:00.000Z"
 *                   resetPasswordToken:
 *                     type: string
 *                     example: "ejemplo"
 *                   fotoPerfil:
 *                     type: string
 *                     example: "ejemplourl"
 *       500:
 *         description: Error al obtener las notificaciones.
 */
router.get("/", getAllUsuarios);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     summary: obtiene al usuario por id
 *     description: Obtiene un usuario por su ID.
 *     tags:
 *       - Users
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
 *                 usuario_id:
 *                   type: integer
 *                   example: 1
 *                 nombre:
 *                   type: string
 *                   example: "ejemplo"
 *                 email:
 *                   type: string
 *                   example: "ejemplo@gmail.com"
 *                 contrasena:
 *                   type: string
 *                   example: "ejemplo"
 *                 telefono:
 *                   type: integer
 *                   example: 123
 *                 rol_id:
 *                   type: integer
 *                   example: 1
 *                 membresia_id:
 *                   type: integer
 *                   example: 1
 *                 activo:
 *                   type: boolean
 *                   example: true
 *                 last_name:
 *                   type: string
 *                   example: ejemplo
 *                 resetPasswordExpire:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-07-10T14:48:00.000Z"
 *                 resetPasswordToken:
 *                   type: string
 *                   example: "ejemplo"
 *                 fotoPerfil:
 *                   type: string
 *                   example: "ejemplourl"
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al obtener el usuario.
 */
router.get("/:id", getUsuarioById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags:
 *        - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID del usuario
 *       - in: body
 *         name: user
 *         description: Datos del usuario a actualizar
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nombre:
 *               type: string
 *             email:
 *               type: string
 *             contrasena:
 *               type: string
 *             telefono:
 *               type: string
 *             rol_id:
 *               type: integer
 *             membresia_id:
 *               type: integer
 *             activo:
 *               type: boolean
 *             last_name:
 *               type: string
 *             fotoPerfil:
 *               type: string
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.put("/:id", updateUsuarioById);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     summary: Elimina un usuario por su ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       204:
 *         description: Usuario eliminado correctamente.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error al eliminar el usuario.
 */
router.delete("/:id", deleteUsuarioById);

/* AQUI PONDRE TODO MI CODIGO BIEN MASISO */

router.put("/update-membresia/:id", async (req, res) => {
  const { id } = req.params;
  const tipo = req.body.numeroMeses ?? 1;
  try {
    // Verificar si el usuario existe
    const [users] = await pool.query(
      "SELECT * FROM Usuarios WHERE usuario_id = ?",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const user = users[0];

    const membresia_id = req.body.membresia_id || user.membresia_id;
    const rol_id = 3; // Nuevo rol_id que queremos asignar
    const fecha = new Date();
    const fechaDevencia = new Date(fecha.setMonth(fecha.getMonth() + tipo));

    // Formatear la fecha a 'YYYY-MM-DD HH:MM:SS'
    const pad = (n) => (n < 10 ? "0" : "") + n;
    const fechaDevenciaFormatted = `${fechaDevencia.getFullYear()}-${pad(
      fechaDevencia.getMonth() + 1
    )}-${pad(fechaDevencia.getDate())} ${pad(fechaDevencia.getHours())}:${pad(
      fechaDevencia.getMinutes()
    )}:${pad(fechaDevencia.getSeconds())}`;
    let fechafinal = "";
    if (membresia_id == 5) {
      fechafinal = null;
    } else {
      fechafinal = fechaDevenciaFormatted;
    }

    const values = [membresia_id, rol_id, fechafinal, id];

    const updateUserQuery =
      "UPDATE Usuarios SET membresia_id = ?, rol_id = ?, fecha_membresia = ? WHERE usuario_id = ?";

    const [result] = await pool.query(updateUserQuery, values);

    if (result.affectedRows > 0) {
      // Consultar el usuario actualizado
      const [updatedUsers] = await pool.query(
        "SELECT * FROM Usuarios WHERE usuario_id = ?",
        [id]
      );
      const updatedUser = updatedUsers[0];

      res.status(200).json({
        message: "Usuario actualizado correctamente",
        user: updatedUser,
      });
    } else {
      res.status(500).json({ error: "Error al actualizar el usuario" });
    }
  } catch (error) {
    console.error("Error actualizando usuario:", error);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});

router.get("/membresia-de-usuario/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    // Query to get the membership ID of the user
    const [userRows] = await pool.query(
      "SELECT membresia_id FROM Usuarios WHERE usuario_id = ?",
      [userId]
    );

    if (userRows.length > 0) {
      const membresiaId = userRows[0].membresia_id;

      // Query to get the membership details
      const [membresiaRows] = await pool.query(
        "SELECT * FROM Membresia WHERE membresia_id = ?",
        [membresiaId]
      );

      if (membresiaRows.length > 0) {
        res.json(membresiaRows[0]);
      } else {
        res.status(404).json({ message: "Membresía no encontrada" });
      }
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
});

module.exports = router;
