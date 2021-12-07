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
  
  // const {BlobServiceClient} = require('@azure/storage-blob');
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
              context.res = {
                      body: {status:200, data: "he"}
                  };
              context.done();
              // const downloadBlockBlobResponse = await blockBlobClient.download(0);
              // console.log('\nDownloaded blob content...');
              // console.log('\t', await streamToString(downloadBlockBlobResponse.readableStreamBody));
              
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
          if(type=="upload" ){
                  const name = (req.query.name  || req.body.name);
                  var container=name?name:"securesharecc";
                  if(!list_of_container.includes(container)){
                      context.res = {
                          body: {status:404, msg: "No such group exists!"}
                      };
                      context.done();
                  }else{
                      var bodybuffer = Buffer.from(req.body);
                      var boundary = multipart.getBoundary(req.headers['content-type']);
                      var parts = multipart.Parse(bodybuffer, boundary);
                  
                      const containerClient = await blobServiceClient.getContainerClient(container);
  
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
              body: {status: 500, msg:"ERR! Parameter missed!"}
          };
          context.done();
      }
      
      context.res = {
          body: {status: 500, msg:"ERR! Try something else!"}
      };
      context.done();
  }