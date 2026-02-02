const http = require('http');
const fs = require('fs');

function log(msg) {
    fs.appendFileSync('verify_log.txt', msg + '\n');
    console.log(msg);
}

// Helper for requests
function request(method, path, body, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
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
                    console.log('Error parsing JSON:', data);
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

async function runTest() {
    const timestamp = Date.now();
    const adminEmail = `admin${timestamp}@test.com`;
    const counselorEmail = `counselor${timestamp}@test.com`;
    const user1Email = `user1${timestamp}@test.com`;
    const user2Email = `user2${timestamp}@test.com`;

    log('1. Registering Admin...');
    const adminReg = await request('POST', '/api/auth/register', {
        name: 'Admin',
        email: adminEmail,
        password: 'password123',
        role: 'admin'
    });
    log('Admin Register Status:', adminReg.status);
    const adminToken = adminReg.data.token;

    log('\n2. Creating Counselor (as Admin)...');
    const counselorReg = await request('POST', '/api/auth/create-user', {
        name: 'Counselor',
        email: counselorEmail,
        password: 'password123',
        role: 'counselor'
    }, adminToken);
    log('Counselor Create Status:', counselorReg.status);
    const counselorId = counselorReg.data.user.id;

    // Login as Counselor to get token
    const counselorLogin = await request('POST', '/api/auth/login', {
        email: counselorEmail,
        password: 'password123'
    });
    const counselorToken = counselorLogin.data.token;


    log('\n3. Creating User 1 (as Counselor)...');
    const user1Reg = await request('POST', '/api/auth/create-user', {
        name: 'User 1',
        email: user1Email,
        password: 'password123',
        role: 'user'
    }, counselorToken);
    log('User 1 Create Status:', user1Reg.status);
    if (user1Reg.data.user.counselor === counselorId) {
        log('SUCCESS: User 1 correctly assigned to Counselor');
    } else {
        log('FAIL: User 1 NOT assigned to Counselor correctly. Got:', user1Reg.data.user.counselor);
    }

    log('\n4. Creating User 2 (as Admin, assigned to Counselor)...');
    const user2Reg = await request('POST', '/api/auth/create-user', {
        name: 'User 2',
        email: user2Email,
        password: 'password123',
        role: 'user',
        counselorId: counselorId
    }, adminToken);
    log('User 2 Create Status:', user2Reg.status);
    if (user2Reg.data.user.counselor === counselorId) {
        log('SUCCESS: User 2 correctly assigned to Counselor');
    } else {
        log('FAIL: User 2 NOT assigned to Counselor correctly. Got:', user2Reg.data.user.counselor);
    }

    log('\n5. Checking Counselor Dashboard...');
    const counselorDash = await request('GET', '/api/users', null, counselorToken);
    log('Counselor Dash Status:', counselorDash.status);
    log('Counselor sees users:', counselorDash.data.length);
    const usersForCounselor = counselorDash.data.map(u => u.email);
    if (usersForCounselor.includes(user1Email) && usersForCounselor.includes(user2Email) && !usersForCounselor.includes(adminEmail)) {
        log('SUCCESS: Counselor sees correct users');
    } else {
        log('FAIL: Counselor sees incorrect users:', usersForCounselor);
    }

    log('\n6. Checking Admin Dashboard...');
    const adminDash = await request('GET', '/api/users', null, adminToken);
    log('Admin Dash Status:', adminDash.status);
    console.log('Admin sees users:', adminDash.data.length);
    // Should see everyone
    if (adminDash.data.length >= 4) { // Admin + Counselor + User1 + User2 + any existing
        console.log('SUCCESS: Admin sees all users');
    } else {
        console.log('FAIL: Admin count suspicious:', adminDash.data.length);
    }
}

runTest();
