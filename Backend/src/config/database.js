require("dotenv/config");

module.exports = {
	dialect: process.env.DB_DIALECT,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	timezone: "+07:00",
	// eslint-disable-next-line no-unused-vars
	logging: sql => { },
	define: {
		timestamps: true
	},
	pool: {
		max: 10,
		min: 0,
		acquire: 30000,
		idle: 10000
	}
};
