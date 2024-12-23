import cloudinary from "cloudinary"

const uploaadImageToCloudinary = async (file, folder, height, qualtiy) => {
    const options = {folder};
    
    if(height){
        options.height = height;
    }
    if(qualtiy){
        options.qualtiy = qualtiy;
    }

    options.resource_type = "auto";

    return await cloudinary.uploader.upload(file.tempFilePath, options);
}

export default uploaadImageToCloudinary;

