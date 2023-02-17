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
    pinfo["ราคา"],
    quantity,
  ];

  var sheetname = "ออเดอร์";
  var osheet = gspandas.gsdataframe(sheeturl, sheetname);
  osheet.sheet.appendRow(trx);
}

function getcustdata(custid = "Uc217a79841540c1b0afe06312a885849") {
  var sheetname = "ออเดอร์";
  var psheet = gspandas.gsdataframe(sheeturl, sheetname);
  var pinfo = psheet.getrowdict("รหัสลูกค้า", custid);
  Logger.log(pinfo);
  return pinfo;
}

function getproductlistflex(custid = "Uc217a79841540c1b0afe06312a885849") {
  var datList = getcustdata(custid);
  //var datList = [{'fname':'ข้าวมันไก่','price':'60'},{'fname':'ข้าวมันไก่','price':'60'}]
  let wlist = [];
  let total = 0;
  for (i in datList) {
    fitem = datList[i]["ชื่อสินค้า"];
    fprice = datList[i]["ราคา"];
    total = total + fprice;
    let oneitem = {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "text",
          text: `${parseInt(i) + 1}) ${fitem}`,
          size: "sm",
          color: "#555555",
          flex: 0,
        },
        {
          type: "text",
          text: fprice + " บาท",
          size: "sm",
          color: "#111111",
          align: "end",
        },
      ],
    };
    wlist.push(oneitem);
  }

  let sum = {
    type: "box",
    layout: "horizontal",
    contents: [
      {
        type: "text",
        text: `รวมทั้งสิ้น`,
        size: "sm",
        color: "#555555",
        flex: 0,
      },
      {
        type: "text",
        text: total + " บาท",
        size: "sm",
        color: "#111111",
        align: "end",
      },
    ],
  };
  wlist.push(sum);

  var itemflex = {
    type: "box",
    layout: "vertical",
    margin: "xxl",
    spacing: "sm",
    contents: wlist,
  };

  Logger.log(itemflex);
  return itemflex;
}

function getproductflex(
  custid = "Uc217a79841540c1b0afe06312a885849",
  altText = "This is a Flex Message"
) {
  itemflex = getproductlistflex(custid);

  var flextemplate = {
    type: "bubble",
    body: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "text",
          text: "รายการที่เลือก",
          weight: "bold",
          color: "#1DB446",
          size: "sm",
        },
        {
          type: "separator",
          margin: "xxl",
        },
        itemflex,
      ],
    },
    hero: {
      type: "image",
      url: "https://user-images.githubusercontent.com/64634605/219683821-be2d1674-7dab-45c6-91e4-d9fb6473033a.png",
      size: "full",
      aspectMode: "cover",
      aspectRatio: "400:320",
      action: {
        type: "message",
        label: "action",
        text: "ยืนยันการสั่งซื้อ",
      },
    },
    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "button",
          action: {
            type: "message",
            label: "ยืนยันการสั่งซื้อ",
            text: "ยืนยันการสั่งซื้อ",
          },
          style: "primary",
        },
      ],
    },
    styles: {
      footer: {
        separator: false,
      },
    },
  };

  var lineres = {};
  lineres["type"] = "flex";
  lineres["altText"] = altText;
  lineres["contents"] = flextemplate;

  var lr = {
    line_payload: [lineres],
    response_type: "object",
  };
  return lr;
}

function doGet(request) {
  // Change Spread Sheet url
  var custid = request.parameter.custid;
  //Logger.log(pname)
  var result = getproductflex(custid);
  //Logger.log(jo)
  result = JSON.stringify(result);
  return ContentService.createTextOutput(result).setMimeType(
    ContentService.MimeType.JSON
  );
}
