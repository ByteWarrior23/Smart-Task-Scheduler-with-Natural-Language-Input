// Comprehensive Backend Test Script
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/v1';
let accessToken = '';
let refreshToken = '';
let userId = '';

// Test data
const testUser = {
    username: 'testuser',
    email: 'test@example.com',
    fullname: 'Test User',
    password: 'password123'
};

const testTask = {
    title: 'Test Task',
    description: 'This is a test task',
    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    category: 'work'
};

const testEmailConfig = {
    service: 'gmail',
    user: 'test@gmail.com',
    pass: 'test_password'
};

// Helper function to make requests
async function makeRequest(endpoint, method = 'GET', body = null, useAuth = false) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (useAuth && accessToken) {
        options.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        return { status: 500, data: { error: error.message } };
    }
}

// Test functions
async function testUserRegistration() {
    console.log('\n🧪 Testing User Registration...');
    const result = await makeRequest('/auth/register', 'POST', testUser);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 201;
}

async function testUserLogin() {
    console.log('\n🧪 Testing User Login...');
    const result = await makeRequest('/auth/login', 'POST', {
        username: testUser.username,
        password: testUser.password
    });
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    
    if (result.status === 200 && result.data.data) {
        accessToken = result.data.data.accessToken;
        refreshToken = result.data.data.refreshToken;
        userId = result.data.data.safeUser.id;
    }
    return result.status === 200;
}

async function testGetUserProfile() {
    console.log('\n🧪 Testing Get User Profile...');
    const result = await makeRequest('/auth/me', 'GET', null, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 200;
}

async function testUpdateEmailConfig() {
    console.log('\n🧪 Testing Update Email Config...');
    const result = await makeRequest('/auth/email-config', 'PATCH', { emailConfig: testEmailConfig }, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 200;
}

async function testCreateTask() {
    console.log('\n🧪 Testing Create Task...');
    const result = await makeRequest('/tasks/', 'POST', testTask, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 201;
}

async function testGetTasks() {
    console.log('\n🧪 Testing Get Tasks...');
    const result = await makeRequest('/tasks/', 'GET', null, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 200;
}

async function testNLPParse() {
    console.log('\n🧪 Testing NLP Parse...');
    const result = await makeRequest('/tasks/nlp/parse', 'POST', { 
        text: 'Schedule a meeting tomorrow at 2pm for 1 hour' 
    }, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 200;
}

async function testRefreshToken() {
    console.log('\n🧪 Testing Refresh Token...');
    const result = await makeRequest('/auth/refresh', 'POST', { refreshToken });
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    
    if (result.status === 200 && result.data.data) {
        accessToken = result.data.data.accessToken;
        refreshToken = result.data.data.refreshToken;
    }
    return result.status === 200;
}

async function testLogout() {
    console.log('\n🧪 Testing Logout...');
    const result = await makeRequest('/auth/logout', 'POST', null, true);
    console.log(`Status: ${result.status}`);
    console.log(`Response:`, result.data);
    return result.status === 200;
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting Comprehensive Backend Tests...\n');
    
    const tests = [
        { name: 'User Registration', fn: testUserRegistration },
        { name: 'User Login', fn: testUserLogin },
        { name: 'Get User Profile', fn: testGetUserProfile },
        { name: 'Update Email Config', fn: testUpdateEmailConfig },
        { name: 'Create Task', fn: testCreateTask },
        { name: 'Get Tasks', fn: testGetTasks },
        { name: 'NLP Parse', fn: testNLPParse },
        { name: 'Refresh Token', fn: testRefreshToken },
        { name: 'Logout', fn: testLogout }
    ];
    
    let passed = 0;
    let failed = 0;
    
    for (const test of tests) {
        try {
            const result = await test.fn();
            if (result) {
                console.log(`✅ ${test.name} - PASSED`);
                passed++;
            } else {
                console.log(`❌ ${test.name} - FAILED`);
                failed++;
            }
        } catch (error) {
            console.log(`❌ ${test.name} - ERROR: ${error.message}`);
            failed++;
        }
    }
    
    console.log(`\n📊 Test Results:`);
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${failed}`);
    console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
}

// Check if server is running
async function checkServer() {
    try {
        const response = await fetch('http://localhost:3000/api/v1/auth/register', { method: 'POST' });
        return true;
    } catch (error) {
        console.log('❌ Server is not running. Please start the server first.');
        console.log('Run: npm start');
        return false;
    }
}

// Main execution
async function main() {
    const serverRunning = await checkServer();
    if (serverRunning) {
        await runAllTests();
    }
}

main().catch(console.error);
