
// Detects webgl
if ( ! Detector.webgl ) {

	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";

}

var myFunction = new Func( 'x * x', ['x'] );
var terrainFunc = new Func( 'Math.sin(x) * z', ['x', 'z'] );

var sceneBuilder = new SceneBuilder(myFunction, terrainFunc, -5, 5 );
sceneBuilder.build();