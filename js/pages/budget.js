const BudgetPage = (() => {
    function render(context) {
        const data=context.data, plan=data.plans.find(function(p){return p.status==="active";})||data.plans[0];
        const allocations=plan?data.allocations.filter(function(a){return a.plan_id===plan.id;}):[];
        const total=allocations.reduce(function(s,a){return s+Number(a.planned_amount);},0);
        let html=context.pageHeader("Plan","Give your current money a job before you spend it.",'<button class="button primary" data-action="create-plan">+ Create plan</button>');
        html+='<section class="plan-layout"><article class="plan-main surface-card"><div class="plan-question"><p class="eyebrow">Current plan</p><h2>'+(plan?"What should your "+UI.money(plan.total_amount)+" do?":"Start with the money you have.")+'</h2><p>'+(plan?UI.date(plan.start_date)+" – "+UI.date(plan.end_date)+" · "+Math.max(0,Math.ceil((new Date(plan.end_date)-new Date())/86400000))+" days left":"Choose a period and divide money between the things that matter.")+'</p></div>';
        html+=allocations.length?allocations.map(function(a){return '<div class="plan-line"><span class="mini-icon">◈</span><div><strong>'+UI.escape(a.name)+'</strong><small>'+(a.protected?"Protected":"Available for this plan")+'</small></div><b>'+UI.money(a.planned_amount)+'</b></div>';}).join(""):UI.empty("No allocations yet","Create a plan to divide your money into useful buckets.","create-plan","Create plan");
        if(plan) html+='<div class="plan-total"><span>Allocated</span><strong>'+UI.money(total)+'</strong><span>Unassigned</span><strong>'+UI.money(Math.max(0,Number(plan.total_amount)-total))+'</strong></div><button class="button primary wide-button" data-action="edit-plan" data-id="'+plan.id+'">Edit plan</button>';
        html+='</article><aside class="surface-card plan-side"><p class="eyebrow">Planning principle</p><h3>Protect what matters first.</h3><p class="muted">Keep everyday spending visible while fees, rent and emergency money stay protected.</p><div class="allocation-example"><span>Protected</span><strong>'+UI.money(allocations.filter(function(a){return a.protected;}).reduce(function(s,a){return s+Number(a.planned_amount);},0))+'</strong></div><div class="allocation-example"><span>Flexible</span><strong>'+UI.money(allocations.filter(function(a){return !a.protected;}).reduce(function(s,a){return s+Number(a.planned_amount);},0))+'</strong></div></aside></section>';
        return html;
    }
    return {render};
})();