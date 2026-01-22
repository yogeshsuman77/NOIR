import connectionModel from "../models/connection.model.js";
import caseModel from "../models/case.model.js";
import clueModel from "../models/clue.model.js";


export const createConnection = async (req, res) => {
  try {
    const user = req.user;

    const { caseId, from, to, style } = req.body;

    if (!caseId || !from || !to) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const foundCase = await caseModel.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({ message: "Case not found" });
    }

    if (!foundCase.user.equals(user._id)) {
      return res.status(403).json({
        message: "Not allowed to add connection",
      });
    }

    
    const fromClue = await clueModel.findOne({
      case: caseId,
      clientId: from,
    });

    const toClue = await clueModel.findOne({
      case: caseId,
      clientId: to,
    });

    if (!fromClue || !toClue) {
      return res.status(404).json({
        message: "Clue not found",
      });
    }

    const existing = await connectionModel.findOne({
      case: caseId,
      from,
      to,
    });

    if (existing) {
      return res.status(409).json({
        message: "Connection already exists",
      });
    }

    const connection = await connectionModel.create({
      case: caseId,
      from,       
      to,         
      style: style || {},
    });

    res.status(201).json(connection);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create connection",
      error: error.message,
    });
  }
};




export const getConnectionsByCase = async (req, res) => {
  try {
    const user = req.user;
    const { caseId } = req.params;

    const foundCase = await caseModel.findById(caseId);
    if (!foundCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (!foundCase.user.equals(user._id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const connections = await connectionModel.find({ case: caseId });

    res.status(200).json(connections);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch connections",
      error: error.message,
    });
  }
};



export const updateConnection = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const updates = req.body;

    const connection = await connectionModel.findById(id);
    if (!connection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }

    const foundCase = await caseModel.findById(connection.caseId);
    if (!foundCase.user.equals(user._id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    Object.assign(connection, updates);
    await connection.save();

    res.status(200).json(connection);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update connection",
      error: error.message,
    });
  }
};



export const deleteConnection = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const connection = await connectionModel.findById(id);
    if (!connection) {
      return res.status(404).json({
        message: "Connection not found",
      });
    }

    const foundCase = await caseModel.findById(connection.caseId);
    if (!foundCase.user.equals(user._id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    await connection.deleteOne();

    res.status(200).json({
      message: "Connection deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete connection",
      error: error.message,
    });
  }
};
