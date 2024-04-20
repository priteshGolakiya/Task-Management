const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      status: false,
      message: "Please provide a valid name, email, and password.",
    });
  }

  try {
    let userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({
        status: false,
        message: "Email already exists.",
      });
    }

    const isFirstUser = (await User.countDocuments({})) === 0;

    const role = isFirstUser ? "admin" : "user";

    // Hash Password

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    const user = { id: newUser._id, name: newUser.name, role: newUser.role };

    const token = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRY,
    });

    await User.create(newUser);

    res.status(201).json({
      status: true,
      message: "User created successfully!",
      data: newUser,
      token,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error!",
      error: error.message,
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email and a password",
    });
  }
  const exisitingUser = await User.findOne({ email });

  if (!exisitingUser) {
    return res.status(401).json({
      success: false,
      message: "Email does not exist.",
    });
  }

  const hashedPasswordFromDB = exisitingUser.password;

  bcrypt.compare(password, hashedPasswordFromDB, (err, result) => {
    if (!result) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password!",
      });
    }
    if (err) {
      return res.status(500).json({
        success: false,
        message: "Internal Server Error",
      });
    }
  });

  const user = {
    id: exisitingUser._id,
    name: exisitingUser.name,
    role: exisitingUser.role,
  };

  const token = jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRY,
  });

  res.status(200).json({ sucess: true, data: user, token });
};

const logout = async (req, res, next) => {
  res.status(200).json({ status: true, message: "Logout  Successful" });
};

const getAllUsers = async (req, res, next) => {
  const users = await User.find();
  if (!users || users.length === 0) throw new Error("No Users Found!");
  else
    return res
      .status(200)
      .json({ message: "Successfully fetched all users!", data: users });
};

// const deleteUser = async (req, res, next) => {
//   const userId = req.params.id; // Corrected line

//   console.log("delete User");

//   try {
//     let deletedUser = await User.findByIdAndDelete(userId);

//     if (!deletedUser) {
//       return res.status(400).json({
//         success: false,
//         message: "User not found!",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "User has been deleted successfully.",
//         // data: deletedUser,
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "An error occurred while deleting the user.",
//       error: error.message,
//     });
//   }
// };

// const createUser = async (req, res, next) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide a valid name, email, and password.",
//     });
//   }

//   try {
//     let userExist = await User.findOne({ email: email });
//     if (userExist) {
//       return res.status(409).json({
//         status: false,
//         message: "Email already exists.",
//       });
//     }

//     // Hash Password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new user
//     const newUser = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//     });

//     res.status(201).json({
//       status: true,
//       message: "User created successfully!",
//       data: newUser,
//     });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     return res.status(500).json({
//       status: false,
//       message: "Internal Server Error!",
//       error: error.message,
//     });
//   }
// };

const getSingleUser = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: "User not found!",
    });
  }
  res.status(200).json({
    status: true,
    data: user,
  });
};

const updateUser = async (req, res, next) => {
  const { id } = req.params; // Assuming user ID is passed as a URL parameter
  const { name, email } = req.body; // Assuming name and email are fields to update

  try {
    // Find the user by ID in the database
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Update the user fields
    user.name = name || user.name; // Update only if name is provided in request
    user.email = email || user.email; // Update only if email is provided in request

    // Save the updated user object
    await user.save();

    // Send response with updated user data
    res.status(200).json({
      status: true,
      message: "User updated successfully!",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      status: false,
      message: "Error updating user. Please try again.",
    });
  }
};

const deleteUser = async (req, res, next) => {
  const userId = req.params.id; // Corrected line

  console.log("delete User");

  try {
    let deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "User has been deleted successfully.",
        // data: deletedUser,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the user.",
      error: error.message,
    });
  }
};

// const signup = async (req, res, next) => {
//   const { name, email, password } = req.body;

//   if (!name || !email || !password) {
//     return res.status(400).json({
//       status: false,
//       message: "Please provide all the details.",
//     });
//   }

//   let userExist = await User.findOne({ email: email });
//   if (userExist) {
//     return res.status(409).json({
//       status: false,
//       message: "Email already exists.",
//     });
//   }

//   const isFirstUser = (await User.countDocuments({})) === 0;

//   const role = isFirstUser ? "admin" : "user";

//   //Hased Password
//   const hashedPassword = await bcrypt.hash(password, 10);

//   const result = await User.create({
//     name,
//     email,
//     password: hashedPassword,
//     role,
//   });

//   const user = {
//     id: result._id,
//     name: result.name,
//     email: result.email,
//     role: result.role,
//   };

//   const token = jwt.sign(user, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRY,
//   });

//   res.status(200).json({ suceess: true, data: user, token });
// };

module.exports = {
  getAllUsers,
  // createUser,
  getSingleUser,
  updateUser,
  deleteUser,
  signup,
  login,
  logout,
  // deleteUser,
};
