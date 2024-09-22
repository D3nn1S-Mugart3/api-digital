const express = require("express");
const router = express.Router();

// Importar y usar otras rutas
const authRouter = require("./authRouter");
const commentsRouter = require("./commentsRouter");
const eventRouter = require("./eventRouter");
const subirImagen = require("./imagenRouter");
const membresiaRoutes = require("./membresiaRouter");
const notificationRoutes = require("./notificationRouter");
const paymentRouter = require("./paymentRouter");
const resetPasswordRouter = require("./resetPasswordRouter");
const escenarioRoutes = require("./escenarioRouter");
const asientoRoutes = require("./asientoRouter");
const userRoutes = require("./userRoutes");

// Categorias de las rutas
router.use("/auth", authRouter);
router.use("/comments", commentsRouter);
router.use("/events", eventRouter);
router.use("/imagenes", subirImagen);
router.use("/membresia", membresiaRoutes);
router.use("/notification", notificationRoutes);
router.use("/payment", paymentRouter);
router.use("/password", resetPasswordRouter);
router.use("/scenery", escenarioRoutes);
router.use("/seats", asientoRoutes);
router.use("/users", userRoutes);

module.exports = router;
