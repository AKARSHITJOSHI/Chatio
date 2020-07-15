var istring = (str) => {
    return typeof str === 'string' && str.trim().length > 0;
};

module.exports = { istring }
    /*
    trim removes whitespaces on either ends of string
    */