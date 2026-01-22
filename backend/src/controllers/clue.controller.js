import clueModel from "../models/clue.model.js";
import caseModel from "../models/case.model.js";

export const createClue = async (req, res) => {
  try {
    const user = req.user;

    const {
      caseId,
      id,
      type,
      data,
      position,
      size,
      note,
      meta,
    } = req.body;

    if (!caseId || !id || !type || !data || !position) {
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
        message: "Not allowed to add clue to this case",
      });
    }

    // Preventing duplicate clientId in same case
    const existing = await clueModel.findOne({
      case: caseId,
      clientId: id,
    });

    if (existing) {
      return res.status(409).json({
        message: "Clue with this id already exists",
      });
    }

    const clue = await clueModel.create({
      case: caseId,
      clientId: id,
      type,
      data,
      position,
      size: size || {},
      note: note || {},
      meta: meta || {},
    });

    res.status(201).json(clue);

  } catch (error) {
    res.status(500).json({
      message: "Failed to create clue",
      error: error.message,
    });
  }
};



export const getCluesByCase = async (req, res) => {
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

    const clues = await clueModel.find({ case: caseId }).sort({ updatedAt: -1 });

    res.status(200).json(clues);

  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch clues",
      error: error.message,
    });
  }
};



export const updateClue = async (req, res) => {
  try {
    const user = req.user;
    const { id } = req.params;
    const updates = req.body;

    const clue = await clueModel.findById(id);
    if (!clue) {
      return res.status(404).json({
        message: "Clue not found",
      });
    }

    const foundCase = await caseModel.findById(clue.case);
    if (!foundCase.user.equals(user._id)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    Object.assign(clue, updates);
    clue.updatedAt = Date.now();
    await clue.save();

    res.status(200).json(clue);
  } catch (error) {
    res.status(500).json({
      message: "Failed to update clue",
      error: error.message,
    });
  }
};