const express = require("express");
const router = express.Router();
const salaryController = require("../controller/salaryController");

router.get("/:id", salaryController.getSalary);
router.post("/", salaryController.createOrUpdateSalary);
router.delete("/item", salaryController.deleteEarningOrDeduction);
router.put("/reset/:id", salaryController.resetSalary);

module.exports = router;
