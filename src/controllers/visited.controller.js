const db = require("../models");
const Visited = db.visited;
const Landmark = db.landmark;

exports.create = (req, res) => {
  const { visitor_name, landmark_id, note } = req.body;

  Visited.create({
    visitor_name,
    visited_date: new Date(),
    landmark_id,
    note,                  
  })
    .then((data) => res.send(data))
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the visit record.",
      });
    });
};


exports.findAll = async (req, res) => {
  try {
    const visits = await Visited.findAll({ include: [Landmark] });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.findByLandmarkId = async (req, res) => {
  try {
    const visits = await Visited.findAll({
      where: { landmark_id: req.params.id },
      include: [Landmark],
    });
    res.json(visits);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
