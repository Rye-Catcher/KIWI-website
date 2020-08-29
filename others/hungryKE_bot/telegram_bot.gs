var token = "705007313:AAHDYj0GYE9NpSElA9JLLhjZ3Fc2UsqOtJ8";
var telegramUrl = "https://api.telegram.org/bot" + token;
var googleSheetId = "1FLT1rvaHUhDxyDUQYN-sfCaYlxJ2MJq-t7UQob_kXtw";
var webAppUrl ="https://script.google.com/macros/s/AKfycbyyoLI2bOzqgfRRK_TFPuGIJZTg10Ab2oT4y5EN3SQUklHX96c/exec";

function getMe() {
    var response = UrlFetchApp.fetch(telegramUrl + "/getMe");
    Logger.log(response.getContentText());
}

function getUpdates() {
    var response = UrlFetchApp.fetch(telegramUrl + "/getUpdates");
    Logger.log(response.getContentText());
}

function setWebhook(){ 
    var response = UrlFetchApp.fetch(telegramUrl + "/setWebhook?url=" + WebAppUrl); 
    Logger.log(response.getContentText()); 
}

function sendTestText(){ 
    var response = UrlFetchApp.fetch(telegramUrl + "/sendMessage?chat_id=" + "744355462" + "&text=" + "damn!"); 
    Logger.log(response.getContentText()); 
}

function sendText(id, text){ 
    var response = UrlFetchApp.fetch(telegramUrl + "/sendMessage?chat_id=" + id + "&text=" + text); 
    Logger.log(response.getContentText()); 
}

function doGet(e){
    return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
    Logger.log(e);
}

function doPost(e){
    var contents = JSON.parse(e.postData.contents);
    contents.message.chat.id = contents.message.chat.id + '';
  
    var usr_id = contents.message.chat.id;
    var usr_name = contents.message.from.first_name;
  
    /*
    for testing
    sendText(contents.message.chat.id+'', "helloworld");
    sendTestText();
    */

    //greetings
    sendText(usr_id, "Welcome back! " + usr_name);   
    var date = new Date();
    var curr_month = date.getMonth() + 1;
    var curr_day = date.getDate();
    var curr_year = date.getYear();
    sendText(usr_id, "today's date is " + curr_day + "/" + curr_month + "/" + curr_year);

  
    //get spreadsheet
    var ss = SpreadsheetApp.openById(googleSheetId);
    var sheetData = ss.getDataRange().getValues();  

    //To find out which row matches the date
    var row = 0;
    
    for(var i = 0; i < sheetData.length; i++){
        if(sheetData[i][0] == curr_day && sheetData[i][1] == curr_month){ 
            Logger.log((i+1));
            row = i+1;
        } 
        else if (row == 0) {
            row = -1;
        }
    }
  
    if(row == -1) {
        sendText(usr_id, "hehe... sorry there's no meal today :p");
    } 
    else {
        var payload = {
            'method': 'sendMessage',
            'chat_id': usr_id,
            'text': outputMenu(contents, ss, row),
            'parse_mode': 'HTML'
        }
        var data = {
            "method": "post",
            "payload": payload
        }
        UrlFetchApp.fetch(telegramUrl + '/', data);

        var notice = 
            '<b>' + 'Please take note that:' + '</b>' + '\n'
            + '\n' + '<b>' + 'For Breakfast (7am to 10am)' + '</b>'
            + '\n' + '- The resident is to choose one of the option from the category.'
            + '\n' + '- If resident has chosen the Bread & Cake selection, the resident is to choose one of the option from the Bread & Cake selection.'
            + '\n' + '- If resident has chosen the Hot Selection, the resident is to choose one of the option from the Hot Selection. The side dish is served with the Hot Selection.'
            + '\n' + '- The enriched bread is a free serving option.'
            + '\n'
            + '<b>' + 'For Dinner (5.30pm to 9pm)' + '</b>' + '\n'
            + '\n' + '- On Mon, Wed & Fri will be served with economical rice with selection of 2 choices of meats, one choice of side dish and a choice of seasonal vegetable.'
            + '\n' + '- On Tue, Thu and Sun will be served with daily special. Choose 1 from the 2 selections provided.'
            + '\n'
            + 'thank-you ' + usr_name + ', enjoy your meal :)';

        var payload = {
            'method': 'sendMessage',
            'chat_id': usr_id,
            'text': notice,
            'parse_mode': 'HTML'
        }
        var data = {
            "method": "post",
            "payload": payload
        }

        UrlFetchApp.fetch(telegramUrl + '/', data);
    }  


    return HtmlService.createHtmlOutput("Hello " + JSON.stringify(e));
}

function outputMenu(e, ss, row) {
    if (e.message.text) {
        var usrText = e.message.text;

        if(usrText == 'Breakfast' || usrText == 'breakfast') {
            var b1 = ss.getRange(row, 3).getValue();
            var b2 = ss.getRange(row, 4).getValue();
            var b3 = ss.getRange(row, 5).getValue();
            var b4 = ss.getRange(row, 6).getValue();
            var b5 = ss.getRange(row, 7).getValue();

            var breakfast =   
                '<b>' + "Breakfast" + '</b>' + '\n'
                + '\n' + " - " + b1 
                + '\n' + " - " + b2 
                + '\n' + " - " + b3 
                + '\n' + " - " + b4 
                + '\n' + " - " + b5;
            var outputStr = breakfast;
        }
        else if(usrText == 'Dinner' || usrText == 'dinner' || usrText == 'supper') {
            var m1 = ss.getRange(row, 8).getValue();
            var m2 = ss.getRange(row, 9).getValue();
            var m3 = ss.getRange(row, 10).getValue();
            var v1 = ss.getRange(row, 11).getValue();
            var v2 = ss.getRange(row, 12).getValue();
            var v3 = ss.getRange(row, 13).getValue();
            var sd1 = ss.getRange(row, 14).getValue();
            var sd2 = ss.getRange(row, 15).getValue();
            var sd3 = ss.getRange(row, 16).getValue();
            var sd4 = ss.getRange(row, 17).getValue();
            var sp1 = ss.getRange(row, 18).getValue();
            var sp2 = ss.getRange(row, 19).getValue();
            var sp3 = ss.getRange(row, 20).getValue();
            var fruit = ss.getRange(row, 21).getValue();
            var soup = ss.getRange(row, 22).getValue();
    
            var sp = "";
            var dinner =   
                '<b>' + "Dinner" + '</b>' + '\n'
                + '\n' + sp + '<b>' + "[Meat]" + '</b>' 
                + '\n' + " - " + m1 
                + '\n' + " - " + m2 
                + '\n' + " - " + m3 
                + '\n' + sp + '<b>' + "[Vege]" + '</b>' 
                + '\n' + " - " + v1
                + '\n' + " - " + v2
                + '\n' + " - " + v3
                + '\n' + sp + '<b>' + "[Side Dishes]" + '</b>' 
                + '\n' + " - " + sd1
                + '\n' + " - " + sd2
                + '\n' + " - " + sd3
                + '\n' + " - " + sd4
                + '\n' + sp + '<b>' + "[Special Dishes]" + '</b>' 
                + '\n' + " - " + sp1
                + '\n' + " - " + sp2
                + '\n' + " - " + sp3
                + '\n' + sp + '<b>' + "[Fruit n Dessert]" + '</b>' 
                + '\n' + " - " + fruit
                + '\n' + " " + '<b>' + "[Soup]" + '</b>' 
                + '\n' + " - " + soup;
            var outputStr = dinner;
        } 
        else if (usrText == "tommorow" || usrText == "Tommorow") {
            var tmr_row = row+1;
            var tb1 = ss.getRange(tmr_row, 3).getValue();
            var tb2 = ss.getRange(tmr_row, 4).getValue();
            var tb3 = ss.getRange(tmr_row, 5).getValue();
            var tb4 = ss.getRange(tmr_row, 6).getValue();
            var tb5 = ss.getRange(tmr_row, 7).getValue();

            var tmr_breakfast =   
                '<b>' + "and tmr's breakfast" + '</b>' + '\n'
                + '\n' + " - " + tb1 
                + '\n' + " - " + tb2 
                + '\n' + " - " + tb3 
                + '\n' + " - " + tb4 
                + '\n' + " - " + tb5;
            var outputStr = tmr_breakfast;
        }
        else {
            var outputStr = "Pls text `breakfast`, `dinner` or 'tommorow' :D";
        }
    }
    else {
        var outputStr = "Pls text `breakfast`, `dinner` or 'tommorow' :D";
    }
    return outputStr
}

