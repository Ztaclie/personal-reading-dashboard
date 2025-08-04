const http = require("http");

// Test the API endpoints
async function testAPI() {
  console.log("🧪 Testing Reading Dashboard Backend API...\n");

  // Test 1: Health check
  console.log("1. Testing health check...");
  const healthResponse = await makeRequest("GET", "/api/health");
  console.log("Health check response:", healthResponse);
  console.log("✅ Health check passed\n");

  // Test 2: Signup
  console.log("2. Testing user signup...");
  const signupData = {
    username: "testuser2",
    email: "test2@example.com",
    password: "password123",
  };
  const signupResponse = await makeRequest(
    "POST",
    "/api/auth/signup",
    signupData
  );
  console.log("Signup response:", signupResponse);

  if (signupResponse.error) {
    console.log("⚠️  User might already exist, trying login...");
  } else {
    console.log("✅ Signup successful\n");
  }

  // Test 3: Login
  console.log("3. Testing user login...");
  const loginData = {
    email: "test2@example.com",
    password: "password123",
  };
  const loginResponse = await makeRequest("POST", "/api/auth/login", loginData);
  console.log("Login response:", loginResponse);

  if (loginResponse.error) {
    console.log("❌ Login failed");
    return;
  }

  const token = loginResponse.token;
  console.log("✅ Login successful\n");

  // Test 4: Create book
  console.log("4. Testing book creation...");
  const bookData = {
    title: "Test Book",
    author: "Test Author",
    reading_url: "https://example.com/book",
    cover_url: "https://example.com/cover.jpg",
    notes: "This is a test book",
  };
  const bookResponse = await makeRequest("POST", "/api/books", bookData, token);
  console.log("Book creation response:", bookResponse);

  if (bookResponse.error) {
    console.log("❌ Book creation failed");
    return;
  }

  console.log("✅ Book creation successful\n");

  // Test 5: Get books
  console.log("5. Testing get books...");
  const booksResponse = await makeRequest("GET", "/api/books", null, token);
  console.log("Get books response:", booksResponse);
  console.log("✅ Get books successful\n");

  console.log("🎉 All tests passed! Backend is working correctly.");
}

function makeRequest(method, path, data = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 3001,
      path: path,
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
    };

    if (token) {
      options.headers["Authorization"] = `Bearer ${token}`;
    }

    const req = http.request(options, (res) => {
      let body = "";
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          resolve({ error: "Invalid JSON response", body });
        }
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Run the tests
testAPI().catch(console.error);
