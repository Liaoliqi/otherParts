<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
	<script src="./kendo_ui/js/jquery.min.js"></script>
	<!-- xlsxjs插件 -->
	<script type="text/javascript" src="./xlsxjs/ga.js"></script>
	<script type="text/javascript" src="./xlsxjs/shim.js"></script>
	<script type="text/javascript" src="./xlsxjs/jszip.js"></script>
	<script type="text/javascript" src="./xlsxjs/xlsx.js"></script>
	<script type="text/javascript" src="./xlsxjs/ods.js"></script>
	<script type="text/javascript" src="./xlsxjs/getxls.js"></script>
 	<!-- kendo插件 -->
	<link rel="stylesheet" href="./kendo_ui/styles/kendo.common.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.rtl.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.default.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.default.mobile.min.css"/>
    <script src="./kendo_ui/js/kendo.all.min.js"></script>
    <!-- kendo公共方法 -->
    <script src="./kendo_ui/common-gys.js"></script>
	<script src="./kendo_ui/common-ken.js"></script>
</head>
<body>
	<div id="file_display">
		<input name="xlfile" id="xlf" type="file" style="margin-left: 152px;">
	    <input type="hidden" id="XLSX_out">
	    <br/><br/><br/>
	    <button id="view" style="display:none;" onclick="showView()">显示内容</button>
    </div>
    <div id="dialog"></div>
</body>
</html>
<script>
	$('#xlf').change(function(e){
        var filedaxiao=$("#xlf")[0].files[0].size;
        if(filedaxiao>5*1024*1024){
        	QiQiAlert('导入的文件不能大于5M！');
            return false;
        }
        XLSX_handleFile(e);
    });
    //解析完XSL执行的处理
    function XLSX_Okreturn() {
    	QiQiAlert('解析成功！！！');
    	$("#view").css('display','block');
    }
    function QiQiAlert(text1){
		$('#dialog').text(text1);
	 	$("#dialog").kendoDialog({
	      	actions: [{
          		text: "确定",
	      	}]
	    });
    }
    function showView(){
    	//可以使用ajax将解析后的数据发送到后台进行处理
    	/*$.ajax({
            type: 'POST',
            dataType: 'json',
            url: "/company/Completion/importInterface",
            data: {
                DataJson:datajson
            },
            success: function (data) {
                alert("导入成功");
            },
            error:function(e){
                alert("导入失败");
            }
        });*/

    	window.parent.$("#content").html('<pre>' + $("#XLSX_out").val());
    	kenWindowClose();
    }
</script>