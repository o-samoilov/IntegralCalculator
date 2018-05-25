function SceneBuilder() {

    // - Global variables -
    // Heightfield parameters
    var terrainWidthExtents = 100;
    var terrainDepthExtents = 100;
    var terrainWidth = 100;
    var terrainDepth = 100;
    var terrainHalfWidth = terrainWidth / 2;
    var terrainHalfDepth = terrainDepth / 2;
    var terrainMaxHeight = 2;
    var terrainMinHeight = 0;

    // Graphics variables
    var container, stats;
    var camera, controls, scene, renderer;
    var terrainMesh, texture;

    //const
    var step = 0.01;


    this.build = function (func, terrainFunc, xmin, xmax) {

        this.func           = func;
        this.terrainFunc    = terrainFunc;
        this.ranges         = {
            XMIN: xmin,
            XMAX: xmax,
            YMIN: 0,
            YMAX: 0,
            ZMAX: 0,
            ZMIN: 0
        };

        this.initAreaIntegral();


        //gui.__folders.Builder.domElement.children[0].children[1].setAttribute('text', '123')

        //TODO draw Terrain
        //heightData = this.generateHeight( terrainWidth, terrainDepth, terrainMinHeight, terrainMaxHeight );
        //this.initTerrain();
    };

    this.init = function() {
        sceneBuilder.initGraphics();
        sceneBuilder.initCamera();
        sceneBuilder.initLight();
        sceneBuilder.initHelpers();
        sceneBuilder.animate();
    };

    this.animate = function() {
        requestAnimationFrame( this.animate.bind(this) );

        this.render();
        stats.update();
    };

    this.initGraphics = function() {
        container = document.getElementById( 'container' );

        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;

        container.innerHTML = "";

        container.appendChild( renderer.domElement );

        stats = new Stats();
        stats.domElement.style.top = '';
        stats.domElement.style.left = '';
        stats.domElement.style.bottom = '0px';
        stats.domElement.style.right = '0px';

        container.appendChild( stats.domElement );

        window.addEventListener( 'resize', this.onWindowResize, false );

    };

    this.initCamera = function () {
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.2, 2000 );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xbfd1e5 );

        camera.position.y = 20;//heightData[ terrainHalfWidth + terrainHalfDepth * terrainWidth ] * ( terrainMaxHeight - terrainMinHeight ) + 10;

        camera.position.z = terrainDepthExtents / 2;
        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

        controls = new THREE.OrbitControls( camera, renderer.domElement );
    };
    this.initAreaIntegral = function () {
        var geometryXZ = new THREE.Geometry();
        var geometryXYZ = new THREE.Geometry();
        var surface = new THREE.Geometry();

        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        var materialSurface = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

        var x, y, z;
        var countPoint = 0;

        var skippedPoints = [];

        scene.remove(scene.getObjectByName("surface"));
        scene.remove(scene.getObjectByName("geometryXZ"));
        scene.remove(scene.getObjectByName("geometryXYZ"));

        for( x = this.ranges.XMIN; x < this.ranges.XMAX; x += step ) {
            z = this.func.getValueFunc([x]);

            if (!isFinite(z)) {
                continue;
            }

            y = this.terrainFunc.getValueFunc([x, z]);

            if (!isFinite(y)) {
                continue;
            }

            if (this.ranges.YMAX < y) {
                this.ranges.YMAX = y;
            }

            if (this.ranges.YMIN > y) {
                this.ranges.YMIN = y;
            }

            if (this.ranges.ZMAX < z) {
                this.ranges.ZMAX = z;
            }

            if (this.ranges.ZMIN > z) {
                this.ranges.ZMIN = z;
            }

            geometryXZ.vertices.push(new THREE.Vector3( x, 0, z ));
            geometryXYZ.vertices.push(new THREE.Vector3( x, y, z ));

            surface.vertices.push(
                new THREE.Vector3( x, 0, z ),
                new THREE.Vector3( x, y, z )
            );

            countPoint++;
        }

        for(var i = 0; i < countPoint * 2 - 2; i += 2) {
            surface.faces.push( new THREE.Face3( i, i+1, i+2 ) );
            surface.faces.push( new THREE.Face3( i+1, i+2, i+3 ) );
        }

        var mesh = new THREE.Mesh( surface, materialSurface ) ;
        mesh.name = "surface";
        scene.add( mesh );

        var lineXZ = new THREE.Line( geometryXZ, material );
        lineXZ.name = "geometryXZ";
        scene.add( lineXZ );

        var lineXYZ = new THREE.Line( geometryXYZ, material );
        lineXYZ.name = "geometryXYZ";
        scene.add( lineXYZ );

    };
    this.initTerrain = function () {
        var geometry = new THREE.PlaneBufferGeometry( terrainWidthExtents, terrainDepthExtents, terrainWidth - 1, terrainDepth - 1 );
        geometry.rotateX( - Math.PI / 2 );

        var vertices = geometry.attributes.position.array;

        for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {

            // j + 1 because it is the y component that we modify
            vertices[ j + 1 ] = heightData[ i ];

        }

        geometry.computeVertexNormals();

        var groundMaterial = new THREE.MeshPhongMaterial( { color: 0xFFFFBD, side: THREE.DoubleSide } );// side: THREE.DoubleSide
        terrainMesh = new THREE.Mesh( geometry, groundMaterial );
        terrainMesh.receiveShadow = true;
        terrainMesh.castShadow = true;
        terrainMesh.position.set( 0, 0, 0 );
        terrainMesh.material.opacity = 0.6;
        terrainMesh.material.transparent = true;

        scene.add( terrainMesh );

        var textureLoader = new THREE.TextureLoader();
        textureLoader.load( "textures/grid.png", function ( texture ) {

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
            groundMaterial.map = texture;
            groundMaterial.needsUpdate = true;

        } );
    };
    this.initLight = function () {
        var light = new THREE.DirectionalLight( 0xffffff, 1 );
        light.position.set( 100, 100, 50 );
        //light.castShadow = true;
        var dLight = 200;
        var sLight = dLight * 0.25;
        /*light.shadow.camera.left = -sLight;
        light.shadow.camera.right = sLight;
        light.shadow.camera.top = sLight;
        light.shadow.camera.bottom = -sLight;

        //light.shadow.camera.near = dLight / 30;
        //light.shadow.camera.far = dLight;

        //light.shadow.mapSize.x = 1024 * 2;
        //light.shadow.mapSize.y = 1024 * 2;*/

        scene.add( light );
    };
    this.initHelpers = function() {
        var helper = new THREE.GridHelper( 1000, 1000 );
        helper.position.y = 0;
        helper.material.opacity = 0.25;
        helper.material.transparent = true;
        scene.add( helper );

        var axes = new THREE.AxesHelper( 1000 );
        axes.position.set( 0, 0, 0 );
        scene.add( axes );
    };

    this.onWindowResize = function() {

        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( window.innerWidth, window.innerHeight );

    };

    this.generateHeight = function( width, depth, minHeight, maxHeight ) {

        // Generates the height data (a sinus wave)

        var size = width * depth;
        var data = new Float32Array( size );

        /*var hRange = maxHeight - minHeight;
        var w2 = width / 2;
        var d2 = depth / 2;
        var phaseMult = 12;

        var p = 0;
        for ( var j = 0; j < depth; j++ ) {
            for ( var i = 0; i < width; i++ ) {

                var radius = Math.sqrt(
                        Math.pow( ( i - w2 ) / w2, 2.0 ) +
                        Math.pow( ( j - d2 ) / d2, 2.0 ) );

                var height = ( Math.sin( radius * phaseMult ) + 1 ) * 0.5 * hRange + minHeight;

                data[ p ] = height;

                p++;
            }
        }*/

        //sin(x^2 + y ^2)
        for ( var i = 0; i < width; i ++ ) {

            for ( var j = 0; j < depth; j ++ ) {

                data[ j * width + i ] = Math.sin( i * j );

            }

        }

        return data;

    };

    this.render = function() {
        //camera.rotation.y += 0.01;

        renderer.render( scene, camera );
    };
}