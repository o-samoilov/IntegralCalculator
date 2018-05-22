// GUI
var gui = new dat.GUI();
var builderFolder = gui.addFolder( "Builder" );
var examplesFolder = gui.addFolder( "Examples" );

var GuiContent = function() {
    this.func = 'POW(x, 3)';
    this.surface = 'SIN(x) * z';
    this.xMax = 5;
    this.xMin = -5;
    this.build = function() {
        calculateIntegral(this.func, this.surface, this.xMin, this.xMax);
        buildSurface(this.func, this.surface, this.xMin, this.xMax);
    };

    this.Help = function () {
        window.open(configs.helpURL);
    };
    this.GitHub = function () {
        window.open(configs.gitHubURL);
    };
    this.example1 = function () {
        alert("TODO");
    };

    this.example2 = function () {
        alert("TODO");
    };

    this.example3 = function () {
        alert("TODO");
    };
};

function calculateIntegral(func, surface, xMin, xMax) {
    $.ajax({
        type: "POST",
        url: configs.serverURL,
        data: {
            func: func,
            surface: surface,
            xMin: xMin,
            xMax: xMax,
        },

        beforeSend: function (jqXHR, settings) {
            $('#container-result').html("");
            $('#container-result').append($('<span>Loading...</span>').addClass('span-loading'));
        },

        success: function(result, status, xhr) {
            $('#container-result').html("");
            $('#container-result').append($('<table id="table-metadata"></table>'));
            $('#container-result').append($('<table id="table-integral-sum"></table>'));

            var response = JSON.parse(result);

            $('#table-metadata').append($('<tr>'));

            for (let i = 0; i < response.metadata.length; i++) {
                $('#table-metadata tr:last').append($('<td>').append($('<span>' + response.metadata[i].name + ': ' + response.metadata[i].value + '</span>')).addClass('td-result'));
            }

            $('#table-integral-sum').append($('<tr>'));
            for (let i = 0; i < response.integral_sum.length; i++) {
                $('#table-integral-sum tr:last').append($('<td>').append($('<span>' + response.integral_sum[i].name + ': ' + response.integral_sum[i].value + '</span>')).addClass('td-result'));
            }
        },

        error: function(xhr, status, error) {
            alert("Error calculate Integral");
        }
    });

}

function buildSurface(func, surface, xMin, xMax) {
    let myFunction = new Func( func, ['x'] );
    let terrainFunc = new Func( surface, ['x', 'z'] );

    if (!myFunction.isFuncValid()) {
        alert('Invalid L(x)');
        return;
    }

    if (!terrainFunc.isFuncValid()) {
        alert('Invalid g(x, z)');
        return;
    }

    sceneBuilder.build(myFunction, terrainFunc, xMin, xMax );
}

var guiContent = new GuiContent();
builderFolder.add(guiContent, 'func').name('L(x): ');
builderFolder.add(guiContent, 'surface').name('f(x, z):');

builderFolder.add(guiContent, 'xMax');
builderFolder.add(guiContent, 'xMin');
builderFolder.add(guiContent, 'build').name('Build');

examplesFolder.add(guiContent, 'example1').name('Example1');
examplesFolder.add(guiContent, 'example2').name('Example2');
examplesFolder.add(guiContent, 'example3').name('Example3');

gui.add(guiContent, 'Help');
gui.add(guiContent, 'GitHub');

//gui.remember(guiContent);