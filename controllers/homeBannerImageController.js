// controllers/bannerController.js
const path = require('path');
const Banner = require('../models/homeBannerImage');
const fs = require('fs');
// Upload banner images
const uploadBanner = async (req, res) => {
  if (!req.files || !req.files.bannerImages) {
      return res.status(400).json({ message: 'No banner images uploaded' });
  }

  // Get banner images from the uploaded files
  const newBannerImages = req.files.bannerImages.map(file => {
      return path.posix.join('/uploads', file.filename);
  });

  try {
      // Find the existing banner document (if it exists)
      let banner = await Banner.findOne();

      if (banner) {
          // Append the new images to the existing ones
          banner.bannerImages = [...banner.bannerImages, ...newBannerImages];
      } else {
          // If no banner exists, create a new one
          banner = new Banner({
              bannerImages: newBannerImages
          });
      }

      // Save the banner images to the database
      await banner.save();

      res.status(200).json({
          message: 'Banner images uploaded successfully',
          bannerImages: banner.bannerImages.map(img => `https://admin.menaauctions.com${img}`)
      });

  } catch (error) {
      console.error('Error uploading banner images:', error);
      res.status(500).json({ message: 'Error uploading banner images', error });
  }
};


// Fetch banner images
const getBannerImages = async (req, res) => {
    const banner = await Banner.findOne(); // Fetch the latest banner (or you can modify to fetch all)
  
    if (!banner) {
      return res.status(404).json({ message: 'No banner images found' });
    }
  
    res.status(200).json({
      bannerImages: banner.bannerImages.map(img => {
        // Ensure forward slashes for URLs
        return `https://admin.menaauctions.com${img.replace(/\\/g, '/')}`;
      })
    });
  };
  
  // controllers/bannerController.js

// Delete a banner image
const deleteBannerImage = async (req, res) => {
  const imageUrl = decodeURIComponent(req.params.imageUrl); // Decode the URL-encoded string
  const fileName = path.basename(imageUrl); // Extract just the filename

  try {
    // Find the banner document from the database
    const banner = await Banner.findOne();
    if (!banner) {
      return res.status(404).json({ message: 'No banner found' });
    }

    // Compare by file name only (e.g., "1725968615592-c4.png")
    const updatedImages = banner.bannerImages.filter(img => path.basename(img) !== fileName);

    if (updatedImages.length === banner.bannerImages.length) {
      return res.status(404).json({ message: 'Image not found in database' });
    }

    // Save the updated bannerImages array in the database
    banner.bannerImages = updatedImages;
    await banner.save();

    // Delete the file from the server
    const filePath = path.resolve(__dirname, '..', 'uploads', fileName); // Get absolute path to the file

    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          return res.status(404).json({ message: 'File not found on server' });
        }
        return res.status(500).json({ message: 'Error deleting file from server', error: err });
      }
      // Respond with success
      res.status(200).json({ message: 'Image deleted successfully' });
    });

  } catch (error) {
    console.error('Error deleting image:', error); // Log the error for debugging
    res.status(500).json({ message: 'Error deleting image', error });
  }
};




module.exports = { uploadBanner, getBannerImages,deleteBannerImage };
