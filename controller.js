var controller = (function () {
    var companies = [];
    var companyDivs = [];
    
    function handleLoad() {
        companies = getCompaniesCookie();
        generateDivs();
        drawing.drawGraphs();
    }
    
    function addCompanyWithInfo(market, symbol, amount, color) {
        companies.push({market: market, symbol: symbol,
                        amount: amount, color: color});
        setCompaniesCookie(companies);
    }

    function removeCompanyWithInfo(market, symbol) {
        for (var i = 0; i < companies.length; i++) {
            if (companies[i].market == market) {
                if (companies[i].symbol == symbol) {
                    companies.splice(i, 1);
                    setCompaniesCookie(companies);
                    return true;
                }
            }
        }
        return false;
    }

    function generateDivs() {
        $('#companies').html('');
        for (var i = 0; i < companies.length; i++) {
            // add a DIV here
            var aDiv = generateDiv(companies[i]);
            $('#companies').append(aDiv);
        }
    }
    
    function generateDiv(company) {
        var aDiv = $('<div></div>');
        aDiv.text(company.amount + ' shares of ' + 
                  company.market + ':' + company.symbol +
                  ' (' + company.color + ')');
        var removeButton = $('<button />', {text: 'Remove'});
        removeButton.click(function() {
            removeCompanyPressed(company.market, company.symbol);
        });
        aDiv.append(removeButton);
        return aDiv;
    }

    function addCompanyPressed() {
        var market = $('#add-market').val();
        var symbol = $('#add-symbol').val();
        var amount = parseFloat($('#add-amount').val());
        var color = $('#add-color').val();
        if (!amount && amount != 0) {
            return alert('Invalid `amount` input');
        }
        removeCompanyWithInfo(market, symbol);
        addCompanyWithInfo(market, symbol, amount, color);
        generateDivs();
        drawing.drawGraphs();
    }

    function removeCompanyPressed(market, symbol) {
        if (removeCompanyWithInfo(market, symbol)) {
            drawing.drawGraphs();
            generateDivs();
        }
    }
    
    return {
        handleLoad: handleLoad,
        addCompanyPressed: addCompanyPressed,
        removeCompanyPressed: removeCompanyPressed,
        getCompanies: function() { return companies; }
    };
    
})();

$(controller.handleLoad);
