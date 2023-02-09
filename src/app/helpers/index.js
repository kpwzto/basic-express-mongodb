// String length default: 8
// String case default: 1
// 1: String To Lower
// 2: String To Upper
// 3: Both of case
exports.makeRandomId = function(length = 8, stringCase = 1) {
    var id           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    switch(stringCase){
        case 1:
            id = id.toLowerCase();
            break;
        case 2:
            id = id.toUpperCase();
            break;
    }
    return id;
}
