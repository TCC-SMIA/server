import { createConnection } from 'typeorm';

export default createConnection().then(_ => {
  console.log('Database was sucessfuly connected');
});
