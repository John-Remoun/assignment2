import User from "./schemas/user.schema.js";

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

export const getAllUsers = async () => {
    return await User.find().sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
    return await User.findById(id);
};

export const getUserByEmail = async (email) => {
    return await User.findOne({ email: email.toLowerCase().trim() });
};

export const updateUser = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, {
        returnDocument: "after",
        runValidators: true,
    });
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};
