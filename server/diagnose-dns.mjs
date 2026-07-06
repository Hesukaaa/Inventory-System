import dns from 'dns/promises';

async function test() {
  try {
    console.log('SRV:');
    const srv = await dns.resolveSrv('_mongodb._tcp.cluster0.nikhnxt.mongodb.net');
    console.log(srv);
    console.log('A:');
    const a = await dns.resolve('cluster0.nikhnxt.mongodb.net');
    console.log(a);
  } catch (err) {
    console.error(err);
  }
}
test();
