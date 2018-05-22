// Detects webgl
if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var configs = {
    serverURL: "http://127.0.0.1/G/IntegralCalculatorServer/public/index.php",
    helpURL:   "https://github.com/a-samoylov/IntegralCalculator/blob/master/README.md",
    gitHubURL: "https://github.com/a-samoylov/IntegralCalculator",
};

var sceneBuilder = new SceneBuilder();
sceneBuilder.init();