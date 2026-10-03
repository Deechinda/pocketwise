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
        const spentInPlan=plan?data.transactions.filter(function(x){return x.type==="expense"&&x.date>=plan.start_date&&x.date<=plan.end_date;}).reduce(function(s,x){return s+Number(x.amount);},0):t.expense;
        const room=plan?Math.max(0,Number(plan.total_amount)-spentInPlan):Math.max(0,balance);
        const daily=room/Math.max(1,daysLeft);
        const spentPercent=plan?Math.min(100,Number(plan.total_amount)?spentInPlan/Number(plan.total_amount)*100:0):(t.income?Math.min(100,t.expense/t.income*100):0);

        let html='<header class="command-head"><div><p class="eyebrow">PERSONAL MONEY WORKSPACE</p><h1>Good morning, '+UI.escape(first)+'.</h1><p>Here’s what your money looks like right now.</p></div><div class="command-actions"><button class="button secondary" data-action="add-spending">− Spending</button><button class="button primary" data-action="add-money">+ Money in</button></div></header>';
        html+='<section class="command-center"><article class="command-balance"><div class="command-balance-top"><span>AVAILABLE BALANCE</span><button class="command-eye">•••</button></div><strong>'+UI.money(balance)+'</strong><div class="command-balance-bottom"><span><i class="status-dot"></i> Up to date</span><span>'+UI.money(t.income)+' received · '+UI.money(t.expense)+' spent</span></div></article>';
        html+='<article class="command-plan"><div class="command-plan-head"><div><span>ACTIVE PLAN</span><strong>'+(plan?UI.escape(plan.name):"No active plan")+'</strong></div><button class="text-button" data-route="plan">'+(plan?"Open plan":"Create plan")+' →</button></div>';
        html+=plan?'<div class="command-plan-number"><strong>'+UI.money(room)+'</strong><span>left to work with</span></div><div class="command-plan-track"><i style="width:'+spentPercent+'%"></i></div><div class="command-plan-meta"><span>'+Math.round(spentPercent)+'% used</span><span>'+daysLeft+' days left</span></div>':UI.empty("Give your money a plan","Choose a time period and decide what your money should do.","create-plan","Create your first plan");
        html+='</article></section>';
        html+='<section class="glance-grid"><article class="glance-card"><span>Spending room today</span><strong>'+UI.money(daily)+'</strong><small>'+(plan?daysLeft+" days remaining in your plan":"Set a plan to calculate this")+'</small></article><article class="glance-card"><span>Money in</span><strong class="positive">'+UI.money(t.income)+'</strong><small>Total received so far</small></article><article class="glance-card"><span>Goals in progress</span><strong>'+goals.length+'</strong><small>'+ (goals.length?"Keep the momentum going":"Create your first goal")+'</small></article><article class="glance-card"><span>Things to handle</span><strong>'+data.tasks.filter(function(x){return x.status==="open";}).length+'</strong><small>Purchases, bills, school & more</small></article></section>';
        html+='<section class="workspace-grid"><article class="surface-card allocation-panel"><div class="card-head"><div><p class="eyebrow">MONEY PLAN</p><h2>Give your money a job</h2></div><button class="text-button" data-route="plan">Manage →</button></div>';
        html+=allocations.length?allocations.map(function(a){const share=totalAllocated?Number(a.planned_amount)/totalAllocated*100:0;return '<div class="allocation-row"><span class="mini-icon">'+(a.protected?"◆":"◈")+'</span><div><strong>'+UI.escape(a.name)+(a.protected?'<small class="protected-label">Protected</small>':"")+'</strong><div class="mini-progress"><i style="width:'+share+'%"></i></div></div><b>'+UI.money(a.planned_amount)+'</b></div>';}).join(""):UI.empty("No plan yet","Give your current money a job.","create-plan","Create a plan");
        html+='</article><article class="surface-card activity-panel"><div class="card-head"><div><p class="eyebrow">ACTIVITY</p><h2>Recent money movement</h2></div><button class="text-button" data-route="money">See all →</button></div>';
        html+=recent.length?recent.map(function(x){return UI.row(x);}).join(""):UI.empty("Nothing here yet","Add money or spending to start.");
        html+='</article><aside class="side-stack"><article class="surface-card"><div class="card-head"><div><p class="eyebrow">GOALS</p><h2>What you’re building</h2></div><button class="text-button" data-route="goals">View →</button></div>';
        html+=goals.length?goals.map(function(g){const p=context.percentage(g.current_amount,g.target_amount);return '<div class="goal-mini"><div><span class="goal-badge">◇</span><strong>'+UI.escape(g.name)+'</strong><b>'+p+'%</b></div><div class="mini-progress"><i style="width:'+p+'%"></i></div><small>'+UI.money(g.current_amount)+' of '+UI.money(g.target_amount)+'</small></div>';}).join(""):UI.empty("No goals yet","Create something worth saving for.","add-goal","Create goal");
        html+='</article><article class="surface-card"><div class="card-head"><div><p class="eyebrow">NEXT UP</p><h2>Money tasks</h2></div><button class="text-button" data-route="tasks">Open →</button></div>';
        html+=tasks.length?tasks.map(function(task){return '<button class="task-preview" data-action="toggle-task" data-id="'+task.id+'" data-status="done"><span>○</span><div><strong>'+UI.escape(task.title)+'</strong><small>'+(task.due_date?UI.date(task.due_date):"No due date")+'</small></div><b>'+(task.amount?UI.money(task.amount):"")+'</b></button>';}).join(""):UI.empty("No open tasks","Add a purchase, book, fee, bill or anything else.","new-task","Add task");
        html+='</article></aside></section>';
        html+='<section class="insight-strip"><span>✦</span><div><strong>Make the next money decision clearer.</strong><p>Use your plan, goals, lists and tools together instead of keeping everything in your head.</p></div><button class="text-button" data-route="tools">Open tools →</button></section>';
        return html;
    }
    return {render};
})();