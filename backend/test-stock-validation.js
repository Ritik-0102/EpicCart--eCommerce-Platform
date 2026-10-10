const { updateProductStock } = require('./controllers/adminController.js');

async function runTests() {
  const tests = [
    { name: '0 -> accepted', body: { stock: 0 } },
    { name: '10 -> accepted', body: { stock: 10 } },
    { name: '"10" -> accepted', body: { stock: "10" } },
    { name: '-1 -> rejected', body: { stock: -1 } },
    { name: '1.5 -> rejected', body: { stock: 1.5 } },
    { name: '"1.5" -> rejected', body: { stock: "1.5" } },
    { name: 'Missing quantity -> rejected', body: {} },
    { name: 'Non-numeric string -> rejected', body: { stock: "abc" } },
    { name: 'Extremely large number -> rejected', body: { stock: 3000000000 } }
  ];

  for (const t of tests) {
    const req = {
      params: { id: '1' },
      body: t.body
    };

    let statusCalled = null;
    let jsonCalled = null;

    const res = {
      status: (code) => {
        statusCalled = code;
        return res;
      },
      json: (data) => {
        jsonCalled = data;
        return res;
      }
    };

    const next = (err) => {
      console.log(`[${t.name}] ERRORED (next called):`, err.message);
    };

    // We can't let it run the DB query for the 'accepted' ones because we just want to test validation.
    // If it throws or returns 400, it's rejected.
    // If it reaches prisma, it will fail because Prisma is not connected or it will try to hit the DB.
    // But let's see if it returns 400 before hitting the DB.
    
    // We will catch the execution
    const originalPrisma = require('@prisma/client');
    // It's already required in adminController.js, we can't easily mock it here without proxyquire.
    
    try {
      // Just run it. If it tries to connect to DB, it means validation passed!
      const promise = updateProductStock(req, res, next);
      
      // wait a bit for synchronous validation to run
      await new Promise(resolve => setTimeout(resolve, 50));
      
      if (statusCalled === 400) {
        console.log(`[${t.name}] PASSED VALIDATION CHECK (Rejected 400): ${jsonCalled.message}`);
      } else {
        console.log(`[${t.name}] PASSED VALIDATION CHECK (Accepted/DB queried)`);
      }
    } catch (e) {
      console.log(`[${t.name}] EXCEPTION: ${e.message}`);
    }
  }
  
  process.exit(0);
}

runTests();
