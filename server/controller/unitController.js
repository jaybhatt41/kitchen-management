const getUnits = (req, res) => {
    const units = ["kg", "liters", "grams", "units", "dozen"];
    res.status(200).json(units);
};

module.exports = { getUnits };
