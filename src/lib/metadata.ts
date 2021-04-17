import ipfsClient from 'ipfs-http-client';

const ipfs_metadata = ipfsClient({
  host: 'localhost',
  port: 5002,
});

export default ipfs_metadata;
