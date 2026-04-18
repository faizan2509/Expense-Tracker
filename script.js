let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let filteredExpenses = [...expenses];

function addExpense() {
  const amount = document.getElementById("amount").value;
  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;

  if (!amount || !date) return;

  const expense = {
    id: Date.now(),
    amount: Number(amount),
    category,
    date
  };

  expenses.push(expense);
  filteredExpenses = [...expenses];

  saveData();
  showExpenses();
  updateCharts();

  document.getElementById("amount").value = "";
}

function deleteExpense(id) {
  expenses = expenses.filter(e => e.id !== id);
  filteredExpenses = [...expenses];

  saveData();
  showExpenses();
  updateCharts();
}

function saveData() {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function filterByDate() {
  const selectedDate = document.getElementById("filterDate").value;

  if (!selectedDate) {
    filteredExpenses = [...expenses];
  } else {
    filteredExpenses = expenses.filter(e => e.date === selectedDate);
  }

  showExpenses();
  updateCharts();
}

function showExpenses() {
  const list = document.getElementById("list");
  list.innerHTML = "";

  let total = 0;

  filteredExpenses.forEach(e => {
    total += e.amount;

    const div = document.createElement("div");
    div.innerHTML = `
      ${e.category} - ₹${e.amount}
      <small>${e.date}</small>
      <button class="delete-btn" onclick="deleteExpense(${e.id})">X</button>
    `;
    list.appendChild(div);
  });

  document.getElementById("total").innerText = total;
}

function getTotal(category, data) {
  return data
    .filter(e => e.category === category)
    .reduce((sum, e) => sum + e.amount, 0);
}

// PIE CHART
let pieChart;
function updatePieChart() {
  const data = {
    labels: ["Food", "Travel", "Shopping"],
    datasets: [{
      data: [
        getTotal("Food", filteredExpenses),
        getTotal("Travel", filteredExpenses),
        getTotal("Shopping", filteredExpenses)
      ]
    }]
  };

  if (pieChart) pieChart.destroy();

  pieChart = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data
  });
}

// BAR CHART (Monthly)
let barChart;
function updateBarChart() {
  const months = {};

  expenses.forEach(e => {
    const month = e.date.slice(0, 7); // YYYY-MM
    months[month] = (months[month] || 0) + e.amount;
  });

  const labels = Object.keys(months);
  const values = Object.values(months);

  if (barChart) barChart.destroy();

  barChart = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Monthly Expenses",
        data: values
      }]
    }
  });
}

function updateCharts() {
  updatePieChart();
  updateBarChart();
}

// Initial load
showExpenses();
updateCharts();
