const {
    Aborter,
    BlobURL,
    BlockBlobURL,
    BlobServiceClient,
    ContainerURL,
    ServiceURL,
    StorageURL,
    SharedKeyCredential,
    AnonymousCredential,
    TokenCredential,
    } = require("@azure/storage-blob");
  const { saveAs } = require('file-saver');
  var multipart = require('parse-multipart');
  const AZURE_STORAGE_CONNECTION_STRING = process.env["AZURE_STORAGE_CONNECTION_STRING"];
  
  module.exports = async function (context, req) {
      context.log('JavaScript HTTP trigger function processed a request.');
      try{
          const type = (req.query.type || req.body.type);
          const blobServiceClient = await BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
          var list_of_container=[];
          for await (const contain of blobServiceClient.listContainers()) {
              list_of_container.push(contain.name);
          }
          async function streamToString(readableStream) {
              return new Promise((resolve, reject) => {
                  const chunks = [];
                  readableStream.on("data", (data) => {
                  chunks.push(data.toString());
                  });
                  readableStream.on("end", () => {
                  resolve(chunks.join(""));
                  });
                  readableStream.on("error", reject);
              });
              }
          
          if(type=="download"){
              const name = (req.query.name  || req.body.name);
              const itemname = (req.query.itemname  || req.body.itemname);
              var container=name?name:"securesharecc";
              const containerClient = await blobServiceClient.getContainerClient(container);
              const blobName=itemname?itemname:"sample.png";
              const blockBlobClient = containerClient.getBlockBlobClient(blobName);
              const downloadBlockBlobResponse = await blockBlobClient.download(0);
              console.log('\nDownloaded blob content...');
              var base64String=await streamToString(downloadBlockBlobResponse.readableStreamBody);
              console.log('\t', base64String);
              context.res = {
                      body: {data:base64String}
                  };
              context.done();
          }
   
          if(type=="create" ){
              //name new group name
              const name = (req.query.name  || req.body.name);
              var container=name?name:"securesharecc";
  
              if(!list_of_container.includes(container)){
                  const newGroupContainerClient = blobServiceClient.getContainerClient(name.toLowerCase());
                  const createContainerResponse = await newGroupContainerClient.create();
                  console.log(`Create container ${name} successfully`, createContainerResponse.requestId);
  
                  context.res = {
                      body: {status:200, msg: "created successfully!"}
                  };
                  context.done();
              }else{
                  
                  context.res = {
                      body: {status:500, msg: "Group Already Exists!"}
                  };
                  context.done();
              }
              
          }
          if(type=="delete" ){
                  const name = (req.query.name  || req.body.name);
                  var container=name?name:"securesharecc";
                  if(!list_of_container.includes(container)){
                      context.res = {
                          body: {status:404, msg: "No such group exists!"}
                      };
                      context.done();
                  }else{
                      const deleteGroupContainerClient = blobServiceClient.getContainerClient(name.toLowerCase());
                      const deleteContainerResponse = await deleteGroupContainerClient.delete();
                      console.log("Container was deleted successfully. requestId: ", deleteContainerResponse.requestId);
                      context.res = {
                          body: {status:200, msg: "deleted successfully!"}
                      };
                      context.done();
                  }
          }
          if(type=="listall" ){
              context.res = {
                  body: {status:200, data: list_of_container }
              };
              context.done();
          }
          if(type=="listallcontent" ){
              const name = (req.query.name  || req.body.name);
              console.log('\nListing blobs...');
              var container=name?name:"securesharecc";
              const containerClient = await blobServiceClient.getContainerClient(container);
              var list_content=[];
              for await (const blob of containerClient.listBlobsFlat()) {
                  list_content.push(blob.name);
              }
              context.res = {
                  body: {status:200, data: list_content }
              };
              context.done();
          }
          function generateRandomNDigits(n){
              return Math.floor(Math.random() * (9 * (Math.pow(10, n)))) + (Math.pow(10, n));
          }
          if(type=="upload" ){
                  const name = (req.query.name  || req.body.name);
                  var uploadtype = (req.query.uploadtype  || req.body.uploadtype);
                  uploadtype=uploadtype?uploadtype:"text";
                  var container=name?name:"securesharecc";
                  const containerClient = await blobServiceClient.getContainerClient(container);
  
                  if(uploadtype=="text"){
                      const msg = (req.query.msg  || req.body.msg);
                      var random=generateRandomNDigits(1)+generateRandomNDigits(3)+generateRandomNDigits(5)+generateRandomNDigits(4)+generateRandomNDigits(7);
                      random=random.toString();
                      const blobName = 'text'+random+'.txt';
                      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                      const data = msg;
                      const uploadBlobResponse = await blockBlobClient.upload(data, data.length);
                      console.log("Blob was uploaded successfully. requestId: ", uploadBlobResponse.requestId);
                      context.res = {
                          body: {status:200, msg: "uploaded msg successfully!", value:data, filename:blobName}
                      };
                      context.done();
                  }
                  
                  if(!list_of_container.includes(container)){
                      context.res = {
                          body: {status:404, msg: "No such group exists!"}
                      };
                      context.done();
                  }else{
                      var bodybuffer = Buffer.from(req.body);
                      var boundary = multipart.getBoundary(req.headers['content-type']);
                      var parts = multipart.Parse(bodybuffer, boundary);
                      const blobName = parts[0].filename;
                      const blockBlobClient = containerClient.getBlockBlobClient(blobName);
                      const uploadBlobresponse = await blockBlobClient.upload(parts[0].data,parts[0].data.length);
                      context.res = {
                          body: {status:200 , msg:"uploaded successfully!" , name: parts[0].filename, type: parts[0].type, data: parts[0].data.length}
                      };
                      context.done();
                  }    
              
              //name which container to upload
          }
      }catch(err){
          context.res = {
              body: {status: 500, msg:err}
          };
          context.done();
      }
      
      context.res = {
          body: {status: 500, msg:"ERR! Try something else!"}
      };
      context.done();
  }