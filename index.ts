import * as connection from './src/index';

(async () => {
	await connection.connection.default.init();
})();
