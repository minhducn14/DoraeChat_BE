const CloudinaryService = require("../services/CloudinaryService");

const CloudinaryController = {
  async uploadImages(req, res, next) {
    try {
      const { id } = req.body;
      const uploadImages = await CloudinaryService.uploadImagesMessage(
        id,
        req.files
      );

      res.json({
        message: "Images are uploaded successfully!",
        images: uploadImages,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadVideo(req, res, next) {
    try {
      const { id } = req.body;
      const uploadVideo = await CloudinaryService.uploadVideoMessage(
        id,
        req.file
      );

      res.json({
        message: "Video is uploaded successfully!",
        video: uploadVideo,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadFile(req, res, next) {
    try {
      const { id } = req.body;
      const uploadFile = await CloudinaryService.uploadFileMessage(
        id,
        req.file
      );

      res.json({
        message: "File is uploaded successfully!",
        file: uploadFile,
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadImage(req, res, next) {
    try {
      const { id } = req.body;
      const uploadImage = await CloudinaryService.uploadImage(
        req.file,
        id,
        "avatar"
      );

      res.json({
        message: "Image is uploaded successfully!",
        image: uploadImage,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = CloudinaryController;
