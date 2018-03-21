function Func( func, variablesNamesArray ) {

	this._func                  = func;
	this._variablesNamesArray   = variablesNamesArray;
	this.isFuncValid            = false;

	this._funcValidate = function () {
        //TODO
		this.isFuncValid = true;
		return true;
	};

	this._isFuncCanProcess = function (valuesVariablesArray) {
        this._funcValidate();

        return this.isFuncValid && valuesVariablesArray.length == this._variablesNamesArray.length;
	};

	this.getValueFunc = function ( valuesVariablesArray ) {
        var temp = this._func;

	    if (!this._isFuncCanProcess) {
            return;
        }

        for (var i = 0; i < valuesVariablesArray.length; i++) {
            temp = temp.replace(this._variablesNamesArray[i], valuesVariablesArray[i])
        }

        return eval(temp);
	};

}
