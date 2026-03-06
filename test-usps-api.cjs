#!/usr/bin/env node

/**
 * USPS API TEST SCRIPT
 * Tests USPS Web Tools API connection with your credentials
 */

const https = require('https');

// Your USPS credentials
const USERID = '3P934TRACK349';
const PASSWORD = 'K9024ME92Z0856D';

// Test tracking number (use a real one if you have it)
const TEST_TRACKING_NUMBER = '9400111899223396156'; // Example USPS tracking number

console.log('🧪 USPS API TEST');
console.log('═══════════════════════════════════════\n');
console.log(`📋 USERID: ${USERID}`);
console.log(`🔑 PASSWORD: ${PASSWORD.substring(0, 5)}...`);
console.log(`📦 Test Tracking Number: ${TEST_TRACKING_NUMBER}\n`);

// Build XML request
const xmlRequest = `<TrackFieldRequest USERID="${USERID}"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp>const xmlRequest = `<TrackFieldRequest USERID="${USERID}"><Revision>1</Revision><ClientIp>127.0.0.1</ClientIp><SourceId>USPostalTracking</SourceId><TrackID ID="${TEST_TRACKING_NUMBER}"/></TrackFieldRequest>`;<TrackID ID="${TEST_TRACKING_NUMBER}"/></TrackFieldRequest>`;

const url = `https://secure.shippingapis.com/ShippingAPI.dll?API=TrackV2&XML=${encodeURIComponent(xmlRequest)}`;

console.log('🌐 Sending request to USPS API...\n');

https.get(url, { timeout: 10000 }, (resp) => {
  let data = '';
  
  resp.on('data', chunk => data += chunk);
  
  resp.on('end', () => {
    console.log('📥 Response received!\n');
    console.log('═══════════════════════════════════════');
    console.log('RAW XML RESPONSE:');
    console.log('═══════════════════════════════════════');
    console.log(data);
    console.log('═══════════════════════════════════════\n');
    
    // Check for errors
    if (data.includes('<Error>')) {
      console.log('❌ ERROR DETECTED:');
      const errorMatch = data.match(/<Description>(.*?)<\/Description>/);
      const errorNumber = data.match(/<Number>(.*?)<\/Number>/);
      if (errorMatch) console.log(`   Description: ${errorMatch[1]}`);
      if (errorNumber) console.log(`   Error Code: ${errorNumber[1]}`);
      
      console.log('\n💡 COMMON ERRORS:');
      console.log('   - "Authorization failure" = Wrong USERID or not registered');
      console.log('   - "Invalid tracking number" = Tracking number format wrong');
      console.log('   - "This Information has not been included" = Package not in system yet');
      
    } else if (data.includes('<TrackSummary>') || data.includes('<TrackDetail>')) {
      console.log('✅ SUCCESS! API is working correctly!');
      
      // Extract status
      const statusMatch = data.match(/<TrackSummary>(.*?)<\/TrackSummary>/);
      if (statusMatch) {
        console.log(`\n📦 Status: ${statusMatch[1]}`);
      }
      
      // Extract events
      const eventMatches = data.match(/<TrackDetail>(.*?)<\/TrackDetail>/g);
      if (eventMatches) {
        console.log(`\n📋 Events found: ${eventMatches.length}`);
        eventMatches.slice(0, 3).forEach((event, i) => {
          const eventText = event.replace(/<\/?TrackDetail>/g, '');
          console.log(`   ${i + 1}. ${eventText.substring(0, 100)}...`);
        });
      }
      
    } else {
      console.log('⚠️  UNEXPECTED RESPONSE FORMAT');
      console.log('   The API responded but format is not recognized');
    }
    
    console.log('\n═══════════════════════════════════════');
    console.log('TEST COMPLETE');
    console.log('═══════════════════════════════════════\n');
  });
  
}).on('error', (err) => {
  console.log('❌ CONNECTION ERROR:');
  console.log(`   ${err.message}\n`);
  console.log('💡 POSSIBLE CAUSES:');
  console.log('   - No internet connection');
  console.log('   - Firewall blocking HTTPS requests');
  console.log('   - USPS API is down (rare)\n');
});
