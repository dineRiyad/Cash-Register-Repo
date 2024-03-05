const changeDue = document.getElementById("change-due");
const inputForm = document.getElementById("input-cash-form");
const cash = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const spanEl = document.querySelectorAll(".Change-in-drawer > p span");
const spanArray = Array.from(spanEl);
let price = 1.87;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
const monetaryValues = [100, 20, 10, 5, 1, 0.25, 0.1, 0.05, 0.01];
let chandeDueArray = [];

let usedMonetaryIndices = [];
let selectedArray = [];

const calculateChange = (changeAmount) => {
  if (changeAmount <= 0) {
    return;
  } else {
    let selectedMonetaryValue = monetaryValues.find(
      (number, index) =>
        number <= changeAmount && !usedMonetaryIndices.includes(index)
    );
    console.log(selectedMonetaryValue);
    cid.reverse();
    let selectedIndex = monetaryValues.indexOf(selectedMonetaryValue);
    console.log(selectedIndex);

    cid[selectedIndex][1] -= parseFloat(selectedMonetaryValue);

    cid[selectedIndex][1] = parseFloat(cid[selectedIndex][1].toFixed(2));
    console.log(cid[selectedIndex][1]);
    selectedArray.push([cid[selectedIndex][0], selectedMonetaryValue]);
    if (cid[selectedIndex][1] === 0) {
      usedMonetaryIndices.push(selectedIndex);
    }
    cid.reverse();

    changeAmount = parseFloat(
      (changeAmount - selectedMonetaryValue).toFixed(2)
    );
    calculateChange(changeAmount);
  }
};
const updateResult = (originalArray) => {
  for (let i = 0; i < originalArray.length; i++) {
    const existing = chandeDueArray.find(
      (item) => item[0] === originalArray[i][0]
    );
    if (!existing) {
      chandeDueArray.unshift(originalArray[i]);
    } else {
      chandeDueArray[0][1] += parseFloat(originalArray[i][1]);
      chandeDueArray[0][1] = parseFloat(chandeDueArray[0][1].toFixed(2));
    }
  }
  chandeDueArray = chandeDueArray.reverse();
};

const statusChecker = (number) => {
  const statusArray = [" INSUFFICIENT_FUNDS", "CLOSED", "OPEN"];
  let total = 0;
  for (let i = 0; i < cid.length; i++) {
    total += parseFloat(cid[i][1]);
  }
  const roundTotal = parseFloat(total.toFixed(2));

  changeDue.style.display = "block";
  if (roundTotal < number) {
    changeDue.innerText = `Status: ${statusArray[0]}`;
  } else if (roundTotal === number) {
    changeDue.innerText = `Status: ${statusArray[1]}`;
    calculateChange(number);
    updateResult(selectedArray);
    chandeDueArray.forEach(
      ([string, number]) =>
        (changeDue.innerText += `
      ${string}: $${number}`)
    );
  } else if (roundTotal > number) {
    calculateChange(number);
    updateResult(selectedArray);
    changeDue.innerText = `Status: ${statusArray[2]}`;
    chandeDueArray.forEach(
      ([string, number]) =>
        (changeDue.innerText += `
      ${string}: $${number}`)
    );
  }
};

const checkValue = (value) => {
  value = parseFloat(cash.value);
  console.log(value);
  if (value < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (value === price) {
    changeDue.style.display = "block";
    changeDue.textContent = "No change due - customer paid with exact cash";
  } else if (value > price) {
    valueDue = parseFloat((value - price).toFixed(2));
    statusChecker(valueDue);
    spanArray.forEach((element, index) => {
      element.innerText = `$${cid[index][1]}`;
    });
  }
  cash.value = "";
  selectedArray = [];
  chandeDueArray = [];
};

inputForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

cash.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    checkValue();
  }
});

purchaseBtn.addEventListener("click", checkValue);
