import mongoose from "mongoose";
import { MONGO_URI } from "../config/config.service.js";
import User from "../modules/users/schemas/user.schema.js";
import Book from "../modules/books/schemas/book.schema.js";

const sampleUsers = [
    {
        name: "Admin User",
        email: "admin@orbscope.com",
        password: "adminpassword123",
        role: "admin",
        bio: "System Administrator",
    },
    {
        name: "EYADMOHAMED",
        email: "eyadezzat78@gmail.com",
        password: "password123",
        role: "user",
        bio: "Author of Clean Code, Clean Architecture, and Agile Software Development.",
        age: 71,
    },
    {
        name: "ahmed mohamed",
        email: "eyadezzat78@gmail.com",
        password: "password123",
        role: "user",
        bio: "Chief Scientist at ThoughtWorks and author of Refactoring.",
        age: 62,
    },
    {
        name: "Kyle Simpson",
        email: "eyadezzat78@gmail.com",
        password: "password123",
        role: "user",
        bio: "Author of You Don't Know JS book series and JavaScript evangelist.",
        age: 44,
    },
];

const sampleBooks = (users) => [
    {
        title: "Clean Code",
        description: "A Handbook of Agile Software Craftsmanship",
        price: 44.99,
        category: "Software Engineering",
        pages: 464,
        author: users[1]._id,
        inStock: true,
        publishedYear: 2008,
    },
    {
        title: "Clean Architecture",
        description: "A Craftsman's Guide to Software Structure and Design",
        price: 39.99,
        category: "Software Architecture",
        pages: 432,
        author: users[1]._id,
        inStock: true,
        publishedYear: 2017,
    },
    {
        title: "Refactoring: Improving the Design of Existing Code",
        description: "Guide to restructuring existing code without changing its external behavior.",
        price: 49.99,
        category: "Software Engineering",
        pages: 448,
        author: users[2]._id,
        inStock: true,
        publishedYear: 2018,
    },
    {
        title: "You Don't Know JS: Scope & Closures",
        description: "Deep dive into the core mechanisms of JavaScript.",
        price: 24.99,
        category: "Web Development",
        pages: 144,
        author: users[3]._id,
        inStock: true,
        publishedYear: 2020,
    },
    {
        title: "Fundamentals of Web Development",
        description: "Comprehensive introduction to HTML, CSS, JavaScript and server-side programming.",
        price: 29.99,
        category: "Web Development",
        pages: 350,
        author: users[3]._id,
        inStock: true,
        publishedYear: 2022,
    },
    {
        title: "Data Science & Machine Learning Essentials",
        description: "Practical guide to data science, analysis and machine learning algorithms.",
        price: 54.99,
        category: "Data Science",
        pages: 520,
        author: users[2]._id,
        inStock: true,
        publishedYear: 2023,
    },
];

export const seedDatabase = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB for seeding... 🍃");

        await User.deleteMany({});
        await Book.deleteMany({});
        console.log("Cleared existing collections.");

        const createdUsers = [];
        for (const userData of sampleUsers) {
            const user = new User(userData);
            await user.save();
            createdUsers.push(user);
        }
        console.log(`Seeded ${createdUsers.length} users (including 1 Admin and 3 Authors).`);

        const createdBooks = await Book.insertMany(sampleBooks(createdUsers));
        console.log(`Seeded ${createdBooks.length} books with author relationships.`);

        console.log("Database successfully seeded! 🌱🎉");
        await mongoose.disconnect();
    } catch (error) {
        console.error("Seeding Error:", error);
        process.exit(1);
    }
};

seedDatabase();
