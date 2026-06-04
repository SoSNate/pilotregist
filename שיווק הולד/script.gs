function doPost(e) {
  try {
    var ss = SpreadsheetApp.openById('1Pl4hGiPqQXz_15hEXpSGwbAg-IIYHvvLqmwpBe5zx6Q');
    var sheet = ss.getSheetByName('לידים') || ss.getSheets()[0];

    var data = JSON.parse(e.postData.contents);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['#', 'תאריך', 'שם', 'אימייל', 'טלפון', 'הצעה לשם']);
    }

    var rowNum = sheet.getLastRow();
    sheet.appendRow([
      rowNum,
      new Date().toLocaleString('he-IL'),
      data.name || '',
      data.email || '',
      data.phone ? '\'' + data.phone : '',
      data.platformName || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    console.error("Error in doPost: " + err.toString());
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
