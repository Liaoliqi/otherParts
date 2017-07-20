<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>js-xlsx</title>
    <!-- kendo插件 -->
	<link rel="stylesheet" href="./kendo_ui/styles/kendo.common.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.rtl.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.default.min.css"/>
    <link rel="stylesheet" href="./kendo_ui/styles/kendo.default.mobile.min.css"/>
    <script src="./kendo_ui/js/jquery.min.js"></script>
    <script src="./kendo_ui/js/kendo.all.min.js"></script>
    <!-- kendo公共方法 -->
    <script src="./kendo_ui/common-gys.js"></script>
    <script src="./kendo_ui/common-ken.js"></script>
</head>
<body>
	<button id='btnDelRow' onclick="batchImport()"><span class="k-icon k-i-search"></span>点击上传</button>
    <div id="content"></div>
</body>
</html>
<script>
	 function batchImport() {
        var url = "./batchImport.php";
        openKenWindow(url, "批量导入", "40%", "40%", false, false);
    }
</script>