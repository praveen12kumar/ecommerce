
import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';

console.log("api key",process.env.CLOUDINARY_API_KEY)
// CLOUDINARY_API_KEY = 347985487972654
          
cloudinary.config({ 
  cloud_name: "dir7z9qr8",
  api_key: "347985487972654", 
  api_secret: "eV-LEeWBAVcIRcD4dni7zpL80Wk"
});



const uploadFileToCloudinary = async(localFilePath)=>{
    try {
        if(!localFilePath){
            console.log("No local file path provided")
            return null;
        }

        const response = await cloudinary.uploader.upload(localFilePath,{
            resource_type: "auto"
        })

        fs.unlinkSync(localFilePath);
        return response

    } catch (error) {
        console.log("Cloudinary upload error: " + error)
        fs.unlinkSync(localFilePath)
        return null;
    }   
}


export {uploadFileToCloudinary};

