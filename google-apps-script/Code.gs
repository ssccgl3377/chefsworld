/**
 * The Chef's World form backend.
 *
 * Deploy this Apps Script as a web app.  It creates a spreadsheet named
 * "ChefsWorld Client Submissions" in the owner's Google Drive on its first
 * valid submission, records each enquiry, and emails the notification inbox.
 */
const CONFIG = {
  spreadsheetName: 'ChefsWorld Client Submissions',
  sheetName: 'Submissions',
  notificationEmail: 'chefsworldglobal@gmail.com',
};

const HEADERS = [
  'Submitted at',
  'Package',
  'Price',
  'Campaign target',
  'Campaign duration',
  'Name',
  'Email',
  'Instagram username',
  'Social media links',
  'Business / profile description',
  'Campaign remarks',
  'Payment preference',
];

function doGet() {
  return json_({ ok: true, service: "The Chef's World form backend" });
}

function doPost(e) {
  try {
    const payload = JSON.parse((e && e.postData && e.postData.contents) || '{}');

    // Ignore bots that fill the hidden honeypot field.
    if (payload.website) return json_({ ok: true });

    if (!payload.name || !payload.email || !payload.packageName) {
      return json_({ ok: false, error: 'Missing required submission data.' });
    }

    const sheet = getSheet_();
    const row = [
      new Date(),
      payload.packageName,
      payload.packagePrice,
      payload.campaignTarget,
      payload.campaignDuration,
      payload.name,
      payload.email,
      payload.instagram,
      payload.socialLinks,
      payload.description,
      payload.remarks,
      payload.paymentMethod,
    ].map(safeCell_);

    sheet.appendRow(row);
    notify_(payload);
    return json_({ ok: true });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'Unable to save the submission.' });
  }
}

function getSheet_() {
  const files = DriveApp.getFilesByName(CONFIG.spreadsheetName);
  const spreadsheet = files.hasNext()
    ? SpreadsheetApp.open(files.next())
    : SpreadsheetApp.create(CONFIG.spreadsheetName);

  const sheet = spreadsheet.getSheetByName(CONFIG.sheetName)
    || spreadsheet.insertSheet(CONFIG.sheetName);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.autoResizeColumns(1, HEADERS.length);
  }
  return sheet;
}

function notify_(payload) {
  const lines = [
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    `Instagram: ${payload.instagram || 'Not provided'}`,
    `Package: ${payload.packageName} (${payload.packagePrice || 'Custom'})`,
    `Target: ${payload.campaignTarget || 'Custom'}`,
    `Duration: ${payload.campaignDuration || 'Custom'}`,
    `Payment preference: ${payload.paymentMethod || 'Not provided'}`,
    '',
    'Business / profile description:',
    payload.description || 'Not provided',
    '',
    'Campaign remarks:',
    payload.remarks || 'Not provided',
  ];

  MailApp.sendEmail({
    to: CONFIG.notificationEmail,
    subject: `New Chef's World enquiry — ${payload.packageName}`,
    body: lines.join('\n'),
  });
}

function safeCell_(value) {
  const text = String(value == null ? '' : value);
  // Prevent spreadsheet formulas from being executed when a client enters
  // a value that starts with a formula-significant character.
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

function json_(value) {
  return ContentService
    .createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

