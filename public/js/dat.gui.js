// GUI
var gui = new dat.GUI();
var builderFolder = gui.addFolder( "Builder" );
var examplesFolder = gui.addFolder( "Examples" );

var GuiContent = function() {
    this.func = 'POW(x, 0.5)';
    this.surface = '5';
    this.xMax = 5;
    this.xMin = -5;
    this.build = function() {
        process(this.func, this.surface, this.xMin, this.xMax);
    };

    this.Help = function () {
        window.open(configs.helpURL);
    };
    this.GitHub = function () {
        window.open(configs.gitHubURL);
    };
    this.example1 = function () {
        process('x', '5', -5, 5);
    };

    this.example2 = function () {
        process('POW(x, 2)', '5', -5, 5);
    };

    this.example3 = function () {
        process('x', 'y', -5, 5);
    };

    this.example4 = function () {
        process('POW(x, 2)', 'y', -5, 5);
    };

    this.example5 = function () {
        process('POW(x, 2)', 'SIN(y)', -5, 5);
    };
};

var guiContent = new GuiContent();
builderFolder.add(guiContent, 'func').name('L(x): ');
builderFolder.add(guiContent, 'surface').name('f(x, y):');

builderFolder.add(guiContent, 'xMin');
builderFolder.add(guiContent, 'xMax');
builderFolder.add(guiContent, 'build').name('Build');

examplesFolder.add(guiContent, 'example1').name('Example #1');
examplesFolder.add(guiContent, 'example2').name('Example #2');
examplesFolder.add(guiContent, 'example3').name('Example #3');
examplesFolder.add(guiContent, 'example4').name('Example #4');
examplesFolder.add(guiContent, 'example5').name('Example #5');

gui.add(guiContent, 'Help');
gui.add(guiContent, 'GitHub');

//gui.remember(guiContent);

function calculateIntegral(func, surface, xMin, xMax) {
    var data = {
        command: 'calculateIntegral',
        version: 1,
        params: {
            methods: [1],
            func: {
                func: func.getFunc(),
                vars: func.getVars()
            },

            surface: {
                func: surface.getFunc(),
                vars: surface.getVars()
            },
            xMin: xMin,
            xMax: xMax
        }
    };

    $.ajax({
        type: "POST",
        url: configs.serverURL,
        data: JSON.stringify(data),

        beforeSend: function (jqXHR, settings) {
            $('#container-result').html("");
            $('#container-result').append($('<span>Loading...</span>').addClass('span-loading'));
        },

        success: function(result, status, xhr) {
            $('#container-result').html("");
            $('#container-result').append($('<table id="table-metadata"></table>'));
            $('#container-result').append($('<table id="table-integral-sum"></table>'));

            var response = JSON.parse(result);

            for (var i = 0; i < response.metadata.length; i++) {
                $('#table-metadata').append($('<tr>'));
                $('#table-metadata tr:last').append($('<td>').append($('<span>' + response.metadata[i].name + ': ' + response.metadata[i].value + '</span>')).addClass('td-result'));
            }

            for (var i = 0; i < response.integral_sum.length; i++) {
                $('#table-integral-sum').append($('<tr>'));
                $('#table-integral-sum tr:last').append($('<td>').append($('<span>' + response.integral_sum[i].name + ': ' + response.integral_sum[i].value + '</span>')).addClass('td-result'));
            }
        },

        error: function(xhr, status, error) {
            alert('Server error: ' + JSON.parse(xhr.responseText).error);
            $('#container-result').html("");
        }
    });

}

function process(func, surface, xMin, xMax) {
    var myFunction = new Func( func, ['x'] );
    var terrainFunc = new Func( surface, ['x', 'y'] );

    if (!myFunction.isFuncValid()) {
        alert('Invalid L(x)');
        return;
    }

    if (!terrainFunc.isFuncValid()) {
        alert('Invalid g(x, z)');
        return;
    }

    if (isNaN(xMin) || isNaN(xMin) || xMin >= xMax) {
        alert('Invalid xMin or xMax');
        return;
    }

    calculateIntegral(myFunction, terrainFunc, xMin, xMax);
    sceneBuilder.build(myFunction, terrainFunc, xMin, xMax );
}