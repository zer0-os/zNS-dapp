//- Utils Import
import { ROUTES } from 'constants/routes';

//- Constants Imports
import { updateDocumentTitle } from './documentTitle';

//////////////////////////
// f:: getDocumentTitle //
//////////////////////////

describe('updateDocumentTitle', () => {
	describe('Default Network (no network set)', () => {
		const env = import.meta.env;

		beforeEach(() => {
			jest.resetModules();
			import.meta.env = {
				...env,
				VITE_NETWORK: '',
				VITE_TITLE: 'Zero',
			};
		});

		afterEach(() => {
			import.meta.env = env;
		});

		it('mock VITE_NETWORK success', () => {
			expect(import.meta.env.VITE_NETWORK).toBe('');
			expect(import.meta.env.VITE_NETWORK).not.toBe('wilder');
		});

		describe('when Marketplace dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = '';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Zero | NFTs');
			});

			it('should display subdomain metatdata title when subdomain(x1) and domainMetadataTitle', () => {
				const zna = 'wilder';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = 'Wilder World';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Zero | ${domainMetadataTitle}`);
			});

			it('should display subdomain metatdata title when subdomain(x2) and domainMetadataTitle', () => {
				const zna = 'wilder.boat';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = 'On the water';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Zero | ${domainMetadataTitle}`);
			});
		});

		describe('when DAO dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = '';
				const app = ROUTES.ZDAO;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Zero | DAOs');
			});

			it('should display subdomain metatdata title when dao subdomain and domainMetadataTitle', () => {
				const zna = 'zero.dao';
				const app = ROUTES.ZDAO;
				const domainMetadataTitle = 'Test DAO One';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Zero | ${domainMetadataTitle}`);
			});
		});

		describe('when Staking dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = '';
				const app = ROUTES.STAKING;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Zero | Staking');
			});
		});

		describe('when Profile path', () => {
			it('should display Profile', () => {
				const zna = '';
				const app = ROUTES.PROFILE;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Zero | Profile');
			});
		});
	});

	describe('Network Variable (network set)', () => {
		const env = import.meta.env;

		beforeEach(() => {
			jest.resetModules();
			import.meta.env = {
				...env,
				VITE_NETWORK: 'wilder',
				VITE_TITLE: 'Wilder World',
			};
		});

		afterEach(() => {
			import.meta.env = env;
		});

		describe('when Marketplace dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = 'wilder';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Wilder World | NFTs');
			});

			it('should display subdomain metatdata title when subdomain(x1) and domainMetadataTitle', () => {
				const zna = 'wilder.boat';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = 'Test Subdomain';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Wilder World | ${domainMetadataTitle}`);
			});

			it('should display subdomain metatdata title when subdomain(x3) and domainMetadataTitle', () => {
				const zna = 'wilder.boat.notreal';
				const app = ROUTES.MARKET;
				const domainMetadataTitle = 'On the water';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Wilder World | ${domainMetadataTitle}`);
			});
		});

		describe('when DAO dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = 'wilder';
				const app = ROUTES.ZDAO;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Wilder World | DAOs');
			});

			it('should display subdomain metatdata title when dao subdomain and domainMetadataTitle', () => {
				const zna = 'wilder.test';
				const app = ROUTES.ZDAO;
				const domainMetadataTitle = 'Test DAO One';

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe(`Wilder World | ${domainMetadataTitle}`);
			});
		});

		describe('when Staking dApp', () => {
			it('should display dApp root title when root domain', () => {
				const zna = 'wilder';
				const app = ROUTES.STAKING;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Wilder World | Staking');
			});
		});

		describe('when Profile path', () => {
			it('should display Profile', () => {
				const zna = '';
				const app = ROUTES.PROFILE;
				const domainMetadataTitle = undefined;

				updateDocumentTitle(zna, app, domainMetadataTitle);

				expect(document.title).toBe('Wilder World | Profile');
			});
		});
	});
});
