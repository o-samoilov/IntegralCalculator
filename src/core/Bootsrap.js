// Detects webgl
if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var sceneBuilder = new SceneBuilder();
sceneBuilder.init();
