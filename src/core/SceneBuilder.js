function SceneBuilder() {

    // - Global variables -
    // Heightfield parameters
    /*var terrainWidthExtents = 10;
    var terrainDepthExtents = 10;
    var terrainWidth = 10;
    var terrainDepth = 10;*/

    // Graphics variables
    var container, stats;
    var camera, controls, scene, renderer;
    var terrainMesh, texture;

    var heightData;

    //const
    var step = 0.01;

    this.build = function (func, terrainFunc, xmin, xmax) {

        this.func           = func;
        this.terrainFunc    = terrainFunc;
        this.ranges         = {
            XMIN: xmin,
            XMAX: xmax,
            YMIN: '',
            YMAX: '',
            ZMAX: '',
            ZMIN: ''
        };

        this.initAreaIntegral();

        //TODO draw Terrain
        var terrainWidthExtents = this.ranges.XMAX - this.ranges.XMIN;
        var terrainDepthExtents = this.ranges.YMAX - this.ranges.YMIN;
        var terrainWidth = terrainWidthExtents;
        var terrainDepth = terrainDepthExtents;

        heightData = this.generateHeight( terrainWidth, terrainDepth );
        this.initTerrain(terrainWidthExtents, terrainDepthExtents, terrainWidth, terrainDepth);
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

        camera.position.z = 20;//terrainDepthExtents / 2;
        camera.lookAt( new THREE.Vector3( 0, 0, 0 ) );

        controls = new THREE.OrbitControls( camera, renderer.domElement );
    };
    this.initAreaIntegral = function () {
        var geometryXZ = new THREE.Geometry();
        var geometryXYZ = new THREE.Geometry();
        var surface = new THREE.Geometry();

        var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );
        var materialSurface = new THREE.MeshBasicMaterial( { color: 0xffffff, side: THREE.DoubleSide } );

        var x, z, y;
        var countPoint = 0;

        var skippedPoints = [];

        scene.remove(scene.getObjectByName('surface'));
        scene.remove(scene.getObjectByName('geometryXZ'));
        scene.remove(scene.getObjectByName('geometryXYZ'));

        for( x = this.ranges.XMIN; x < this.ranges.XMAX; x += step ) {
            y = this.func.getValueFunc([x]);

            if (!isFinite(y)) {
                continue;
            }

            z = this.terrainFunc.getValueFunc([x, y]);

            if (!isFinite(z)) {
                continue;
            }

            if (this.ranges.YMAX === '' || this.ranges.YMAX < y) {
                this.ranges.YMAX = y;
            }

            if (this.ranges.YMIN === '' || this.ranges.YMIN > y) {
                this.ranges.YMIN = y;
            }

            if (this.ranges.ZMAX === '' || this.ranges.ZMAX < z) {
                this.ranges.ZMAX = z;
            }

            if (this.ranges.ZMIN === '' || this.ranges.ZMIN > z) {
                this.ranges.ZMIN = z;
            }

            geometryXZ.vertices.push(new THREE.Vector3( x, 0, y ));
            geometryXYZ.vertices.push(new THREE.Vector3( x, z, y ));

            surface.vertices.push(
                new THREE.Vector3( x, 0, y ),
                new THREE.Vector3( x, z, y )
            );

            countPoint++;
        }

        for ( var i = 0; i < countPoint * 2 - 2; i += 2 ) {
            surface.faces.push( new THREE.Face3( i, i+1, i+2 ) );
            surface.faces.push( new THREE.Face3( i+1, i+2, i+3 ) );
        }

        var mesh = new THREE.Mesh( surface, materialSurface ) ;
        mesh.name = 'surface';
        scene.add( mesh );

        var lineXZ = new THREE.Line( geometryXZ, material );
        lineXZ.name = 'geometryXZ';
        scene.add( lineXZ );

        var lineXYZ = new THREE.Line( geometryXYZ, material );
        lineXYZ.name = 'geometryXYZ';
        scene.add( lineXYZ );

    };
    this.initTerrain = function (terrainWidthExtents, terrainDepthExtents, terrainWidth, terrainDepth) {

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
        //terrainMesh.receiveShadow = true;
        //terrainMesh.castShadow = true;
        //terrainMesh.position.set( 0, 0,  0);
        //terrainMesh.position.z = 10;
        terrainMesh.position.x = (this.ranges.XMAX - this.ranges.XMIN) / 2 - 5;
        terrainMesh.position.z = (this.ranges.YMAX - this.ranges.YMIN) / 2;
        terrainMesh.material.opacity = 0.8;
        terrainMesh.material.transparent = true;

        scene.remove(scene.getObjectByName('terrain'));
        terrainMesh.name = 'terrain';
        scene.add( terrainMesh );

        /*var textureLoader = new THREE.TextureLoader();
        textureLoader.load( "textures/grid.png", function ( texture ) {

            texture.wrapS = THREE.RepeatWrapping;
            texture.wrapT = THREE.RepeatWrapping;
            texture.repeat.set( terrainWidth - 1, terrainDepth - 1 );
            groundMaterial.map = texture;
            groundMaterial.needsUpdate = true;

        });*/
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

    this.generateHeight = function( width, depth) {

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

        for ( var x = 0; x < width; x ++ ) {
            for ( var y = 0; y < depth; y ++ ) {
                data[ y * width + x ] = this.terrainFunc.getValueFunc([x, y]);
            }
        }

        return data;

    };

    this.render = function() {
        //camera.rotation.y += 0.01;

        renderer.render( scene, camera );
    };
}