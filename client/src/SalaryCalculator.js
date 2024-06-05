import React, { useState, useEffect } from "react";
import "./index.css";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloseIcon from "@mui/icons-material/Close";

const SalaryCalculator = () => {
  const [basicSalary, setBasicSalary] = useState(0);
  const [earnings, setEarnings] = useState([]);
  const [deductions, setDeductions] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const formData = {
      basicSalary: parseFloat(basicSalary),
      earnings,
      deductions
    };
    calculateResults(formData);
  }, [basicSalary, earnings, deductions]);

  const handleAddEarning = () => {
    setEarnings([
      ...earnings,
      {
        id: Date.now(),
        name: "",
        amount: 0,
        applicable: true
      }
    ]);
  };

  const handleAddDeduction = () => {
    setDeductions([...deductions, { id: Date.now(), name: "", amount: 0 }]);
  };

  const handleReset = () => {
    setBasicSalary(0);
    setEarnings([]);
    setDeductions([]);
    setResults(null);
  };

  const calculateResults = (data) => {
    const { basicSalary, earnings, deductions } = data;

    const totalEarnings =
      basicSalary +
      earnings.reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
    const totalEarningsForEPF =
      basicSalary +
      earnings
        .filter((earning) => earning.applicable)
        .reduce((sum, earning) => sum + parseFloat(earning.amount), 0);
    const grossDeduction = deductions.reduce(
      (sum, deduction) => sum + parseFloat(deduction.amount),
      0
    );
    const grossEarnings = totalEarnings - grossDeduction;
    const grossSalaryForEPF = totalEarningsForEPF - grossDeduction;

    const employeeEPF = grossSalaryForEPF * 0.08;
    const employerEPF = grossSalaryForEPF * 0.12;
    const employerETF = grossSalaryForEPF * 0.03;

    const APIT = grossEarnings * 0.18 - 25500;

    const netSalary = grossEarnings - employeeEPF - APIT;
    const costToCompany = grossEarnings + employerEPF + employerETF;

    setResults({
      basicSalary,
      grossEarnings,
      grossDeduction,
      employeeEPF,
      employerEPF,
      employerETF,
      APIT,
      netSalary,
      costToCompany
    });
  };

  const handleEarningChange = (index, field, value) => {
    const newEarnings = [...earnings];
    newEarnings[index][field] = field === "amount" ? parseFloat(value) : value;
    setEarnings(newEarnings);
  };

  const handleDeductionChange = (index, field, value) => {
    const newDeductions = [...deductions];
    newDeductions[index][field] =
      field === "amount" ? parseFloat(value) : value;
    setDeductions(newDeductions);
  };

  const handleRemoveEarning = (index) => {
    const newEarnings = earnings.filter((_, i) => i !== index);
    setEarnings(newEarnings);
  };

  const handleRemoveDeduction = (index) => {
    const newDeductions = deductions.filter((_, i) => i !== index);
    setDeductions(newDeductions);
  };

  return (
    <div className="App">
      <div className="container">
        <div className="card salary-form">
          <div className="header">
            <h1>Salary Calculator</h1>
            <div
              style={{ display: "flex", alignItems: "center" }}
              onClick={handleReset}
            >
              <RefreshIcon color="primary" fontSize="large" />
              <span style={{ marginLeft: "5px", color: "#1974D2" }}>Reset</span>
            </div>
          </div>
          <div>
            <label>Basic Salary:</label>
            <input
              type="text"
              value={basicSalary}
              onChange={(e) => setBasicSalary(e.target.value)}
            />
          </div>

          <h2>Earnings</h2>
          {earnings.map((earning, index) => (
            <div key={earning.id} className="earning">
              <input
                type="text"
                name="name"
                value={earning.name}
                onChange={(e) =>
                  handleEarningChange(index, "name", e.target.value)
                }
                placeholder="Earning Name"
              />
              <input
                type="text"
                name="amount"
                value={earning.amount}
                onChange={(e) =>
                  handleEarningChange(index, "amount", e.target.value)
                }
                placeholder="Amount"
              />
              <CloseIcon
                fontSize="medium"
                style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#C0C0C0",
                  borderRadius: "50%"
                }}
                onClick={() => handleRemoveEarning(index)}
              />
              <label>
                <input
                  type="checkbox"
                  name="applicable"
                  checked={earning.applicable}
                  onChange={(e) =>
                    handleEarningChange(index, "applicable", e.target.checked)
                  }
                />
                EPF/ETF
              </label>
            </div>
          ))}
          <button type="button" onClick={handleAddEarning}>
            + Add New Allowance
          </button>

          <h2>Deductions</h2>
          {deductions.map((deduction, index) => (
            <div key={deduction.id} className="deduction">
              <input
                type="text"
                name="name"
                value={deduction.name}
                onChange={(e) =>
                  handleDeductionChange(index, "name", e.target.value)
                }
                placeholder="Deduction Name"
              />
              <input
                type="text"
                name="amount"
                value={deduction.amount}
                onChange={(e) =>
                  handleDeductionChange(index, "amount", e.target.value)
                }
                placeholder="Amount"
              />

              <CloseIcon
                fontSize="medium"
                style={{
                  color: "black",
                  cursor: "pointer",
                  backgroundColor: "#C0C0C0",
                  borderRadius: "50%"
                }}
                onClick={() => handleRemoveDeduction(index)}
              />
            </div>
          ))}
          <button type="button" onClick={handleAddDeduction}>
            + Add New Deduction
          </button>
        </div>

        {results && (
          <div className="card results">
            <h2>Your Salary</h2>
            <p>Basic Salary: {results.basicSalary.toFixed(2)}</p>
            <p>Gross Earnings: {results.grossEarnings.toFixed(2)}</p>
            <p>Gross Deduction: {results.grossDeduction.toFixed(2)}</p>
            <p>Employee EPF (8%): {results.employeeEPF.toFixed(2)}</p>
            <p>APIT: {results.APIT.toFixed(2)}</p>
            <p>Net Salary (Take Home): {results.netSalary.toFixed(2)}</p>

            <h3>Contribution from the Employer</h3>
            <p>Employer EPF (12%): {results.employerEPF.toFixed(2)}</p>
            <p>Employer ETF (3%): {results.employerETF.toFixed(2)}</p>
            <p>CTC (Cost to Company): {results.costToCompany.toFixed(2)}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalaryCalculator;
