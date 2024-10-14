const { User } = require("../models");
const imagekit = require("../lib/imagekit");

// Function for get all user data
async function getAllUser(req, res) {
  try {
    const users = await User.findAll();
    res.status(200).json({
      status: "Success",
      message: "Successfully obtained users data",
      isSuccess: true,
      data: { users },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to get users data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for get user data by id
async function getUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }
    res.status(200).json({
      status: "Success",
      message: "Successfully obtained user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to get user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for delete user by id
async function deleteUserById(req, res) {
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }

    await user.destroy();

    res.status(200).json({
      status: "Success",
      message: "Successfully delete user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to delete user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for update user by id
async function UpdateUserById(req, res) {
  const { firstName, lastName, age, phoneNumber } = req.body;
  const id = req.params.id;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({
        status: "Failed",
        message: "Can't find spesific id user",
        isSuccess: false,
        data: null,
      });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.age = age;
    user.phoneNumber = phoneNumber;

    await user.save();

    res.status(200).json({
      status: "Success",
      message: "Successfully update user data",
      isSuccess: true,
      data: { user },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to update user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

// Function for create new user data
async function createUser(req, res) {
  const newUser = req.body;

  try {
    // Create new user
    const createdUser = await User.create(newUser);
    const photoUrls = [];

    // Check if files were uploaded
    if (req.files && req.files.length > 0) {
      // If only one file, handle as single upload
      if (req.files.length === 1) {
        const uploadedImage = await imagekit.upload({
          file: req.files[0].buffer,
          fileName: `Profile-${createdUser.id}-${Date.now()}.${req.files[0].mimetype.split("/")[1]}`,
        });
        photoUrls.push(uploadedImage.url); // Add URL to array
      } else {
        // If more than one file, upload all files
        for (const file of req.files) {
          const uploadedImage = await imagekit.upload({
            file: file.buffer,
            fileName: `Profile-${createdUser.id}-${Date.now()}.${file.mimetype.split("/")[1]}`,
          });
          photoUrls.push(uploadedImage.url); // Save image URLs
        }
      }
    }

    // Update user with array of image URLs
    await createdUser.update({ photoProfile: photoUrls });

    res.status(200).json({
      status: "Success",
      message: "Successfully added user data with photo(s)",
      isSuccess: true,
      data: { ...newUser, photoProfile: photoUrls },
    });
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message: "Failed to add user data",
      isSuccess: false,
      data: null,
      error: error.message,
    });
  }
}

module.exports = {
  getAllUser,
  getUserById,
  deleteUserById,
  UpdateUserById,
  createUser,
};
