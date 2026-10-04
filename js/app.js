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
    function field(name,label,type,placeholder,extra){return '<label class="field"><span>'+label+'</span><input name="'+name+'" type="'+(type||"text")+'" placeholder="'+(placeholder||"")+'" '+(extra||"")+ '></label>';}function choiceGroup(name, options, selected, multiple, note) {
        const values=multiple?(selected||[]):[selected||options[0]?.value];
        return '<fieldset class="choice-group '+(multiple?"choice-group-multi":"")+'"><legend>'+options.label+'</legend>'+(note?'<p class="choice-note">'+note+'</p>':"")+'<div class="choice-options">'+options.items.map(function(item){const checked=values.includes(item.value);return '<label class="choice-option"><input type="'+(multiple?"checkbox":"radio")+'" name="'+name+'" value="'+item.value+'" '+(checked?"checked":"")+'><span class="choice-mark"></span><span class="choice-copy"><strong>'+item.label+'</strong>'+(item.note?'<small>'+item.note+'</small>':"")+'</span></label>';}).join("")+'</div></fieldset>';
    }
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
        requestAnimationFrame(function(){const activePage=pages[activeRoute];if(activePage.createCharts)activePage.createCharts(context(),activeCharts);select("#view").classList.add("view-ready");});
    }
    async function reload(message){loading=true;renderPrivate();try{workspace=await Data.all();if(message)UI.toast(message);}catch(e){console.error(e);UI.toast("Could not load your PocketWise data.","error");}finally{loading=false;renderPrivate();}}
    function openTransaction(type,transaction){
        const income=type==="income", categories=income?incomeSources:expenseCategories;
        const items=categories.map(function(x){return {value:x,label:x};});
        const selected=transaction&&transaction.category||items[0].value;
        const title=transaction?"Edit money entry":(income?"Money just came in":"Add spending");
        const description=income?"Record money that has become available.":"Keep a simple record of what you spent.";
        UI.modal(title,'<form id="transaction-form" data-id="'+(transaction?transaction.id:"")+'"><input type="hidden" name="type" value="'+(transaction?transaction.type:type)+'"><div class="modal-intro"><span class="modal-intro-icon">'+(income?"↗":"↘")+'</span><div><strong>'+title+'</strong><small>'+description+'</small></div></div><div class="form-grid">'+field("amount","Amount (₦)","number","0",'min="1" value="'+(transaction?transaction.amount:"")+'" required')+field("date","Date","date","",'value="'+(transaction?transaction.date:new Date().toISOString().slice(0,10))+'" required')+field("description",income?"What is it?":"What did you spend on?","text",income?"e.g. Allowance":"e.g. Lunch",'value="'+UI.escape(transaction?transaction.description:"")+'" required maxlength="80"')+'</div>'+choiceGroup("category",{label:income?"Where did it come from?":"What was it for?",items:items},selected,false,"Choose one so PocketWise can organize your money.")+'<p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">'+(transaction?"Save changes":"Save entry")+'</button></div></form>','Money');
    }
    function openPlan(plan){
        const start=plan?plan.start_date:new Date().toISOString().slice(0,10), end=plan?plan.end_date:new Date(Date.now()+14*86400000).toISOString().slice(0,10);
        const allocations=plan?workspace.allocations.filter(function(a){return a.plan_id===plan.id;}):[];
        const names=["Food","Transport","Data & Airtime","School","Savings","Flexible"];
        UI.modal(plan?"Edit money plan":"Create a money plan",'<form id="plan-form" data-id="'+(plan?plan.id:"")+'">'+field("name","Plan name","text","e.g. October plan",'value="'+(plan?UI.escape(plan.name):"Current plan")+'" required')+'<div class="form-grid">'+field("amount","Money available (₦)","number","0",'value="'+(plan?plan.total_amount:"")+'" min="0" required')+field("start","Starts","date","",'value="'+start+'" required')+field("end","Ends","date","",'value="'+end+'" required')+'</div><p class="form-hint">Divide the amount below. Leave anything unused as unassigned.</p><div class="allocation-editor">'+names.map(function(n){const a=allocations.find(function(x){return x.name===n;});return '<label class="allocation-input"><span>'+n+'</span><input name="alloc_'+n.replace(/[^a-z]/gi,"_").toLowerCase()+'" type="number" min="0" value="'+(a?a.planned_amount:0)+'"><input name="protect_'+n.replace(/[^a-z]/gi,"_").toLowerCase()+'" type="checkbox" '+(a&&a.protected?"checked":"")+'> <small>protect</small></label>';}).join("")+'</div><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">Save plan</button></div></form>','Plan');
    }
    function openGoal(goal){
        const modes={label:"How do you want to build this goal?",items:[
            {value:"manual",label:"I’ll decide each time",note:"Choose an amount whenever money comes in"},
            {value:"fixed",label:"Set a fixed amount",note:"Automatically suggest the same amount each time"},
            {value:"percentage",label:"Set a percentage",note:"Suggest a percentage of every money-in entry"}
        ]};
        const selected=goal&&goal.contribution_mode||"manual";
        UI.modal(goal?"Edit savings goal":"Create a savings goal",'<form id="goal-form" data-id="'+(goal?goal.id:"")+'"><div class="modal-intro"><span class="modal-intro-icon">◇</span><div><strong>'+(goal?"Keep the goal moving":"Give your money somewhere to go")+'</strong><small>Set the target, choose a date and decide how you want to contribute.</small></div></div><div class="form-grid">'+field("name","What are you saving for?","text","e.g. Laptop",'value="'+(goal?UI.escape(goal.name):"")+'" required')+field("target","Target amount (₦)","number","450000",'value="'+(goal?goal.target_amount:"")+'" min="1" required')+field("current","Already saved (₦)","number","0",'value="'+(goal?goal.current_amount:0)+'" min="0" required')+field("date","Target date","date","",'value="'+(goal?goal.target_date:"")+'" required')+'</div>'+choiceGroup("mode",modes,selected,false)+field("contribution","Contribution value","number",selected==="percentage"?"e.g. 10":"e.g. 5000",'value="'+(goal?goal.contribution_value:0)+'" min="0"')+'<label class="field"><span>Notes <small>Optional</small></span><textarea name="description" maxlength="140" placeholder="Why does this goal matter?">'+(goal?UI.escape(goal.description||""):"")+'</textarea></label><p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">'+(goal?"Save changes":"Create goal")+'</button></div></form>','Goals');
    }
    function openTask(task){
        const types={label:"What kind of list item is this?",items:[
            {value:"shopping",label:"Shopping",note:"Groceries, clothes, market items"},
            {value:"school",label:"School",note:"Books, handouts, uniforms, fees"},
            {value:"bills",label:"Bills & debts",note:"Payments you need to clear"},
            {value:"household",label:"Household",note:"Family and home expenses"},
            {value:"personal",label:"Personal",note:"Something for yourself"},
            {value:"business",label:"Business",note:"Work or business purchases"},
            {value:"custom",label:"Custom",note:"Anything else"}
        ]};
        const priorities={label:"Priority",items:[{value:"normal",label:"Normal"},{value:"high",label:"Important"},{value:"low",label:"Later"}]};
        const currentType=task&&task.task_type||"shopping", currentPriority=task&&task.priority||"normal";
        UI.modal(task?"Edit list item":"Add to a list",'<form id="task-form" data-id="'+(task?task.id:"")+'">'+
        '<div class="modal-intro"><span class="modal-intro-icon">☑</span><div><strong>'+ (task?"Update this item":"Build a useful list") +'</strong><small>Lists are for anything your money needs to buy, pay or handle.</small></div></div>'+
        '<div class="form-grid">'+field("list_name","List name","text","e.g. October essentials",'value="'+(task?UI.escape(task.list_name||"My list"):"My list")+'" required')+field("title","Item","text","e.g. CSC handout",'value="'+(task?UI.escape(task.title):"")+'" required maxlength="100"')+field("amount","Expected amount (₦)","number","0",'value="'+(task?task.amount:0)+'" min="0"')+field("due","Due date","date","",'value="'+(task&&task.due_date?task.due_date:"")+'"')+'</div>'+
        choiceGroup("task_type",types,currentType,false)+choiceGroup("priority",priorities,currentPriority,false)+
        '<label class="field"><span>Notes <small>Optional</small></span><textarea name="notes" maxlength="180" placeholder="Add a useful detail">'+(task?UI.escape(task.notes||""):"")+'</textarea></label>'+
        '<p class="form-error"></p><div class="modal-actions"><button type="button" class="button ghost" data-action="close-modal">Cancel</button><button class="button primary">'+(task?"Save changes":"Add to list")+'</button></div></form>','Lists');
    }
    function openTool(tool){
        const titles={calculator:"Calculator","split-bill":"Split Bill","savings-calc":"Savings Calculator","daily-spend":"Daily Spending","percentage":"Percentage","discount":"Discount","goal-calc":"Goal Calculator","debt-calc":"Debt Calculator","afford":"Can I Afford This?"};
        let body="";
        if(tool==="calculator") body=field("a","Calculation","text","e.g. 12500 / 5",'id="tool-a"')+'<p class="tool-result" id="tool-result">Enter an expression.</p>';
        else if(tool==="split-bill") body=field("a","Total amount (₦)","number","0",'id="tool-a"')+field("b","Number of people","number","2",'id="tool-b"')+field("c","Extra tip/charge (%)","number","0",'id="tool-c"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="savings-calc"||tool==="goal-calc") body=field("a","Target amount (₦)","number","450000",'id="tool-a"')+field("b","Already saved (₦)","number","0",'id="tool-b"')+field("c","Months","number","6",'id="tool-c"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="daily-spend") body=field("a","Available money (₦)","number","100000",'id="tool-a"')+field("b","Days remaining","number","14",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="percentage") body=field("a","Amount","number","50000",'id="tool-a"')+field("b","Percentage","number","10",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="discount") body=field("a","Original price (₦)","number","50000",'id="tool-a"')+field("b","Discount (%)","number","10",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else if(tool==="debt-calc") body=field("a","Debt amount (₦)","number","100000",'id="tool-a"')+field("b","Monthly payment (₦)","number","20000",'id="tool-b"')+'<p class="tool-result" id="tool-result"></p>';
        else body=field("a","Purchase amount (₦)","number","8000",'id="tool-a"')+'<p class="tool-result" id="tool-result"></p>';
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
        if(a==="share-tasks"){const rows=workspace.tasks.filter(function(x){return x.status==="open";});const text="PocketWise list\\n\\n"+rows.map(function(x){return "☐ "+x.title+(x.amount?" — "+UI.money(x.amount):"")+(x.due_date?" — due "+UI.date(x.due_date):"");}).join("\\n")+"\\n\\nTotal: "+UI.money(rows.reduce(function(s,x){return s+Number(x.amount||0);},0));if(navigator.share){navigator.share({title:"PocketWise list",text:text}).catch(function(){});}else{navigator.clipboard?.writeText(text).then(function(){UI.toast("List copied to clipboard.");});}}
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
            if(form.id==="plan-form"){const amount=Number(fd.get("amount"));const start=fd.get("start"),end=fd.get("end");if(end<start)throw new Error("End date must be after the start date.");const names=["Food","Transport","Data & Airtime","School","Savings","Flexible"];const allocations=names.map(function(n){const key="alloc_"+n.replace(/[^a-z]/gi,"_").toLowerCase();return {name:n,planned_amount:Number(fd.get(key)||0),protected:fd.get("protect_"+n.replace(/[^a-z]/gi,"_").toLowerCase())==="on"};}).filter(function(x){return x.planned_amount>0;});if(allocations.reduce(function(s,x){return s+x.planned_amount;},0)>amount)throw new Error("Your allocations cannot be greater than the plan amount.");const plan=await Data.savePlan({user_id:session.user.id,name:fd.get("name").trim(),plan_type:"custom",start_date:start,end_date:end,total_amount:amount,status:"active"},form.dataset.id||null);await Data.replaceAllocations(session.user.id,plan.id,allocations);UI.close();await reload("Plan saved.");}
            if(form.id==="goal-form"){const target=Number(fd.get("target")),current=Number(fd.get("current"));if(current>target)throw new Error("Already saved cannot exceed the target.");await Data.saveGoal({user_id:session.user.id,name:fd.get("name").trim(),target_amount:target,current_amount:current,target_date:fd.get("date"),description:fd.get("description").trim(),contribution_mode:fd.get("mode"),contribution_value:Number(fd.get("contribution")||0)},form.dataset.id||null);UI.close();await reload("Goal saved.");}
            if(form.id==="saving-form"){const g=workspace.goals.find(function(x){return x.id===form.dataset.id;}),amount=Number(fd.get("amount"));if(!g||amount<=0||amount>g.target_amount-g.current_amount)throw new Error("Enter an amount within the goal balance.");await Data.saveGoal({current_amount:Number(g.current_amount)+amount},g.id);UI.close();await reload("Savings added.");}
            if(form.id==="task-form"){await Data.saveTask({user_id:session.user.id,list_name:fd.get("list_name").trim(),title:fd.get("title").trim(),amount:Number(fd.get("amount")||0),due_date:fd.get("due")||null,task_type:fd.get("task_type"),priority:fd.get("priority"),notes:fd.get("notes").trim()},form.dataset.id||null);UI.close();await reload("Task saved.");}
            if(form.id==="tool-form"){calculateTool(form);return;}
            if(form.id==="profile-form"){await Data.updateProfile(session.user.id,{full_name:fd.get("fullName").trim(),persona:fd.get("persona")});profile.full_name=fd.get("fullName").trim();profile.persona=fd.get("persona");renderPrivate();UI.toast("Profile updated.");}
            if(form.id==="onboarding-form"){await Data.updateProfile(session.user.id,{persona:fd.get("persona"),money_frequency:fd.get("frequency"),focus_areas:fd.getAll("focus"),onboarding_complete:true});profile=await Data.profile(session.user);UI.close();renderPrivate();UI.toast("PocketWise is ready for you.");}
        }catch(e){console.error(e);if(err)err.textContent=e.message||"Something went wrong.";else UI.toast(e.message||"Something went wrong.","error");}
    }
    function openOnboarding(){
        const first=profile&&profile.full_name?profile.full_name.split(" ")[0]:"there";
        const persona={label:"What best describes you?",items:[
            {value:"student",label:"Student",note:"Allowance, school costs and everyday spending"},
            {value:"salary",label:"Salary earner",note:"Regular pay, bills and personal spending"},
            {value:"freelance",label:"Freelancer",note:"Income that can change from job to job"},
            {value:"business",label:"Business owner",note:"Business money and personal commitments"},
            {value:"parent",label:"Parent / household",note:"Family costs, bills and shared priorities"},
            {value:"other",label:"Something else",note:"A little bit of everything"}
        ]};
        const frequency={label:"When does money usually come in?",items:[
            {value:"irregular",label:"It varies",note:"No fixed pattern"},
            {value:"daily",label:"Daily",note:"Money comes in most days"},
            {value:"weekly",label:"Weekly",note:"About once a week"},
            {value:"biweekly",label:"Every 2 weeks",note:"Biweekly"},
            {value:"monthly",label:"Monthly",note:"Salary or regular monthly money"},
            {value:"multiple",label:"Multiple sources",note:"Different sources at different times"}
        ]};
        const focus={label:"What should PocketWise help you with?",items:[
            {value:"spending",label:"Track spending",note:"Know where money goes"},
            {value:"lasting",label:"Make money last",note:"Plan what you can spend"},
            {value:"saving",label:"Save for goals",note:"Build toward something specific"},
            {value:"bills",label:"Stay on top of bills",note:"Remember upcoming payments"},
            {value:"household",label:"Manage household money",note:"Groceries, school and family costs"}
        ]};
        const selectedPersona=profile&&profile.persona||"student";
        const selectedFrequency=profile&&profile.money_frequency||"irregular";
        const selectedFocus=profile&&profile.focus_areas&&profile.focus_areas.length?profile.focus_areas:["spending"];
        UI.modal("Welcome to PocketWise",
            '<form id="onboarding-form" class="onboarding-form">'+
            '<div class="onboarding-hero"><div class="onboarding-icon">P</div><div><p class="eyebrow">Your workspace, your way</p><h2>Let’s make this feel like yours, '+UI.escape(first)+'.</h2><p>Tell us a little about how money reaches you and what you want PocketWise to help with. There are no wrong answers.</p></div></div>'+
            '<div class="onboarding-section"><div class="onboarding-section-head"><span>01</span><div><strong>Your situation</strong><small>We’ll use this to prioritize your workspace.</small></div></div>'+choiceGroup("persona",persona,selectedPersona,false)+'</div>'+
            '<div class="onboarding-section"><div class="onboarding-section-head"><span>02</span><div><strong>Your money rhythm</strong><small>Money does not have to arrive on a monthly schedule.</small></div></div>'+choiceGroup("frequency",frequency,selectedFrequency,false)+'</div>'+
            '<div class="onboarding-section"><div class="onboarding-section-head"><span>03</span><div><strong>Your priorities</strong><small>Pick everything that matters to you right now.</small></div></div>'+choiceGroup("focus",focus,selectedFocus,true)+'</div>'+
            '<p class="form-error"></p><div class="modal-actions onboarding-actions"><span class="onboarding-footnote">You can change these later in Settings.</span><button class="button primary">Build my workspace <span>→</span></button></div></form>',
            "Getting started");
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
