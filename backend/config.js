import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  jwtSecret: process.env.JWT_SECRET || 'blocktrace_super_secret_jwt_key_2026_algorand_verification',
  algod: {
    server: process.env.ALGOD_SERVER || 'http://localhost',
    port: process.env.ALGOD_PORT || '4001',
    token: process.env.ALGOD_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  },
  indexer: {
    server: process.env.INDEXER_SERVER || 'http://localhost',
    port: process.env.INDEXER_PORT || '8980',
    token: process.env.INDEXER_TOKEN || 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  },
  network: process.env.NETWORK || 'LocalNet'
};
