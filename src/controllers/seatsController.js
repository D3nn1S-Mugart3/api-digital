const pool = require("../config/connection");

// Obtienes todos los asientos
const getAllSeats = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Asientos");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving seats" });
  }
};

// Obtienes un asiento por id
const getSeatById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Asientos WHERE asiento_id = ?",
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Seat not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving seat" });
  }
};

// Crear un nuevo asiento
const createSeat = async (req, res) => {
  const { numero_asiento, estado, usuario_id } = req.body;
  if (!numero_asiento || !estado || !usuario_id) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const [usuarios] = await pool.query(
      "SELECT * FROM Usuarios WHERE usuario_id = ?",
      [usuario_id]
    );
    if (usuarios.length === 0) {
      return res
        .status(404)
        .json({ error: `User with id ${usuario_id} not found` });
    }

    const [rows] = await pool.query(
      "INSERT INTO Asientos (numero_asiento, estado, usuario_id) VALUES (?, ?, ?)",
      [numero_asiento, estado, usuario_id]
    );
    res.status(201).json({
      message: "Seat created successfully",
      asiento: {
        asiento_id: rows.insertId,
        numero_asiento,
        estado,
        usuario_id,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating seat" });
  }
};

// Actualizar asiento por ID
const updateSeat = async (req, res) => {
  const { id } = req.params;

  try {
    const [asientos] = await pool.query(
      "SELECT * FROM Asientos WHERE asiento_id = ?",
      [id]
    );
    if (asientos.length === 0) {
      return res.status(404).json({ error: "Seat not found" });
    }

    const asiento = asientos[0];
    const numero_asiento = req.body.numero_asiento || asiento.numero_asiento;
    const estado = req.body.estado || asiento.estado;
    let usuario_id = req.body.usuario_id || asiento.usuario_id;

    if (req.body.usuario_id) {
      const [usuarios] = await pool.query(
        "SELECT * FROM Usuarios WHERE usuario_id = ?",
        [usuario_id]
      );
      if (usuarios.length === 0) {
        return res
          .status(404)
          .json({ error: `User with id ${usuario_id} not found` });
      }
    }

    const [result] = await pool.query(
      "UPDATE Asientos SET numero_asiento = ?, estado = ?, usuario_id = ? WHERE asiento_id = ?",
      [numero_asiento, estado, usuario_id, id]
    );

    if (result.affectedRows > 0) {
      const [updatedSeats] = await pool.query(
        "SELECT * FROM Asientos WHERE asiento_id = ?",
        [id]
      );
      res.status(200).json({
        message: "Seat updated successfully",
        asiento: updatedSeats[0],
      });
    } else {
      res.status(500).json({ message: "Failed to update seat" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating seat" });
  }
};

// Eliminar asiento por ID
const deleteSeat = async (req, res) => {
  const { id } = req.params;
  try {
    const [asientos] = await pool.query(
      "SELECT * FROM Asientos WHERE asiento_id = ?",
      [id]
    );
    if (asientos.length === 0) {
      return res.status(404).json({ error: "Seat not found" });
    }

    await pool.query("DELETE FROM Asientos WHERE asiento_id = ?", [id]);
    res.json({ message: "Seat deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting seat" });
  }
};

module.exports = {
  getAllSeats,
  getSeatById,
  createSeat,
  updateSeat,
  deleteSeat,
};
