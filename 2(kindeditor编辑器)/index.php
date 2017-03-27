<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>kindeditor 插件</title>
	<link rel="stylesheet" href="./kindeditor/themes/default/default.css">
	<script charset="utf-8" src="./kindeditor/kindeditor-all.js"></script>
	<script charset="utf-8" src="./kindeditor/lang/zh-CN.js"></script>
</head>
<body>
	<textarea name="content" id="content"></textarea>
	<input id="tijiao" type="button" value="提交" style="margin-top:10px;">
</body>
<script>
	KindEditor.ready(function(K) {
			window.editor = K.create('textarea[name="content"]', {
				width:'700px',		//宽度
				height:'250px',		//高度
				resizeType:0,		//2时可以拖动改变宽度和高度，1时只能改变高度，0时不能拖动。
				fullscreenMode:false,	//是否显示全屏
				pasteType:0,		//设置粘贴类型，0:禁止粘贴, 1:纯文本粘贴, 2:HTML粘贴
				allowImageRemote:false,		//是否显示网络图片上传
				items:[	'source', '|', 'undo', 'redo', '|', 'preview', 'print', 'template', 'code', 'cut', 'copy', 'paste',
				'plainpaste', 'wordpaste', '|', 'justifyleft', 'justifycenter', 'justifyright',
				'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'subscript',
				'superscript', 'clearhtml', 'quickformat', 'selectall', '|', 'fullscreen', '/',
				'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'hilitecolor', 'bold',
				'italic', 'underline', 'strikethrough', 'lineheight', 'removeformat', '|', 'image', 'multiimage',
				'flash', 'media', 'insertfile', 'table', 'hr', 'emoticons', 'baidumap', 'pagebreak',
				'anchor', 'link', 'unlink', '|', 'about'],		//限制菜单栏显示的项目
				cssPath : './kindeditor/plugins/code/prettify.css',
				uploadJson : './kindeditor/php/upload_json.php',
				afterBlur:function(){this.sync();}		//失去焦点时触发 将编辑的内容同步到textarea中
			});
		});
</script>
<script>
	var tijiao=document.getElementById('tijiao');
	var content=document.getElementById('content');
	content.innerHTML="试试";
	tijiao.onclick=function(){
		// KindEditor.sync(content); 
		alert(content.innerHTML);
	}
</script>
</html>