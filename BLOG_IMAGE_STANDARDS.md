# Blog Image Standards

## Image Implementation Standards for All Blog Pages

### ✅ **Standard Image Configuration**

All blog images should use the following configuration to ensure full visibility without cropping:

```tsx
{/* Featured Image */}
<div className="mb-12 rounded-2xl overflow-hidden shadow-lg">
  <Image
    src="/blog/[image-name]"
    alt="Descriptive alt text"
    width={800}
    height={600}
    className="w-full h-auto object-contain"
    style={{
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden'
    }}
  />
</div>

{/* Strategic Images */}
<div className="mb-8 rounded-xl overflow-hidden shadow-lg">
  <Image
    src="/blog/[image-name]"
    alt="Descriptive alt text"
    width={800}
    height={600}
    className="w-full h-auto object-contain"
    style={{
      WebkitTransform: 'translateZ(0)',
      transform: 'translateZ(0)',
      WebkitBackfaceVisibility: 'hidden',
      backfaceVisibility: 'hidden'
    }}
  />
</div>
```

### 🚫 **What NOT to Use**

```tsx
// ❌ DON'T USE - This crops images
<div className="relative h-96 mb-12 rounded-2xl overflow-hidden shadow-lg">
  <Image
    src="/blog/[image-name]"
    alt="Descriptive alt text"
    fill
    className="object-cover"
    style={{
      objectFit: 'cover',
      objectPosition: 'center'
    }}
  />
</div>
```

### ✅ **Key Principles**

1. **Full Visibility**: Use `object-contain` instead of `object-cover`
2. **Dynamic Heights**: Remove fixed heights (`h-96`, `h-80`)
3. **Responsive Width**: Use `w-full h-auto` for responsive sizing
4. **No Cropping**: Images maintain their aspect ratio
5. **Full Width**: Images occupy full card width
6. **Variable Heights**: Each image can have different heights based on content

### 📁 **Image Storage**

- **Blog Images**: Store in `/public/blog/` directory
- **Access URL**: `/blog/[image-name]`
- **Supported Formats**: PNG, JPG, WEBP
- **Recommended Size**: 800x600px base, but will scale responsively

### 🔄 **Applied To**

- ✅ Mood Boards to Manufacturable Garments Blog
- ✅ Print, Pattern & Prototyping Matters Blog
- ✅ All future blog pages

### 📝 **For Admin Portal**

When creating new blogs through the admin portal, ensure all images follow this standard configuration to maintain consistency across all blog pages.
