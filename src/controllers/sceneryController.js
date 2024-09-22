const pool = require("../config/connection");

// Obtener todos los escenarios y asientos
const getAllScenery = async (req, res) => {
  try {
    const [scenarios] = await pool.query("SELECT * FROM Escenario");
    const [seats] = await pool.query(
      "SELECT * FROM Asientos WHERE numero_asiento LIKE ?",
      [`%-%`]
    );
    const scenariosWithSeats = scenarios.map((scenery) => {
      const seatsByScenarios = seats.filter((seat) =>
        seat.numero_asiento.startsWith(`${scenery.escenario_id}-`)
      );
      return { ...scenery, seats: seatsByScenarios };
    });
    res.json(scenariosWithSeats);
  } catch (error) {
    handleError(res, error);
  }
};

// Obtener escenario por ID
const getSceneryById = async (req, res) => {
  const { id } = req.params;
  try {
    const scenery = await findSceneryById(id);
    const seats = await getSeatsBySceneryId(id);
    res.json({ ...scenery, seats });
  } catch (error) {
    handleError(res, error);
  }
};

// Crear un nuevo escenario y asientos
const createScenery = async (req, res) => {
  const { asiento, forma, evento_id } = req.body;
  if (!asiento || !forma || !evento_id) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    validateShape(forma);
    await validateEvent(evento_id);

    const [rows] = await pool.query(
      "INSERT INTO Escenario (asiento, forma, evento_id) VALUES (?, ?, ?)",
      [asiento, forma, evento_id]
    );

    const scenarioId = rows.insertId;

    for (let i = 1; i <= asiento; i++) {
      await pool.query(
        "INSERT INTO Asientos (numero_asiento, estado, usuario_id) VALUES (?, 'Disponible', NULL)",
        [`${scenarioId}-${i}`]
      );
    }

    res.json({
      message: "Scenery and seats created successfully",
      escenario_id: scenarioId,
      asiento,
      forma,
      evento_id,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Actualizar escenario por su ID
const updateScenery = async (req, res) => {
  const { id } = req.params;
  try {
    const scenery = await findSceneryById(id);

    if (req.body.asiento) {
      return res
        .status(400)
        .json({ error: "The number of seats cannot be changed" });
    }

    const forma = req.body.forma || scenery.forma;
    if (req.body.forma) {
      validateShape(req.body.forma);
    }

    const evento_id = req.body.evento_id || scenery.evento_id;
    if (req.body.evento_id) {
      await validateEvent(req.body.evento_id);
    }

    const [result] = await pool.query(
      "UPDATE Escenario SET forma = ?, evento_id = ? WHERE escenario_id = ?",
      [forma, evento_id, id]
    );

    if (result.affectedRows > 0) {
      const updatedScenery = await findSceneryById(id);
      res.json({
        message: "Scenery updated successfully",
        escenario: updatedScenery,
      });
    } else {
      res.status(400).json({ error: "Could not update scenery" });
    }
  } catch (error) {
    handleError(res, error);
  }
};

// Eliminar escenario por su ID
const deleteScenery = async (req, res) => {
  const { id } = req.params;
  try {
    await findSceneryById(id);
    await pool.query("DELETE FROM Asientos WHERE numero_asiento LIKE ?", [
      `${id}-%`,
    ]);
    await pool.query("DELETE FROM Escenario WHERE escenario_id = ?", [id]);

    res.json({ message: "Scenery and seats removed successfully" });
  } catch (error) {
    handleError(res, error);
  }
};

// Funciones auxiliares
// Para obtener escenario por su ID
const findSceneryById = async (id) => {
  const [scenery] = await pool.query(
    "SELECT * FROM Escenario WHERE escenario_id = ?",
    [id]
  );
  if (scenery.length === 0) {
    throw new Error("Scenery not found");
  }
  return scenery[0];
};

// Obtener asientos por escenario_id
const getSeatsBySceneryId = async (sceneryId) => {
  const [seats] = await pool.query(
    "SELECT * FROM Asientos WHERE numero_asiento LIKE ?",
    [`${sceneryId}-%`]
  );
  return seats;
};

// Para validar forma
const validateShape = (forma) => {
  const validShapes = ["Redondo", "Cuadrado", "Triangular"];
  if (!validShapes.includes(forma)) {
    throw new Error(`Invalid shape. Valid shapes: ${validShapes.join(", ")}`);
  }
};

// Para validar evento
const validateEvent = async (evento_id) => {
  const [event] = await pool.query(
    "SELECT * FROM Eventos WHERE evento_id = ?",
    [evento_id]
  );
  if (event.length === 0) {
    throw new Error(`Event with the id ${evento_id} not found`);
  }
};

// Manejo de errores
const handleError = (res, error) => {
  console.error(error);
  res.status(500).send({
    message: error.message,
  });
};

module.exports = {
  getAllScenery,
  getSceneryById,
  createScenery,
  updateScenery,
  deleteScenery,
};
