let people = [];

function addPerson() {
  const nameInput = document.getElementById("personName");
  const amountInput = document.getElementById("amountSpent");

  const name = nameInput.value.trim();
  const amount = parseFloat(amountInput.value);

  if (name === "" || isNaN(amount) || amount <= 0) {
    alert("Please enter a valid name and a positive amount.");
    return;
  }

  if (people.some(p => p.name.toLowerCase() === name.toLowerCase())) {
    alert("This person already exists.");
    return;
  }

  people.push({ name, amount });

  nameInput.value = "";
  amountInput.value = "";

  renderPeopleList();
}

function renderPeopleList() {
  const list = document.getElementById("peopleList");
  list.innerHTML = "";

  people.forEach(person => {
    const li = document.createElement("li");
    li.innerText = `${person.name} spent ₹${person.amount.toFixed(2)}`;
    list.appendChild(li);
  });
}

function calculateBalances() {
  if (people.length === 0) {
    alert("Please add some people first.");
    return;
  }

  const total = people.reduce((sum, person) => sum + person.amount, 0);
  const equalShare = total / people.length;
  const summaryList = document.getElementById("summaryList");
  summaryList.innerHTML = "";

  const balances = people.map(person => ({
    name: person.name,
    balance: parseFloat((person.amount - equalShare).toFixed(2))
  }));

  balances.forEach(p => {
    const li = document.createElement("li");
    if (p.balance > 0) {
      li.innerText = `${p.name} is owed ₹${p.balance.toFixed(2)}`;
    } else if (p.balance < 0) {
      li.innerText = `${p.name} owes ₹${Math.abs(p.balance).toFixed(2)}`;
    } else {
      li.innerText = `${p.name} is settled.`;
    }
    summaryList.appendChild(li);
  });

  document.getElementById("totalDisplay").innerText =
    `Total Spent: ₹${total.toFixed(2)} | Equal Share: ₹${equalShare.toFixed(2)}`;

  showSettlements(balances);
}

function showSettlements(balances) {
  const settlementsList = document.getElementById("settlementsList");
  settlementsList.innerHTML = "";

  let debtors = balances.filter(p => p.balance < 0).map(p => ({ ...p }));
  let creditors = balances.filter(p => p.balance > 0).map(p => ({ ...p }));

  while (debtors.length && creditors.length) {
    let debtor = debtors[0];
    let creditor = creditors[0];

    const amountToPay = Math.min(Math.abs(debtor.balance), creditor.balance);

    const li = document.createElement("li");
    li.innerText = `${debtor.name} owes ${creditor.name} ₹${amountToPay.toFixed(2)}`;
    settlementsList.appendChild(li);

    debtor.balance += amountToPay;
    creditor.balance -= amountToPay;

    if (Math.abs(debtor.balance) < 0.01) debtors.shift();
    if (creditor.balance < 0.01) creditors.shift();
  }
}

function resetAll() {
  people = [];
  document.getElementById("peopleList").innerHTML = "";
  document.getElementById("summaryList").innerHTML = "";
  document.getElementById("settlementsList").innerHTML = "";
  document.getElementById("totalDisplay").innerText = "";
  document.getElementById("personName").value = "";
  document.getElementById("amountSpent").value = "";
}

document.getElementById("add-person").addEventListener("click", addPerson);
document.getElementById("calculate").addEventListener("click", calculateBalances);
document.getElementById("reset").addEventListener("click", resetAll);
