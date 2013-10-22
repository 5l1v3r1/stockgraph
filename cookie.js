function setCompaniesCookie(companies) {
    var encoded = encodeURIComponent(JSON.stringify(companies));
    var expiry = new Date();
    expiry.setTime(expiry.getTime() + 1000 * 60 * 60 * 24 * 30);
    document.cookie = 'companies=' + encoded +
        '; expires=' + expiry.toGMTString() + 
        '; path=/';
}

function getCompaniesCookie() {
    try {
        var comps = document.cookie.split('=');
        if (comps[0] != 'companies') return [];
        var valueComps = comps[1].split(';');
        var decoded = decodeURIComponent(valueComps[0]);
        return JSON.parse(decoded);
    } catch (e) {
        return [];
    }
}