const chalk = require('chalk');
module.exports = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#12BDF3").bold('[ Error ] » ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#12BDF3").bold('[ Error ] »') + data);
     break;
		default:			        
                        console.log(chalk.bold.hex("#12BDF3").bold(`${option} » `) + data);
			break;
	}
}

module.exports.loader = (data, option) => {
	switch (option) {
		case "warn":
			console.log(chalk.bold.hex("#12BDF3").bold('[ ZEESHAN ] » ') + data);
			break;
		case "error":
			console.log(chalk.bold.hex("#12BDF3").bold('[ ZEESHAN ] » ') + data);
			break;
		default:
			console.log(chalk.bold.hex("#12BDF3").bold(`[ ZEESHAN ] » `) + data);
			break;
	}
	}