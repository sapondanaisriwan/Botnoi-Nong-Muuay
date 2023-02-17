var sheeturl = "https://docs.google.com/spreadsheets/d/.../edit?usp=sharing";

function exploreclass(
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
    pinfo["คะแนน"],
    pinfo["ราคา"],
    quantity,
  ];

  var sheetname = "ออเดอร์";
  var osheet = gspandas.gsdataframe(sheeturl, sheetname);
  osheet.sheet.appendRow(trx);
}

function getproductdata(category = "อุปกรณ์") {
  var sheetname = "สินค้า";
  var psheet = gspandas.gsdataframe(sheeturl, sheetname);
  var pinfo = psheet.getrowdict("หมวด", category);
  Logger.log(pinfo);
  return pinfo;
}

function genproductflex(category, ncol = 4) {
  var pdata = getproductdata(category);
  var pflex = getmultipleflex(pdata, ncol);
  Logger.log(pflex);
  return pflex;
}

function doGet(request) {
  // Change Spread Sheet url
  var category = request.parameter.category;
  var ncol = request.parameter.ncol;
  //Logger.log(pname)
  var result = genproductflex(category, ncol);
  //Logger.log(jo)
  result = JSON.stringify(result);
  return ContentService.createTextOutput(result).setMimeType(
    ContentService.MimeType.JSON
  );
}

function getmenuflex(mimage, mname, mdetail, mprice) {
  var flextemplate = {
    type: "bubble",
    size: "nano",
    hero: {
      type: "image",
      url: mimage,
      size: "full",
      aspectMode: "cover",
      aspectRatio: "400:320",
      action: {
        type: "message",
        label: "action",
        text: mname,
      },
    },
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: mname,
          weight: "bold",
          size: "xs",
          wrap: true,
          margin: "none",
          contents: [],
        },
        {
          type: "text",
          text: `฿${mprice}`,
          wrap: true,
          size: "xs",

          color: "#FF0000",
        },
        {
          type: "text",
          text: mdetail,
          size: "xs",
          color: "#32cd32",
        },
      ],
      spacing: "none",
      paddingAll: "10px",
      background: {
        type: "linearGradient",
        angle: "90deg",
        startColor: "#ee9ca7",
        endColor: "#ffdde1",
      },
    },
  };

  return flextemplate;
}

function getrowmenu(mlist) {
  var mltemp = [];
  for (let m in mlist) {
    let mname = mlist[m]["menuname"];
    let mprice = mlist[m]["menuprice"];
    let mimage = mlist[m]["menuimage"];
    let mdetail = mlist[m]["menudetail"];
    var mtemp = getmenuflex(mimage, mname, mdetail, mprice);
    mltemp.push(mtemp);
  }
  return mltemp;
}

function getmultipleflex(mlist, ncol = 4) {
  let nrow = Math.floor(mlist.length / ncol);

  Logger.log(ncol);
  Logger.log(nrow);
  let lpayloadList = [];
  for (i = 0; i < nrow; i++) {
    let mltemp = [];
    for (j = 0; j < ncol; j++) {
      let ind = i * ncol + j;
      let mname = mlist[ind]["ชื่อสินค้า"];
      let mdetail = mlist[ind]["คะแนน"];
      let mprice = mlist[ind]["ราคา"];
      let mimage = mlist[ind]["รูปภาพ"];
      var mtemp = getmenuflex(mimage, mname, mdetail, mprice);
      mltemp.push(mtemp);
    }

    var flextemplate = {
      type: "carousel",
      contents: mltemp,
    };

    var lineres = {};
    lineres["type"] = "flex";
    lineres["altText"] = "แสดงรายการสินค้า";
    lineres["contents"] = flextemplate;
    lpayloadList.push(lineres);
  }

  var lr = {
    line_payload: lpayloadList,
    response_type: "object",
  };
  Logger.log(lr);
  return lr;
}
