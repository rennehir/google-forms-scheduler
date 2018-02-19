FORM_OPEN_DATE	= "2018-02-19 14:50:00"; // "YYYY-MM-DD HH:MM:SS"
FORM_CLOSE_DATE	= "2018-02-19 16:00:00";
RESPONSE_COUNT	= "60";
EMAIL_ADDRESS	= "";
 
/* Web tutorial: http://labnol.org/?p=20707  */
 
/* Initialize the form, setup time based triggers */
function Initialize() {
  
  deleteTriggers_();
  
  if ((FORM_OPEN_DATE !== "") && 
      ((new Date()).getTime() < parseDate_(FORM_OPEN_DATE).getTime())) { 
    closeForm();
    ScriptApp.newTrigger("openForm")
    .timeBased()
    .at(parseDate_(FORM_OPEN_DATE))
    .create();
  }
  
  if (FORM_CLOSE_DATE !== "") { 
    ScriptApp.newTrigger("closeForm")
    .timeBased()
    .at(parseDate_(FORM_CLOSE_DATE))
    .create(); 
  }
  
  if (RESPONSE_COUNT !== "") { 
    ScriptApp.newTrigger("checkLimit")
    .forForm(FormApp.getActiveForm())
    .onFormSubmit()
    .create();
  }
  
}
 
/* Delete all existing Script Triggers */
function deleteTriggers_() {  
  var triggers = ScriptApp.getProjectTriggers();  
  for (var i in triggers) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}
 
/* Send a mail to the form owner when the form status changes */
function informUser_(subject) {
  var formURL = FormApp.getActiveForm().getPublishedUrl();
  MailApp.sendEmail(EMAIL_ADDRESS, subject, formURL);  // Session.getActiveUser().getEmail() does not always work
}
 
/* Allow Google Form to Accept Responses */
function openForm() {
  var form = FormApp.getActiveForm();
  form.setAcceptingResponses(true);
  informUser_("Your Google Form is now accepting responses");
}
 
/* Close the Google Form, Stop Accepting Reponses */
function closeForm() {  
  var form = FormApp.getActiveForm();
  form.setAcceptingResponses(false);
  deleteTriggers_();
  informUser_("Your Google Form is no longer accepting responses");
}
 
/* If Total # of Form Responses >= Limit, Close Form */
function checkLimit() {
  if (FormApp.getActiveForm().getResponses().length >= RESPONSE_COUNT ) {
    closeForm();
  }  
}
 
/* Parse the Date for creating Time-Based Triggers */
function parseDate_(d) {
  return new Date(d.substr(0,4), d.substr(5,2)-1, 
                  d.substr(8,2), d.substr(11,2), d.substr(14,2));
}
 
/* Written by Amit Agarwal amit@labnol.org */
/* Edited by Renne Hirsimäki github.com/rennehir */