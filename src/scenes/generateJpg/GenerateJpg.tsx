//Imports
import React from 'react';
import { useState, useEffect } from 'react';
import * as Three from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

//CSS
import './GenerateJpg.css';

type GenerateJpgProps = {
	url: string;
	onRender: (picture: string) => void;
	getLoading: (x: boolean) => void;
	type: string;
	style?: React.CSSProperties;
};

const GenerateJpg: React.FC<GenerateJpgProps> = ({
	url,
	onRender,
	getLoading,
	type,
}) => {
	////////////
	// States //
	////////////

	const [loading, setLoading] = useState<boolean>(true);

	///////////////////////////////////////

	//Basics
	const scene = new Three.Scene();

	//Camera Viewer
	const [camera, setCamera] = useState(
		new Three.PerspectiveCamera(75, 1080 / 1080, 0.1, 1000),
	);

	camera.position.set(-5, 1, 10);
	camera.rotation.set(-0.1, -0.5, 0);

	///////////////////////////////////////

	// Renderer Viewport
	const renderer = new Three.WebGLRenderer({ antialias: true });
	renderer.setSize(1080, 1080);

	// tone mapping
	renderer.toneMapping = Three.NoToneMapping;
	renderer.outputEncoding = Three.sRGBEncoding;

	///////////////////////////////////////

	useEffect(() => {
		if (type == 'fbx') {
			//ENV MAP
			new RGBELoader().setPath('assets/hdri/').load(
				'fondo.hdr',
				function (texture) {
					setLoading(true);
					const loader = new FBXLoader();
					loader.load(
						url,
						function (fbx) {
							scene.add(fbx);

							renderer.render(scene, camera);
							setLoading(false);

							onRender(renderer.domElement.toDataURL('image/jpg'));
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
		} else if (type == 'gltf') {
			//ENV MAP
			new RGBELoader().setPath('assets/hdri/').load(
				'fondo.hdr',
				function (texture) {
					setLoading(true);
					const loader = new GLTFLoader();
					loader.load(
						url,
						function (gltf) {
							scene.add(gltf.scene);

							renderer.render(scene, camera);
							setLoading(false);

							onRender(renderer.domElement.toDataURL('image/jpg'));
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
		}
	}, []);

	useEffect(() => {
		getLoading(loading);
	}, [loading]);

	///////////////////////////////////////

	return (
		<div
			id={'Container3d'}
			style={{ display: 'inline-block', position: 'relative' }}
		>
			{loading && <div id="loader"></div>}
		</div>
	);
};

export default GenerateJpg;
