const http = require('http');

const BASE_URL = 'http://localhost:5000/api';

// Helper for requests
function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (token) {
            options.headers['x-auth-token'] = token;
        }

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({ status: res.statusCode, data: parsed });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });

        req.on('error', (e) => reject(e));

        if (body) {
            req.write(JSON.stringify(body));
        }
        req.end();
    });
}

async function seedData() {
    console.log('--- Starting Data Seeding ---');

    // 1. Create Admin
    const adminCreds = {
        name: 'System Admin',
        email: 'admin@prabhuji.com',
        password: 'password123',
        role: 'admin'
    };

    console.log(`\n1. Creating Admin (${adminCreds.email})...`);
    // Try to register (works if public register is open/proxied or we just use register route)
    // In our routes, /api/auth/register is public.
    let adminRes = await request('POST', '/auth/register', adminCreds);

    if (adminRes.status === 400 && adminRes.data.msg === 'User already exists') {
        console.log('Admin already exists. Logging in...');
        adminRes = await request('POST', '/auth/login', { email: adminCreds.email, password: adminCreds.password });
    }

    if (!adminRes.data.token) {
        console.error('Failed to authenticate Admin:', adminRes.data);
        return;
    }

    const adminToken = adminRes.data.token;
    console.log('Admin Authenticated.');

    // 2. Create Counselor (By Admin)
    const counselorCreds = {
        name: 'Senior Counselor',
        email: 'counselor@prabhuji.com',
        password: 'password123',
        role: 'counselor'
    };

    console.log(`\n2. Creating Counselor (${counselorCreds.email})...`);
    let counRes = await request('POST', '/auth/create-user', counselorCreds, adminToken);

    if (counRes.status === 400 && counRes.data.msg === 'User already exists') {
        console.log('Counselor already exists. Logging in to get ID...');
        // We can't login as someone else easily unless we just login normally
        const loginRes = await request('POST', '/auth/login', { email: counselorCreds.email, password: counselorCreds.password });
        counRes = { data: { user: loginRes.data.user } }; // Mock structure
    } else if (counRes.status !== 200) {
        console.error('Failed to create Counselor:', counRes.data);
        // Try continuing if logic allows, but likely fail
    }

    const counselorId = counRes.data.user.id;
    console.log(`Counselor ID: ${counselorId}`);

    // Login as Counselor to create their user (Best practice for role enforcement test)
    // Or Admin can create user and assign counselor. Let's do Admin assigns Counselor.

    // 3. Create User (By Admin, Assigned to Counselor)
    const userCreds = {
        name: 'Client User',
        email: 'user@prabhuji.com',
        password: 'password123',
        role: 'user',
        counselorId: counselorId
    };

    console.log(`\n3. Creating User (${userCreds.email}) assigned to Counselor...`);
    let userRes = await request('POST', '/auth/create-user', userCreds, adminToken);

    if (userRes.status === 400 && userRes.data.msg === 'User already exists') {
        console.log('User already exists.');
    } else if (userRes.status === 200) {
        console.log('User created and assigned successfully.');
    } else {
        console.error('Result:', userRes.data);
    }

    console.log('\n--- Seeding Complete ---');
    console.log('Credentials:');
    console.log('Admin: admin@prabhuji.com / password123');
    console.log('Counselor: counselor@prabhuji.com / password123');
    console.log('User: user@prabhuji.com / password123');
}

seedData();
