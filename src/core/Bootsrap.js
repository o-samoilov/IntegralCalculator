
// Detects webgl
if ( ! Detector.webgl ) {

	Detector.addGetWebGLMessage();
	document.getElementById( 'container' ).innerHTML = "";

}

var myFunction = new Func( 'x+1', ['x'] );
console.log(myFunction.getValueFunc([1]));

var sceneBuilder = new SceneBuilder();
sceneBuilder.build();
