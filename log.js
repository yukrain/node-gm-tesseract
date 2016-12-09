var moment = require('moment');
var colors = require('colors');
const start = moment();
function log(msg, color){
	var min = moment().diff(start,'minute');
	var sec = moment().diff(start,'second') % 60;
	min = min < 10 ? ('0' + min): min;
	sec = sec < 10 ? ('0' + sec): sec
	msg = moment().format('YYYY/MM/DD HH:mm:ss') + ` | ${min}:${sec}`+'    '+ msg;
	switch(color){
		case 'grey' : console.log(msg.grey); break;
		case 'red' : console.log(msg.red); break;
		case 'yellow' : console.log(msg.yellow); break;
		case 'blue' : console.log(msg.blue); break;
		case 'cyan' : console.log(msg.cyan); break;
		
		default:  console.log(msg.green); 
	}
}

module.exports = log;