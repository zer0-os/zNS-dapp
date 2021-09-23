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

	const [loading, setLoading] = useState<Boolean>(true);

	///////////////////////////////////////

	//Basics
	const scene = new Three.Scene();

	//Camera Viewer
	const [camera, setCamera] = useState(
		new Three.PerspectiveCamera(75, 224 / 224, 0.1, 1000),
	);

	camera.position.set(-5, 1, 10);
	camera.rotation.set(-0.1, -0.5, 0);

	///////////////////////////////////////

	// Renderer Viewport
	const renderer = new Three.WebGLRenderer({ antialias: true });
	renderer.setSize(224, 224);

	// tone mapping
	renderer.toneMapping = Three.NoToneMapping;
	renderer.outputEncoding = Three.sRGBEncoding;

	///////////////////////////////////////

	const [img, setImg] = useState(document.createElement('img'));

	//ENV MAP
	new RGBELoader().setPath('assets/hdri/').load(
		'fondo.hdr',
		function (texture) {
			const loader = new GLTFLoader();
			loader.load(
				url,
				function (gltf) {
					scene.add(gltf.scene);

					renderer.render(scene, camera);

					img.src = renderer.domElement.toDataURL('image/png');
					img.alt = 'NFT Preview';
					const image = document.getElementById('Container3d');
					if (image?.lastChild) {
						image?.removeChild(image?.lastChild);
					}
					console.log('Faso');
					image?.appendChild(img);
					setLoading(false);
				},
				undefined,
				function (error) {
					console.error(error);
				},
			);

			texture.mapping = Three.EquirectangularReflectionMapping;

			scene.environment = texture;
		},
		undefined,
		function (error) {
			console.error(error);
		},
	);

	///////////////////////////////////////

	return (
		<div
			id={'Container3d'}
			style={{ display: 'inline-block', position: 'relative' }}
		>
			{loading && <div id="loader"></div>}
			<div></div>

			{/*!loading && <div></div>*/}
		</div>
	);
};

export default GenerateJpg;
