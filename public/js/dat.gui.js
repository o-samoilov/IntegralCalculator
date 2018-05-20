// GUI
var gui = new dat.GUI();
var builderFolder = gui.addFolder( "Builder" );
var examplesFolder = gui.addFolder( "Examples" );

var guiContent = function() {
    this.function = 'x * x * x';
    this.surface = 'SIN(x) * z';
    this.xMax = 5;
    this.xMin = -5;
    this.build = function() {

        var myFunction = new Func( this.function, ['x'] );
        var terrainFunc = new Func( this.surface, ['x', 'z'] );

        if (!myFunction.isFuncValid()) {
            alert('Invalid L(x)');
            return;
        }

        if (!terrainFunc.isFuncValid()) {
            alert('Invalid g(x, z)');
            return;
        }

        sceneBuilder.build(myFunction, terrainFunc, this.xMin, this.xMax );

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

var guiContent = new guiContent();
builderFolder.add(guiContent, 'function').name('L(x): ');
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