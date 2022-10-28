const express = require('express');
const cluster = require('cluster');
const { generateKeyPair } = require('crypto');

// Check the number of available CPU.
const numCPUs = require('os').cpus().length;

const app = express();
const PORT = 3000;

// For Master process
if (cluster.isMaster) {
console.log(`Master ${process.pid} is running`);

// Fork workers.
for (let i = 0; i < numCPUs; i++) {
	cluster.fork();
}

// This event is firs when worker died
cluster.on('exit', (worker, code, signal) => {
	console.log(`worker ${worker.process.pid} died`);
});
}

// For Worker
else {
// Workers can share any TCP connection
// In this case it is an HTTP server
app.listen(PORT, err => {
	err ?
	console.log("Error in server setup") :
	console.log(`Worker ${process.pid} started`);
});

// API endpoint
// Send public key
app.get('/key', (req, res) => {
	generateKeyPair('rsa', {
	modulusLength: 2048,
	publicKeyEncoding: {
		type: 'spki',
		format: 'pem'
	},
	privateKeyEncoding: {
		type: 'pkcs8',
		format: 'pem',
		cipher: 'aes-256-cbc',
		passphrase: 'top secret'
	}
	}, (err, publicKey, privateKey) => {

	// Handle errors and use the
	// generated key pair.
	res.send(publicKey);
	})
})
}
