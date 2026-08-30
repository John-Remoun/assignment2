import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Book title is required"],
            trim: true,
            minlength: [2, "Title must be at least 2 characters long"],
            maxlength: [200, "Title cannot exceed 200 characters"],
        },
        description: {
            type: String,
            trim: true,
            maxlength: [2000, "Description cannot exceed 2000 characters"],
        },
        price: {
            type: Number,
            required: [true, "Book price is required"],
            min: [0, "Price must be a positive number or zero"],
        },
        category: {
            type: String,
            trim: true,
            default: "General",
        },
        pages: {
            type: Number,
            min: [1, "Pages must be at least 1"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        publishedYear: {
            type: Number,
            min: [1000, "Invalid publication year"],
            max: [new Date().getFullYear() + 1, "Publication year cannot be in the distant future"],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

bookSchema.index({ title: 1 });

const Book = mongoose.model("Book", bookSchema);

export default Book;
