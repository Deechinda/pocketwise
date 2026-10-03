const DashboardPage = (() => {
    function render(context) {
        const data=context.data, profile=context.profile, t=context.totals(), pageHeader=context.pageHeader;
        const balance=t.income-t.expense;
        const plan=data.plans.find(function(p){return p.status==="active";})||data.plans[0];
        const allocations=plan?data.allocations.filter(function(a){return a.plan_id===plan.id;}):[];
        const totalAllocated=allocations.reduce(function(s,a){return s+Number(a.planned_amount);},0);
        const recent=data.transactions.slice(0,5);
        const tasks=data.tasks.filter(function(x){return x.status==="open";}).slice(0,4);
        const goals=data.goals.slice(0,3);
        const first=(profile&&profile.full_name?profile.full_name.split(" ")[0]:"there");
        const daysLeft=plan?Math.max(0,Math.ceil((new Date(plan.end_date)-new Date())/86400000)):0;
        const room=plan?Math.max(0,Number(plan.total_amount)-data.transactions.filter(function(x){return x.type==="expense"&&x.date>=plan.start_date&&x.date<=plan.end_date;}).reduce(function(s,x){return s+Number(x.amount);},0)):balance;
        const daily=room/Math.max(1,daysLeft);
        let html=pageHeader("Good morning, "+UI.escape(first)+" 👋","Here's your money at a glance.",'<button class="button primary" data-action="add-money">+ Add money</button><button class="button secondary" data-action="add-spending">Add spending</button>');
        html+='<section class="home-hero-grid"><article class="money-hero"><div><span>Available to spend</span><button class="eye-button">◉</button></div><strong>'+UI.money(balance)+'</strong><div class="money-hero-meta"><span>Current balance</span><span>'+ (t.income?Math.round(t.expense/t.income*100):0) +'% spent</span></div><div class="hero-progress"><i style="width:'+Math.min(100,t.income?t.expense/t.income*100:0)+'%"></i></div></article>';
        html+='<article class="compact-stat"><span>Today’s spending room</span><strong>'+UI.money(daily)+'</strong><small>'+(plan?daysLeft+" days left":"Create a plan to calculate")+'</small></article>';
        html+='<article class="compact-stat"><span>Current plan</span><strong>'+(plan?UI.money(plan.total_amount):"No plan")+'</strong><small>'+(plan?UI.date(plan.start_date)+" – "+UI.date(plan.end_date):"Plan your current money")+'</small></article>';
        html+='<article class="compact-stat"><span>Money in</span><strong class="positive">'+UI.money(t.income)+'</strong><small>Total received</small></article></section>';
        html+='<section class="dense-grid">';
        html+='<article class="surface-card"><div class="card-head"><div><p class="eyebrow">Your money</p><h2>Where it is going</h2></div><button class="text-button" data-route="plan">View plan</button></div>';
        html+=allocations.length?allocations.map(function(a){return '<div class="allocation-row"><span class="mini-icon">◈</span><div><strong>'+UI.escape(a.name)+'</strong><div class="mini-progress"><i style="width:'+(totalAllocated?Number(a.planned_amount)/totalAllocated*100:0)+'%"></i></div></div><b>'+UI.money(a.planned_amount)+'</b></div>';}).join(""):UI.empty("No plan yet","Give your current money a job.","create-plan","Create a plan");
        html+='</article><article class="surface-card"><div class="card-head"><div><p class="eyebrow">Recent activity</p><h2>Money movement</h2></div><button class="text-button" data-route="money">View all</button></div>';
        html+=recent.length?recent.map(function(x){return UI.row(x);}).join(""):UI.empty("Nothing here yet","Add money or spending to start.");
        html+='</article><article class="surface-card"><div class="card-head"><div><p class="eyebrow">Goals</p><h2>What you’re building</h2></div><button class="text-button" data-route="goals">View all</button></div>';
        html+=goals.length?goals.map(function(g){const p=context.percentage(g.current_amount,g.target_amount);return '<div class="goal-mini"><div><span class="goal-badge">◇</span><strong>'+UI.escape(g.name)+'</strong><b>'+p+'%</b></div><div class="mini-progress"><i style="width:'+p+'%"></i></div><small>'+UI.money(g.current_amount)+' of '+UI.money(g.target_amount)+'</small></div>';}).join(""):UI.empty("No goals yet","Create a target worth saving for.","add-goal","Create goal");
        html+='</article><article class="surface-card"><div class="card-head"><div><p class="eyebrow">Upcoming</p><h2>Money tasks</h2></div><button class="text-button" data-route="tasks">View all</button></div>';
        html+=tasks.length?tasks.map(function(task){return '<button class="task-preview" data-action="toggle-task" data-id="'+task.id+'" data-status="done"><span>□</span><div><strong>'+UI.escape(task.title)+'</strong><small>'+(task.due_date?UI.date(task.due_date):"No due date")+'</small></div><b>'+(task.amount?UI.money(task.amount):"")+'</b></button>';}).join(""):UI.empty("No open tasks","Add things you need to buy or pay.","new-task","Create task");
        html+='</article></section><section class="insight-strip"><span>✦</span><div><strong>Small steps, clearer money.</strong><p>Use Plans, Tasks and Goals together to decide what your money should do.</p></div><button class="text-button" data-route="insights">See insights</button></section>';
        return html;
    }
    return {render};
})();