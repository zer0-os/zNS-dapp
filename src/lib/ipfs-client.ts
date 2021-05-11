const ipfsLib = require('ipfs-api');

const ipfsClient = new ipfsLib({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

export default ipfsClient