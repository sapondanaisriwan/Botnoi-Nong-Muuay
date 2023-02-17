var sheeturl = "https://docs.google.com/spreadsheets/d/.../edit?usp=sharing";

function doGet(request) {
  // Change Spread Sheet url
  var custid = request.parameter.custid;
  var orderid = "789";
  var pname = request.parameter.pname;
  var quantity = request.parameter.quantity;
  //Logger.log(pname)
  var result = addorder(orderid, custid, pname, quantity);
  //Logger.log(jo)
  result = {};
  result["result"] = 200;
  result = JSON.stringify(result);
  return ContentService.createTextOutput(result).setMimeType(
    ContentService.MimeType.JSON
  );
}

function addorder(
  oid = "789",
  custid = "123",
  pname = "Corsair K100 RGB",
  quantity = 1
) {
  var sheetname = "สินค้า";
  var psheet = gspandas.gsdataframe(sheeturl, sheetname);
  var currentval = parseInt(psheet.getvalue("ชื่อสินค้า", pname, "ปริมาณ"), 10);
  psheet.updatevalue("ชื่อสินค้า", pname, "ปริมาณ", currentval - quantity);
  var pinfo = psheet.getrowdict("ชื่อสินค้า", pname)[0];
  var trx = [
    Date(Date.now()).toString(),
    oid,
    custid,
    pinfo["รหัสสินค้า"],
    pinfo["ชื่อสินค้า"],
    pinfo["ราคา"],
    quantity,
  ];

  var sheetname = "ออเดอร์";
  var osheet = gspandas.gsdataframe(sheeturl, sheetname);
  osheet.sheet.appendRow(trx);
}

function deleteorder() {
  var sheetname = "ออเดอร์";
  var psheet = gspandas.gsdataframe(sheeturl, sheetname);
  psheet.deleterows("รหัสลูกค้า", custid);
}
