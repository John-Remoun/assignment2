import Book from "./schemas/book.schema.js";

export const getAllBooks = async (options = {}) => {
    const {
        page = 1,
        limit = 10,
        search,
        category,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = options;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const filter = {};
    if (search) {
        filter.title = { $regex: search, $options: "i" };
    }
    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const sortOptions = {
        [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const [totalBooks, books] = await Promise.all([
        Book.countDocuments(filter),
        Book.find(filter)
            .populate("author", "name email bio age")
            .sort(sortOptions)
            .skip(skip)
            .limit(limitNum),
    ]);

    const totalPages = Math.ceil(totalBooks / limitNum) || 1;

    return {
        pagination: {
            totalBooks,
            totalPages,
            currentPage: pageNum,
            limit: limitNum,
            hasNextPage: pageNum < totalPages,
            hasPrevPage: pageNum > 1,
        },
        count: books.length,
        books,
    };
};

export const getBookById = async (id) => {
    return await Book.findById(id).populate("author", "name email bio age");
};

export const createBook = async (bookData) => {
    const book = new Book(bookData);
    const savedBook = await book.save();
    return await savedBook.populate("author", "name email bio age");
};

export const updateBook = async (id, updateData) => {
    return await Book.findByIdAndUpdate(id, updateData, {
        returnDocument: "after",
        runValidators: true,
    }).populate("author", "name email bio age");
};

export const deleteBook = async (id) => {
    return await Book.findByIdAndDelete(id);
};
