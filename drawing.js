drawing = (function() {

    var _fetchIdentifier = 0;

    function drawGraphs() {
        _fetchIdentifier++;
        var companies = controller.getCompanies();
        if (companies.length == 0) {
            return handleCollective([]);
        }
        
        var values = [];
        for (var i = 0; i < companies.length; i++) {
            var company = companies[i];
            fetchCompany(values, company, i, companies.length, _fetchIdentifier);
        }
    }

    function fetchCompany(collective, company, idx, total, identifier) {
        var stock = new StockCompany(company.market, company.symbol);
        stock.requestPrice(function(err, price) {
            if (identifier != _fetchIdentifier) return;
            if (err) {
                console.log(err);
                return alert('Failed to get stock quote.');
            }
            collective.push({color: company.color, price: price, idx: idx});
            if (collective.length == total) {
                handleCollective(collective);
            }
        })
    }
    
    function sortedCollective(collective) {
        var newCol = [];
        for (var i = 0; i < collective.length; i++) {
            newCol[collective[i].idx] = collective[i];
        }
        return newCol;
    }

    function handleCollective(_collective) {
        var collective = sortedCollective(_collective);
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var width = canvas.width;
        var height = canvas.height;
        
        // calculate the total money
        var totalMoney = 0;
        for (var i = 0; i < collective.length; i++) {
            totalMoney += collective[i].price;
        }
        
        // draw background
        ctx.fillStyle = '#DDD';
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2, false);
        ctx.closePath();
        ctx.fill();
        
        // draw each segment
        var lastAngle = 0;
        for (var i = 0; i < collective.length; i++) {
            var angle = (collective[i].price / totalMoney) * 2 * Math.PI;
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, width / 2,
                        lastAngle, lastAngle + angle, false);
            lastAngle += angle;
            ctx.closePath();
            ctx.fillStyle = collective[i].color;
            ctx.fill();
        }
    }
    
    return {
        drawGraphs: drawGraphs
    }
})();