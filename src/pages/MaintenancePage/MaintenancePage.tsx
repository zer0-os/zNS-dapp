//- Containers Imports
import { MaintenanceContainer } from 'containers/maintenance';

//- Asset Imports
import backgroundImage from 'assets/background.jpg';

const MaintenancePage: React.FC = () => {
	// Background Image ID - index.html
	const loadImg = new Image();
	loadImg.src = backgroundImage;
	if (loadImg.complete) {
		document.body.style.backgroundImage = `url(${backgroundImage})`;
	} else {
		loadImg.onload = () => {
			const bg = document.getElementById('backgroundImage')?.style;
			if (!bg) return;
			bg.backgroundImage = `url(${backgroundImage})`;
			bg.opacity = '1';
		};
	}

	return (
		<>
			<MaintenanceContainer />
		</>
	);
};

export default MaintenancePage;
