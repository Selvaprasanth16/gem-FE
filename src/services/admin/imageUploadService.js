import { apiCall } from '../api';

/**
 * Image Upload Service - Handles Cloudinary image uploads
 */
class ImageUploadService {
  /**
   * Upload multiple land images to Cloudinary
   * @param {FileList|Array} files - Array of image files
   * @returns {Promise} - Upload response with image URLs
   */
  async uploadLandImages(files) {
    try {
      const formData = new FormData();
      
      // Append all files to FormData
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }

      const response = await apiCall('/admin/images/upload-land-images', {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - browser will set it with boundary
        headers: {
          // Remove Content-Type to let browser set it
        },
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete a single land image from Cloudinary
   * @param {string} imageUrl - Cloudinary image URL
   * @returns {Promise} - Deletion response
   */
  async deleteLandImage(imageUrl) {
    try {
      const response = await apiCall('/admin/images/delete-land-image', {
        method: 'DELETE',
        body: JSON.stringify({ image_url: imageUrl }),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete multiple land images from Cloudinary
   * @param {Array} imageUrls - Array of Cloudinary image URLs
   * @returns {Promise} - Deletion response
   */
  async deleteMultipleLandImages(imageUrls) {
    try {
      const response = await apiCall('/admin/images/delete-multiple-land-images', {
        method: 'DELETE',
        body: JSON.stringify({ image_urls: imageUrls }),
      });

      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new ImageUploadService();
