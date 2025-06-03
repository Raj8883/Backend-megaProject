import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
});

const uploadOncloudinary = async(filePath)=>{
    try {
        if (!filePath) {
            throw new Error('File path is required');
        }
        const response=await cloudinary.uploader.upload(filePath, {
            resource_type:'auto'
        })//file has been uploaded successfully

        //console.log('File uploaded successfully', response.url);

        
        fs.unlinkSync(filePath); // remove the local saved temporary file after upload
        return response;
    } catch (error) {
        fs.unlinksync(filePath)// remove the local saved  temporary file as the upload failed
        return null;
    }
}

export {uploadOncloudinary};