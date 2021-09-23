//Imports
import React from 'react';
import { useState, useEffect } from 'react';
import * as Three from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

export function useGenerateJpg(url: string) {
	////////////
	// States //
	////////////

	const [loading, setLoading] = useState<Boolean>(true);
	const [img, setImg] = useState<String>('');
	const [error, setError] = useState<ErrorEvent>();

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

	useEffect(() => {
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

						setImg(renderer.domElement.toDataURL('image/png'));
						setLoading(false);

						return {
							loading,
							img,
						};
					},
					undefined,
					function (error) {
						console.error(error);
						setError(error);

						return {
							error,
						};
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
	}, []);
}
