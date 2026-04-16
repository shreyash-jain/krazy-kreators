const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dn9snfizy', 
  api_key: '644429988616382', 
  api_secret: 'd11XIyI5e12AJ--FnAeQRPh6j68' 
});

const uploadImages = async () => {
    const images = [
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\essential_trimmings_banner.png", public_id: "blog/essential_trimmings_banner" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\premium_zipper_hardware.png", public_id: "blog/premium_zipper_hardware" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\custom_drawstring_aglet.png", public_id: "blog/custom_drawstring_aglet" }
    ];

    for (const img of images) {
        try {
            const res = await cloudinary.uploader.upload(img.path, { public_id: img.public_id });
            console.log(`UPLOAD_SUCCESS|${img.public_id}`);
        } catch(e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|`, e);
            process.exit(1);
        }
    }
}

uploadImages();
