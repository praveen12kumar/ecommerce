
import fs from "fs";
import {v2 as cloudinary} from 'cloudinary';
import { fileURLToPath } from "url";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
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

        //fs.unlink(localFilePath);
        return response

    } catch (error) {
        console.log("Cloudinary upload error: " + error)
        fs.unlink(localFilePath)
        return null;
    }   
}


export {uploadFileToCloudinary};

