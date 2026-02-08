const cloudinaryConfig = require("../config/cloudinaryConfig")

const cloudinary = require('cloudinary').v2;


async function uploadImage(imagePath){
    
    try{
    //     cloudinary.config({ 
    //     cloud_name: 'doufggs9h', 
    //     api_key: '275747938149982', 
    //     api_secret: 'LHenzbpJMKo9gWvST6eEtr7Uq-U'
    //   });
        cloudinaryConfig()

      console.log("object", imagePath)
      const result = await cloudinary.uploader.upload(imagePath , {
        folder : "blog app",
        // format: "auto",
    });
        return(result)
    }catch(error) {
        console.log(error);
    }
    
}

async function deleteImagefromCloudinary(imageId) {
    try{
        await cloudinary.uploader.upload(imageId);

    } catch(error) {
        console.log(error)
    }
}
module.exports = {uploadImage, deleteImagefromCloudinary}