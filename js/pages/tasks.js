const TasksPage = (() => {
    function render(context){
        const tasks=context.data.tasks, groups=["all","shopping","school","bills","household","personal","business"];
        const active=context.taskFilter||"all";
        const shown=tasks.filter(function(t){return active==="all"||t.task_type===active;});
        const total=shown.reduce(function(s,t){return s+Number(t.amount||0);},0);
        return context.pageHeader("Tasks","Keep track of what your money needs to buy, pay or handle.",'<button class="button secondary" data-action="share-tasks">Share list</button><button class="button primary" data-action="new-task">+ New task</button>')+
        '<section class="task-toolbar"><div class="pill-tabs">'+groups.map(function(g){return '<button class="'+(active===g?"active":"")+'" data-action="task-filter" data-value="'+g+'">'+(g==="all"?"All":g==="bills"?"Bills & Debts":g.charAt(0).toUpperCase()+g.slice(1))+'</button>';}).join("")+'</div><strong>'+UI.money(total)+'</strong></section>'+
        '<section class="task-grid">'+(shown.length?shown.map(function(t){return '<article class="task-card surface-card '+(t.status==="done"?"done":"")+'"><button class="check-button" data-action="toggle-task" data-id="'+t.id+'" data-status="'+(t.status==="done"?"open":"done")+'">'+(t.status==="done"?"✓":"")+'</button><div class="task-content"><div><span class="task-type">'+(t.task_type==="bills"?"Bills & Debts":t.task_type)+'</span><h3>'+UI.escape(t.title)+'</h3><p>'+UI.escape(t.notes||"")+'</p></div><div class="task-meta"><span>'+(t.due_date?"Due "+UI.date(t.due_date):"No due date")+'</span><strong>'+ (t.amount?UI.money(t.amount):"No amount")+'</strong></div></div><button class="icon-button danger-icon" data-action="delete-task" data-id="'+t.id+'">×</button></article>';}).join(""):UI.empty("Nothing on this list","Add a purchase, bill, school item or anything else your money needs to handle.","new-task","Add task"))+'</section>';
    }
    return {render};
})();