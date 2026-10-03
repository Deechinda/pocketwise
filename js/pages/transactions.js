const TransactionsPage = (() => {
    function render(context) {
        const { data, filters, pageHeader } = context;
        const searchText = filters.query.toLowerCase();

        const filteredTransactions = data.transactions.filter((transaction) => {
            const matchesType =
                filters.type === "all" || transaction.type === filters.type;
            const matchesMonth =
                !filters.month || transaction.date.startsWith(filters.month);
            const searchableText =
                `${transaction.description} ${transaction.category}`.toLowerCase();

            return matchesType && matchesMonth && searchableText.includes(searchText);
        });

        const headerActions = `
            <button class="button secondary" data-action="add-income">
                + Add income
            </button>
            <button class="button primary" data-action="add-expense">
                + Add expense
            </button>
        `;

        const transactionList = filteredTransactions.length
            ? filteredTransactions
                  .map((transaction) => {
                      return UI.row(transaction, true);
                  })
                  .join("")
            : UI.empty(
                  data.transactions.length
                      ? "No matching transactions"
                      : "No transactions yet",
                  data.transactions.length
                      ? "Try changing or clearing the filters."
                      : "Start tracking your money by adding your first transaction.",
                  "add-expense",
                  "Add transaction",
              );

        return `
            ${pageHeader(
                "Transactions",
                "Track every naira coming in and going out.",
                headerActions,
            )}

            <section class="card filter-card">
                <input
                    id="search-transactions"
                    type="search"
                    placeholder="Search transactions"
                    value="${UI.escape(filters.query)}"
                >
                <select id="type-filter" aria-label="Filter by transaction type">
                    <option value="all">All types</option>
                    <option value="income" ${filters.type === "income" ? "selected" : ""}>
                        Income
                    </option>
                    <option value="expense" ${filters.type === "expense" ? "selected" : ""}>
                        Expenses
                    </option>
                </select>
                <input
                    id="month-filter"
                    type="month"
                    value="${filters.month}"
                    aria-label="Filter by month"
                >
                <button class="button ghost" data-action="clear-filters">Clear</button>
            </section>

            <section class="card">
                <div class="card-head">
                    <h2>
                        ${filteredTransactions.length}
                        transaction${filteredTransactions.length === 1 ? "" : "s"}
                    </h2>
                </div>
                <div class="transaction-list detailed">${transactionList}</div>
            </section>
        `;
    }

    return { render };
})();
