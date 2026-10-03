const TransactionsPage = (() => {
    function render(context) {
        const data=context.data, f=context.filters;
        const q=f.query.toLowerCase();
        const rows=data.transactions.filter(function(x){return (f.type==="all"||x.type===f.type)&&(!f.month||x.date.startsWith(f.month))&&(x.description+" "+x.category+" "+(x.source||"")).toLowerCase().includes(q);});
        return context.pageHeader("Money","See what came in, what went out, and where it went.",'<button class="button secondary" data-action="add-money">+ Add money</button><button class="button primary" data-action="add-spending">Add spending</button>')+
        '<section class="money-summary"><div><span>Money in</span><strong class="positive">'+UI.money(data.transactions.filter(function(x){return x.type==="income";}).reduce(function(s,x){return s+Number(x.amount);},0))+'</strong></div><div><span>Money out</span><strong class="negative">'+UI.money(data.transactions.filter(function(x){return x.type==="expense";}).reduce(function(s,x){return s+Number(x.amount);},0))+'</strong></div><div><span>Entries</span><strong>'+data.transactions.length+'</strong></div></section>'+
        '<section class="surface-card filter-card compact"><input id="search-transactions" type="search" placeholder="Search money..." value="'+UI.escape(f.query)+'"><select id="type-filter"><option value="all">All activity</option><option value="income" '+(f.type==="income"?"selected":"")+'>Money in</option><option value="expense" '+(f.type==="expense"?"selected":"")+'>Money out</option></select><input id="month-filter" type="month" value="'+f.month+'"><button class="button ghost" data-action="clear-filters">Clear</button></section>'+
        '<section class="surface-card"><div class="card-head"><h2>Activity</h2><span class="muted">'+rows.length+' entries</span></div><div class="transaction-list detailed">'+(rows.length?rows.map(function(x){return UI.row(x,true);}).join(""):UI.empty("No matching activity","Try another filter or add your first entry.","add-money","Add money"))+'</div></section>';
    }
    return {render};
})();