const Salary = require("../models/salary");

exports.createOrUpdateSalary = async (req, res) => {
  try {
    const { id, basicSalary, earnings, deductions } = req.body;

    let salary = await Salary.findById(id);

    if (salary) {
      salary.basicSalary = basicSalary;
      salary.earnings = earnings;
      salary.deductions = deductions;
    } else {
      salary = new Salary({ basicSalary, earnings, deductions });
    }

    await salary.save();
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteEarningOrDeduction = async (req, res) => {
  try {
    const { id, type, itemId } = req.body;
    let salary = await Salary.findById(id);

    if (type === "earning") {
      salary.earnings.id(itemId).remove();
    } else if (type === "deduction") {
      salary.deductions.id(itemId).remove();
    }

    await salary.save();
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resetSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (salary) {
      salary.basicSalary = 0;
      salary.earnings = [];
      salary.deductions = [];
      await salary.save();
    }
    res.status(200).json(salary);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getSalary = async (req, res) => {
  try {
    const salary = await Salary.findById(req.params.id);
    if (!salary) {
      return res.status(404).json({ message: "Salary not found" });
    }

    const basicSalary = salary.basicSalary;

    // Calculate total earnings and total earnings for EPF
    let totalEarnings = basicSalary;
    let totalEarningsForEPF = basicSalary;
    salary.earnings.forEach((earning) => {
      totalEarnings += earning.amount;
      if (earning.epfApplicable) {
        totalEarningsForEPF += earning.amount;
      }
    });

    // Calculate gross deductions
    let grossDeduction = 0;
    salary.deductions.forEach((deduction) => {
      grossDeduction += deduction.amount;
    });

    // Calculate gross earnings and gross salary for EPF
    const grossEarnings = totalEarnings - grossDeduction;
    const grossSalaryForEPF = totalEarningsForEPF - grossDeduction;

    // Calculate EPF, ETF, APIT, and net salary
    const employeeEPF = grossSalaryForEPF * 0.08;
    const employerEPF = grossSalaryForEPF * 0.12;
    const employerETF = grossSalaryForEPF * 0.03;
    const APIT = grossEarnings * 0.18 - 25500;
    const netSalary = grossEarnings - employeeEPF - APIT;

    // Calculate CTC (Cost To Company)
    const CTC = grossEarnings + employerEPF + employerETF;

    res.json({
      basicSalary,
      grossEarnings,
      grossDeduction,
      employeeEPF,
      employerEPF,
      employerETF,
      APIT,
      netSalary,
      CTC
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
