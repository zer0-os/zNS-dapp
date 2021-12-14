'use strict';
var __createBinding =
	(this && this.__createBinding) ||
	(Object.create
		? function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				Object.defineProperty(o, k2, {
					enumerable: true,
					get: function () {
						return m[k];
					},
				});
		  }
		: function (o, m, k, k2) {
				if (k2 === undefined) k2 = k;
				o[k2] = m[k];
		  });
var __exportStar =
	(this && this.__exportStar) ||
	function (m, exports) {
		for (var p in m)
			if (p !== 'default' && !Object.prototype.hasOwnProperty.call(exports, p))
				__createBinding(exports, m, p);
	};
Object.defineProperty(exports, '__esModule', { value: true });
exports.getZStakePoolFactory =
	exports.getZStakeCorePool =
	exports.getZStakePoolBase =
		void 0;
const types_1 = require('./types');
__exportStar(require('./types'), exports);
const getZStakePoolBase = async (address, provider) => {
	const contract = types_1.ZStakePoolBase__factory.connect(address, provider);
	return contract;
};
exports.getZStakePoolBase = getZStakePoolBase;
const getZStakeCorePool = async (address, provider) => {
	const contract = types_1.ZStakeCorePool__factory.connect(address, provider);
	return contract;
};
exports.getZStakeCorePool = getZStakeCorePool;
const getZStakePoolFactory = async (address, provider) => {
	const contract = types_1.ZStakePoolFactory__factory.connect(
		address,
		provider,
	);
	return contract;
};
exports.getZStakePoolFactory = getZStakePoolFactory;
//# sourceMappingURL=index.js.map
