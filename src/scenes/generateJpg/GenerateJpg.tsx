//Imports
import React from 'react';
import { useState, useEffect } from 'react';
import * as Three from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
//import { GLTFLoaderObject } from './loaders/GLTFLoaderObject.d';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

//CSS
import './GenerateJpg.css';

type GenerateJpgProps = {
	object: any;
	style?: React.CSSProperties;
};

const GenerateJpg: React.FC<GenerateJpgProps> = ({ object }) => {
	////////////
	// States //
	////////////

	const [loading, setLoading] = useState(true);

	///////////////////////////////////////

	//Basics
	const scene = new Three.Scene();

	//Camera Viewer
	const [camera, setCamera] = useState(
		new Three.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000,
		),
	);

	//camera.position.setZ(10);

	///////////////////////////////////////

	// Renderer Viewport
	const renderer = new Three.WebGLRenderer({ antialias: true });
	renderer.setSize(240, 240);

	useEffect(() => {
		document.body.appendChild(renderer.domElement);
	}, []);

	// tone mapping
	renderer.toneMapping = Three.NoToneMapping;
	renderer.outputEncoding = Three.sRGBEncoding;

	///////////////////////////////////////

	//GEOMETRY

	const torusGeo = new Three.TorusGeometry(10, 3, 16, 100);
	const torusMat = new Three.MeshStandardMaterial({ color: 0xff6347 });
	const torusMesh = new Three.Mesh(torusGeo, torusMat);

	///////////////////////////////////////

	//LIGHT
	const pointLight = new Three.PointLight(0xffffff, 1);
	pointLight.position.set(5, 5, 5);
	//scene.add(pointLight);

	//Light
	const ambientLight = new Three.AmbientLight(0xffffff, 0.1);
	//scene.add(ambientLight);

	//PROBE
	const lightProbe = new Three.LightProbe();
	//scene.add(lightProbe);

	//ENV MAP
	new RGBELoader().setPath('assets/hdri/').load(
		'fondo.hdr',
		function (texture) {
			const loader = new GLTFLoader();
			loader.load(
				'assets/object/scene.gltf',
				function (gltf) {
					scene.add(gltf.scene);
					setLoading(false);
				},
				function (x) {
					console.log(x);
				},
				function (error) {
					console.error(error);
				},
			);

			texture.mapping = Three.EquirectangularReflectionMapping;

			scene.background = texture;
			scene.environment = texture;
		},
		undefined,
		function (error) {
			console.error(error);
		},
	);

	///////////////////////////////////////

	//Controls
	const controls = new OrbitControls(camera, renderer.domElement);
	controls.minDistance = 8;
	controls.maxDistance = 10;
	controls.enablePan = false;

	var a = document.createElement('a');

	//Function that reload
	function animate() {
		//Update View
		controls.update();

		//Update Size and Render
		renderer.render(scene, camera);

		//Loop
		requestAnimationFrame(animate);
	}
	animate();

	/////////////////
	// SAVE RENDER //
	/////////////////

	const takeScreenShot = () => {
		//Camera Render
		const cameraRender = new Three.PerspectiveCamera(75, 300 / 300, 0.1, 1000);

		cameraRender.position.set(
			camera.position.x,
			camera.position.y,
			camera.position.z,
		);

		cameraRender.rotation.set(
			camera.rotation.x,
			camera.rotation.y,
			camera.rotation.z,
		);

		renderer.setSize(300, 300);
		renderer.render(scene, cameraRender);

		a.href = renderer.domElement.toDataURL('image/png');
		a.download = 'screenshot.png';
		a.click();
	};

	return (
		<div>
			{loading && <div id="loader"></div>}
			{!loading && (
				<div id="gui">
					<button onClick={() => takeScreenShot()}>Screenshot</button>
				</div>
			)}
		</div>
	);
};

export default GenerateJpg;
