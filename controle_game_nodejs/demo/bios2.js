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

var tt = sc.listen(5790);

var master = null;
var clients = [];
var pongs = [];

tt.sockets.on('connection', function (client) {
	
	clients.push(client);
	
	client.on('ping', function (data) {
		client.emit('pong', data);
		pongs.push({client: client, data: data});
	});		
});


function allPongs(){
	if(pongs.length == 0) return;
	
	var p = pongs;
			pongs = [];
	
	var c = clients;
	var l = c.length;
	var pl = p.length;
	
	for(var y = 0; y < pl; y++){
		for(var x = 0; x < l; x++){
			if(p[y].client !== c[x]){
				c[x].emit('pong', p[y].data);
			}
		}
	}
}

setInterval(allPongs, 1);