// Environment and Configuration Validation Script
import dotenv from 'dotenv';
import fs from 'fs';

// Load environment variables
dotenv.config();

console.log('🔍 Validating Backend Configuration...\n');

// Check required environment variables
const requiredEnvVars = [
    'MONGODB_URL',
    'JWT_ACCESS_TOKEN',
    'JWT_REFRESH_TOKEN',
    'ACCESS_TOKEN_EXPIRES_IN',
    'REFRESH_TOKEN_EXPIRES_IN',
    'PORT'
];

const optionalEnvVars = [
    'EMAIL_USER',
    'EMAIL_PASS',
    'NODE_ENV'
];

console.log('📋 Environment Variables Check:');
let envIssues = 0;

requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
        console.log(`❌ Missing required: ${envVar}`);
        envIssues++;
    } else {
        console.log(`✅ Found: ${envVar}`);
    }
});

optionalEnvVars.forEach(envVar => {
    if (process.env[envVar]) {
        console.log(`✅ Found optional: ${envVar}`);
    } else {
        console.log(`⚠️  Missing optional: ${envVar}`);
    }
});

// Check file structure
console.log('\n📁 File Structure Check:');
const requiredFiles = [
    'src/app.js',
    'src/server.js',
    'src/db/index.js',
    'src/models/user.model.js',
    'src/models/task.model.js',
    'src/controllers/user.controller.js',
    'src/controllers/task.controller.js',
    'src/middlewares/auth.middleware.js',
    'src/routes/auth.routes.js',
    'src/routes/task.routes.js',
    'src/utils/ApiError.js',
    'src/utils/ApiResponse.js',
    'src/utils/asyncHandler.js',
    'src/services/email.service.js',
    'src/services/reminder.scheduler.js',
    'src/services/cron.scheduler.js',
    'src/services/nlp.services.js',
    'src/services/training_data.js'
];

let fileIssues = 0;
requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ Found: ${file}`);
    } else {
        console.log(`❌ Missing: ${file}`);
        fileIssues++;
    }
});

// Check package.json dependencies
console.log('\n📦 Dependencies Check:');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = [
    'express',
    'mongoose',
    'bcryptjs',
    'jsonwebtoken',
    'cookie-parser',
    'natural',
    'chrono-node',
    'rrule',
    'nodemailer',
    'node-cron'
];

let depIssues = 0;
requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ Found: ${dep}`);
    } else {
        console.log(`❌ Missing: ${dep}`);
        depIssues++;
    }
});

// Check for common issues
console.log('\n🔧 Common Issues Check:');

// Check for duplicate function names
const taskController = fs.readFileSync('src/controllers/task.controller.js', 'utf8');
const functionNames = taskController.match(/const\s+(\w+)\s*=/g);
if (functionNames) {
    const names = functionNames.map(match => match.replace(/const\s+(\w+)\s*=/, '$1'));
    const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
    if (duplicates.length > 0) {
        console.log(`❌ Duplicate function names: ${duplicates.join(', ')}`);
    } else {
        console.log('✅ No duplicate function names found');
    }
}

// Check for missing imports
const importIssues = [];
if (!taskController.includes('import { Task }')) {
    importIssues.push('Task model import');
}
if (!taskController.includes('import asyncHandler')) {
    importIssues.push('asyncHandler import');
}
if (!taskController.includes('import { ApiError }')) {
    importIssues.push('ApiError import');
}
if (!taskController.includes('import ApiResponse')) {
    importIssues.push('ApiResponse import');
}

if (importIssues.length > 0) {
    console.log(`❌ Missing imports: ${importIssues.join(', ')}`);
} else {
    console.log('✅ All required imports found');
}

// Summary
console.log('\n📊 Validation Summary:');
const totalIssues = envIssues + fileIssues + depIssues + importIssues.length;

if (totalIssues === 0) {
    console.log('🎉 All checks passed! Backend is ready to run.');
    console.log('\n🚀 To start the server:');
    console.log('   npm start');
    console.log('\n🧪 To run tests:');
    console.log('   node test-backend.js');
} else {
    console.log(`❌ Found ${totalIssues} issues that need to be fixed.`);
    console.log('\n🔧 Fix the issues above before starting the server.');
}

console.log('\n📝 Environment Variables Template:');
console.log('Create a .env file with the following variables:');
console.log(`
MONGODB_URL=mongodb://localhost:27017/scheduling_project
JWT_ACCESS_TOKEN=your_access_token_secret
JWT_REFRESH_TOKEN=your_refresh_token_secret
ACCESS_TOKEN_EXPIRES_IN=15m
REFRESH_TOKEN_EXPIRES_IN=7d
PORT=3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
NODE_ENV=development
`);