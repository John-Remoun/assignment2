import { PORT } from "./config/config.service.js";

const BASE_URL = `http://localhost:${PORT}`;

const runTests = async () => {
    console.log(`\n======================================================`);
    console.log(`🚀 Starting Full API, Auth & RBAC End-to-End Test`);
    console.log(`Target Base URL: ${BASE_URL}`);
    console.log(`======================================================\n`);

    let passedTests = 0;
    let totalTests = 0;

    const assert = (condition, testName, details = "") => {
        totalTests++;
        if (condition) {
            console.log(`✅ PASS [${totalTests}]: ${testName}`);
            passedTests++;
        } else {
            console.error(`❌ FAIL [${totalTests}]: ${testName} - Details: ${details}`);
        }
    };

    try {
        // 1. Welcome Route
        const resRoot = await fetch(`${BASE_URL}/`);
        const dataRoot = await resRoot.json();
        assert(resRoot.status === 200 && dataRoot.endpoints, "GET / returns welcome payload with auth endpoints");

        // 2. POST /register (New regular user)
        const uniqueEmail = `testuser_${Date.now()}@example.com`;
        const resRegister = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Alice Developer",
                email: uniqueEmail,
                password: "mypassword123",
                bio: "Full Stack Engineer",
                age: 28,
            }),
        });
        const dataRegister = await resRegister.json();
        assert(
            resRegister.status === 201 &&
            dataRegister.token &&
            dataRegister.user &&
            dataRegister.user.email === uniqueEmail &&
            dataRegister.user.password === undefined,
            "POST /register creates user, generates JWT, and excludes password in response"
        );
        const regularUserToken = dataRegister.token;
        const regularUserId = dataRegister.user._id;

        // 3. POST /register duplicate email
        const resDuplicateRegister = await fetch(`${BASE_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: "Alice Duplicate",
                email: uniqueEmail,
                password: "mypassword123",
            }),
        });
        assert(resDuplicateRegister.status === 409, "POST /register with duplicate email returns 409 Conflict");

        // 4. POST /login with correct credentials
        const resLogin = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: uniqueEmail,
                password: "mypassword123",
            }),
        });
        const dataLogin = await resLogin.json();
        assert(
            resLogin.status === 200 &&
            dataLogin.token &&
            dataLogin.user.role === "user",
            "POST /login with valid credentials returns 200 and JWT token"
        );

        // 5. POST /login with invalid password
        const resBadLogin = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: uniqueEmail,
                password: "wrongpassword",
            }),
        });
        assert(resBadLogin.status === 401, "POST /login with incorrect password returns 401 Unauthorized");

        // 6. Login as Admin
        const resAdminLogin = await fetch(`${BASE_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: "admin@bookstore.com",
                password: "adminpassword123",
            }),
        });
        const dataAdminLogin = await resAdminLogin.json();
        assert(
            resAdminLogin.status === 200 &&
            dataAdminLogin.token &&
            dataAdminLogin.user.role === "admin",
            "POST /login with Admin credentials returns token with admin role"
        );
        const adminToken = dataAdminLogin.token;

        // 7. Protected Route: POST /books WITHOUT Token -> 401
        const resCreateNoAuth = await fetch(`${BASE_URL}/books`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: "Unauthorized Book",
                price: 19.99,
            }),
        });
        assert(
            resCreateNoAuth.status === 401,
            "POST /books without JWT returns 401 Unauthorized"
        );

        // 8. Protected Route: POST /books with INVALID Token -> 401
        const resCreateBadAuth = await fetch(`${BASE_URL}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer invalidtoken12345",
            },
            body: JSON.stringify({
                title: "Bad Token Book",
                price: 19.99,
            }),
        });
        assert(
            resCreateBadAuth.status === 401,
            "POST /books with invalid JWT token returns 401 Unauthorized"
        );

        // 9. Protected Route: POST /books with VALID Token (Regular User) -> 201
        const resCreateAuth = await fetch(`${BASE_URL}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${regularUserToken}`,
            },
            body: JSON.stringify({
                title: "Mastering Node.js and MongoDB",
                description: "Complete guide to modern backend engineering.",
                price: 49.99,
                category: "Web Development",
                pages: 500,
                inStock: true,
                publishedYear: 2026,
            }),
        });
        const dataCreateAuth = await resCreateAuth.json();
        assert(
            resCreateAuth.status === 201 &&
            dataCreateAuth.book &&
            dataCreateAuth.book.title === "Mastering Node.js and MongoDB" &&
            dataCreateAuth.book.author?.name === "Alice Developer",
            "POST /books with valid JWT successfully creates book and links authenticated author"
        );
        const createdBookId = dataCreateAuth.book?._id;

        // 10. POST /books Schema Validation (missing title) with Auth -> 400
        const resInvalidBook = await fetch(`${BASE_URL}/books`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${regularUserToken}`,
            },
            body: JSON.stringify({ price: 29.99 }),
        });
        assert(
            resInvalidBook.status === 400,
            "POST /books with missing required fields returns 400 Schema Validation Error"
        );

        // 11. GET /books (Public route with pagination & author population)
        const resBooks = await fetch(`${BASE_URL}/books?page=1&limit=3`);
        const dataBooks = await resBooks.json();
        assert(
            resBooks.status === 200 &&
            dataBooks.pagination &&
            dataBooks.books.length === 3 &&
            dataBooks.pagination.totalBooks >= 7,
            "GET /books?page=1&limit=3 returns 3 paginated books and pagination metadata"
        );

        // 12. GET /books/:id (Public route with author population)
        const resGetBook = await fetch(`${BASE_URL}/books/${createdBookId}`);
        const dataGetBook = await resGetBook.json();
        assert(
            resGetBook.status === 200 &&
            dataGetBook._id === createdBookId &&
            dataGetBook.author?.name === "Alice Developer",
            "GET /books/:id returns book with populated author information"
        );

        // 13. Admin Protection: DELETE /books/:id WITHOUT Token -> 401
        const resDeleteNoToken = await fetch(`${BASE_URL}/books/${createdBookId}`, {
            method: "DELETE",
        });
        assert(
            resDeleteNoToken.status === 401,
            "DELETE /books/:id without Token returns 401 Unauthorized"
        );

        // 14. Admin Protection: DELETE /books/:id with REGULAR USER Token -> 403 Forbidden
        const resDeleteRegularUser = await fetch(`${BASE_URL}/books/${createdBookId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${regularUserToken}`,
            },
        });
        assert(
            resDeleteRegularUser.status === 403,
            "DELETE /books/:id with regular user token returns 403 Forbidden (Admin only)"
        );

        // 15. Admin Protection: DELETE /books/:id with ADMIN Token -> 200 OK
        const resDeleteAdmin = await fetch(`${BASE_URL}/books/${createdBookId}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${adminToken}`,
            },
        });
        const dataDeleteAdmin = await resDeleteAdmin.json();
        assert(
            resDeleteAdmin.status === 200 &&
            dataDeleteAdmin.book?._id === createdBookId,
            "DELETE /books/:id with Admin token returns 200 OK and successfully deletes book"
        );

        // 16. Verify Deleted Book returns 404
        const resGetDeleted = await fetch(`${BASE_URL}/books/${createdBookId}`);
        assert(resGetDeleted.status === 404, "GET /books/:id after deletion returns 404 Not Found");

        // 17. CastError check for invalid ObjectId
        const resCastError = await fetch(`${BASE_URL}/books/invalid-id-999`);
        assert(resCastError.status === 400, "GET /books with invalid ID format returns 400 Bad Request");

        console.log(`\n======================================================`);
        console.log(`📊 Test Results: ${passedTests}/${totalTests} PASSED`);
        console.log(`======================================================\n`);

        if (passedTests === totalTests) {
            console.log("🎉 ALL AUTH & RBAC TESTS PASSED SUCCESSFULLY! 🎉\n");
            process.exit(0);
        } else {
            console.error("⚠️ Some tests failed!");
            process.exit(1);
        }
    } catch (error) {
        console.error("API Test Execution Error:", error);
        process.exit(1);
    }
};

runTests();
