const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loadErrorEl = $("#load-error");

const myBalanceValueEl = $("#my-balance-value");
const totalThisMonthValueEl = $("#total-this-month-value");
const percentageIncreaseFromLastMonthValueEl = $("#percentage-increase-from-last-month-value");

await getAndDisplayDataAsync();

async function getAndDisplayDataAsync(){
    const data = await getDataAsync();
    displayData(data);
}

async function getDataAsync() {
    try {
        const response = await fetch("data.json");
        if (response.ok) {
            return response.json();
        }
    }
    catch {

    }

    return null;
}

function displayData(data) {
    if (data != null) {
        loadErrorEl.style.display = "none";
        myBalanceValueEl.textContent = "$" + data.balance;
        totalThisMonthValueEl.textContent = "$" + data.totalThisMonth;
        percentageIncreaseFromLastMonthValueEl.textContent = data.fromLastMonthIncrease;
    }
    else {
        loadErrorEl.style.display = "";
    }
}