const View3D = () =>
{
	const instance = new THREE.EventDispatcher();
	const viewport = document.querySelector( '#viewport' );
	const viewportContainer = document.querySelector( '#viewportContainer' );
	const lineMaterial = new THREE.LineBasicMaterial( { color:0x000000 } );
	const envMap = new THREE.TextureLoader().load( 'envmap.png' );
	const loader = new THREE.GLTFLoader();

	envMap.mapping = THREE.EquirectangularReflectionMapping;
	envMap.encoding = THREE.sRGBEncoding;

	let viewportWidth = 1;
	let viewportHeight = 1;
	let viewportVisible = viewportContainer.checkVisibility();
	let renderer, camera, scene, light, ground, container, controls;
	let profileDiameter = 2;
	let profileWidth = 5;
	let profileHeight = 1;
	let isProfileFlat = true;
	
	const models = [];
	const colors = [ new THREE.Color(), new THREE.Color(), new THREE.Color() ];
	const segments = 32;
	const profileDepth = 300;
	
	const getProfileWidth = () => profileWidth;
	const getProfileHeight = () => profileHeight;
	const getProfileFlat = () => isProfileFlat;
	const setProfileFlat = ( value ) =>
	{
		value = !!value;
		
		if( value != isProfileFlat )
		{
			isProfileFlat = value;
			
			const model = models[ 'profile' ];
		
			if( model )
			{
				const { box, cylinder } = model;
				
				box.visible = isProfileFlat;
				cylinder.visible = !isProfileFlat;
			}
		}
	};
	const setProfileSize = ( w, h ) =>
	{
		w = Math.round( w );
		h = Math.round( h );
		
		if( Number.isFinite( w ) && Number.isFinite( h ) )
		{
			if( w >= 1 && w < 50 && h >= 1 && h < 50 )
			{
				profileWidth = w;
				profileHeight = h;
				
				const model = models[ 'profile' ];
				const { box } = model;
				
				box.geometry?.dispose();
				box.geometry = new THREE.BoxGeometry( profileWidth * 10, profileHeight * 10, profileDepth );
			}
		}
	};
	
	const getProfileDiameter = ()=> profileDiameter;
	const setProfileDiameter = ( value ) =>
	{
		value = Math.round( value );
		
		if( Number.isFinite( value ) )
		{
			if( value !== profileDiameter && [ 2, 3, 4, 5, 6, 7 ].includes( value ) )
			{
				profileDiameter = value;
				
				const model = models[ 'profile' ];
		
				if( model )
				{
					const { cylinder } = model;

					cylinder.geometry?.dispose();
					cylinder.geometry = new THREE.CylinderGeometry( profileDiameter * 5, profileDiameter * 5, profileDepth, segments );
				}
			}
		}
	};
	
	const load = ( id, url ) =>
	{
		if( models[ id ] == null )
		{
			if( id === 'profile' )
			{
				const group = new THREE.Group();
				const material = new THREE.MeshStandardMaterial( { color:'#' + colors[ 2 ].getHexString(), envMap } );
				const box = new THREE.Mesh( new THREE.BoxGeometry( profileWidth * 10, profileHeight * 10, profileDepth ), material );
				const cylinder = new THREE.Mesh( new THREE.CylinderGeometry( profileDiameter * 5, profileDiameter * 5, profileDepth, segments ), material );
				
				box.visible = isProfileFlat;

				cylinder.visible = !isProfileFlat;
				cylinder.rotateX( Math.PI / 2 );
				
				group.add( box, cylinder );
				group.visible = false;
				
				models[ id ] = { materials:[ null, null, material ], scene:group, visible:false, box, cylinder };
				
				container.add( group );
			}
			else 
			{
				models[ id ] = { materials:[], scene:null, visible:false };
				
				loader.load( url, gltf => onload( id, gltf ), null, error => console.trace( error ) );
			}
		}
	};
	
	const getColorList = () =>
	{
		const _colors = [];		
		
		colors.forEach( color => _colors.push( '#' + color.getHexString() ) );	
		
		return colors;
	};
	
	const getColorByIndex = ( index ) => getColorList()[ index ];
	
	const setColorByIndex = ( index, color ) =>
	{
		if( index >= 0 && index < colors.length )
		{
			colors[ index ].set( color );			
			
			Object.values( models ).forEach( model => model.materials[ index ]?.color?.copy( colors[ index ] ) );
		}
	};
	
	const showModel = ( _id ) =>
	{
		let hasVisible = false;

		for( const [ id, model ] of Object.entries( models ) ) 
		{
			model.visible = ( _id === id );

			if( model.scene )
				model.scene.visible = model.visible;
			
			if( model.visible )
				hasVisible = true;
		}
		
		if( hasVisible )
		{
			fitToScreen();
		}
	};
	
	const onload = ( id, gltf ) =>
	{
		const model = models[ id ];
		const { materials } = model;

		model.scene = gltf.scene;
		model.scene.visible = model.visible;
		model.scene.traverse( mesh => 
		{   
			if( mesh.isMesh )
			{
				mesh.castShadow = true;

				if( mesh.material && !materials.includes( mesh.material ) && mesh.material.type == 'MeshStandardMaterial' )
				{
					mesh.material.envMap = envMap;
					
					materials.push( mesh.material );
				}
			}
		} );
		
		container.add( model.scene );
		
		let loaded = true;
		
		Object.values( models ).forEach( model =>
		{
			loaded &&= ( model.scene instanceof THREE.Object3D );
		} );

		if( loaded )
		{
			instance.dispatchEvent( { type:'load' } );
		}
	};

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

	const init = () =>
	{
		renderer = new THREE.WebGLRenderer
		( {
			antialias:true,
			canvas:viewport
		} );

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.autoUpdate = false;
		renderer.shadowMap.type = THREE.VSMShadowMap;
		renderer.setSize( viewportWidth, viewportHeight );
		renderer.setClearColor( 0xFFFFFF );
		renderer.setPixelRatio( window.devicePixelRatio );

		camera = new THREE.PerspectiveCamera( 35, viewportWidth / viewportHeight, 0.1, 1000 );
		camera.position.set( 0, 20, 0 );

		container = new THREE.Object3D();

		scene = new THREE.Scene();
		scene.add( camera );
		scene.add( container );
		scene.add( new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.2 ) ); 

		controls = new THREE.OrbitControls( camera, renderer.domElement );
		controls.autoRotate = true;
		controls.autoRotateSpeed  = 0.5;
		controls.enablePan = false;
		controls.enableKeys = false;
		controls.enableDamping = true;
		controls.dampingFactor = 0.1;
		controls.minPolarAngle = controls.maxPolarAngle = Math.PI / 180 * 55;
		controls.update();

		controls.minPolarAngle = Math.PI / 180 * 15;
		controls.maxPolarAngle = Math.PI / 180 * 95;
		controls.minAzimuthAngle = -Infinity;
		controls.maxAzimuthAngle = Infinity;

		render();
		
		load( 'profile', null );
		load( 'stool1', 'Stul.glb' );
		load( 'stool2', 'Stul2.glb' );
	};

	const fitToScreen = () =>
	{
		container.updateMatrixWorld( true );
		
		const box = new THREE.Box3();
		
		Object.values( models ).forEach( model => 
		{
			if( model.visible && model.scene )
			{
				box.expandByObject( model.scene )
			}
		} );

		const size = box.getSize( new THREE.Vector3() );
		const center = box.getCenter( new THREE.Vector3() );
		const maxSize = Math.max( size.x, size.y, size.z );
		const fitHeightDistance = maxSize / ( 2 * Math.atan( Math.PI * camera.fov / 360 ) );
		const fitWidthDistance = fitHeightDistance / camera.aspect;
		const distance = Math.max( fitHeightDistance, fitWidthDistance );
		const direction = controls.target.clone().sub( camera.position ).normalize().multiplyScalar( distance );

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
		const hasChanges = viewportContainer.checkVisibility() != viewportVisible || viewportContainer.offsetWidth != viewportWidth || viewportContainer.offsetHeight != viewportHeight;
			
		viewportVisible = viewportContainer.checkVisibility();
		
		if( hasChanges || timestamp === undefined )
		{
			if( viewportVisible )
			{
				setSize( Math.max( 1, viewportContainer.offsetWidth ), Math.max( 1, viewportContainer.offsetHeight ) );
				fitToScreen();
			}
		}
		
		if( viewportVisible )
		{
			controls.update();
			camera.updateMatrixWorld( true );
			renderer.render( scene, camera );
		}
		
		requestAnimationFrame( render );
	};
	
	Object.assign( instance, 
	{ 
		showModel, 
		getColorList, getColorByIndex, setColorByIndex, 
		getProfileFlat, setProfileFlat, 
		getProfileDiameter, setProfileDiameter,
		getProfileWidth, getProfileHeight, setProfileSize,
	} );
	
	init();
	
	return instance;
}


const view3d = View3D();

view3d.addEventListener( 'load', ( event ) =>
{
	// TODO: нужно связать с радиокнопками!
	view3d.setProfileSize( 7, 2 );
	view3d.setProfileDiameter( 2 );
	view3d.setProfileFlat( false );
} );

document.querySelectorAll( 'button[data-model]' ).forEach( element => 
{
	element.onclick = () => view3d.showModel( element.dataset.model );

	if( element.classList.contains( 'active' ) )
	{
		// показываем модель связанную с активной вкладкой!
		view3d.showModel( element.dataset.model );
	}
} );


document.querySelectorAll( '.js-flat input' ).forEach( input => 
{
	input.onchange = () => {
		view3d.setProfileFlat( input.value === "flat" );
		if (input.value === "flat") {
			document.querySelector('.js-groupname').textContent = 'Size'
			document.querySelector('.js-radius').style.display = 'none'
			document.querySelector('.js-size').style.display = 'grid'
		} else {
			document.querySelector('.js-groupname').textContent = 'Diameter'
			document.querySelector('.js-radius').style.display = 'grid'
			document.querySelector('.js-size').style.display = 'none'
		}
	}
} );



document.querySelectorAll( '.js-radius input' ).forEach( input => 
{
	input.onchange = () => view3d.setProfileDiameter( input.value );
} );

document.querySelectorAll( '.js-size input' ).forEach( input => 
{
	input.onchange = () => view3d.setProfileSize( input.value.split('x')[0], input.value.split('x')[1] );
} );



document.querySelectorAll( '.grid-colors' )?.forEach( ( grid, index ) => 
{
	const switcher = grid.querySelectorAll( '.color' );
	const active = grid.querySelector( '.color.active' );

	switcher.forEach( element =>
	{
		element.addEventListener( 'click', event =>
		{
			if( !event.currentTarget.classList.contains( 'active' ) ) 
			{
				view3d.setColorByIndex( index, event.currentTarget.style.backgroundColor );
				grid.querySelector( '.color.active' )?.classList.remove( 'active' );			
				event.currentTarget.classList.add( 'active' );
			}
		} );
	} );
	
	if( active )
	{
		// В index.html добавил цвет по умолчанию в каждую палитру цветов ( .color.active )
		view3d.setColorByIndex( index, active.style.backgroundColor );
	}
} );


