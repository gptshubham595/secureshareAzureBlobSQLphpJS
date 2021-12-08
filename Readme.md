# Features Implemented

## COMPLETED (All are stored inside azure storage blob [*ONLY ADMIN NOW( EVERYTHING ALLOWED! )*]) 

- Web Api generation
- Uploading files
- Uploading texts
- Listing all uploaded files
- Downloading of a file
- Creation of group 
- Listing all groups
- Posting in a group
- Deleting a group

## LEFT: Authentication part for user and admin using azure SQL (everything is setup in azure portal but coding is left for single php file) 

## Contains 3 files

- index.html (Need to run to perform completed functions)
    - All functions implemented

- index.js (Already uploaded in Azure portal inside function HTTPTrigger1)
    - Already uploaded inside HTTPTrigger1 function in Azure portal 
    
- index.php (!INCOMPLETE! AZURE SQL SERVER setup is done coding and connection depends on adding of firewall clients IP)
    - Need to install php and xampp server and file need to be placed inside "c:\xampp\htdocs\secureshare\index.php"

# UNDERSTANDING index.html

- We send a collected information from user using form and send as encoded multipart data over a api on Azure
- All files/msg upload is done on a general public channel/container/group named "securesharecc" 
- New group creation is refered here as creation of new container in Azure blob
- A sample function written to upload files to a group named "GroupA"
- Listing all the Containers/Groups availability 
- Listing all the Files present inside a Group 
- After seeing names of possible groups and files we can retrieve/download data as a stringstream like base64 for image,etc
- We can delete any group ( or container) 
- For each api we defined name of container and type of request we want like name="securesharecc" and type="upload", "create", "download", "delete" , "listall" , etc
- Azure SQL setup done in portal!

# What is Left and how should i link all?
- I will have total of 3 tables inside and SQl database Auth Table, Group Table, Stored Refernce Table
- We can create a basic auth form and send request to a function to save/retrieve data using SQl

# Resources name, id and password used

 Resource Group: SecureShare
 storage a/c name: securesharegg
 public container: securesharecc (general group)
 service: secureshare.azurewebsites.net Node 12 LTS
 functionapp: securesharegg.azurewebsites.net Node 14 LTS
 functionurl: HTTPTrigger1: https://securesharegg.azurewebsites.net/api/HttpTrigger1?code=Y/YI0ezHeIYrXbTXYdJ5TyNWSlqaoQyFhUngITUWcRSAMlT/OND6fA==

 SQl Server name: securesharess
 Server Admin name: secureshare
 SQL pass: Vijayalaxmi@0897