import caseModel from "../models/case.model.js";
import connectionModel from "../models/connection.model.js";
import clueModel from "../models/clue.model.js";
import mongoose from "mongoose";

// CREATE CASE
export const createCase = async (req, res) => {
  try {

    const user = req.user

    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        message: "Case title is required",
      });
    }

    const newCase = await caseModel.create({
      title,
      description,
      user: user._id,
    });

    res.status(201).json(newCase);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create case",
      error: error.message,
    });
  }
};

// GET ALL CASES
export const getAllCases = async (req, res) => {
  try {

    const user = req.user

    const cases = await caseModel.find({user: user._id}).sort({ updatedAt: -1 });

    res.status(200).json(cases);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// GET CASE BY ID
export const getCaseById = async (req, res) => {
  try {
    const user = req.user
    const { id } = req.params;

    if(!id){
      return res.status(500).json({
        message: "No case id provided",
        error: error.message,
      });
    }

    const foundCase = await caseModel.findById(id);

    if (!foundCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (foundCase.user.toString() !== user._id.toString()){
      return res.status(403).json({
        message: "You are not allowed to access this case",
      });
    }

    res.status(200).json(foundCase);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};



export const getBoardData = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;

    const foundCase = await caseModel.findById(id);
    if (!foundCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    if (foundCase.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    const clues = await clueModel.find({ case: id });
    const connections = await connectionModel.find({ case: id });

    res.status(200).json({
      case: foundCase,
      clues,
      connections,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load board",
      error: error.message,
    });
  }
};






export const saveBoard = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userId = req.user._id;
    const { caseId } = req.params;
    const { clues = [], connections = [] } = req.body;

    // Validating case ownership
    const caseDoc = await caseModel.findOne({
      _id: caseId,
      user: userId,
    }).session(session);

    if (!caseDoc) {
      await session.abortTransaction();
      return res.status(404).json({ message: "Case not found or unauthorized" });
    }

    // ==========================
    // Clues Sync
    // ==========================

    const existingClues = await clueModel
      .find({ case: caseId })
      .session(session);

    const existingClueMap = new Map(
      existingClues.map(c => [c.clientId, c])
    );

    const incomingClientIds = new Set(clues.map(c => c.id));

    const clueBulkOps = [];

    // Deleting removed clues
    for (const existing of existingClues) {
      if (!incomingClientIds.has(existing.clientId)) {
        clueBulkOps.push({
          deleteOne: { filter: { _id: existing._id } },
        });
      }
    }

    // Create or updating clues
    for (const clue of clues) {
      const existing = existingClueMap.get(clue.id);

      if (existing) {
        // Update
        clueBulkOps.push({
          updateOne: {
            filter: { _id: existing._id },
            update: {
              $set: {
                type: clue.type,
                data: clue.data,
                note: clue.note,
                position: clue.position,
                size: clue.size,
                meta: clue.meta,
                updatedAt: Date.now(),
              },
            },
          },
        });
      } else {
        // Create
        clueBulkOps.push({
          insertOne: {
            document: {
              case: caseId,
              clientId: clue.id,
              type: clue.type,
              data: clue.data,
              note: clue.note,
              position: clue.position,
              size: clue.size,
              meta: clue.meta,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          },
        });
      }
    }

    if (clueBulkOps.length) {
      await clueModel.bulkWrite(clueBulkOps, { session });
    }

    // ==========================
    // Connections sync
    // ==========================

    const existingConnections = await connectionModel
      .find({ case: caseId })
      .session(session);

    const existingConnKey = (c) => `${c.from}->${c.to}`;
    const existingConnMap = new Map(
      existingConnections.map(c => [existingConnKey(c), c])
    );

    const incomingConnKeys = new Set(
      connections.map(c => `${c.from}->${c.to}`)
    );

    const connBulkOps = [];

    // Deleting removed connections
    for (const existing of existingConnections) {
      const key = existingConnKey(existing);
      if (!incomingConnKeys.has(key)) {
        connBulkOps.push({
          deleteOne: { filter: { _id: existing._id } },
        });
      }
    }

    // creating and updating connections
    for (const conn of connections) {
      const key = `${conn.from}->${conn.to}`;
      const existing = existingConnMap.get(key);

      if (existing) {
        connBulkOps.push({
          updateOne: {
            filter: { _id: existing._id },
            update: {
              $set: {
                style: conn.style,
                updatedAt: Date.now(),
              },
            },
          },
        });
      } else {
        connBulkOps.push({
          insertOne: {
            document: {
              case: caseId,
              from: conn.from,
              to: conn.to,
              style: conn.style,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
          },
        });
      }
    }

    if (connBulkOps.length) {
      await connectionModel.bulkWrite(connBulkOps, { session });
    }

    // ==========================
    // Commiting changes
    // ==========================

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ message: "Board saved successfully" });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();

    console.error("Save board failed:", err);

    res.status(500).json({
      message: "Failed to save board",
      error: err.message,
    });
  }
};

