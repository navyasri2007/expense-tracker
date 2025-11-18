// -------------------------------
// Expense Tracker - script.js
// Home Page Logic (index.html)
// -------------------------------

// DOM Elements
const balanceEl = document.getElementById('balance');
const moneyPlusEl = document.getElementById('money-plus');
const moneyMinusEl = document.getElementById('money-minus');
const listEl = document.getElementById('list') || null; // list only exists on index page

const form = document.getElementById('form');
const textInput = document.getElementById('text');
const amountInput = document.getElementById('amount');

// LocalStorage Key
const LOCAL_STORAGE_KEY = 'expenseTracker.transactions';

// Load saved transactions OR use empty array
let transactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

// Format currency (₹)
function formatCurrency(num) {
  const value = Number(num) || 0;
  return value < 0
    ? `-₹${Math.abs(value).toFixed(2)}`
    : `₹${value.toFixed(2)}`;
}

// Add a transaction item to DOM (only for home page)
function addTransactionDOM(tx) {
  if (!listEl) return; // skip if on history page

  const li = document.createElement('li');
  li.classList.add('transaction-item');

  const signClass = tx.amount < 0 ? 'minus' : 'plus';

  // Description + Date
  const descDiv = document.createElement('div');
  descDiv.className = 'desc';

  const name = document.createElement('strong');
  name.textContent = tx.text;

  const dateSmall = document.createElement('small');
  dateSmall.textContent = new Date(tx.date).toLocaleString();

  descDiv.appendChild(name);
  descDiv.appendChild(dateSmall);

  // Amount + Delete button
  const amountDiv = document.createElement('div');
  amountDiv.style.display = 'flex';
  amountDiv.style.alignItems = 'center';

  const amt = document.createElement('div');
  amt.className = `amount ${signClass}`;
  amt.textContent = formatCurrency(tx.amount);

  const delBtn = document.createElement('button');
  delBtn.className = 'delete-btn';
  delBtn.textContent = '✕';
  delBtn.onclick = () => removeTransaction(tx.id);

  amountDiv.appendChild(amt);
  amountDiv.appendChild(delBtn);

  li.appendChild(descDiv);
  li.appendChild(amountDiv);

  listEl.appendChild(li);
}

// Update totals (balance, income, expense)
function updateTotals() {
  const amounts = transactions.map(t => Number(t.amount));

  const total = amounts.reduce((acc, val) => acc + val, 0);
  const income = amounts.filter(a => a > 0).reduce((acc, val) => acc + val, 0);
  const expense = amounts.filter(a => a < 0).reduce((acc, val) => acc + val, 0);

  balanceEl.textContent = formatCurrency(total);
  moneyPlusEl.textContent = `+${formatCurrency(income)}`;
  moneyMinusEl.textContent = `-${formatCurrency(Math.abs(expense))}`;
}

// Save to localStorage
function saveTransactions() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transactions));
}

// Render all UI
function render() {
  if (listEl) {
    listEl.innerHTML = ''; // avoid duplicate items
    transactions.forEach(addTransactionDOM);
  }

  updateTotals();
}

// Add transaction
function addTransaction(e) {
  e.preventDefault();

  const text = textInput.value.trim();
  const amount = Number(amountInput.value);

  if (text === '' || isNaN(amount) || amount === 0) {
    alert('Enter a valid description & non-zero amount.');
    return;
  }

  const newTx = {
    id: Date.now().toString(),
    text,
    amount,
    date: new Date().toISOString()
  };

  transactions.push(newTx);
  saveTransactions();
  render();

  // Clear form
  textInput.value = '';
  amountInput.value = '';
}

// Delete a transaction
function removeTransaction(id) {
  transactions = transactions.filter(tx => tx.id !== id);
  saveTransactions();
  render();
}

// Initialize app
function init() {
  render();

  form.addEventListener('submit', addTransaction);

  // Allow pressing Enter in amount input to submit
  amountInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      form.requestSubmit();
    }
  });
}

init();
