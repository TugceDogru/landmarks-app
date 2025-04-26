const db = require("../models");
const Landmark = db.landmark;

exports.create = async (req, res) => {
  try {
    const data = await Landmark.create(req.body);
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const landmarks = await Landmark.findAll();
    res.json(landmarks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const landmark = await Landmark.findByPk(req.params.id);
    if (landmark) res.json(landmark);
    else res.status(404).send("Landmark not found.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const [updated] = await Landmark.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) res.send("Landmark updated.");
    else res.status(404).send("Landmark not found.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const deleted = await Landmark.destroy({ where: { id: req.params.id } });
    if (deleted) res.send("Landmark deleted.");
    else res.status(404).send("Landmark not found.");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
