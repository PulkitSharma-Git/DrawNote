const http = require("http");

const BASE_URL = "http://localhost:3001";

async function post(url, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const postData = JSON.stringify(data);
    const options = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 80,
      path: parsedUrl.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData),
      },
    };

    const req = http.request(options, (res) => {
      let responseBody = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        responseBody += chunk;
      });
      res.on("end", () => {
        let json = {};
        try {
          json = JSON.parse(responseBody);
        } catch (e) {
          // ignore
        }
        resolve({
          status: res.statusCode,
          data: json,
        });
      });
    });

    req.on("error", (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runTests() {
  console.log("Running backend validation integration tests...");
  let passed = true;

  // Test Case 1: Sign up with missing fields
  try {
    const res = await post(`${BASE_URL}/signup`, {});
    if (res.status === 400 && res.data.message) {
      console.log("✅ TC1: Missing signup fields rejected with 400 (Passed)");
    } else {
      console.error(`❌ TC1 Failed: expected 400, got ${res.status}. Payload:`, res.data);
      passed = false;
    }
  } catch (err) {
    console.error("❌ TC1 Failed: server connection issue. Is the backend running?", err.message);
    passed = false;
  }

  // Test Case 2: Sign up with invalid email
  try {
    const res = await post(`${BASE_URL}/signup`, {
      username: "invalidemail",
      password: "password123",
      name: "John Doe",
    });
    if (res.status === 400 && res.data.message.includes("Invalid email")) {
      console.log("✅ TC2: Invalid signup email rejected with 400 (Passed)");
    } else {
      console.error(`❌ TC2 Failed: expected 400 with 'Invalid email', got ${res.status}. Payload:`, res.data);
      passed = false;
    }
  } catch (err) {
    console.error("❌ TC2 Failed:", err.message);
    passed = false;
  }

  // Test Case 3: Sign up with short password
  try {
    const res = await post(`${BASE_URL}/signup`, {
      username: "john.doe@example.com",
      password: "123",
      name: "John Doe",
    });
    if (res.status === 400 && res.data.message.includes("Password must be at least 8 characters")) {
      console.log("✅ TC3: Short signup password rejected with 400 (Passed)");
    } else {
      console.error(`❌ TC3 Failed: expected 400 with 'at least 8 characters', got ${res.status}. Payload:`, res.data);
      passed = false;
    }
  } catch (err) {
    console.error("❌ TC3 Failed:", err.message);
    passed = false;
  }

  // Test Case 4: Sign in with invalid email format
  try {
    const res = await post(`${BASE_URL}/signin`, {
      username: "notanemail",
      password: "password123",
    });
    if (res.status === 400 && res.data.message.includes("Invalid email")) {
      console.log("✅ TC4: Invalid signin email rejected with 400 (Passed)");
    } else {
      console.error(`❌ TC4 Failed: expected 400, got ${res.status}. Payload:`, res.data);
      passed = false;
    }
  } catch (err) {
    console.error("❌ TC4 Failed:", err.message);
    passed = false;
  }

  // Test Case 5: Sign in with short password
  try {
    const res = await post(`${BASE_URL}/signin`, {
      username: "test@example.com",
      password: "abc",
    });
    if (res.status === 400 && res.data.message.includes("Password must be at least 8 characters")) {
      console.log("✅ TC5: Short signin password rejected with 400 (Passed)");
    } else {
      console.error(`❌ TC5 Failed: expected 400, got ${res.status}. Payload:`, res.data);
      passed = false;
    }
  } catch (err) {
    console.error("❌ TC5 Failed:", err.message);
    passed = false;
  }

  if (passed) {
    console.log("🎉 All validation integration tests passed successfully!");
    process.exit(0);
  } else {
    console.error("❌ Some validation tests failed.");
    process.exit(1);
  }
}

runTests();
