const TasksPage = (() => {
    function render(context){
        const tasks=context.data.tasks;
        const groups=["all","shopping","school","bills","household","personal","business"];
        const active=context.taskFilter||"all";
        const shown=tasks.filter(function(t){return active==="all"||t.task_type===active;});
        const open=shown.filter(function(t){return t.status!=="done";});
        const done=shown.length-open.length;
        const total=open.reduce(function(s,t){return s+Number(t.amount||0);},0);
        const grouped={};
        open.forEach(function(t){const key=t.list_name||"My list";if(!grouped[key])grouped[key]=[];grouped[key].push(t);});
        return context.pageHeader("Lists","Keep purchases, school items, bills and other money tasks in one place.",
            '<button class="button secondary" data-action="share-tasks">Share open items</button><button class="button primary" data-action="new-task">+ Add item</button>')+
        '<section class="list-overview"><div><span class="list-overview-icon">☑</span><div><p class="eyebrow">Your lists</p><h2>'+open.length+' open item'+(open.length===1?"":"s")+'</h2><p>'+done+' completed · '+UI.money(total)+' still to plan for</p></div></div><div class="list-progress"><span><i style="width:'+(shown.length?done/shown.length*100:0)+'%"></i></span><small>'+(shown.length?Math.round(done/shown.length*100):0)+'% complete</small></div></section>'+
        '<section class="task-toolbar"><div class="pill-tabs">'+groups.map(function(g){return '<button class="'+(active===g?"active":"")+'" data-action="task-filter" data-value="'+g+'">'+(g==="all"?"Everything":g==="bills"?"Bills & debts":g.charAt(0).toUpperCase()+g.slice(1))+'</button>';}).join("")+'</div></section>'+
        '<section class="list-groups">'+(Object.keys(grouped).length?Object.keys(grouped).map(function(name){
            const rows=grouped[name];
            return '<article class="list-group surface-card"><header><div><span class="list-label">LIST</span><h3>'+UI.escape(name)+'</h3></div><span class="list-count">'+rows.length+'</span></header><div class="checklist">'+rows.map(function(t){
                return '<div class="checklist-row"><button class="check-circle" data-action="toggle-task" data-id="'+t.id+'" data-status="done" aria-label="Mark '+UI.escape(t.title)+' complete"></button><div class="checklist-copy"><strong>'+UI.escape(t.title)+'</strong><small>'+(t.task_type==="bills"?"Bills & debts":t.task_type.charAt(0).toUpperCase()+t.task_type.slice(1))+(t.due_date?" · Due "+UI.date(t.due_date):"")+'</small></div><b>'+(t.amount?UI.money(t.amount):"")+'</b><div class="checklist-actions"><button class="icon-button" data-action="edit-task" data-id="'+t.id+'" aria-label="Edit item">···</button></div></div>';
            }).join("")+'</div></article>';
        }).join(""):UI.empty("Your lists are clear","Add a shopping item, handout, book, uniform, fee, bill, debt or anything else you need to handle.","new-task","Add your first item"))+'</section>'+
        (tasks.filter(function(t){return t.status==="done";}).length?'<section class="completed-preview surface-card"><div class="card-head"><div><p class="eyebrow">Completed</p><h2>Handled items</h2></div><span class="muted">'+tasks.filter(function(t){return t.status==="done";}).length+'</span></div>'+tasks.filter(function(t){return t.status==="done";}).slice(0,5).map(function(t){return '<div class="completed-row"><button class="check-circle checked" data-action="toggle-task" data-id="'+t.id+'" data-status="open">✓</button><span><s>'+UI.escape(t.title)+'</s><small>'+UI.escape(t.list_name||"My list")+'</small></span><b>'+(t.amount?UI.money(t.amount):"")+'</b></div>';}).join("")+'</section>':"");
    }
    return {render};
})();