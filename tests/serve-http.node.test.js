import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import http from 'node:http';
import net from 'node:net';
import {mkdtemp, writeFile, rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));

async function withServer(run) {
  const reservation=net.createServer();
  await new Promise(resolve=>reservation.listen(0,'127.0.0.1',resolve));
  const port=reservation.address().port;
  await new Promise(resolve=>reservation.close(resolve));
  const child=spawn(process.execPath,['scripts/serve.js'],{
    cwd:root,env:{...process.env,PORT:String(port)},stdio:['ignore','pipe','pipe'],
  });
  try {
    await new Promise((resolve,reject)=>{
      const timer=setTimeout(()=>reject(Error('server startup timed out')),5000);
      child.stdout.on('data',()=>{clearTimeout(timer);resolve();});
      child.once('exit',()=>{clearTimeout(timer);reject(Error('server exited before startup'));});
      child.once('error',error=>{clearTimeout(timer);reject(error);});
    });
    await run(port);
  } finally {
    child.kill();
  }
}
function request(port, pathname) {
  return new Promise((resolve,reject)=>{
    const req=http.get({hostname:'127.0.0.1',port,path:pathname},res=>{
      let body='';
      res.on('data',chunk=>{body+=chunk;});
      res.on('end',()=>resolve({status:res.statusCode,body}));
    });
    req.on('error',reject);
    req.setTimeout(3000,()=>req.destroy(Error('request timed out')));
  });
}
test('malformed URI returns 400 and leaves the server healthy',async()=>{
  await withServer(async port=>{
    assert.equal((await request(port,'/%')).status,400);
    assert.equal((await request(port,'/')).status,200);
  });
});
test('a sibling with the same src prefix cannot be served',async()=>{
  const directory=await mkdtemp(path.join(root,'src-private-'));
  try {
    await writeFile(path.join(directory,'secret.txt'),'must not be served');
    await withServer(async port=>{
      const response=await request(port,`/../${path.basename(directory)}/secret.txt`);
      assert.equal(response.status,403);
      assert.ok(!response.body.includes('must not be served'));
    });
  } finally { await rm(directory,{recursive:true,force:true}); }
});
