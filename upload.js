const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dn9snfizy',
    api_key: '644429988616382',
    api_secret: 'd11XIyI5e12AJ--FnAeQRPh6j68'
});

const uploadImages = async () => {
    const images = [
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\wrong_samples.png", public_id: "blog/wrong_samples" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\defective_bulk.png", public_id: "blog/defective_bulk" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\no_one_to_call.png", public_id: "blog/no_one_to_call" },
        { path: "G:\\gitt repoo\\krazy-kreators\\public\\blog\\krazy_solution.png", public_id: "blog/krazy_solution" }
    ];

    for (const img of images) {
        try {
            const res = await cloudinary.uploader.upload(img.path, { public_id: img.public_id });
            console.log(`UPLOAD_SUCCESS|${img.public_id}`);
        } catch (e) {
            console.error(`UPLOAD_ERROR|${img.public_id}|`, e);
            process.exit(1);
        }
    }
}

uploadImages();
