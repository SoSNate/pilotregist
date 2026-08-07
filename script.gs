/**
 * Google Apps Script for Hasbaonautica Tutor Landing Page (PRESALE)
 * Received data from landing page and appends to Google Sheet (Excel).
 * 
 * Deployment:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1Pl4hGiPqQXz_15hEXpSGwbAg-IIYHvvLqmwpBe5zx6Q/
 * 2. Extensions -> Apps Script -> Paste this code.
 * 3. Deploy -> New Deployment -> Web App -> Execute as: Me, Who has access: Anyone.
 */

function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('1Pl4hGiPqQXz_15hEXpSGwbAg-IIYHvvLqmwpBe5zx6Q');
    var sheet = ss.getSheetByName('לידים') || ss.getSheets()[0];

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Auto-create header row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['#', 'תאריך ושעה', 'שם מלא', 'מספר טלפון', 'אימייל', 'כמות תלמידים / כיתה', 'הערות נוספות']);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#0f172a').setFontColor('#38bdf8');
    }

    var rowNum = sheet.getLastRow();
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm:ss');
    
    var name = data.name || data.fullName || '';
    var email = data.email || '';
    var phone = data.phone ? '\'' + String(data.phone).replace(/[' font-bold]/g, '') : '';
    var studentsCount = data.studentsCount || data.studentCount || '';
    var about = data.about || data.notes || '';

    sheet.appendRow([
      rowNum,
      nowStr,
      name,
      phone,
      email,
      studentsCount,
      about
    ]);

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Lead recorded successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'active', service: 'Hasbaonautica Lead Collector' }))
    .setMimeType(ContentService.MimeType.JSON);
}
