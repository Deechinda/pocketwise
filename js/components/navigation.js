const Navigation = (() => {
    const icons={dashboard:"⌂",money:"◉",plan:"▣",goals:"◇",tasks:"☑",tools:"✦",insights:"▥",settings:"⚙"};
    function render(routes,active){
        document.querySelector("#desktop-nav").innerHTML=routes.map(function(x){return '<a href="#'+x[0]+'" data-route="'+x[0]+'" class="nav-item '+(active===x[0]?"active":"")+'"><span>'+icons[x[0]]+'</span><span>'+x[1]+'</span></a>';}).join("");
        const mobileRoutes=[["dashboard","Home"],["money","Money"],["plan","Plan"],["goals","Goals"],["tasks","Tasks"]];
        document.querySelector("#mobile-nav").innerHTML=mobileRoutes.map(function(x){return '<a href="#'+x[0]+'" class="'+(active===x[0]?"active":"")+'"><span>'+icons[x[0]]+'</span><small>'+x[1]+'</small></a>';}).join("")+'<a href="#tools"><span>'+icons.tools+'</span><small>More</small></a>';
    }
    return {render};
})();