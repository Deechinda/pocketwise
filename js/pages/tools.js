const ToolsPage = (() => {
    const tools=[
        ["calculator","Calculator","Basic calculations"],
        ["split-bill","Split Bill","Share a cost"],
        ["savings-calc","Savings Calculator","Plan a target"],
        ["daily-spend","Daily Spending","Find your daily room"],
        ["percentage","Percentage","Find percentages"],
        ["discount","Discount","Calculate sale prices"],
        ["goal-calc","Goal Calculator","Reach a target"],
        ["debt-calc","Debt Calculator","Plan repayment"],
        ["afford","Can I Afford This?","See the impact"],
    ];
    function render(context){
        return context.pageHeader("Tools","Quick calculations for everyday money decisions.")+'<section class="tools-grid">'+tools.map(function(t){return '<button class="tool-card surface-card" data-action="open-tool" data-tool="'+t[0]+'"><span class="tool-icon">✦</span><strong>'+t[1]+'</strong><small>'+t[2]+'</small></button>';}).join("")+'</section><section class="tool-note"><span>◎</span><div><strong>Built for quick decisions.</strong><p>Use a calculator before you commit money to a purchase, bill, goal or shared expense.</p></div></section>';
    }
    return {render};
})();