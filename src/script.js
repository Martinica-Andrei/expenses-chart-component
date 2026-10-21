const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loadErrorEl = $("#load-error");
const loadDataBtnEl = $("#load-data-btn");
const loadMessageEl = $("#load-message");
const contentEl = $("#content");

const myBalanceValueEl = $("#my-balance-value");
const totalThisMonthValueEl = $("#total-this-month-value");
const percentageIncreaseFromLastMonthValueEl = $("#percentage-increase-from-last-month-value");

const STATE_LOADING = 0;
const STATE_LOADED_SUCCESS = 1;
const STATE_LOADED_FAILURE = 2;

const MAX_BAR_SIZE_PX = 200;

loadDataBtnEl.addEventListener("click", getAndDisplayDataAsync);

await getAndDisplayDataAsync();

async function getAndDisplayDataAsync() {
    updateLoadingState(STATE_LOADING);
    const data = await getDataAsync();
    if (data !== null) {
        displayData(data);
        updateLoadingState(STATE_LOADED_SUCCESS);
    }
    else {
        updateLoadingState(STATE_LOADED_FAILURE);
    }
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
    myBalanceValueEl.textContent = "$" + data.balance;
    totalThisMonthValueEl.textContent = "$" + data.totalThisMonth;
    percentageIncreaseFromLastMonthValueEl.textContent = data.fromLastMonthIncrease;

    const barSizes = getBarSizesNormalized(data.spending);

    barSizes.forEach(({ day, amount, sizeNormalized }) => {
        const barEl = getBarEl(day);
        barEl.style.height = sizeNormalized * MAX_BAR_SIZE_PX + "px";
        barEl.style.backgroundColor = "";
        const spendingEl = $(`.spending.${day}`);
        spendingEl.textContent = "$" + amount;

        barEl.addEventListener("mouseenter", () => spendingEl.style.visibility = "visible");
        barEl.addEventListener("mouseleave", () => spendingEl.style.visibility = "");
    });

    highlightCurrentDay();
}

function getBarSizesNormalized(spending) {
    const maxValue = spending.reduce((prev, current) => Math.max(prev, current.amount), 0);
    return spending.map(v => ({ day: v.day, amount: v.amount, sizeNormalized: v.amount / maxValue }));
}

function updateLoadingState(state) {
    switch (state) {
        case STATE_LOADING:
            loadErrorEl.style.display = "none";
            loadMessageEl.style.display = "";
            contentEl.style.display = "none";
            break;
        case STATE_LOADED_SUCCESS:
            loadErrorEl.style.display = "none";
            loadMessageEl.style.display = "none";
            contentEl.style.display = "";
            break;
        case STATE_LOADED_FAILURE:
            loadErrorEl.style.display = "";
            loadMessageEl.style.display = "none";
            contentEl.style.display = "none";
            break;
        default:
            break;
    }
}

function highlightCurrentDay() {
    const days = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
    const todayIndex = new Date().getDay();
    const today = days[todayIndex];
    const todayBarEl = getBarEl(today);
    todayBarEl.style.backgroundColor = "var(--primary-2)";
}

function getBarEl(day) {
    return $(`.bar.${day}`);
}