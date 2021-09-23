//Imports
import React from 'react';
import { useState, useEffect } from 'react';
import * as Three from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

//CSS
import './GenerateJpg.css';

type GenerateJpgProps = {
	url: string;
	style?: React.CSSProperties;
};

const GenerateJpg: React.FC<GenerateJpgProps> = ({ url }) => {
	////////////
	// States //
	////////////

	const [loading, setLoading] = useState(true);

	///////////////////////////////////////

	//Basics
	const scene = new Three.Scene();

	//Camera Viewer
	const [camera, setCamera] = useState(
		new Three.PerspectiveCamera(75, 240 / 240, 0.1, 1000),
	);

	camera.position.set(-5, 1, 10);
	camera.rotation.set(-0.1, -0.5, 0);

	///////////////////////////////////////

	// Renderer Viewport
	const renderer = new Three.WebGLRenderer({ antialias: true });
	renderer.setSize(240, 240);

	useEffect(() => {
		const faso = document.getElementById('Container3d');
		faso?.appendChild(renderer.domElement);
	}, []);

	// tone mapping
	renderer.toneMapping = Three.NoToneMapping;
	renderer.outputEncoding = Three.sRGBEncoding;

	///////////////////////////////////////

	var img = document.createElement('img');

	var picture: string;

	//ENV MAP
	new RGBELoader().setPath('assets/hdri/').load(
		'fondo.hdr',
		function (texture) {
			const loader = new GLTFLoader();
			loader.load(
				url,
				function (gltf) {
					scene.add(gltf.scene);

					const cameraRender = new Three.PerspectiveCamera(
						200,
						300 / 300,
						0.1,
						1000,
					);

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

					var binaryData = [];
					binaryData.push(renderer.domElement.toDataURL('image/png'));
					picture = URL.createObjectURL(
						new Blob(binaryData, { type: 'image/png' }),
					);
					console.log(picture.split('blob:').pop());
					let source: string | undefined = picture.split('blob:').pop();
					img.src = source ? source : '';
					img.alt = 'NFT Preview';
					const image = document.getElementById('Container3d');
					image?.appendChild(img);
					console.log(img);
					setLoading(false);
				},
				undefined,
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

	//Function that reload
	function animate() {
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
		const cameraRender = new Three.PerspectiveCamera(200, 300 / 300, 0.1, 1000);

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

		/*
		a.href = renderer.domElement.toDataURL('image/png');
		a.download = 'screenshot.png';
		a.click();*/
	};

	return (
		<div
			id={'Container3d'}
			style={{ display: 'inline-block', position: 'relative' }}
		>
			{loading && <div id="loader"></div>}

			{/*!loading && <img alt="NFT Preview" src={picture} />*/}
		</div>
	);
};

export default GenerateJpg;
