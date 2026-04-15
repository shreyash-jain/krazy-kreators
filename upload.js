const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'dn9snfizy', 
  api_key: '644429988616382', 
  api_secret: 'd11XIyI5e12AJ--FnAeQRPh6j68' 
});

const uploadImages = async () => {
    const images = [
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\dtf-vs-screen-printing-banner.jpg", public_id: "blog/dtf-vs-screen-printing-banner.jpg" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\dtf_screen_printing_demo.jpg", public_id: "blog/dtf_screen_printing_demo.jpg" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\dtf_film_peel.jpg", public_id: "blog/dtf_film_peel.jpg" }
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
