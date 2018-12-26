const express = require('express');
const bodyParser = require('body-parser');
// Imports the Google Cloud client library
const {Storage} = require('@google-cloud/storage');
const cors = require('cors');
const port = process.env.PORT || 4000;
// Your Google Cloud Platform project ID
const projectId = 'filecloud-222613';
const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => console.log(`Listening on port ${port}`));

// Creates a client
const storage = new Storage({
    projectId: projectId,
  });
  
  // The name for the new bucket
  //const bucketName = 'filecloudfirstbucket';
  
  // Creates the new bucket
  //async function createBucket() {
    //await storage.createBucket(bucketName);
    //console.log(`Bucket ${bucketName} created.`);
  //}
  
  //try {
    //createBucket();
  //} catch (err) {
    //console.error('ERROR:', err);
  //}

  /**
 * TODO(developer): Uncomment the following lines before running the sample.
 */
app.post('/api/upload', (req,res) => {
  console.log(req.body);

  const bucketName = 'filecloudfirstbucket';
  const filename = '../../'+ `${req.body.name}`;

// Uploads a local file to the bucket
async function storedata() {
await storage.bucket(bucketName).upload(filename, {
    // Support for HTTP requests made with `Accept-Encoding: gzip`
    gzip: true,
    metadata: {
      // Enable long-lived HTTP caching headers
      // Use only if the contents of the file will never change
      // (If the contents will change, use cacheControl: 'no-cache')
      cacheControl: 'public, max-age=31536000',
    },
  });
  console.log(`${filename} uploaded to ${bucketName}.`);
}
try{
    storedata().then(function(e){
      res.send({ok:1});
    }).catch(function(e){
      res.send({ok:0});
    });
} catch(err) {
    console.log('ERROR', err);
}});

app.get('/api/show' , (req,res) => {
  //res.send({ express: 'Hello From Express' });
 const bucketName = 'filecloudfirstbucket';
 var filesdata = [];
 var metadata = [];
// Lists files in the bucket
async function showdata(){
const [files] = await storage.bucket(bucketName).getFiles();

console.log('Files:');
files.forEach(file => {
  async function showmetadata(){
  [metadata] = await storage.bucket(bucketName).file(file.name).getMetadata();

  console.log(metadata.id+"###"+file.name+"###"+metadata.size+"###"+metadata.updated);
  
}try{showmetadata().then(function(e){
  console.log(err);
}).catch(function(err){
  console.log(err);
});}catch(err){console.log(err);}

var files = {
  "name":file.name,
  "size":metadata.size
};
filesdata.push(files);
console.log(filesdata);
});

  //res.send({files:[files]});
}try{showdata().then(function(e){
  console.log(e);
res.send({filesdata});
}).catch(function(err){
  console.log(err);
});}catch(err){console.log(err);}

});

app.post('/api/delete', (req,res) =>{
  const bucketName = 'filecloudfirstbucket';
  const filename = `${req.body.name}`;
  async function deletefile(){
    await storage
  .bucket(bucketName)
  .file(filename)
  .delete();

console.log(`gs://${bucketName}/${filename} deleted.`);
  }
  try{
    deletefile();
  }catch(err){console.log(err);}
});

app.post('/api/download', (req,res) =>{
  const bucketName = 'filecloudfirstbucket';

 const srcFilename = `${req.body.name}`;
 const destFilename = 'Downloads/'+`${req.body.name}`;

const options = {
  // The path to which the file should be downloaded, e.g. "./file.txt"
  destination: destFilename,
};
async function downloadfile(){
// Downloads the file
await storage
  .bucket(bucketName)
  .file(srcFilename)
  .download(options);

console.log(
  `gs://${bucketName}/${srcFilename} downloaded to ${destFilename}.`
);}
try{downloadfile().then(function(e){
  res.send({ok:1});
}).catch(function(e){
  res.send({ok:0});
});}catch(err){console.log(err)};
});