import * as http from 'http'
import app from './app'

const server = http.createServer(app);
server.listen(3000);
server.on('listening', ()=> console.log('Listening port 3000'));