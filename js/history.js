const LOCAL_STORAGE_KEY = 'expenseTracker.transactions';

let transactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || [];

const historyList = document.getElementById('history-list');

function formatCurrency(num) {
  const v = Number(num) || 0;
  return (v < 0 ? '-₹' + Math.abs(v).toFixed(2) : '₹' + v.toFixed(2));
}

function renderHistory() {
  historyList.innerHTML = '';

  transactions.forEach(tx => {
    const li = document.createElement('li');
    li.classList.add('transaction-item');

    const signClass = tx.amount < 0 ? 'minus' : 'plus';

    const desc = document.createElement('div');
    desc.className = 'desc';

    const name = document.createElement('strong');
    name.textContent = tx.text;

    const dateSmall = document.createElement('small');
    dateSmall.textContent = new Date(tx.date).toLocaleString();

    desc.appendChild(name);
    desc.appendChild(dateSmall);

    const amount = document.createElement('p');
    amount.className = `amount ${signClass}`;
    amount.textContent = formatCurrency(tx.amount);

    li.appendChild(desc);
    li.appendChild(amount);

    historyList.appendChild(li);
  });
}

renderHistory();
