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
let changeDueArray = [];
let usedMonetaryIndices = [];
let selectedArray = [];
let roundChangeToGive = 0;

const valueSelector = () => {};

const calculateChange = (changeAmount) => {
  if (changeAmount <= 0) {
    return;
  } else {
    let selectedMonetaryValue = monetaryValues.find(
      (number, index) =>
        number <= changeAmount && !usedMonetaryIndices.includes(index)
    );

    cid.reverse();
    let selectedIndex = monetaryValues.indexOf(selectedMonetaryValue);
    let remainderCid = 0;
    let roundRemainder = 0;
    for (let i = selectedIndex; i < cid.length; i++) {
      remainderCid += parseFloat(cid[i][1]);
    }
    roundRemainder = parseFloat(remainderCid.toFixed(2));
    if (roundRemainder >= changeAmount) {
      if (cid[selectedIndex][1]) {
        cid[selectedIndex][1] -= parseFloat(selectedMonetaryValue);

        cid[selectedIndex][1] = parseFloat(cid[selectedIndex][1].toFixed(2));

        selectedArray.push([cid[selectedIndex][0], selectedMonetaryValue]);
        if (cid[selectedIndex][1] === 0) {
          usedMonetaryIndices.push(selectedIndex);
        }
        cid.reverse();
        changeAmount = parseFloat(
          (changeAmount - selectedMonetaryValue).toFixed(2)
        );
        calculateChange(changeAmount);
      } else {
        let nextIndex;
        for (let i = selectedIndex + 1; i < monetaryValues.length; i++) {
          if (cid[i][1] !== 0) {
            nextIndex = i;
            break;
          }
        }

        if (nextIndex !== undefined) {
          selectedMonetaryValue = monetaryValues[nextIndex];
          selectedIndex = nextIndex;

          cid[selectedIndex][1] -= parseFloat(selectedMonetaryValue);

          cid[selectedIndex][1] = parseFloat(cid[selectedIndex][1].toFixed(2));
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
      }
    } else {
      cid.reverse();
    }
  }
};

const updateResult = (originalArray, num) => {
  calculateChange(num);
  for (let i = 0; i < originalArray.length; i++) {
    const existing = changeDueArray.find(
      (item) => item[0] === originalArray[i][0]
    );
    if (!existing) {
      changeDueArray.unshift(originalArray[i]);
    } else {
      changeDueArray[0][1] += parseFloat(originalArray[i][1]);
      changeDueArray[0][1] = parseFloat(changeDueArray[0][1].toFixed(2));
    }
  }

  changeDueArray = changeDueArray.reverse();
  let changeToGive = 0;
  for (let i = 0; i < changeDueArray.length; i++) {
    changeToGive += parseFloat(changeDueArray[i][1]);
  }
  roundChangeToGive += parseFloat(changeToGive.toFixed(2));
};

const statusChecker = (number) => {
  const statusArray = [" INSUFFICIENT_FUNDS", "CLOSED", "OPEN"];
  let total = 0;
  for (let i = 0; i < cid.length; i++) {
    total += parseFloat(cid[i][1]);
  }
  const roundTotal = parseFloat(total.toFixed(2));

  const check = () => {
    updateResult(selectedArray, number);
    changeDue.style.textAlign = "left";
    changeDue.style.width = "160px";
    if (roundChangeToGive === number) {
      changeDueArray.forEach(
        ([string, num]) =>
          (changeDue.innerText += `
    ${string}: $${num}`)
      );
    } else {
      changeDue.style.width = "220px";

      changeDue.style.textAlign = "center";

      changeDue.innerText = `Status: ${statusArray[0]}`;
    }
  };

  changeDue.style.display = "block";
  if (roundTotal < number) {
    changeDue.innerText = `Status: ${statusArray[0]}`;
    changeDue.style.textAlign = "center";
    changeDue.style.width = "220px";
  } else if (roundTotal === number) {
    changeDue.innerText = `Status: ${statusArray[1]}`;
    check();
  } else if (roundTotal > number) {
    changeDue.innerText = `Status: ${statusArray[2]}`;
    check();
  }
};

const checkValue = (value) => {
  value = parseFloat(cash.value);

  if (value < price) {
    alert("Customer does not have enough money to purchase the item");
  } else if (value === price) {
    changeDue.style.display = "block";
    changeDue.textContent = "No change due - customer paid with exact cash";
  } else if (value > price) {
    const valueDue = parseFloat((value - price).toFixed(2));
    statusChecker(valueDue);
    spanArray.forEach((element, index) => {
      element.innerText = `$${cid[index][1]}`;
    });
  }

  cash.value = "";
  selectedArray = [];
  changeDueArray = [];
  roundChangeToGive = 0;
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
