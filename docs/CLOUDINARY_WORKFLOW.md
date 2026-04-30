# Cloudinary Image Upload Workflow

**ATTENTION AI AGENT: ALWAYS READ THIS WHEN CREATING A NEW BLOG POST.**

When generating new images for blog posts, follow this strictly:

1. Generate the images and place them in the `public/blog/` directory (e.g., `public/blog/my_image.png`).
2. **DO NOT** use the local `/blog/my_image.png` paths in the final `.tsx` components or `blogPosts.ts` data file.
3. Instead, you MUST automatically prepare to upload these images to Cloudinary.
4. **MANDATORY CHECKPOINT:** Before actually uploading the images to Cloudinary (using `upload.js` or any other method), you MUST explicitly ask the USER for permission to upload the images to Cloudinary.
5. Only after the user confirms, execute the upload (e.g., via `node upload.js`) and replace the local paths with the corresponding Cloudinary URLs (`https://res.cloudinary.com/dn9snfizy/image/upload/blog/...`) in both the React client component and `blogPosts.ts`.

Failure to ask the user before uploading or failing to use Cloudinary URLs in production will result in broken builds or deployment issues on Cloudflare Pages.
