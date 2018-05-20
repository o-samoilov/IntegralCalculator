function Func( func, variablesNamesArray ) {

	this._func                  = func;
	this._variablesNamesArray   = variablesNamesArray;

	this._isFuncValid = false;
	this._wasValidate = false;

	this._isReplaceExpression = false;
    this.replaceExpression = function () {
        var expressions = this._replaceExpressions;
        var func = this._func;

        Object.keys(expressions).map(function(objectKey, index) {
            while (func.indexOf(objectKey) != -1) {
                func = func.replace(objectKey, expressions[objectKey]);
            }
        });

        this._func = func;

    };

	this._validExpressions = {
        '(': '(',
        ')': ')',

        ' ': '',
        ',': ',',

        '+': '+',
        '-': '-',
        '*': '*',
        '/': '/',
        'SIN': 'Math.sin',
        'COS': 'Math.cos',
        'TG': 'Math.tan',
        'POW': 'Math.pow',

        '1': '1',
        '2': '2',
        '3': '3',
        '4': '4',
        '5': '5',
        '6': '6',
        '7': '7',
        '8': '8',
        '9': '9',
        '0': '0',
    };

    this._replaceExpressions = {
        'SIN': 'Math.sin',
        'COS': 'Math.cos',
        'TG': 'Math.tan',
        'POW': 'Math.pow',
    };

	this._funcValid = function () {
	    let tempFunc = this._func;

        Object.keys(this._validExpressions).map(function(objectKey, index) {
            while (tempFunc.indexOf(objectKey) != -1) {
                tempFunc = tempFunc.replace(objectKey, '');
            }
        });

        for (var j = 0; j < this._variablesNamesArray.length; j++) {
            while (tempFunc.indexOf(this._variablesNamesArray[j]) != -1) {
                tempFunc = tempFunc.replace(this._variablesNamesArray[j], '');
            }
        }


        if (tempFunc.length > 0) {
	        return false;
        }

        return true;
	};

    this.isFuncValid = function () {

        if (this._wasValidate == false) {
            this._isFuncValid = this._funcValid();
            this._wasValidate = true;
        }

        return this._isFuncValid;
    };
}

Func.prototype.getValueFunc = function ( valuesVariablesArray ) {
    if (!this.isFuncValid()) {
        return false;
    }

    if(!this._isReplaceExpression) {
        this.replaceExpression();
        this._isReplaceExpression = true;
    }

    var temp = this._func;

    for (var i = 0; i < valuesVariablesArray.length; i++) {
        while ( temp.indexOf(this._variablesNamesArray[i]) != -1 ) {
            temp = temp.replace(this._variablesNamesArray[i], valuesVariablesArray[i])
        }
    }

    return eval(temp);
};