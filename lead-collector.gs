/**
 * Google Apps Script for Chashbonautika Landing Pages (PRESALE)
 * Receives lead data from the landing pages, appends it to a Google
 * Sheet, and emails a notification for every new signup.
 *
 * Deployment:
 * 1. Open Google Sheet: https://docs.google.com/spreadsheets/d/1Pl4hGiPqQXz_15hEXpSGwbAg-IIYHvvLqmwpBe5zx6Q/
 * 2. Extensions -> Apps Script -> Paste this code.
 * 3. Update NOTIFY_EMAIL below.
 * 4. Deploy -> New Deployment -> Web App -> Execute as: Me, Who has access: Anyone.
 */

var NOTIFY_EMAIL = 'razbitton@gmail.com';

var ROLE_LABELS = {
  teacher: 'מורה',
  parent: 'הורה',
  institution: 'מוסד/בית ספר'
};

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
      sheet.appendRow(['#', 'תאריך ושעה', 'שם מלא', 'מספר טלפון', 'אימייל', 'תפקיד', 'כמות תלמידים / ילדים', 'הערות נוספות']);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold').setBackground('#0f172a').setFontColor('#38bdf8');
    }

    var rowNum = sheet.getLastRow();
    var nowStr = Utilities.formatDate(new Date(), 'Asia/Jerusalem', 'dd/MM/yyyy HH:mm:ss');

    var name = data.name || data.fullName || '';
    var email = data.email || '';
    var phone = data.phone ? '\'' + String(data.phone).replace(/['\s-]/g, '') : '';
    var role = data.role || '';
    var roleLabel = ROLE_LABELS[role] || role || '';
    var studentsCount = data.studentsCount || data.studentCount || '';
    var about = data.about || data.notes || '';

    sheet.appendRow([
      rowNum,
      nowStr,
      name,
      phone,
      email,
      roleLabel,
      studentsCount,
      about
    ]);

    sendNewLeadNotification({
      name: name,
      phone: data.phone || '',
      email: email,
      roleLabel: roleLabel,
      studentsCount: studentsCount,
      about: about,
      nowStr: nowStr
    });

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: 'Lead recorded successfully' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function sendNewLeadNotification(lead) {
  if (!NOTIFY_EMAIL) return;
  try {
    var subject = 'ליד חדש בחשבונאוטיקה' + (lead.roleLabel ? ' — ' + lead.roleLabel : '');
    var bodyLines = [
      'התקבל ליד חדש דרך דף הנחיתה:',
      '',
      'שם: ' + (lead.name || '—'),
      'תפקיד: ' + (lead.roleLabel || '—'),
      'טלפון: ' + (lead.phone || '—'),
      'אימייל: ' + (lead.email || '—'),
      'כמות תלמידים/ילדים: ' + (lead.studentsCount || '—'),
      lead.about ? ('הערות: ' + lead.about) : '',
      '',
      'זמן: ' + lead.nowStr
    ];
    MailApp.sendEmail(NOTIFY_EMAIL, subject, bodyLines.filter(Boolean).join('\n'));
  } catch (mailErr) {
    console.error('Failed to send lead notification email: ' + mailErr.toString());
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ status: 'active', service: 'Chashbonautika Lead Collector' }))
    .setMimeType(ContentService.MimeType.JSON);
}
