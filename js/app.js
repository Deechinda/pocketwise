const App = (() => {
    const expenseCategories=["Food","Transport","Education","Data & Airtime","Entertainment","Shopping","Health","Household","Personal","Other"];
    const incomeSources=["Salary","Allowance","Family support","Side hustle","Business","Gift","Refund","Other"];
    const routes=[["dashboard","Home"],["money","Money"],["plan","Plan"],["goals","Goals"],["tasks","Tasks"],["tools","Tools"],["insights","Insights"],["settings","Settings"]];
    const pages={dashboard:DashboardPage,money:TransactionsPage,plan:BudgetPage,goals:SavingsPage,tasks:TasksPage,tools:ToolsPage,insights:AnalyticsPage,settings:SettingsPage};
    let session=null, profile=null, workspace={transactions:[],budget:null,goals:[],plans:[],allocations:[],tasks:[]};
    let activeRoute="dashboard", activeCharts=[], loading=false, filters={query:"",type:"all",month:""}, taskFilter="all";

    function select(s){return document.querySelector(s);}
    function currentMonth(){return new Date().toISOString().slice(0,7);}
    function totals(){return workspace.transactions.reduce(function(a,x){a[x.type]+=Number(x.amount);return a;},{income:0,expense:0});}
    function monthly(){return workspace.transactions.filter(function(x){return x.type==="expense"&&x.date.startsWith(currentMonth());});}
    function percentage(v,t){return t?Math.round(Number(v)/Number(t)*100):0;}
    function categoryTotals(rows){return rows.reduce(function(a,x){if(x.type==="expense")a[x.category]=(a[x.category]||0)+Number(x.amount);return a;},{});}
    function field(name,label,type,placeholder,extra){return '<label class="field"><span>'+label+'</span><input name="'+name+'" type="'+(type||"text")+'" placeholder="'+(placeholder||"")+'" '+(extra||"")+ '></label>';}
    function pageHeader(title,subtitle,actions){return '<header class="page-head"><div><p class="eyebrow">PocketWise</p><h1>'+title+'</h1><p>'+subtitle+'</p></div><div class="page-actions">'+(actions||"")+'</div></header>';}
    function context(){return {data:workspace,session:session,profile:profile,filters:filters,taskFilter:taskFilter,loading:loading,pageHeader:pageHeader,field:field,totals:totals,monthly:monthly,percentage:percentage,categoryTotals:categoryTotals};}

    function applyTheme(theme){theme=theme||localStorage.getItem("pocketwise_theme")||"light";document.documentElement.dataset.theme=theme;localStorage.setItem("pocketwise_theme",theme);document.querySelectorAll("[data-theme-icon]").forEach(function(x){x.textContent=theme==="dark"?"☀":"☾";});document.querySelectorAll("[data-theme-label]").forEach(function(x){x.textContent=theme==="dark"?"Light mode":"Dark mode";});}
    function userInitials(){return (profile&&profile.full_name?profile.full_name:session&&session.user&&session.user.email||"PW").split(/[ @]/).filter(Boolean).slice(0,2).map(function(x){return x[0];}).join("").toUpperCase();}
    function renderPublic(){select("#private-root").hidden=true;select("#public-root").hidden=false;const r=location.hash.slice(1);select("#public-root").innerHTML=["login","signup","forgot","reset-password"].includes(r)?PublicViews.authentication(r):PublicViews.landing();HeroMotion.start();}
    function renderPrivate(){
        if(!session){renderPublic();return;}
        const requested=location.hash.slice(1);activeRoute=routes.some(function(x){return x[0]===requested;})?requested:"dashboard";
        select("#public-root").hidden=true;select("#private-root").hidden=false;select(".avatar").textContent=userInitials();
        select("#today-label").textContent=new Date().toLocaleDateString("en-NG",{weekday:"short",day:"numeric",month:"short"});
        Navigation.render(routes,activeRoute);
        activeCharts.forEach(function(c){c.destroy();});activeCharts=[];
        select("#view").innerHTML=loading?'<div class="loading-view"><span></span><span></span><span></span></div>':pages[activeRoute].render(context());
        requestAnimationFrame(function(){if(AnalyticsPage.createCharts)AnalyticsPage.createCharts(context(),activeCharts);select("#view").classList.add("view-ready");});
    }
    async function reload(message){loading=true;renderPrivate();try{workspace=await Data.all();if(message)UI.toast(message);}catch(e){console.error(e);UI.toast("Could not load your PocketWise data.","error");}finally{loading=false;renderPrivate();}}
    function openTransaction(type,transaction){
        const income=type==="income", categories=income?incomeSources:expenseCategories;
        const opts=categories.map(function(c){return '<option '+(transaction&&transaction.category===c?"selected":"")+'>'+c+'</option>';}).join("");
        UI.modal(transaction?"Edit money entry":(income?"Money just came in":"Add spending"),'<form id="transaction-form" data-id="'+(transaction?transaction.id:"")+'"><input type="hidden" name="type" value="'+(transaction?transaction.type:type)+'"><div class="form-grid">'+field("amount","Amount (₦)","number","0",'min="1" value="'+(transaction?transaction.amount:"")+'" required')+field("date","Date","date","",'value="'+(transaction?transaction.date:new Date().toISOString().slice(0,10))+'" required')+field("description",income?"What is it?":"What did you spend on?","text",income?"e.g. Allowance":"e.g. Lunch",'value="'+UI.escape(transaction?transaction.description:"")+'" required maxlength="80"')+'<label class="field"><span>'+(income?"Source":"Category")+'</span><select name="category" required>'+opts+'</select></label></div><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Save</button></div></form>','Money');
    }
    function openPlan(plan){
        const start=plan?plan.start_date:new Date().toISOString().slice(0,10), end=plan?plan.end_date:new Date(Date.now()+14*86400000).toISOString().slice(0,10);
        const allocations=plan?workspace.allocations.filter(function(a){return a.plan_id===plan.id;}):[];
        const names=["Food","Transport","Data & Airtime","School","Savings","Flexible"];
        UI.modal(plan?"Edit money plan":"Create a money plan",'<form id="plan-form" data-id="'+(plan?plan.id:"")+'">'+field("name","Plan name","text","e.g. October plan",'value="'+(plan?UI.escape(plan.name):"Current plan")+'" required')+'<div class="form-grid">'+field("amount","Money available (₦)","number","0",'value="'+(plan?plan.total_amount:"")+'" min="0" required')+field("start","Starts","date","",'value="'+start+'" required')+field("end","Ends","date","",'value="'+end+'" required')+'</div><p class="form-hint">Divide the amount below. Leave anything unused as unassigned.</p><div class="allocation-editor">'+names.map(function(n){const a=allocations.find(function(x){return x.name===n;});return '<label class="allocation-input"><span>'+n+'</span><input name="alloc_'+n.replace(/[^a-z]/gi,"_").toLowerCase()+'" type="number" min="0" value="'+(a?a.planned_amount:0)+'"><input name="protect_'+n.replace(/[^a-z]/gi,"_").toLowerCase()+'" type="checkbox" '+(a&&a.protected?"checked":"")+'> <small>protect</small></label>';}).join("")+'</div><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Save plan</button></div></form>','Plan');
    }
    function openGoal(goal){
        UI.modal(goal?"Edit goal":"Create savings goal",'<form id="goal-form" data-id="'+(goal?goal.id:"")+'"><div class="form-grid">'+field("name","Goal","text","e.g. Laptop",'value="'+(goal?UI.escape(goal.name):"")+'" required')+field("target","Target amount (₦)","number","0",'value="'+(goal?goal.target_amount:"")+'" min="1" required')+field("current","Already saved (₦)","number","0",'value="'+(goal?goal.current_amount:0)+'" min="0" required')+field("date","Target date","date","",'value="'+(goal?goal.target_date:"")+'" required')+'</div><label class="field"><span>How should you contribute?</span><select name="mode"><option value="manual">I’ll decide each time</option><option value="fixed">Fixed amount when money comes in</option><option value="percentage">Percentage when money comes in</option></select></label><label class="field"><span>Contribution value (optional)</span><input name="contribution" type="number" min="0" value="'+(goal?goal.contribution_value:0)+'" placeholder="e.g. 5000 or 10"></label><label class="field"><span>Notes</span><textarea name="description" maxlength="140">'+(goal?UI.escape(goal.description||""):"")+'</textarea></label><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Save goal</button></div></form>','Goal');
    }
    function openTask(task){
        UI.modal(task?"Edit money task":"New money task",'<form id="task-form" data-id="'+(task?task.id:"")+'">'+field("title","What needs to happen?","text","e.g. Buy CSC handout",'value="'+(task?UI.escape(task.title):"")+'" required maxlength="100"')+'<div class="form-grid">'+field("amount","Amount (₦)","number","0",'value="'+(task?task.amount:0)+'" min="0"')+field("due","Due date","date","",'value="'+(task&&task.due_date?task.due_date:"")+'"')+'</div><div class="form-grid"><label class="field"><span>Type</span><select name="task_type"><option value="shopping">Shopping</option><option value="school">School</option><option value="bills">Bills & Debts</option><option value="household">Household</option><option value="personal">Personal</option><option value="business">Business</option><option value="custom">Custom</option></select></label><label class="field"><span>Priority</span><select name="priority"><option value="normal">Normal</option><option value="high">High</option><option value="low">Low</option></select></label></div><label class="field"><span>Notes</span><textarea name="notes" maxlength="180">'+(task?UI.escape(task.notes||""):"")+'</textarea></label><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Save task</button></div></form>','Tasks');
    }
    function openTool(tool){
        const titles={calculator:"Calculator","split-bill":"Split Bill","savings-calc":"Savings Calculator","daily-spend":"Daily Spending","percentage:"Percentage","discount":"Discount","goal-calc":"Goal Calculator","debt-calc":"Debt Calculator","afford":"Can I Afford This?"};
        let body="";
        if(tool==="calculator") body=field("a","Calculation","text","e.g. 12500 / 5",'id="tool-a"')+'<p class="tool-result" id="tool-result">Enter an expression.</p>';
        else if(tool==="split-bill") body=field("a","Total amount (₦)","number","0",'id="tool-a"')+field("b","Number of people","number","2",'id="tool-b"')+field("c","Extra tip/charge (%)","number","0",'id="tool-c"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="savings-calc"||tool==="goal-calc") body=field("a","Target amount (₦)","number","450000",'id="tool-a"')+field("b","Already saved (₦)","number","0",'id="tool-b"')+field("c","Months","number","6",'id="tool-c"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="daily-spend") body=field("a","Available money (₦)","number","100000",'id="tool-a"')+field("b","Days remaining","number","14",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="percentage") body=field("a","Amount","number","50000",'id="tool-a"')+field("b","Percentage","number","10",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="discount") body=field("a","Original price (₦)","number","50000",'id="tool-a"')+field("b","Discount (%)","number","10",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="debt-calc") body=field("a","Debt amount (₦)","number","100000",'id="tool-a"')+field("b","Monthly payment (₦)","number","20000",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else body=field("a","Purchase amount (₦)","number","8000",'id="tool-a")+'<p class="tool-result" id="tool-result"></p>';
        UI.modal(titles[tool]||"Tool",'<form id="tool-form" data-tool="'+tool+'">'+body+'<div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Close</button><button class="button primary">Calculate</button></div></form>','Tools');
    }
    function calculateTool(form){
        const tool=form.dataset.tool, a=Number(form.querySelector("#tool-a")?.value||0), b=Number(form.querySelector("#tool-b")?.value||0), c=Number(form.querySelector("#tool-c")?.value||0);
        let result=0,text="";
        if(tool==="calculator"){try{if(!/^[0-9+\-*/().%\s]+$/.test(form.querySelector("#tool-a").value))throw new Error();result=Function("return "+form.querySelector("#tool-a").value)();text=UI.money(result);}catch(e){text="Use numbers and + − × ÷ only.";}}
        if(tool==="split-bill"){result=a*(1+c/100)/Math.max(1,b);text=UI.money(result)+" each";}
        if(tool==="savings-calc"||tool==="goal-calc"){result=Math.max(0,a-b)/Math.max(1,c);text=UI.money(result)+" per month";}
        if(tool==="daily-spend"){result=a/Math.max(1,b);text=UI.money(result)+" per day";}
        if(tool==="percentage"){result=a*b/100;text=UI.money(result);}
        if(tool==="discount"){result=a*(1-b/100);text=UI.money(result)+" final price";}
        if(tool==="debt-calc"){result=b?Math.ceil(a/b):0;text=result+" month"+(result===1?"":"s");}
        if(tool==="afford"){const balance=totals().income-totals().expense;const remaining=balance-a;text="After this purchase: "+UI.money(remaining)+" available.";}
        form.querySelector("#tool-result").textContent=text;
    }
    async function handleClick(event){
        const target=event.target.closest("[data-action],[data-route]");if(!target)return;
        if(target.dataset.route){location.hash=target.dataset.route;return;}
        const a=target.dataset.action,id=target.dataset.id;
        if(a==="toggle-theme"||a==="set-theme"){applyTheme(a==="set-theme"?target.dataset.value:(document.documentElement.dataset.theme==="dark"?"light":"dark"));if(session)renderPrivate();}
        if(a==="profile-menu")select("#profile-menu").hidden=!select("#profile-menu").hidden;
        if(a==="close-modal")UI.close();
        if(a==="add-money")openTransaction("income");
        if(a==="add-spending")openTransaction("expense");
        if(a==="edit-transaction")openTransaction("",workspace.transactions.find(function(x){return x.id===id;}));
        if(a==="delete-transaction"&&confirm("Delete this money entry?")){await Data.deleteTransaction(id);await reload("Entry deleted.");}
        if(a==="create-plan")openPlan();
        if(a==="edit-plan")openPlan(workspace.plans.find(function(x){return x.id===id;}));
        if(a==="add-goal")openGoal();
        if(a==="edit-goal")openGoal(workspace.goals.find(function(x){return x.id===id;}));
        if(a==="delete-goal"&&confirm("Delete this goal?")){await Data.deleteGoal(id);await reload("Goal deleted.");}
        if(a==="add-saving"){const g=workspace.goals.find(function(x){return x.id===id;});UI.modal("Add to "+g.name,'<form id="saving-form" data-id="'+id+'">'+field("amount","Amount (₦)","number","0",'min="1" max="'+(g.target_amount-g.current_amount)+'" required')+'<p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Add money</button></div></form>','Goal');}
        if(a==="new-task")openTask();
        if(a==="edit-task")openTask(workspace.tasks.find(function(x){return x.id===id;}));
        if(a==="delete-task"&&confirm("Delete this task?")){await Data.deleteTask(id);await reload("Task deleted.");}
        if(a==="toggle-task"){await Data.toggleTask(id,target.dataset.status);await reload(target.dataset.status==="done"?"Task completed.":"Task reopened.");}
        if(a==="task-filter"){taskFilter=target.dataset.value;renderPrivate();}
        if(a==="open-tool")openTool(target.dataset.tool);
        if(a==="clear-filters"){filters={query:"",type:"all",month:""};renderPrivate();}
        if(a==="export-data"){const blob=new Blob([JSON.stringify({...workspace,profile,exportedAt:new Date().toISOString()},null,2)],{type:"application/json"});const link=document.createElement("a");link.href=URL.createObjectURL(blob);link.download="pocketwise-data.json";link.click();URL.revokeObjectURL(link.href);}
        if(a==="sign-out")await signOut();
    }
    async function submitForm(event){
        event.preventDefault();const form=event.target, fd=new FormData(form), err=form.querySelector(".form-error");
        try{
            if(form.id==="login-form"){const r=await Auth.signIn(fd.get("email").trim(),fd.get("password"));if(r.error)throw r.error;session=r.data.session;await enterWorkspace();}
            if(form.id==="signup-form"){if(fd.get("password")!==fd.get("confirm"))throw new Error("Passwords do not match.");const r=await Auth.signUp({fullName:fd.get("fullName").trim(),email:fd.get("email").trim(),password:fd.get("password")});if(r.error)throw r.error;if(r.data.session){session=r.data.session;await enterWorkspace();}else form.innerHTML='<div class="auth-success"><span>✓</span><h2>Check your email</h2><p>Confirm your email address, then return to sign in.</p><a class="button primary" href="#login">Go to sign in</a></div>';}
            if(form.id==="forgot-form"){const r=await Auth.reset(fd.get("email").trim());if(r.error)throw r.error;form.innerHTML='<div class="auth-success"><span>✓</span><h2>Check your email</h2><p>If an account exists, a reset link is on its way.</p></div>';}
            if(form.id==="reset-form"){const r=await Auth.updatePassword(fd.get("password"));if(r.error)throw r.error;location.hash="dashboard";}
            if(form.id==="transaction-form"){await Data.saveTransaction({user_id:session.user.id,type:fd.get("type"),amount:Number(fd.get("amount")),description:fd.get("description").trim(),category:fd.get("category"),source:fd.get("type")==="income"?fd.get("category"):null,date:fd.get("date")},form.dataset.id||null);UI.close();await reload("Money entry saved.");}
            if(form.id==="plan-form"){const amount=Number(fd.get("amount"));const start=fd.get("start"),end=fd.get("end");if(end<start)throw new Error("End date must be after the start date.");const plan=await Data.savePlan({user_id:session.user.id,name:fd.get("name").trim(),plan_type:"custom",start_date:start,end_date:end,total_amount:amount,status:"active"},form.dataset.id||null);const names=["Food","Transport","Data & Airtime","School","Savings","Flexible"];const allocations=names.map(function(n){const key="alloc_"+n.replace(/[^a-z]/gi,"_").toLowerCase();return {name:n,planned_amount:Number(fd.get(key)||0),protected:fd.get("protect_"+n.replace(/[^a-z]/gi,"_").toLowerCase())==="on"};}).filter(function(x){return x.planned_amount>0;});if(allocations.reduce(function(s,x){return s+x.planned_amount;},0)>amount)throw new Error("Your allocations cannot be greater than the plan amount.");await Data.replaceAllocations(session.user.id,plan.id,allocations);UI.close();await reload("Plan saved.");}
            if(form.id==="goal-form"){const target=Number(fd.get("target")),current=Number(fd.get("current"));if(current>target)throw new Error("Already saved cannot exceed the target.");await Data.saveGoal({user_id:session.user.id,name:fd.get("name").trim(),target_amount:target,current_amount:current,target_date:fd.get("date"),description:fd.get("description").trim(),contribution_mode:fd.get("mode"),contribution_value:Number(fd.get("contribution")||0)},form.dataset.id||null);UI.close();await reload("Goal saved.");}
            if(form.id==="saving-form"){const g=workspace.goals.find(function(x){return x.id===form.dataset.id;}),amount=Number(fd.get("amount"));if(!g||amount<=0||amount>g.target_amount-g.current_amount)throw new Error("Enter an amount within the goal balance.");await Data.saveGoal({current_amount:Number(g.current_amount)+amount},g.id);UI.close();await reload("Savings added.");}
            if(form.id==="task-form"){await Data.saveTask({user_id:session.user.id,title:fd.get("title").trim(),amount:Number(fd.get("amount")||0),due_date:fd.get("due")||null,task_type:fd.get("task_type"),priority:fd.get("priority"),notes:fd.get("notes").trim()},form.dataset.id||null);UI.close();await reload("Task saved.");}
            if(form.id==="tool-form"){calculateTool(form);return;}
            if(form.id==="profile-form"){await Data.updateProfile(session.user.id,{full_name:fd.get("fullName").trim(),persona:fd.get("persona")});profile.full_name=fd.get("fullName").trim();profile.persona=fd.get("persona");renderPrivate();UI.toast("Profile updated.");}
            if(form.id==="onboarding-form"){await Data.updateProfile(session.user.id,{persona:fd.get("persona"),money_frequency:fd.get("frequency"),focus_areas:fd.getAll("focus"),onboarding_complete:true});profile=await Data.profile(session.user);UI.close();renderPrivate();UI.toast("PocketWise is ready for you.");}
        }catch(e){console.error(e);if(err)err.textContent=e.message||"Something went wrong.";else UI.toast(e.message||"Something went wrong.","error");}
    }
    function openOnboarding(){
        UI.modal("Make PocketWise fit you",'<form id="onboarding-form"><p class="form-hint">A few answers help us prioritize the right tools. You can change them later.</p><label class="field"><span>What describes you?</span><select name="persona"><option value="student">Student</option><option value="salary">Salary earner</option><option value="freelance">Self-employed / freelancer</option><option value="business">Business owner</option><option value="parent">Parent / household</option><option value="other">Other</option></select></label><label class="field"><span>How often does money usually come in?</span><select name="frequency"><option value="irregular">Irregularly</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="biweekly">Every two weeks</option><option value="monthly">Monthly</option><option value="multiple">Multiple sources</option></select></label><div class="check-grid"><label><input type="checkbox" name="focus" value="spending" checked> Manage spending</label><label><input type="checkbox" name="focus" value="lasting"> Make money last</label><label><input type="checkbox" name="focus" value="saving"> Save for goals</label><label><input type="checkbox" name="focus" value="bills"> Plan bills</label><label><input type="checkbox" name="focus" value="household"> Manage household money</label></div><button class="button primary wide-button">Continue</button></form>','Welcome');
    }
    async function signOut(){try{await Auth.signOut();session=null;profile=null;workspace={transactions:[],budget:null,goals:[],plans:[],allocations:[],tasks:[]};location.hash="home";renderPublic();}catch(e){UI.toast("Unable to sign out.","error");}}
    async function enterWorkspace(){location.hash="dashboard";loading=true;renderPrivate();try{profile=await Data.profile(session.user);workspace=await Data.all();}catch(e){console.error(e);UI.toast("Unable to load your workspace.","error");}finally{loading=false;renderPrivate();if(profile&&!profile.onboarding_complete)openOnboarding();}}
    function events(){
        document.addEventListener("click",handleClick);document.addEventListener("submit",submitForm);
        document.addEventListener("input",function(e){if(e.target.id==="search-transactions"){filters.query=e.target.value;renderPrivate();requestAnimationFrame(function(){const x=select("#search-transactions");if(x){x.focus();x.setSelectionRange(filters.query.length,filters.query.length);}});}});
        document.addEventListener("change",function(e){if(e.target.id==="type-filter")filters.type=e.target.value;if(e.target.id==="month-filter")filters.month=e.target.value;if(e.target.matches("#type-filter,#month-filter"))renderPrivate();});
        window.addEventListener("hashchange",function(){session?renderPrivate():renderPublic();});
    }
    async function init(){applyTheme();events();if(!SupabaseConfig.configured){renderPublic();return;}try{session=await Auth.session();Auth.onChange(function(event,next){if(event==="SIGNED_OUT"){session=null;renderPublic();}else if(next&&!session){session=next;enterWorkspace();}});if(session)await enterWorkspace();else renderPublic();}catch(e){console.error(e);renderPublic();}}
    return {init};
})();
document.addEventListener("DOMContentLoaded",App.init);