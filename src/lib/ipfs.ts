import ipfsClient from 'ipfs-http-client';

const ipfs = ipfsClient({
  host: 'localhost',
  port: 5002,
});

export default ipfs;
