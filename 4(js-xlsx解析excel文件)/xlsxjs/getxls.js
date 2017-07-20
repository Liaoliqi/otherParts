var X = XLSX;
var XW = {
    msg: 'xlsx',
    rABS: './xlsxjs/xlsxworker2.js',
    norABS: './xlsxjs/xlsxworker1.js',
    noxfer: './xlsxjs/xlsxworker.js'
};
var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
var use_worker = typeof Worker !== 'undefined';
var transferable = use_worker;
var wtf_mode = false;
function XLSX_fixdata(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint8Array(data.slice(l*w)));
    return o;
}
function XLSX_ab2str(data) {
    var o = "", l = 0, w = 10240;
    for(; l<data.byteLength/w; ++l) o+=String.fromCharCode.apply(null,new Uint16Array(data.slice(l*w,l*w+w)));
    o+=String.fromCharCode.apply(null, new Uint16Array(data.slice(l*w)));
    return o;
}
function XLSX_s2ab(s) {
    var b = new ArrayBuffer(s.length*2), v = new Uint16Array(b);
    for (var i=0; i != s.length; ++i) v[i] = s.charCodeAt(i);
    return [v, b];
}
function XLSX_xw_noxfer(data, cb) {
    var worker = new Worker(XW.noxfer);
    worker.onmessage = function(e) {
        switch(e.data.t) {
            case 'ready': break;
            case 'e': console.error(e.data.d); break;
            case XW.msg: cb(JSON.parse(e.data.d)); break;
        }
    };
    var arr = rABS ? data : btoa(XLSX_fixdata(data));
    worker.postMessage({d:arr,b:rABS});
}
function XLSX_xw_xfer(data, cb) {
    var worker = new Worker(rABS ? XW.rABS : XW.norABS);
    worker.onmessage = function(e) {
        switch(e.data.t) {
            case 'ready': break;
            case 'e': console.error(e.data.d); break;
            default: xx=XLSX_ab2str(e.data).replace(/\n/g,"\\n").replace(/\r/g,"\\r"); console.log("done"); cb(JSON.parse(xx)); break;
        }
    };
    if(rABS) {
        var val = XLSX_s2ab(data);
        worker.postMessage(val[1], [val[1]]);
    } else {
        worker.postMessage(data, [data]);
    }
}
function XLSX_xw(data, cb) {
    transferable = true;
    if(transferable) XLSX_xw_xfer(data, cb);
    else XLSX_xw_noxfer(data, cb);
}
function XLSX_to_json(workbook) {
    var result = {};
    workbook.SheetNames.forEach(function(sheetName) {
        var roa = X.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        if(roa.length > 0){
            result[sheetName] =roa;
        }
    });
    return result;
}
function XLSX_to_csv(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var csv = X.utils.sheet_to_csv(workbook.Sheets[sheetName]);
        if(csv.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(csv);
        }
    });
    return result.join("\n");
}
function XLSX_to_formulae(workbook) {
    var result = [];
    workbook.SheetNames.forEach(function(sheetName) {
        var formulae = X.utils.get_formulae(workbook.Sheets[sheetName]);
        if(formulae.length > 0){
            result.push("SHEET: " + sheetName);
            result.push("");
            result.push(formulae.join("\n"));
        }
    });
    return result.join("\n");
}
function XLSX_process_wb(wb) {
    var output = "";
    var format='json'
    switch(format) {
        case "json":
            output = JSON.stringify(XLSX_to_json(wb), 2, 2);
            break;
        case "form":
            output = XLSX_to_formulae(wb);
            break;
        default:
            output = XLSX_to_csv(wb);
    }

    $("#XLSX_out").val(output);
    XLSX_Okreturn();//解析成功后的返回函数
    if(typeof console !== 'undefined') console.log("output", new Date());
}
function XLSX_handleFile(e) {
    e.stopPropagation();
    e.preventDefault();
    var rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
    var use_worker = typeof Worker !== 'undefined';
    var files = e.target.files;
    var f = files[0];
    {
        var reader = new FileReader();
        var name = f.name;
        reader.onload = function(e) {
            if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
            var data = e.target.result;
            if(use_worker) {
                XLSX_xw(data, XLSX_process_wb);
            } else {
                var wb;
                if(rABS) {
                    wb = X.read(data, {type: 'binary'});
                } else {
                    var arr = XLSX_fixdata(data);
                    wb = X.read(btoa(arr), {type: 'base64'});
                }
                XLSX_process_wb(wb);
            }
        };
        if(rABS)
        {
            reader.readAsBinaryString(f);
        }
        else
        {
            reader.readAsArrayBuffer(f);
        }
    }
}
