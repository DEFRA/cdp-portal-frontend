import crypto from 'node:crypto';
import fs from 'node:fs/promises';

const apiKey = process.env.API_KEY;
const cookie = process.env.COOKIE;

const file = '/Users/david/Downloads/test/18010 instrucciones.pdf';
const endpoint = 'https://ephemeral-protected.api.infra-dev.cdp-int.defra.cloud/cdp-portal-backend/entities/cdp-example-node-postgres-be/imports/';
// const endpoint = 'http://localhost:5094/entities/cdp-postgres-service/imports/';
const path = 'demo.pdf';

const content = await fs.readFile(file);
const size = content.length;

const md5 = crypto.createHash('md5').update(content).digest();
const hash =  Buffer.from(md5).toString('base64');

const fullPath = `${endpoint}${path}`;

console.log('Starting upload');

const startResponse = await fetch(fullPath, {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    cookie
  },
  body: JSON.stringify({
    size
  })
})

if (!startResponse.ok) {
  console.error(`Start error - ${startResponse.status}:${startResponse.statusText}`)
  console.error(await startResponse.text())
  process.exit(1);
}

const upload = await startResponse.json()
console.log('Start response', upload);

console.log('Starting part');

const partResponse = await fetch(`${fullPath}?${upload.parts[0].queryParams}&contentMd5=${hash}`, {
  method: 'PUT',
  headers: {
    'x-api-key': apiKey,
    cookie
  }
})

if (!partResponse.ok) {
  console.error(`Part error - ${partResponse.status}:${partResponse.statusText}`)
  console.error(await partResponse.text())
  process.exit(1);
}

const partInfo = await partResponse.json();
console.log('Part response', partInfo);



console.log('Starting upload');

const uploadResponse = await fetch(partInfo.url, {
  method: partInfo.method,
  headers: {
    'content-md5': hash,
    'x-api-key': apiKey,
    cookie
  },
  body: content
})



if (!uploadResponse.ok) {
  console.error(`Upload error - ${uploadResponse.status}:${uploadResponse.statusText}`)
  console.error(await uploadResponse.text())
  process.exit(1);
} else {
  console.log('Upload response', await uploadResponse.text());
}


console.log('Starting upload complete');

const completeResponse = await fetch(fullPath, {
  method: 'PUT',
  headers: {
    'content-type': 'application/json',
    'x-api-key': apiKey,
    cookie
  },
  body: JSON.stringify({
    uploadId: upload.uploadId,
    parts: [{
      partNumber: 1,
      eTag: uploadResponse.headers.get('eTag')
    }]
  })
})


if (!completeResponse.ok) {
  console.error(`Complete error - ${completeResponse.status}:${completeResponse.statusText}`)
  console.error(await completeResponse.text())
  process.exit(1);
} else {
  console.log('Upload complete response', await completeResponse.text());
}
