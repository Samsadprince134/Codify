const cloudinary = require("cloudinary").v2;


exports.uploadImageToCloudinary = async (file , folder, height , quality) => {
    console.log("file" , file);
    const options = {folder};
    if(height){
        options.height = height;
    }
    if(quality){
        options.quality = quality;
    }

    options.resource_type = "auto"
  console.log(options)

    const upload = await cloudinary.uploader.upload(file.tempFilePath , options);
    console.log("uploading")
    return upload;
}  