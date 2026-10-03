const AnalyticsPage = (() => {
    function render(context){
        const data=context.data, t=context.totals(), cats=context.categoryTotals(data.transactions);
        const top=Object.entries(cats).sort(function(a,b){return b[1]-a[1];}).slice(0,5);
        const insights=[];
        if(top[0]) insights.push(top[0][0]+" is currently your largest spending category at "+UI.money(top[0][1])+".");
        if(t.income) insights.push("You have recorded "+Math.round(t.expense/t.income*100)+"% of your money-in as spending.");
        if(data.goals.length) insights.push(data.goals.filter(function(g){return Number(g.current_amount)>=Number(g.target_amount);}).length+" of "+data.goals.length+" goals have reached their target.");
        return context.pageHeader("Insights","Simple patterns from your real PocketWise activity.")+'<section class="insight-metrics"><div><span>Total in</span><strong class="positive">'+UI.money(t.income)+'</strong></div><div><span>Total out</span><strong class="negative">'+UI.money(t.expense)+'</strong></div><div><span>Net</span><strong>'+UI.money(t.income-t.expense)+'</strong></div></section><section class="analytics-grid"><article class="surface-card chart-panel"><div class="card-head"><h2>Money in vs out</h2></div><div class="chart-wrap"><canvas id="income-expense-chart"></canvas></div></article><article class="surface-card chart-panel"><div class="card-head"><h2>Where money goes</h2></div><div class="chart-wrap"><canvas id="category-chart"></canvas></div></article><article class="surface-card wide"><div class="card-head"><h2>Useful patterns</h2></div>'+(insights.length?insights.map(function(i){return '<div class="insight"><span>✦</span><p>'+i+'</p></div>';}).join(""):UI.empty("Insights are waiting","Add a few money entries to see patterns."))+'</article></section>';
    }
    function createCharts(context,charts){
        if(typeof Chart==="undefined") return;
        const t=context.totals(), cats=context.categoryTotals(context.data.transactions);
        const base={responsive:true,maintainAspectRatio:false,plugins:{legend:{position:"bottom",labels:{usePointStyle:true,padding:14}}}};
        const a=document.querySelector("#income-expense-chart"), b=document.querySelector("#category-chart");
        if(a) charts.push(new Chart(a,{type:"bar",data:{labels:["Money in","Money out"],datasets:[{data:[t.income,t.expense],backgroundColor:["#15805c","#d96a6a"],borderRadius:9}]},options:{...base,plugins:{legend:{display:false}}}}));
        if(b) charts.push(new Chart(b,{type:"doughnut",data:{labels:Object.keys(cats),datasets:[{data:Object.values(cats),backgroundColor:["#15805c","#8ecdb3","#f0b866","#6f8bd9","#c27bdc","#de7474"],borderWidth:0}]},options:{...base,cutout:"68%"}}));
    }
    return {render,createCharts};
})();