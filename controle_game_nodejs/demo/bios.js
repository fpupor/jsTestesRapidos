var sys = require("util");
var sc = require('./lib/socket.io');

var io = sc.listen(5791);

var master = null;
var clients = {};

io.sockets.on('connection', function (socket) {

	socket.on('gameclient', function (data) {
		
		if(clients[data]){
			socket.emit("error", "Em uso.");
			return;
		}
		
		clients[data] = socket;
	});
	
	socket.on('controller', function (data) {
		
		if(!clients[data]){
			socket.emit("error", "Não existe cliente.");
			return;
		}
		
		if(clients[data].control){
			socket.emit("error", "Já existe controle.");
			return;
		}
		
		socket.client = clients[data];
		socket.client.control = socket;
		
		socket.on('event', function (data) {
			sys.log(data);
			socket.client.emit("control", data);
		});
		
		socket.on('orientation', function (data) {
			sys.log(data);
			socket.client.emit("orientation", data);
		});
		
		
		socket.client.emit("gameclientSuccess", true);
		socket.emit("controllerSuccess", true);
	});
		
	
	
});