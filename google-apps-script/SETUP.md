# Google Sheets form backend setup

This script creates the **ChefsWorld Client Submissions** spreadsheet automatically in the Google Drive of the account that deploys it. It also emails each valid submission to `chefsworldglobal@gmail.com`.

## One-time deployment

1. Sign in as `ssccgl3377@gmail.com` and open [Google Apps Script](https://script.google.com/home).
2. Create a **New project**, replace the default code with the contents of `Code.gs`, and save it.
3. Choose **Deploy → New deployment → Web app**.
4. Set **Execute as** to **Me** and **Who has access** to **Anyone**, then deploy and complete Google's authorization prompts.
5. Copy the URL ending in `/exec` and send it here. It will be added to the website configuration.

After the website is connected, the first non-test submission creates the spreadsheet in the same Google Drive. Each client enquiry is added as a row and produces an email notification.

## Security note

The web-app URL is public so that visitors can submit the form. Do not share it beyond the website, and redeploy the script if you need to replace the endpoint.

