function StockCompany(market, symbol) {
    this.market = market;
    this.symbol = symbol;
}

StockCompany.prototype.toJSON = function() {
    return {market: this.market, symbol: this.symbol};
}

StockCompany.prototype.requestInfo = function(callback) {
    var component = encodeURIComponent(this.market + ':' + this.symbol);
    var urlStr = 'http://finance.google.com/finance/info?client=ig&q=' + component;
    $.ajax({url: urlStr,
            success: function(data) {
                callback(null, data);
            },
            error: function(err) {
                if (err.status == 200) return;
                callback(err, null);
            },
            dataType: 'jsonp'});
}

StockCompany.prototype.requestPrice = function(callback) {
    this.requestInfo(function(err, data) {
        if (err) return callback(err);
        try {
            // turn 1,000 into 1000
            var shareFormatted = data[0]['l_cur'];
            var comps = shareFormatted.split(',');
            var share = '';
            for (var i = 0; i < comps.length; i++) {
                share += comps[i];
            }
            share = parseFloat(share);
            if (!share && share != 0) {
                return callback(new Error('Not a number'), null);
            }
        } catch (exc) {
            return callback(exc, null);
        }
        callback(null, share);
    });
}
