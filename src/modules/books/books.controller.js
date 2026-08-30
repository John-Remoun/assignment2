import mongoose from "mongoose";
import * as booksService from "./books.service.js";

export const getAllBooksController = async (req, res, next) => {
    try {
        const { page, limit, search, category, sortBy, sortOrder } = req.query;
        const result = await booksService.getAllBooks({
            page,
            limit,
            search,
            category,
            sortBy,
            sortOrder,
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

export const getBookByIdController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid book ID format: ${id}` });
        }

        const book = await booksService.getBookById(id);
        if (!book) {
            return res.status(404).json({ message: `Book with id ${id} not found` });
        }

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
};

export const createBookController = async (req, res, next) => {
    try {
        const bookData = { ...req.body };

        if (!bookData.author && req.user?._id) {
            bookData.author = req.user._id;
        }

        if (bookData.author && !mongoose.Types.ObjectId.isValid(bookData.author)) {
            return res.status(400).json({ message: `Invalid author ID format: ${bookData.author}` });
        }

        const newBook = await booksService.createBook(bookData);
        res.status(201).json({
            message: "Book created successfully",
            book: newBook,
        });
    } catch (error) {
        next(error);
    }
};

export const updateBookController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid book ID format: ${id}` });
        }

        if (req.body.author && !mongoose.Types.ObjectId.isValid(req.body.author)) {
            return res.status(400).json({ message: `Invalid author ID format: ${req.body.author}` });
        }

        const updatedBook = await booksService.updateBook(id, req.body);
        if (!updatedBook) {
            return res.status(404).json({ message: `Book with id ${id} not found` });
        }

        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteBookController = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: `Invalid book ID format: ${id}` });
        }

        const deletedBook = await booksService.deleteBook(id);
        if (!deletedBook) {
            return res.status(404).json({ message: `Book with id ${id} not found` });
        }

        res.status(200).json({
            message: "Book deleted successfully",
            book: deletedBook,
        });
    } catch (error) {
        next(error);
    }
};
