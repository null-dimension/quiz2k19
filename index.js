const restify = require('restify');
const mongoose = require('mongoose');
const config = require('./config');

const Team = require("./models/Team");

const corsMiddleware = require('restify-cors-middleware');
const cors = corsMiddleware({
	origins: ['*'],
	allowHeaders: ['Content-Type'],
	exposeHeaders: ['Content-Type']
});

const server = restify.createServer();
var socketio = require('socket.io');
var io = socketio.listen(server.server);

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.bodyParser());

server.listen(config.PORT, () => {
    mongoose.connect(config.MONGODB_URI, {useNewUrlParser: true});
});

const db = mongoose.connection;

db.on('error', (err) => console.log(err));

db.once('open', () => {
    require('./routes/quiz')(server);
    require('./routes/admin')(server);
    console.log(`Server started on port ${config.PORT}`);
	io.on('connection', function(socket){
		console.log('user connected');
		Team.find({}).sort({'points': -1}).exec((err, res)=>{
			if(err) throw err;
			io.emit('liveScore', res);
		});
		socket.on('updateLiveScore', function(data) {
			Team.find({}).sort({'points': -1}).exec((err, res)=>{
				if(err) throw err;
				io.emit('liveScore', res);
			});
		});
	
	});
});

server.get('/*', restify.plugins.serveStatic({
	directory: './quiz2k19',
	default: 'index.html'
}));