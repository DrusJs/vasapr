const viewport = document.querySelector( '#viewport' );
const viewportContainer = document.querySelector( '#viewportContainer' );
const screenPointsContainer = document.querySelector( '#pointsContainer' );
const ui = document.querySelector( '#ui' );
const lineMaterial = new THREE.LineBasicMaterial( { color:0x000000 } );
const envMap = new THREE.TextureLoader().load( 'envmap.png' );

envMap.mapping = THREE.EquirectangularReflectionMapping;
envMap.encoding = THREE.sRGBEncoding;

let viewportWidth = 1;
let viewportHeight = 1;
let viewportVisible = viewportContainer.checkVisibility();
let renderer, camera, scene, light, ground, container, controls;

const setSize = ( w, h ) =>
{
    viewportWidth = w;
    viewportHeight = h;

    if( renderer )
    {
        camera.aspect = viewportWidth / viewportHeight;
        camera.updateProjectionMatrix();

        renderer.setSize( viewportWidth, viewportHeight );
    }
};

const init = ( gltf ) =>
{
    renderer = new THREE.WebGLRenderer
    ( {
        antialias:true,
        canvas:viewport
    } );


    renderer.shadowMap.enabled = true;
    renderer.shadowMap.autoUpdate = false;
    renderer.shadowMap.type = THREE.VSMShadowMap; // THREE.PCFSoftShadowMap; //
    //renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.setSize( viewportWidth, viewportHeight );
    renderer.setClearColor( 0xFFFFFF );
    renderer.setPixelRatio( window.devicePixelRatio );

    camera = new THREE.PerspectiveCamera( 35, viewportWidth / viewportHeight, 0.1, 1000 );
    camera.position.set( 0, 20, 0 );

    object = gltf.scene;
    console.log(object)
    const modelItems = new Array
    object.traverse( mesh => 
    {   
        if( mesh.isMesh )
        {
            mesh.castShadow = true;
            
            if( mesh.material && mesh.material.type == 'MeshStandardMaterial' )
            {
                console.log( mesh.material );

                mesh.material.envMap = envMap;
                
                const input = document.createElement( 'input' );
                input.classList.add('hidden')
                
                input.type = 'color';
                input.value = '#' + mesh.material.color.getHexString();
                input.oninput = () => mesh.material.color.set( input.value ), console.log(input.value);
                input.onchange = () => mesh.material.color.set( input.value ), console.log(input.value);
            
                
                ui.appendChild( input );
                modelItems.unshift(mesh)
            }
        }
    } );

    const uiChange = document.querySelectorAll('.color-changer')
    const inputColors = document.querySelectorAll('.color-changer input')
    const gridColors = document.querySelectorAll('.color-changer .grid-colors')
    const tabSwitcher = document.querySelectorAll('.tab-item')
    const changeModel = document.querySelectorAll('.change-model button')

    console.log(inputColors)

    if (changeModel.length > 0) {
        changeModel.forEach(el=>{
            el.addEventListener('click', (e)=>{
                const container = e.currentTarget.parentElement

                if (!e.currentTarget.classList.contains('active')) {
                    const active = container.querySelector('.active')
                    const ind = changeModel.indexOf(e.currentTarget)

                    if (active) { active.classList.remove('active') }
                    e.currentTarget.classList.add('active')

                    uiChange.forEach(el => { el.style.display = 'none' })
                    uiChange[ind].style.display = 'block'
                }
            })
        })
    }

    if (tabSwitcher.length > 0) {
        tabSwitcher.forEach(el=>{
            el.addEventListener('click', (e)=>{
                const container = e.currentTarget.nextElementSibling

                if (!container.classList.contains('active')) {
                    const active = document.querySelector('.grid-colors.active')

                    if (active) { active.classList.remove('active') }
                    container.classList.add('active')
                    document.querySelector('.tab-item.active').classList.remove('active')
                    e.currentTarget.classList.add('active')
                }
            })
        })
    }

    if (gridColors.length > 0) {
        gridColors.forEach((grid, index) => {
            const switcher = grid.querySelectorAll('.color')
            const nextBtn = grid.querySelector('.next')
            const prevBtn = grid.querySelector('.prev')

            switcher.forEach(el=>{
                el.addEventListener('click', (e)=>{
                    if (!e.currentTarget.classList.contains('active')) {
                        const active = grid.querySelector('.color.active')

                        if (active) { active.classList.remove('active') }
                        e.currentTarget.classList.add('active')
                        console.log(modelItems)
                        console.log(modelItems[index].material, modelItems[index])
                        modelItems[index].material.color.set( rgbToHex(e.currentTarget.style.backgroundColor) )
                    }
                })
            })

            nextBtn.addEventListener('click', (e=>{
                const actTab = grid.querySelector('.colors-page.active')

                prevBtn.classList.remove('disabled')

                if (actTab.nextElementSibling.classList.contains('colors-page')) {
                    actTab.classList.remove('active')
                    actTab.nextElementSibling.classList.add('active')
                }

                if (!actTab.nextElementSibling.nextElementSibling) {
                    e.currentTarget.classList.add('disabled')
                }
            }))

            prevBtn.addEventListener('click', (e=>{
                const actTab = grid.querySelector('.colors-page.active')

                nextBtn.classList.remove('disabled')

                if (actTab.previousElementSibling.classList.contains('colors-page')) {
                    actTab.classList.remove('active')
                    actTab.previousElementSibling.classList.add('active')
                }

                if (!actTab.previousElementSibling.previousElementSibling.classList.contains('colors-page')) {
                    e.currentTarget.classList.add('disabled')
                }
            }))

        })
    }

    container = new THREE.Object3D();
    container.add( object );

    scene = new THREE.Scene();
    scene.add( camera );
    scene.add( container );
    scene.add( new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.2 ) ); 

    // scene.add( new THREE.BoxHelper( object, 0x00FFFF ) ); // TEST

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.autoRotateSpeed  = 0.5;
    controls.enablePan = false;
    controls.enableKeys = false;
    controls.enableDamping = true;
    controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 180 * 55;
    controls.update();

    controls.minPolarAngle = Math.PI / 180 * 15;
    controls.maxPolarAngle = Math.PI / 180 * 95;
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;

    createGroundAndShadowLight();

    render();
};

const createGroundAndShadowLight = () =>
{
    const box = new THREE.Box3();

    box.expandByObject( container );

    const size = box.getSize( new THREE.Vector3() );
    const maxSize = Math.max( size.x, size.z );
    const center = box.getCenter( new THREE.Vector3() );
    const offset = maxSize / 10;
	
	console.log( size );

    const geometry = new THREE.PlaneGeometry( size.x + offset * 2, size.z + offset * 2, 16, 16 );

    geometry.rotateX( Math.PI / 180 * -90 );
    geometry.translate( center.x, center.y - size.y / 2, center.z );

    const material = new THREE.ShadowMaterial();

    material.opacity = 0.15;

    ground = new THREE.Mesh( geometry, material );
    ground.receiveShadow = true;

    scene.add( ground );

    light = new THREE.DirectionalLight( 0xFFFFFF, 0.1 );
    light.position.set( center.x,  center.y + size.y / 2 + 1, center.z );
    light.castShadow = true;
    light.shadow.camera.left = -size.x / 2 - offset;
    light.shadow.camera.right = size.x / 2 + offset;
    light.shadow.camera.top = -size.z / 2 - offset;
    light.shadow.camera.bottom = size.z / 2 + offset;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = size.y + 2;
    light.shadow.bias = -0.000222;
    light.shadow.mapSize.width =
    light.shadow.mapSize.height = 256;
    light.shadow.radius = 8;

    light.target.position.set( center.x, center.y - size.y / 2, center.z );

    scene.add( light.target );
    scene.add( light );
    // scene.add( new THREE.CameraHelper( light.shadow.camera ) ); // TEST

    renderer.shadowMap.needsUpdate = true;
}

const fitToScreen = () =>
{
	container.updateMatrixWorld( true );
	 
	let box = new THREE.Box3();
		box.expandByObject( container );

	let size = box.getSize( new THREE.Vector3() );
	let center = box.getCenter( new THREE.Vector3() );

	let maxSize = Math.max( size.x, size.y, size.z );
	let fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
	let fitWidthDistance = fitHeightDistance / camera.aspect;
	let distance = Math.max( fitHeightDistance, fitWidthDistance );

	let direction = controls.target.clone()
		.sub( camera.position )
		.normalize()
		.multiplyScalar( distance );

	controls.minDistance = controls.maxDistance = distance * 1.4; 
	controls.target.copy( center );

	camera.near = distance / 100;
	camera.far = distance * 100;
	camera.updateProjectionMatrix();
	camera.position.copy( controls.target ).sub( direction );

	controls.update();
	controls.minDistance /= 2;
	controls.maxDistance *= 2;
};

const render = ( timestamp ) =>
{
    if( timestamp === undefined || 
		viewportContainer.checkVisibility() != viewportVisible || 
		viewportContainer.offsetWidth != viewportWidth || 
		viewportContainer.offsetHeight != viewportHeight )
    {
		viewportVisible = viewportContainer.checkVisibility();
        
		if( viewportVisible )
		{
			setSize( Math.max( 1, viewportContainer.offsetWidth ), Math.max( 1, viewportContainer.offsetHeight ) );
			fitToScreen();
		}
    }
    else
    {
        controls.update();
    }

	camera.updateMatrixWorld( true );

    renderer.render( scene, camera );
    requestAnimationFrame( render );
};

const loader = new THREE.GLTFLoader();

loader.load
(
	'Stul.glb',
	( model ) => init( model ),
	( xhr ) => {},
	( error ) => console.trace( error )
);

function rgbToHex(color) {
    color = ""+ color;
    if (!color || color.indexOf("rgb") < 0) {
        return;
    }

    if (color.charAt(0) == "#") {
        return color;
    }

    var nums = /(.*?)rgb\((\d+),\s*(\d+),\s*(\d+)\)/i.exec(color),
        r = parseInt(nums[2], 10).toString(16),
        g = parseInt(nums[3], 10).toString(16),
        b = parseInt(nums[4], 10).toString(16);

    return "#"+ (
        (r.length == 1 ? "0"+ r : r) +
        (g.length == 1 ? "0"+ g : g) +
        (b.length == 1 ? "0"+ b : b)
    );
}