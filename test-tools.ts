import createServer, { configSchema } from './src/index.js';

async function testMCPTools() {
    console.log('🔧 Testing MCP Server Tools...\n');

    try {
        // Test with debug config and actual cookies
        const config = configSchema.parse({
            debug: true,
            cookies: "VISITOR_INFO1_LIVE=JYiVNjcmCRY; VISITOR_PRIVACY_METADATA=CgJWThIEGgAgIQ%3D%3D; _gcl_au=1.1.2013901205.1756905558; SID=g.a0001gjIagc8Q9II7Ii2wVRC4E3M7IUthsMb_PwdYvK9pgucVZ83mwT8QYT_qfLALfbsZykSIgACgYKAccSARISFQHGX2Mi9iv0MqkxOu5TuyBMVH568xoVAUF8yKoH-js_aFy2h0-lu9VIxSKv0076; __Secure-1PSID=g.a0001gjIagc8Q9II7Ii2wVRC4E3M7IUthsMb_PwdYvK9pgucVZ83sz08vqGXgYdTxpIwSv0c9wACgYKAWYSARISFQHGX2MiCgEdJMs8JnAfQmWYqEaNQBoVAUF8yKpY6yUdqUmCjsIoncLoZqOS0076; __Secure-3PSID=g.a0001gjIagc8Q9II7Ii2wVRC4E3M7IUthsMb_PwdYvK9pgucVZ83CKT7ZxIzU6Q1RU6iyLUH_AACgYKAQISARISFQHGX2MilD-am9sZ6v3qU-DUe7d8SRoVAUF8yKoBQmxbKnM8i1gqG7bbHRBd0076; HSID=A1JLOBWaJGvQr5rN2; SSID=A8nO7HK7Vlhml7eHD; APISID=xqhtcqxKgE6XPp0i/AUna6hLT-7BHyc2hA; SAPISID=enyoYefTRlkOsueg/A5Hvuwe-mm6djwAlg; __Secure-1PAPISID=enyoYefTRlkOsueg/A5Hvuwe-mm6djwAlg; __Secure-3PAPISID=enyoYefTRlkOsueg/A5Hvuwe-mm6djwAlg; YSC=mip-xjrR1-I; LOGIN_INFO=AFmmF2swRAIgJ85MRSw7KIs3WjbhfUh_FoXROKGtQejj0qPf_Rcer4MCICzFo77E1D8csBKT8TQbsjjeOh9HlWXtF5fRA4WSdrIE:QUQ3MjNmeE55TFZqeDNFWS1nNk9sMDI3MTYtYnJTT0Q0UjRYTWU3Vk5KVUxOMWJKcjZKVng1eE9uWXpkQXFBZlF5RzA5eXZCT1JKdERkelA1cG9tZlJGdUxDMkpDd3NTYmFBMHZId1Z1am81Si1MVURmU0NjV1NKVWE0YjllZ3B6QU9rVjRZN2wwek1icUtuSnZzV0RUNDdxUUZNdHg1VkJB; PREF=f6=80&tz=Asia.Saigon&f5=20000&f7=100&f4=10000&repeat=NONE&volume=53&autoplay=true; __Secure-ROLLOUT_TOKEN=CKagkJzMhPa03QEQ5cbU-Ke0jwMYl9ytlKvxjwM%3D; __Secure-1PSIDTS=sidts-CjQBmkD5SyPbnEru9fjRpHC9tvvomNQ5ONXWsws3nQClRWcE0lcTkuHvXZe2TniGQOGZNKkIEAA; __Secure-3PSIDTS=sidts-CjQBmkD5SyPbnEru9fjRpHC9tvvomNQ5ONXWsws3nQClRWcE0lcTkuHvXZe2TniGQOGZNKkIEAA; SIDCC=AKEyXzUPHcgdyuLxhO6XGhmrS2CgvsUgLJhPJmRNTDPdnTVLXLgBjMsiBN9Sd373aP3zRb7kaA; __Secure-1PSIDCC=AKEyXzVPQM327GrdhNxcmzVCSI03Z8-FJyXKzoR8RkAwGt99yImdIYZD850v8J4WHe3z-iTVLe0; __Secure-3PSIDCC=AKEyXzVow_b394KjdK3Eoy6DNYqLcZrn8BW_VnXm1gs6QlWNd6YfFATbTJnwUwivCVrXhnoSEDA"
        });

        console.log('🏗️  Creating MCP server...');
        const mcpServer = createServer({ config });

        console.log('✅ MCP Server created');

        // Test tools/list method
        console.log('🔍 Testing tools/list request...');

        try {
            const toolsListRequest = {
                jsonrpc: '2.0',
                id: 1,
                method: 'tools/list',
                params: {}
            };

            console.log('📤 Sending request:', JSON.stringify(toolsListRequest, null, 2));

            // Call the request method
            const response = await mcpServer.request(toolsListRequest);

            console.log('📥 Response received:', JSON.stringify(response, null, 2));

            if (response && response.result && response.result.tools) {
                console.log(`🎉 Found ${response.result.tools.length} tools!`);
                response.result.tools.forEach((tool: any, index: number) => {
                    console.log(`  ${index + 1}. ${tool.name} - ${tool.description}`);
                });
            } else {
                console.log('❌ No tools found in response');
            }

        } catch (requestError) {
            console.error('❌ Error making tools/list request:', requestError);
        }

        // Also try initialize first
        console.log('\n🤝 Testing full MCP initialization flow...');

        try {
            const initRequest = {
                jsonrpc: '2.0',
                id: 1,
                method: 'initialize',
                params: {
                    protocolVersion: '2025-06-18',
                    capabilities: {},
                    clientInfo: { name: 'test-client', version: '1.0.0' }
                }
            };

            const initResponse = await mcpServer.request(initRequest);
            console.log('✅ Initialize response:', JSON.stringify(initResponse, null, 2));

            // Now try tools/list after initialization
            const toolsResponse = await mcpServer.request({
                jsonrpc: '2.0',
                id: 2,
                method: 'tools/list',
                params: {}
            });

            console.log('📋 Tools after init:', JSON.stringify(toolsResponse, null, 2));

        } catch (error) {
            console.error('❌ Error in init flow:', error);
        }

    } catch (error) {
        console.error('💥 Error in test:', error);
        console.error('Stack:', error.stack);
    }

    console.log('\n🏁 Tools test completed');
}

testMCPTools();