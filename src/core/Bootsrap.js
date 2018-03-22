
// Detects webgl
if ( ! Detector.webgl ) {

	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";

}

var pointA = new Point(0, 11);
var pointB = new Point(5, 2);

var myFunction = new Func( 'x *x', ['x'] );
var terrainFunc = new Func( '5 + x + z', ['x', 'z'] );

var sceneBuilder = new SceneBuilder(myFunction, pointA, pointB, terrainFunc);
sceneBuilder.build();