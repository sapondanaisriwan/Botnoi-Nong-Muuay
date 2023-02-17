var sheeturl = "https://docs.google.com/spreadsheets/d/.../edit?usp=sharing";

function doGet(request) {
  var custid = request.parameter.custid;
  deleteorder(custid);

  result = {};
  result["result"] = "deleted";
  result = JSON.stringify(result);
  return ContentService.createTextOutput(result).setMimeType(
    ContentService.MimeType.JSON
  );
}

function deleteorder(custid) {
  var sheetname = "ออเดอร์";
  var psheet = gspandas.gsdataframe(sheeturl, sheetname);
  psheet.deleterows("รหัสลูกค้า", custid);
}
