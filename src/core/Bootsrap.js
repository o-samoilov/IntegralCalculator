// Detects webgl
if (!Detector.webgl) {

    Detector.addGetWebGLMessage();
    document.getElementById('container').innerHTML = "";

}

var configs = {
    serverURL: "http://integralcalculatorserver.local/",
    helpURL:   "https://github.com/a-samoylov/IntegralCalculator/blob/master/README.md",
    gitHubURL: "https://github.com/a-samoylov/IntegralCalculator"
};

var sceneBuilder = new SceneBuilder();
sceneBuilder.init();