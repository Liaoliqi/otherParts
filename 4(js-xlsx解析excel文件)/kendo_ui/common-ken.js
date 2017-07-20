//系统统一方法
//************************************************************************************

/**===通用公共变量=====(Start)=================================================================
 **/

var _gys_grid_PageSize = Gys.PageSize;
var _gys_grid_PageSizes = Gys.PageSizes;
//通用格式配置
var _gys_datepicker_setting = {format: "yyyy-MM-dd", footer: "今天 - #: kendo.toString(data, 'yyyy-MM-dd') #"}
var _gys_empty_guid = "00000000-0000-0000-0000-000000000000";
var _gys_select_defaultText = "请选择..";

/**===通用公共方法=====(Start)==================================================================


 /***
 基础信息自动下拉选择事件：
 firstItemType:第一个选项类型(null/undefined,guid,"")
 三种：
 (null/undefined)为空不操作
 (guid)为：值:00000000-0000-0000-0000-000000000000值，文本:请选择..
 ("")为:值："",文本：请选择..
 ***/
function _set_gys_kendoComboBox_firstItem(firstItemType, source, id, text) {
    if (typeof source == "Array") {
        if (source != null && firstItemType != null && typeof firstItemType != 'undefined') {
            if (firstItemType.toLocaleLowerCase() == "guid") {
                source.unshift(eval("({\"" + id + "\":\"" + _gys_empty_guid + "\",\"" + text + "\":\"" + _gys_select_defaultText + "\"})"));
            } else if (firstItemType == "") {
                source.unshift(eval("({\"" + id + "\":\"\",\"" + text + "\":\"" + _gys_select_defaultText + "\"})"));
            }
        }
        return source;
    }
}


//Grid列表内科目下拉框
function _get_RowEdit_DropdownListInGrid(container, options, idField, nameField, valuename, textname, dataSourceUrl, itemTemplatehtml, dropDownWidth) {
    var input = $("<input/>");
    input.attr("name", options.field);
    container.append(input);
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                $.ajax({
                    url: dataSourceUrl,
                    data: options.data,
                    success: function (result) {
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            }
        },
        serverFiltering: true
    });

    input.kendoDropDownList({
        dataValueField: valuename,
        dataTextField: textname,
        optionLabel: "--请选择--",
        dataSource: dataSource,
        template: itemTemplatehtml,
        change: function () {
            options.model[idField] = this.value();
            options.model[nameField] = this.text();
        }
    });

    //列表下拉时的宽度，为"auto"时自动调整宽度
    if (dropDownWidth != null && typeof dropDownWidth != 'undefined' && dropDownWidth != "") {
        var ddlViews = input.data("kendoDropDownList");
        ddlViews.list.width(dropDownWidth);
    }

    input.closest(".k-combobox").find(".k-dropdown-wrap input[role=combobox]").focus(function () {
        var input = $(this);
        setTimeout(function () {
            input.select();
        }, 200);
    });
}


/**
 * 绑定下拉框
 * @param controlId 控件ID
 * @param data json数据
 * @param isDefault 是否显示’请选择'
 * @returns {*|jQuery}
 */
function bindkendoDropDownList(controlId, data,isDefault) {
    if (data && data.length > 0) {
        if(isDefault == null || typeof (isDefault) == 'undefined'){
            data.splice(0, 0, {value: "", text: "请选择.."});
        }
        $("#" + controlId).kendoDropDownList({
            dataTextField: "text",
            dataValueField: "value",
            dataSource: data,
            index: 0
        });
    }
    return $("#" + controlId).data("kendoDropDownList");
}

//带有模板的下拉列表
function _get_select_list_kendoDropDownListWithTemplate(textId, sourceurl, valuename, textname, defaultValue, defaultText, tooptiptext, dropDownWidth, itemTemplateHtml) {
    if (defaultValue != null && typeof (defaultValue) != 'undefined') {
        $("#" + textId).attr("value", "");
    }
    if (tooptiptext == null || typeof (tooptiptext) == 'undefined') {

        tooptiptext = "--请选择--";
    }

    var source = new kendo.data.DataSource({
        type: "json",
        serverFiltering: true,
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                $.ajax({
                    url: sourceurl,
                    data: options.data,
                    type: "post",
                    cache: false,
                    success: function (result) {
                        // _set_gys_kendoComboBox_firstItem(firstItemType, result, valuename, textname);
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            }
        }
    });
    $("#" + textId).kendoDropDownList({
        optionLabel: tooptiptext,
        dataValueField: valuename,
        dataTextField: textname,
        template: itemTemplateHtml,
        dataSource: source
    });
    if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
        $("#" + textId).data("kendoDropDownList").value(defaultValue)
    }
    if (defaultText != null && typeof defaultText != 'undefined' && defaultText != "") {
        $("#" + textId).data("kendoDropDownList").text(defaultText)
    }

    if (typeof (dropDownWidth) != "undefined" && !isNaN(dropDownWidth)) {
        $("#" + textId).data("kendoDropDownList").list.width(dropDownWidth);
    }
    return $("#" + textId).data("kendoDropDownList");
}

function _get_RowEdit_kendoComboboxInGrid(container, options, idField, nameField, valuename, textname, dataSourceUrl, itemTemplatehtml, dropDownWidth) {
    var input = $("<input/>");
    input.attr("name", options.field);
    container.append(input);
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                $.ajax({
                    url: dataSourceUrl,
                    data: options.data,
                    success: function (result) {
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            }
        },
        serverFiltering: true
    });

    input.kendoComboBox({
        dataValueField: valuename,
        dataTextField: textname,
        placeholder: "--请选择--",
        dataSource: dataSource,
        template: itemTemplatehtml,
        filter: "contains",
        change: function () {
            options.model[idField] = this.value();
            options.model[nameField] = this.text();
        }
    });

    //列表下拉时的宽度，为"auto"时自动调整宽度
    if (dropDownWidth != null && typeof dropDownWidth != 'undefined' && dropDownWidth != "") {
        var ddlViews = input.data("kendoComboBox");
        ddlViews.list.width(dropDownWidth);
    }

    input.closest(".k-combobox").find(".k-dropdown-wrap input[role=combobox]").focus(function () {
        var input = $(this);
        setTimeout(function () {
            input.select();
        }, 200);
    });
}

function _get_select_list_kendoComboboxWithTemplate(textId, sourceurl, valuename, textname, defaultValue, defaultText, placeholdertext, dropDownWidth, itemTemplateHtml) {
    if (defaultValue != null && typeof (defaultValue) != 'undefined') {
        $("#" + textId).attr("value", "");
    }
    if (placeholdertext == null || typeof (placeholdertext) == 'undefined') {

        placeholdertext = "--请选择--";
    }

    var source = new kendo.data.DataSource({
        type: "json",
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                $.ajax({
                    url: sourceurl,
                    data: options.data,
                    type: "post",
                    cache: false,
                    success: function (result) {
                        // _set_gys_kendoComboBox_firstItem(firstItemType, result, valuename, textname);
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            }
        },
        serverFiltering: true
    });
    $("#" + textId).kendoComboBox({
        placeholder: placeholdertext,
        dataValueField: valuename,
        dataTextField: textname,
        filter: "contains",
        template: itemTemplateHtml,
        dataSource: source
    });
    if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
        $("#" + textId).data("kendoComboBox").value(defaultValue)
    }
    if (defaultText != null && typeof defaultText != 'undefined' && defaultText != "") {
        $("#" + textId).data("kendoComboBox").text(defaultText)
    }

    if (typeof (dropDownWidth) != "undefined" && !isNaN(dropDownWidth)) {
        $("#" + textId).data("kendoComboBox").list.width(dropDownWidth);
    }
    return $("#" + textId).data("kendoComboBox");
}
//设置开始时间和结束时间控件(带有相互约束)
function setkendoDatePickerBeginEnd(beginData, endData, beginDefultValue) {

    var BdefultValue = $(beginData).val();
    if (BdefultValue != "" && BdefultValue != null) {
        beginDefultValue = BdefultValue;
    }

    $(beginData).kendoDatePicker({
        format: "yyyy-MM-dd",
        culture: "zh-CN",
        change: function () {
            var datepicker = $(endData).data("kendoDatePicker");
            if (this.value() == null) {
                if (this._oldText != "") {
                    this.value(new Date());
                    datepicker.min(new Date());
                } else {
                    datepicker.min(new Date(1900, 0, 1));
                }
            }
            else {
                datepicker.min(this.value());
            }
        }
    });

    $(endData).kendoDatePicker({
        format: "yyyy-MM-dd",
        culture: "zh-CN",
        change: function () {
            var datepicker = $(beginData).data("kendoDatePicker");
            if (this.value() == null) {
                if (this._oldText != "") {
                    this.value(new Date());
                    datepicker.max(new Date());
                }
                else {
                    datepicker.max(new Date(9999, 0, 1));
                }
            }
            else {
                datepicker.max(this.value());
            }
        }
    });

    var beginSpan = '<span clearKey="' + beginData + '" class="k-icon k-i-close" role="button" onclick="clearDatePickerTime(this);"></span>';
    $(beginData).next().width(40);
    $(beginData).next().append(beginSpan);

    var endSpan = '<span clearKey="' + endData + '" class="k-icon k-i-close" role="button" onclick="clearDatePickerTime(this);"></span>';
    $(endData).next().width(40);
    $(endData).next().append(endSpan);

    if (beginDefultValue != "" && beginDefultValue != null) {
        var datepicker = $(endData).data("kendoDatePicker");
        datepicker.min(beginDefultValue);
    }
}
/*清除日期选择框时间*/
function clearDatePickerTime(control) {
    var dateTimeControlID = $(control).attr('clearKey');
    var datepicker = $(dateTimeControlID).data("kendoDatePicker");
    setTimeout(function () {
        datepicker.close();
    }, 10);
    datepicker.value(null);
    datepicker.trigger("change");
}

/*
 * 设置开始时间和结束时间控件,包含时分选择控件 (带有相互约束)
 */
function setkendoDateTimePickerBeginEnd(beginData, endData, beginDefultValue) {

    var BdefultValue = $(beginData).val();
    if (BdefultValue != "" && BdefultValue != null) {
        beginDefultValue = BdefultValue;
    }

    $(beginData).kendoDateTimePicker({
        format: "yyyy-MM-dd HH:mm",
        culture: "zh-CN",
        change: function () {
            var datepicker = $(endData).data("kendoDateTimePicker");
            if (this.value() == null) {
                if (this._oldText != "") {
                    this.value(new Date());
                    datepicker.min(new Date());
                } else {
                    datepicker.min(new Date(1900, 0, 1));
                }
            }
            else {
                datepicker.min(this.value());
            }
        },
        close: function (e) {
            //如果选择了日期，将分秒设置为零
            if (e.view === "date") {
                //e.preventDefault(); //prevent popup closing
                var s = e.sender.value();
                if (s) {
                    var datepicker = $(endData).data("kendoDateTimePicker");
                    var endValue = datepicker.value(); //开始时间
                    if (endValue) {
                        //如果开始时间日期等于当前选择的日期，并且小时为0
                        if (endValue.getTime() == s.getTime) {
                            if (endValue.getHours() == 0) {
                                s.setHours(0, 0, 0);
                                this.value(s);
                            }
                        } else {
                            if (endValue.getHours() == 0) {
                                s.setHours(0, 0, 0);
                                this.value(s);
                            }
                        }
                    } else {
                        s.setHours(0, 0, 0);
                        this.value(s);
                    }
                }
                $(beginData).data("kendoDateTimePicker").trigger("change");
            }
        }
    });
    $(endData).kendoDateTimePicker({
        format: "yyyy-MM-dd HH:mm",
        culture: "zh-CN",
        change: function () {
            var datepicker = $(beginData).data("kendoDateTimePicker");
            if (this.value() == null) {
                if (this._oldText != "") {
                    this.value(new Date());
                    datepicker.max(new Date());
                }
                else {
                    datepicker.max(new Date(9999, 0, 1));
                }
            }
            else {
                datepicker.max(this.value());
            }
        },
        close: function (e) {
            if (e.view === "date") {
                //如果选择了日期，将分秒设置为零
                if (e.view === "date") {
                    //e.preventDefault(); //prevent popup closing
                    var s = e.sender.value();
                    if (s) {
                        var datepicker = $(beginData).data("kendoDateTimePicker");
                        var beginValue = datepicker.value(); //开始时间
                        if (beginValue) {
                            //如果开始时间日期等于当前选择的日期，并且小时为0
                            if (beginValue.getTime() == s.getTime) {
                                if (beginValue.getHours() == 0) {
                                    s.setHours(0, 0, 0);
                                    this.value(s);
                                }
                            } else {
                                if (beginValue.getHours() == 0) {
                                    s.setHours(0, 0, 0);
                                    this.value(s);
                                }
                            }
                        }
                        else {
                            s.setHours(0, 0, 0);
                            this.value(s);
                        }
                    }
                    $(endData).data("kendoDateTimePicker").trigger("change");
                }
            }
        }
    });

    var beginSpan = '<span unselectable="on" clearKey="' + beginData + '" class="k-icon k-i-close" role="button" aria-controls="' + beginData.substring(1) + '_dateview" onclick="clearDateTimePickerTime(this);"></span>';
    $(beginData).next().width(55);
    $(beginData).next().append(beginSpan);
    var endSpan = '<span unselectable="on" clearKey="' + endData + '" class="k-icon k-i-close" role="button" aria-controls="' + endData.substring(1) + '_dateview" onclick="clearDateTimePickerTime(this);"></span>';
    $(endData).next().width(55);
    $(endData).next().append(endSpan);

    if (beginDefultValue != "" && beginDefultValue != null) {
        var datepicker = $(endData).data("kendoDateTimePicker");
        datepicker.min(beginDefultValue);
    }
}
//只有一个时间控件的
function setkendoDateOnlyBeginEnd(beginData, beginDefultValue) {
    var BdefultValue = $(beginData).val();
    if (BdefultValue != "" && BdefultValue != null) {
        beginDefultValue = BdefultValue;
    }
    $(beginData).kendoDateTimePicker({
        format: "yyyy-MM-dd HH:mm",
        culture: "zh-CN",
        close: function (e) {
            //如果选择了日期，将分秒设置为零
            if (e.view === "date") {
                //e.preventDefault(); //prevent popup closing
                var s = e.sender.value();
                if (s) {
                    s.setHours(0, 0, 0);
                    this.value(s);
                }
            }
        }
    });

    var beginSpan = '<span unselectable="on" clearKey="' + beginData + '" class="k-icon k-i-close" role="button" aria-controls="' + beginData.substring(1) + '_dateview" onclick="clearDateTimePickerTime(this);"></span>';
    $(beginData).next().width(55);
    $(beginData).next().append(beginSpan);
}
function clearDateTimePickerTime(control) {
    var dateTimeControlID = $(control).attr('clearKey');
    var datepicker = $(dateTimeControlID).data("kendoDateTimePicker");
    datepicker.value(null);
    datepicker.trigger("change");
}

//时间选择框
//解决时间相差8小时的问题(后台不需要再加8小时),使用kendo.toString(this.value(), Gys.EditDate)
function getRowEditDate(container, options, nameField) {
    var input = $("<input/>");
    input.attr("name", options.field);
    input.focus(function () {
        var input = $(this);
        setTimeout(function () {
            input.select();
        }, 200);
    });
    container.append(input);

    input.kendoDatePicker({
        format: Gys.EditDate,
        change: function () {
            if (this._oldText != "" && this.value() == null) {
                this.value(new Date());
            }
            //options.model[nameField] = this.value();
            options.model[nameField] = kendo.toString(this.value(), Gys.EditDate);
        }
    });
}
function setButtonEnable(selector, enable) {
    if ($(selector).length > 0) {
        $(selector).data("kendoButton").enable(enable);
    }
}


//Kendo使用通用方法
//************************************************************************************

/*auto setting kendoTabStrip height
 content: grid
 */
function autoTabHeight(tabobj) {//tab
    if (tabobj != null) {
        var tabcontent = tabobj.find(".k-content.k-state-active");
        expandContentDivs(tabobj, tabcontent);
        resizeGrid(tabcontent.children(".k-grid"));
    }
}

function expandContentDivs(tabStripElement, divs) {//tabcontent
    divs.height(tabStripElement.innerHeight() - tabStripElement.children(".k-tabstrip-items").outerHeight() - 16);
}

function resizeGrid(grid) {//grid
    var gridElement = grid,
        dataArea = gridElement.find(".k-grid-content"),
        gridHeight = gridElement.innerHeight(),
        otherElements = gridElement.children().not(".k-grid-content"),
        otherElementsHeight = 0;
    otherElements.each(function () {
        otherElementsHeight += $(this).outerHeight();
    });
    dataArea.height(gridHeight - otherElementsHeight);
}

//调用父窗体弹框方法
//isInFrame 是否在IFrame中打开
//isCloseParentWindow 是否关闭之前已经打开的窗口（这个主要用于在最外层时）
function openKenWindow(contenturl, title, width, height, isInFrame, isCloseParentWindow) {
    var flagInFrame = true;
    if (typeof isInFrame != "undefined" && $.trim(isInFrame) != "")
        flagInFrame = isInFrame;
    if (flagInFrame)
        selfOpenKenWindow(contenturl, title, width, height);
    else {
        if (window.parent.topOpenKenWindow)
            window.parent.topOpenKenWindow(contenturl, title, width, height, isCloseParentWindow);
        else
            selfOpenKenWindow(contenturl, title, width, height);
    }

}

//直接调用是在当前页面打开，通过 “top.openWindow” 可以在顶层窗口打开
function selfOpenKenWindow(contenturl, title, width, height) {
    if (typeof contenturl == "undefined" || $.trim(contenturl) == "") return false;

    var _contenturl = contenturl,
        _title = "标题", _width = "50%", _height = "60%";
    if (typeof title != "undefined" && $.trim(title) != "") _title = title;
    if (typeof width != "undefined" && $.trim(width) != "") _width = width;
    if (typeof height != "undefined" && $.trim(height) != "") _height = height;

    $(".__gys_auto_ken_window").closest(".k-window").remove();
    var _div = $("<div style='display: none; overflow:hidden;' class='__gys_auto_ken_window'></div>");
    var kenwin = _div.kendoWindow({
        content: _contenturl,
        title: _title,
        width: _width,
        height: _height,
        actions: ["refresh", "close"],
        animation: false,
        resizable: false,
        modal: true,
        iframe: true
    }).data("kendoWindow");
    kenwin.center().open();

    _div.find("iframe").load(function () {
        var iframe = _div.find("iframe")[0].contentwindow;
        if (iframe != undefined) {
            var firsttextbox = $(iframe.document.body).find("input:visible").eq(0);
            firsttextbox.focus();
        }
    });
}

//返回直接关闭窗体
//isTopWindow为true表示为顶层窗口弹窗
function kenWindowClose(isRereadGrid, isOnlyGrid, isTopWindow) {
    if (typeof isTopWindow == "undefined" || isTopWindow == null) {
        isTopWindow = false;
    }

    if (!isTopWindow) {
        kenChildWindowClose(isRereadGrid, isOnlyGrid);
    }
    else {
        kenTopWindowClose(isRereadGrid, isOnlyGrid);
    }
}
//在iframe中弹窗时关闭
function kenChildWindowClose(isRereadGrid, isOnlyGrid) {
    var kwin = window.parent;
    if (kwin != null && typeof kwin == "object") {//有父页面
        if (kwin.location.href != window.top.location.href) {
            if (typeof isOnlyGrid == "undefined" || isOnlyGrid == null) {
                isOnlyGrid = true;
            }
            if (isRereadGrid && isOnlyGrid) {
                var kendoGrid = kwin.$(".k-grid").data("kendoGrid");
                if (typeof kendoGrid == "object" && kendoGrid != null) {
                    kendoGrid.dataSource.read();//刷新当前页信息
                    //kendoGrid.dataSource.page(1);//刷新到第一页
                }
            }
            else if (isRereadGrid && !isOnlyGrid) {
                kwin.location.reload();
            }
            var kendoWindow = kwin.$(".k-window:visible .k-window-content").data("kendoWindow");
            if (typeof kendoWindow == "object" && kendoWindow != null) {
                setTimeout(function () {
                    kendoWindow.close();//关闭窗体
                }, 100);
            }
        }
        else {
            //window.top.deleteCurrActvityTab();
            //取最后一个弹框进行关闭
            var flag = false;
            var kendoWindow = kwin.$(".k-window:visible .k-window-content:last").data("kendoWindow");
            if (typeof kendoWindow == "object" && kendoWindow != null) {
                kendoWindow.close();//关闭窗体
                flag = true;
            }
            if (!flag) {
                var topWindow = kwin.tabStripElement.find(".k-content.k-state-active>iframe")[0].contentWindow.$(".k-window:visible .k-window-content:last").data("kendoWindow");
                if (typeof topWindow == "object" && topWindow != null) {
                    topWindow.close();//关闭窗体
                }
            }
            //刷新当前Grid
            if (kwin.tabStripElement) {
                var kendoGrid = kwin.tabStripElement.find(".k-content.k-state-active>iframe")[0].contentWindow.$(".k-grid").data("kendoGrid");
                if (typeof kendoGrid == "object" && kendoGrid != null) {
                    kendoGrid.dataSource.read();//刷新当前页信息
                }
            }
            if (kwin.$(".k-grid")) {
                var kendoGrid = kwin.$(".k-grid").data("kendoGrid");
                if (typeof kendoGrid == "object" && kendoGrid != null) {
                    kendoGrid.dataSource.read();//刷新当前页信息
                }
            }
        }
    }
}
//顶层弹窗时关闭
function kenTopWindowClose(isRereadGrid, isOnlyGrid) {
    if (typeof isOnlyGrid == "undefined" || isOnlyGrid == null) {
        isOnlyGrid = true;
    }
    if (isRereadGrid && !isOnlyGrid)  //刷新页面
    {
        window.parent.refreshFrame();
    }
    else {
        var iframe = $(window.parent.document).find(".k-content.k-state-active>iframe")[0].contentWindow;
        var kendoGrid = iframe.$(".k-grid").data("kendoGrid");
        if (typeof kendoGrid == "object" && kendoGrid != null) {
            kendoGrid.dataSource.read();//刷新当前页信息
        }
    }

    var kwin = window.parent;
    var kendoWindow = kwin.$(".k-window:visible .k-window-content").data("kendoWindow");
    if (typeof kendoWindow == "object" && kendoWindow != null) {
        setTimeout(function () {
            kendoWindow.close();//关闭窗体
        }, 100);
    }

}
////三层弹窗刷新
function refreshThridWindow(href) {
    var _obj = $(window.parent.document).find(href);
    var _total = _obj.length;
    _obj[_total - 1].contentWindow.$(".k-grid").data("kendoGrid").dataSource.read();
}
//直接调用是在当前页面打开，通过 “top.openWindow” 可以在顶层窗口打开
function OpenDivWindow(domID, title, width, height) {
    if (typeof domID == "undefined" || $.trim(domID) == "")
        return false;
    var _div = $("#" + domID),
        _title = "标题", _width = "50%", _height = "60%";
    if (typeof title != "undefined" && $.trim(title) != "") _title = title;
    if (typeof width != "undefined" && $.trim(width) != "") _width = width;
    if (typeof height != "undefined" && $.trim(height) != "") _height = height;
    var kenwin = _div.kendoWindow({
        title: _title,
        width: _width,
        height: _height,
        actions: ["refresh", "close"],
        animation: false,
        resizable: false,
        modal: true
    }).data("kendoWindow");
    kenwin.center().open();
}

/*消息提示*/
/*status:tip:提示(默认),success:正确,error:错误,warning:警告*/
function GysShowNotice(noticeIngo, _isModal) {
    if (typeof noticeIngo != "object" || noticeIngo == null) {
        return;
    }

    if (_isModal == undefined || _isModal == null) {
        _isModal = true;
    }

    var contentHtml = "<a role='button' href='#' class='k-window-action k-link gy-dialog-cloce' type='button'><span class='k-icon k-i-close' style='float: right;width: 20px;margin-top: 4px;'></span></a>"
        + "<div style='background-color:white;height:auto;width:500px;font: caption;border-radius: 7px;'>"
        + "<h3 class='noticeTitle noticeTitle_them1'class='k-icon k-i-close' style='color: dimgray;margin-left: 10px;'>" + noticeIngo.NoticeTitle + "</h3>"
        + "<div class='noticeContent' style ='overflow-x:hidden;height:71%; text-align:center' >"
        + "<TextArea style='height:300px;width:400px;border:0px;background: white;color: black;line-height: 21px;overflow-y: hidden;font-family: cursive;'disabled='disabled'>" + noticeIngo.NoticeContent + "</TextArea>"
        + "</div>"
        + "</div>"

    var options = {
        content: contentHtml
    }
    var d = dialog(options);
    if (_isModal) {
        d.showModal();
    } else {
        d.show();
    }

    $("a.gy-dialog-cloce").on("click", function () {
        d.close().remove();
    });

    return d;
}


/*消息提示*/
/*status:tip:提示(默认),success:正确,error:错误,warning:警告*/
//function GysAlert(context, status, time, _isModal) {
//    if (_isModal == undefined) {
//        _isModal = true;
//    }
//    if (time == undefined) {
//        time = 1000;
//    }
//    status = status || "tip";
//    var options = {
//        content: "<table class='artdilog-content-table'><tr><td class='artdilog-content-icon artdilog-content-icon-" + status + "'>&nbsp;</td><td  class='artdilog-content-text'>" + context + "</td></tr></table>"
//    }
//    var d = dialog(options);
//    if (_isModal) {
//        d.showModal();
//    } else {
//        d.show();
//    }
//    setTimeout(function () {
//        d.close().remove();
//    }, time);
//    return d;
//}

function GysAlert(arg) {
    var options = {
        content: arg.content
    }
    if (arg.title == undefined || arg.title == null || arg.title == "") {
        arg.title = "提示";
    }
    if (arg.okValue == undefined || arg.okValue == null || arg.okValue == "") {
        arg.okValue = "确定";
    }
    var trueEvent;
    if (arg.trueEvent != null && typeof (arg.trueEvent) != "undefined") {
        trueEvent = function () {
            try {
                arg.trueEvent();
            }
            catch (e) {
            }
        };
    }
    else {
        trueEvent = function () {
        };
    }
    options.width = arg.width || "300px";
    options.title = arg.title;
    options.okValue = arg.okValue;
    options.ok = trueEvent;
    options.modal = true;  //是否模态窗口
    options.backdropOpacity = 0.5;  //设置遮罩透明度
    options.draggable = arg.draggable || false;  //是否支持拖拽
    options.zIndex = 99999;
    var d = dialog(options);
    d.show();
}
/**========表格选择值======
 **/
function _get_grid_select_model(gridId) {
    var dataSource = $(gridId).data("kendoGrid")
    var modelArray = [];
    dataSource.select().each(function () {
        modelArray.push(dataSource.dataItem(this));
    })
    return modelArray;
}
//文本框禁止空格输入
function BanSpace(CategoryName) {
    $("#" + CategoryName).keyup(function (e) {
        if (e.which == 32) {//判断空格键
            //this.value = this.value.replace(/\ /, '');单个空格
            this.value = this.value.replace(/\s/g, '');//判断无限空格
        }
    })
}


///*确认框GysConfirm("ADSFADFASDFASDFASDFA", function () {alert('确认')}, function () { alert('取消')})*/
///*_confirmTrue 确认事件,_confirmFalse取消事件*/
function GysConfirm(arg) {
    var options = {
        content: arg.content
    }
    if (arg.title == undefined || arg.title == null || arg.title == "") {
        arg.title = "提示";
    }
    if (arg.okValue == undefined || arg.okValue == null || arg.okValue == "") {
        arg.okValue = "是";
    }
    if (arg.cancelValue == undefined || arg.cancelValue == null || arg.cancelValue == "") {
        arg.cancelValue = "否";
    }
    if (arg.modal == undefined || arg.modal == null) {
        arg.modal = true;
    }
    if (arg.draggable == undefined || arg.draggable == null) {
        arg.draggable = false;
    }

    var falseEvent;
    if (arg.confirmFalseEvent != null && typeof( arg.confirmFalseEvent) != "undefined") {
        falseEvent = function () {
            try {
                arg.confirmFalseEvent();
            }
            catch (e) {
            }
        };
    }
    else {
        falseEvent = function () {
        };
    }

    if (arg.confirmTrueEvent != null && typeof arg.confirmTrueEvent != 'undefined') {
        options.width = arg.width || "300px";
        options.title = arg.title;
        options.okValue = arg.okValue;
        options.ok = function () {
            try {
                arg.confirmTrueEvent()
            }
            catch (e) {
            }
        };
        options.cancelValue = arg.cancelValue;
        options.cancel = falseEvent;
        options.modal = arg.modal;  //是否模态窗口
        options.backdropOpacity = 0.5;  //设置遮罩透明度
        options.draggable = arg.draggable;  //是否支持拖拽
        options.zIndex = 99999;
    }
    var d = dialog(options);
    d.show();
}


//KenGrid单元格编辑并同步显示
function GridCellEditAndSync(gridObj, editCell, colName, cellValue) {
    if (typeof gridObj == "string" && $.trim(gridObj) != "") gridObj = $(gridObj);
    if (typeof gridObj != "object" || gridObj == null || typeof editCell != "object" || editCell == null
        || $.trim(colName) == "" || typeof cellValue == "undefined" || cellValue == null) return;

    var grid = gridObj.data("kendoGrid");
    var colIndex = -1;//字段对应的列序号
    for (var i = 0; i < grid.columns.length; i++) {
        if (grid.columns[i].field == colName) {
            colIndex = i;
            break;
        }
    }
    if (colIndex > -1) {
        var rowData = grid.dataItem($(editCell.element[0]).closest("tr"));
        var rowIndex = grid.dataSource.data().indexOf(rowData);
        if (rowIndex > -1) {
            //数据源更新
            rowData[colName] = cellValue;
            //rowData.dirty = true;
            //页面显示同步
            var cell = gridObj.find(".k-grid-content tr").eq(rowIndex).find("td").eq(colIndex);
            cell.html(cellValue);
            //cell.addClass("k-dirty-cell").prepend($('<span class="k-dirty"></span>'));
        }
    }
}

//KenGrid多个单元格编辑并同步显示
function GridCellEditAndSyncMore(gridObj, editCell, colNames, cellValues) {
    if (typeof gridObj == "string" && $.trim(gridObj) != "") gridObj = $(gridObj);
    if (typeof gridObj != "object" || gridObj == null || typeof editCell != "object" || editCell == null
        || typeof colNames == "undefined" || colNames == null || typeof cellValues == "undefined" || cellValues == null) return;

    var grid = gridObj.data("kendoGrid");
    var rowData = grid.dataItem($(editCell.element[0]).closest("tr"));
    var rowIndex = grid.dataSource.data().indexOf(rowData);
    if (rowIndex > -1) {
        for (j in colNames) {
            var colIndex = -1;//字段对应的列序号
            for (var i = 0; i < grid.columns.length; i++) {
                if (grid.columns[i].field == colNames[j]) {
                    colIndex = i;
                    break;
                }
            }

            if (colIndex > -1) {
                //数据源更新
                rowData[colNames[j]] = cellValues[j];

                //页面显示同步
                var cell = gridObj.find(".k-grid-content tr").eq(rowIndex).find("td").eq(colIndex);
                cell.html(cellValues[j]);
            }
        }
    }
}

/*基本数据表格-无明细*/
function _get_grid_setting_by_default(gridId, keyId, listUrl, infoUrl, searchModel, gridModel, gridColumn, Sortflag, selectable, isAutoBind, isEditable, callbackFunc, dataBoundFunc, buttonCount, changFunc) {

    if (typeof isAutoBind == "undefined" || isAutoBind == null) {
        isAutoBind = true;
    }

    if (typeof isEditable == "undefined" || isEditable == null) {
        isEditable = false;
    }
    if (typeof buttonCount == "undefined" || buttonCount == null) {
        buttonCount = 5;
    }
    //单据数据源
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                var queryItem = $.extend(options.data, searchModel);
                if (typeof queryItem.filter != "undefined") {
                    queryItem.filter = kendo.stringify(queryItem.filter)
                }
                options.data.t = Math.random();
                $.ajax({
                    url: listUrl,
                    dataType: "json",
                    type: "post",
                    data: options.data,
                    cache: false,
                    success: function (result) {
                        options.success(result);
                        if (typeof callbackFunc == "function") {
                            callbackFunc(result);
                        }
                    },
                    error: function (result) {
                        options.error(result);
                        if (typeof callbackFunc == "function") {
                            callbackFunc();
                        }
                    }
                })
            }
        },
        cache: false,
        pageSize: _gys_grid_PageSize,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: true,
        schema: {
            data: "list",
            total: "total",

            model: gridModel
        }
    });

    //单据数据列
    var columns = gridColumn;

    if (Sortflag != false) {
        Sortflag = true;
    }

    selectable = selectable || "row";

    //Grid配置信息
    var options =
    {
        dataSource: dataSource,
        autoBind: isAutoBind,
        pageable: {
            refresh: true,
            pageSizes: _gys_grid_PageSizes,
            buttonCount: buttonCount,
            messages: {
                display: "{0} - {1} 共 {2} 条数据",
                empty: "没有要显示的数据",
                itemsPerPage: "条每页",
                first: "首页",
                previous: "前一页",
                next: "下一页",
                last: "最后一页",
                refresh: "刷新"
            }
        },                //分页属性
        sortable: Sortflag,   //排序属性
        selectable: selectable,
        scrollable: true,
        resizable: true,
        reorderable: true,
        navigatable: true,
        height: "99%",
        columns: columns,
        editable: isEditable,
        dataBound: function (e) {
            if (typeof dataBoundFunc == "function") {
                dataBoundFunc(e);
            }
        },
        change: function (e) {
            if (typeof changFunc == "function") {
                changFunc();
            }
        }
    };

    var gridObj = $(gridId).kendoGrid(options)

    $(gridId).find(".k-grid-content").dblclick(function () {
        if (gridObj != null && typeof gridObj != 'undefined' && infoUrl != null && infoUrl != "") {
            var dataObj = gridObj.data("kendoGrid");
            var dataItem = dataObj.dataItem(dataObj.select());
            if (dataItem != null) {
                window.location.href = infoUrl + "?" + dataItem.idField + "=" + dataItem.id;
            }
        }
    });

    return gridObj;
}

/*基本数据表格-不分页*/
function _get_grid_setting_by_defaultNoPaging(gridId, keyId, listUrl, infoUrl, searchModel, gridModel, gridColumn, Sortflag, selectable, isAutoBind, isEditable, callbackFunc) {

    if (typeof isAutoBind == "undefined" || isAutoBind == null) {
        isAutoBind = true;
    }
    if (typeof isEditable == "undefined" || isEditable == null) {
        isEditable = false;
    }
    //单据数据源
    var dataSource = new kendo.data.DataSource({
        transport: {
            read: function (options) {
                var queryItem = $.extend(options.data, searchModel);
                if (typeof queryItem.filter != "undefined") {
                    queryItem.filter = kendo.stringify(queryItem.filter)
                }
                options.data.t = Math.random();
                $.ajax({
                    url: listUrl,
                    dataType: "json",
                    type: "post",
                    data: options.data,
                    success: function (result) {
                        options.success(result);

                        if (typeof callbackFunc == "function") {
                            callbackFunc(result);
                        }
                    },
                    error: function (result) {
                        options.error(result);

                        if (typeof callbackFunc == "function") {
                            callbackFunc(result);
                        }
                    }
                })
            }
        },
        cache: false,
        pageSize: _gys_grid_PageSize,
        serverPaging: true,
        serverFiltering: true,
        serverSorting: false,
        schema: {
            data: "list",
            total: "total",
            model: gridModel
        }
    });

    //单据数据列
    var columns = gridColumn;

    if (Sortflag != false) {
        Sortflag = true;
    }

    selectable = selectable || "row";

    //Grid配置信息
    var options =
    {
        dataSource: dataSource,
        autoBind: isAutoBind,
        sortable: Sortflag,   //排序属性
        selectable: selectable,
        scrollable: true,
        resizable: true,
        reorderable: true,
        navigatable: true,
        height: "99%",
        columns: columns,
        editable: isEditable
    };

    var gridObj = $(gridId).kendoGrid(options)
    return gridObj;
}

/*基本数据表格-不分页*/
function _get_grid_setting_by_defaultByDataSource(obj) {
    var gridId = obj.gridId;
    var gridModel = obj.gridModel;
    var gridColumn = obj.gridColumn;
    var Sortflag = obj.Sortflag;
    var selectable = obj.selectable;
    var isAutoBind = obj.isAutoBind;
    var isEditable = obj.isEditable;

    var data = obj.dataSource;
    if (typeof isAutoBind == "undefined" || isAutoBind == null) {
        isAutoBind = true;
    }
    if (typeof isEditable == "undefined" || isEditable == null) {
        isEditable = false;
    }
    //单据数据源
    var dataSource = new kendo.data.DataSource({
        data: data,
        schema: {
            model: gridModel
        }
    });

    //单据数据列
    var columns = gridColumn;

    if (Sortflag != false) {
        Sortflag = true;
    }

    selectable = selectable || "row";
    //Grid配置信息
    var options =
    {
        dataSource: dataSource,
        autoBind: isAutoBind,
        sortable: Sortflag,   //排序属性
        selectable: selectable,
        scrollable: true,
        resizable: true,
        reorderable: true,
        navigatable: true,
        height: "99%",
        columns: columns,
        editable: isEditable,
        dataBinding: function (e) {

        }
    };
    var grid = $(gridId).kendoGrid(options)
    var gridView = $(grid).data("kendoGrid");
    //caojun 解决多行选择时，单元格无法复制的问题
    $.each(gridView.columns, function (n, item) {
        if (typeof item.editor != "undefined")
            return;
        item.editor = function (container, options) {
            CommonJs.KendoGridEditorForReadonly(options, container);
        };
    });
    return gridView;
}


/**========返回单位选择框==============================================================================
 参数说明：sontextId 关联的
 ============================**/
function _get_select_list_kendoComboBox(textId, sourceurl, valuename, textname, firstItemType, defaultValue, dropDownWidth, callBackFunction, parameter, isSearchAll) {
    if (defaultValue != null && typeof defaultValue != 'undefined') {
        $("#" + textId).attr("value", "");
    }
    var source = new kendo.data.DataSource({
        type: "json",
        serverFiltering: true,
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                if (parameter != undefined && parameter != null && parameter != "") {
                    options.data[parameter.key] = parameter.value;
                }

                if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != "" && defaultValue != _gys_empty_guid) {
                    options.data.DefaultValueId = defaultValue;
                }
                else {
                    var searchVal = $("#" + textId).data("kendoComboBox").value();
                    if (searchVal != "") {
                        options.data.DefaultValueId = searchVal;
                    }
                }
                if (isSearchAll != null && typeof isSearchAll != "undefined") {
                    options.data.IsSearchAll = isSearchAll;
                }
                $.ajax({
                    url: sourceurl,
                    data: options.data,
                    type: "post",
                    cache: false,
                    success: function (result) {
                        if (typeof(result) != 'object')
                            result = eval(result);
                        _set_gys_kendoComboBox_firstItem(firstItemType, result, valuename, textname);
                        options.success(result);
                        //var kendoComVal = $("#" + textId).data("kendoComboBox").value();
                        //if (typeof kendoComVal == "string" && kendoComVal != "" && kendoComVal != _gys_empty_guid) {
                        //    var flag = false;
                        //    for (var i = 0; i < result.length; i++) {
                        //        if (result[i][valuename] == kendoComVal) {
                        //            flag =true;
                        //            break;
                        //        }
                        //    }
                        //    if (!flag) {
                        //        $("#" + textId).data("kendoComboBox").value("");
                        //    }
                        //}
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });

                //回调方法
                if (typeof options.data.filter != 'undefined' && options.data.filter.filters[0] != undefined) {
                    if (options.data.filter.filters[0].value == "") {
                        if (typeof callBackFunction == "function") {
                            callBackFunction();
                        }
                    }
                }
            }
        }
    });
    $("#" + textId).kendoComboBox({
        dataValueField: valuename,
        dataTextField: textname,
        dataSource: source,
        filter: "contains"
    });
    if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
        $("#" + textId).data("kendoComboBox").value(defaultValue)
    }
    if (typeof (dropDownWidth) != "undefined" && !isNaN(dropDownWidth)) {
        $("#" + textId).data("kendoComboBox").ul.parent().css("width", dropDownWidth);
    }

    return $("#" + textId).data("kendoComboBox");
}

function _get_select_list_kendoDropDownList(textId, sourceurl, valuename, textname, firstItemType, defaultValue, defaultText, dropDownWidth, changeFunc, parameter, searchModel, callbackFunc) {
    if (defaultValue != null && typeof defaultValue != 'undefined') {
        $("#" + textId).attr("value", "");
    }

    var source = new kendo.data.DataSource({
        type: "json",
        serverFiltering: true,
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                var queryItem = $.extend(options.data, searchModel);
                if (parameter != undefined && parameter != null && parameter != "") {
                    options.data[parameter.key] = parameter.value;
                }
                if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
                    options.data.DefaultValueId = defaultValue;
                }
                $.ajax({
                    url: sourceurl,
                    data: options.data,
                    type: "post",
                    cache: false,
                    success: function (result) {
                        if (typeof(result) != 'object')
                            result = eval(result);
                        var firstSelect = {};
                        firstSelect[valuename] = "";
                        firstSelect[textname] = "请选择..";
                        result.splice(0, 0, firstSelect);
                        _set_gys_kendoComboBox_firstItem(firstItemType, result, valuename, textname);
                        options.success(result);
                        if (typeof callbackFunc == "function") {
                            callbackFunc(result);
                        }
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });
            }
        }
    });
    $("#" + textId).kendoDropDownList({
        dataValueField: valuename,
        dataTextField: textname,
        dataSource: source,
        change: function (e) {
            if (typeof changeFunc == "function") {
                var dataId = this.value();
                changeFunc(dataId);
            }
        }
    });
    if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
        $("#" + textId).data("kendoDropDownList").value(defaultValue)
    }
    if (defaultText != null && typeof defaultText != 'undefined' && defaultText != "") {
        $("#" + textId).data("kendoDropDownList").text(defaultText)
    }

    if (typeof (dropDownWidth) != "undefined" && !isNaN(dropDownWidth)) {
        $("#" + textId).data("kendoDropDownList").ul.parent().css("width", dropDownWidth);
    }

    return $("#" + textId).data("kendoDropDownList");
}

/**
 ============================级联下拉选择框=================================
 参数说明
 textId          元素Id
 sourceurl       请求地址
 valuename       下拉绑定value
 textname        下拉显示文本 text
 tooptiptext     提示文本
 autobind        是否自动绑定（默认为True）
 parentTextId    父级别下拉的Id
 firstItemType   文本类型
 defaultValue    默认值
 dropDownWidth   宽度
 **/
function _get_cascadingSelect_list_kendoComboBox(textId, sourceurl, valuename, textname, tooptiptext, autobind, parentTextId, firstItemType, defaultValue, dropDownWidth) {
    if (defaultValue != null && typeof defaultValue != 'undefined') {
        $("#" + textId).attr("value", "");
    }
    if (autobind != false) {
        autobind = true;
    }
    if (tooptiptext == null || typeof tooptiptext == 'undefined') {
        tooptiptext = "请选择";
    }
    parentTextId = parentTextId || "";
    var source = new kendo.data.DataSource({
        type: "json",
        serverFiltering: true,
        transport: {
            read: function (options) {
                options.data.t = Math.random();
                if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
                    options.data.DefaultValueId = defaultValue;
                }
                var parenttext = $("#" + parentTextId).val();
                $.ajax({
                    url: sourceurl,
                    data: {parentText: parenttext},
                    type: "post",
                    cache: false,
                    success: function (result) {
                        _set_gys_kendoComboBox_firstItem(firstItemType, result, valuename, textname);
                        options.success(result);
                    },
                    error: function (result) {
                        options.error(result);
                    }
                });

                //回调方法
                if (typeof options.data.filter != 'undefined' && options.data.filter.filters[0].value == "") {
                    if (typeof callBackFunction == "function") {
                        callBackFunction();
                    }
                }
            }
        }
    });

    $("#" + textId).kendoComboBox({
        autoBind: autobind,
        cascadeFrom: parentTextId,
        filter: "contains",
        placeholder: tooptiptext + "...",
        dataTextField: textname,
        dataValueField: valuename,
        dataSource: source,
    });

    if (defaultValue != null && typeof defaultValue != 'undefined' && defaultValue != _gys_empty_guid) {
        $("#" + textId).data("kendoComboBox").value(defaultValue)
    }
    if (typeof (dropDownWidth) != "undefined" && !isNaN(dropDownWidth)) {
        $("#" + textId).data("kendoComboBox").ul.parent().css("width", dropDownWidth);
    }

    return $("#" + textId).data("kendoComboBox");

}

/*
 是否在下拉框数据源中存在，如果不存在，则追加数据
 参数说明
 textId          元素Id
 valueName      下拉绑定value
 textName       下拉显示文本 text
 value        要判断的值
 text         要追加的文本
 */
function ExsitValue_kendoComboBox(textId, valueName, textName, value, text) {
    var comboBox = $("#" + textId).data("kendoComboBox");
    //判断是否在下拉框中存在
    var isExist = comboBox.dataSource.data().find(function (obj) {
        return obj[valueName] == value;
    });
    //如果不存在，加至下拉框数据源中
    if (isExist == undefined) {
        var data = {};
        data[valueName] = value;
        data[textName] = text;
        comboBox.dataSource.add(data);
    }
    comboBox.value(value); //选中值 
}

/*kendoTreeView common setting and function*/
//************************************************************************************
//自定义 Kendo TreeView 配置参数选项模型及默认值
function gys_treeview_option_model() {
    this.srcUrl = ""; //数据源地址
    this.paraData = {}; //参数
    this.checkBoxModel = false; //使用复选框
    this.templateModel = false;//使用模板
    this.withRelation = false; //选中父级 + 取消子级
    this.treeModel = {children: "items"}; //Grid模式
    this.lblToggle = false; //描述可以切换选中
    this.emptyInfo = ""; //tree内容为空时的替代内容
    this.onSelect = function () {
        return true;
    };
};

//绑定事件：$("#id").data("kendoTreeView").bind("change", function () { ... });
function init_Ken_TreeView(treeObj, optionModel) {
    if (typeof treeObj != "object" || treeObj == null ||
        typeof optionModel != "object" || optionModel == null ||
        typeof optionModel.srcUrl != "string" || $.trim(optionModel.srcUrl) == "") {
        return treeObj;
    }

    //optionModel.paraData.rnd = Math.random();
    return treeObj.kendoTreeView({
        checkboxes: optionModel.checkBoxModel,
        template: optionModel.templateModel,
        dataSource: {
            transport: {
                read: {
                    url: optionModel.srcUrl,
                    data: optionModel.paraData,
                    cache: false,
                    type: "POST",
                    dataType: "json",
                    complete: function (result) {
                        treeObj.find("input[type=checkbox][checked]").each(function () {
                            if (!$(this).prop('checked')) {
                                kenTreeCheckItem(treeObj, $(this), true);
                            }
                        });
                        if (optionModel.withRelation == true) {
                            kenSetChkWithParent(treeObj);
                        }
                        if (optionModel.lblToggle) {
                            treeObj.find("li.k-item span.k-in").click(function () {
                                var chkItem = $(this).siblings("span.k-checkbox").find("input[type=checkbox]");
                                kenTreeCheckItem(treeObj, chkItem, !chkItem.prop('checked'));
                            });
                        }
                        var _emptyInfo = $.trim(optionModel.emptyInfo);
                        if (_emptyInfo != "") {
                            var itemCount = treeObj.find("li.k-item").length;
                            if (itemCount == 0) {
                                treeObj.empty().append(_emptyInfo);
                            }
                        }
                    }
                }
            },
            schema: {
                model: optionModel.treeModel
            }
        }
    });
}
//重新读取刷新数据
function kenTreeViewRefresh(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        treeObj.data("kendoTreeView").dataSource.read();
    }
}

//重新读取刷新数据
function kenGridRefresh(GridObj) {
    if (typeof GridObj == "object" && GridObj != null) {
        GridObj.data("kendoGrid").dataSource.read();
    }
}

//改变Tree中单个Item的选中状态
function kenTreeCheckItem(treeObj, chkItem, isChecked) {
    if (typeof treeObj == "object" && treeObj != null && typeof chkItem == "object" && chkItem != null) {
        if (typeof isChecked == "undefined" || isChecked == null) isChecked = false;
        var kitem = treeObj.data("kendoTreeView").dataSource.getByUid(chkItem.closest("li.k-item").attr("data-uid"));
        kitem.checked = isChecked;
        chkItem.prop("indeterminate", false);
        chkItem.prop("checked", isChecked);
    }
}

//改变grid中单个Item的选中状态
function kenGridCheckItem(gridObj, chkItem, isChecked) {
    if (typeof gridObj == "object" && gridObj != null && typeof chkItem == "object" && chkItem != null) {
        if (typeof isChecked == "undefined" || isChecked == null) isChecked = false;
        var kitem = gridObj.data("kendoGrid").dataSource.getByUid(chkItem.closest("tr").attr("data-uid"));
        kitem.checked = isChecked;
        chkItem.prop("indeterminate", false);
        chkItem.prop("checked", isChecked);
    }
}

//选中：选中所有父节点；取消选中：取消所有子节点选中
function kenSetChkWithParent(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        treeObj.find("input[type=checkbox]").click(function () {
            if ($(this).prop('checked')) {
                var parents = $(this).parents("ul.k-group").siblings("div.k-mid,div.k-top").find("input[type=checkbox]");
                parents.each(function () {
                    kenTreeCheckItem(treeObj, $(this), true);
                });
            }
            else {
                var sons = $(this).closest("li.k-item").find("input[type=checkbox]");
                sons.each(function () {
                    kenTreeCheckItem(treeObj, $(this), false);
                });
            }
        });
    }
}

//选中Grid中所有节点
function kenGridSelAll(gridObj) {
    if (typeof gridObj == "object" && gridObj != null) {
        gridObj.find("input[type=checkbox]").each(function () {
            if (!$(this).prop('checked')) {
                kenGridCheckItem(gridObj, $(this), true);
            }
        });
    }
}


//全不选中Grid中所有节点
function kenGridSelNone(gridObj) {
    if (typeof gridObj == "object" && gridObj != null) {
        gridObj.find("input[type=checkbox]").each(function () {
            if ($(this).prop('checked')) {
                kenGridCheckItem(gridObj, $(this), false);
            }
        });
    }
}

//反选选Grid中所有节点
function kenGridSelInvert(gridObj) {
    if (typeof gridObj == "object" && gridObj != null) {
        gridObj.find("input[type=checkbox]").each(function () {
            kenGridCheckItem(gridObj, $(this), !$(this).prop('checked'));
        });
    }
}

//选中TreeView中所有节点
function kenTreeSelAll(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        treeObj.find("input[type=checkbox]").each(function () {
            if (!$(this).prop('checked')) {
                kenTreeCheckItem(treeObj, $(this), true);
            }
        });
    }
}

//全不选中TreeView中所有节点
function kenTreeSelNone(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        treeObj.find("input[type=checkbox]").each(function () {
            if ($(this).prop('checked')) {
                kenTreeCheckItem(treeObj, $(this), false);
            }
        });
    }
}

//反选选TreeView中所有节点
function kenTreeSelInvert(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        treeObj.find("input[type=checkbox]").each(function () {
            kenTreeCheckItem(treeObj, $(this), !$(this).prop('checked'));
        });
    }
}

//获取树结构选中节点ID
function kenGetcheckedNodeIds(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        var checkedNodes = [],
            treeView = treeObj.data("kendoTreeView").dataSource.view(),
            message;

        if (treeView != null) {
            checkedNodeIds(treeView, checkedNodes);
        }

        if (checkedNodes.length > 0) {
            return checkedNodes.join(",");//使用半角逗号分隔
        }
    }
    return "";
}
function checkedNodeIds(nodes, checkedNodes) {
    if (typeof nodes == "object" && nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].checked) {
                checkedNodes.push(nodes[i].id);
            }

            if (nodes[i].hasChildren) {
                checkedNodeIds(nodes[i].children.view(), checkedNodes);
            }
        }
    }
}


function kenGetcheckedNodeName(treeObj) {
    if (typeof treeObj == "object" && treeObj != null) {
        var _checkedNodeName = [],
            treeView = treeObj.data("kendoTreeView").dataSource.view(),
            message;

        if (treeView != null) {
            checkedNodeName(treeView, _checkedNodeName);
        }

        if (_checkedNodeName.length > 0) {
            return _checkedNodeName.join(",");//使用半角逗号分隔
        }
    }
    return "";
}
function checkedNodeName(nodes, checkedNodeNames) {
    if (typeof nodes == "object" && nodes != null) {
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].checked) {
                checkedNodeNames.push(nodes[i].text);
            }
            if (nodes[i].hasChildren) {
                checkedNodeName(nodes[i].children.view(), checkedNodeNames);
            }
        }
    }
}

/*Kendo Grid重新读取刷新数据*/
function kenGridRefresh(grid, isFirst) {
    var gridObj = null;
    if (typeof grid == "string" && $.trim(grid) != "") {
        gridObj = $("#" + grid).data("kendoGrid");
    }
    else if (typeof grid == "object" && grid != null) {
        gridObj = grid;
    }
    if (typeof gridObj == "object" && gridObj != null) {
        var _kenGridObj = gridObj;
        if (typeof gridObj.dataSource != "object" || gridObj.dataSource == null) {
            _kenGridObj = gridObj.data("kendoGrid");
        }

        if (isFirst == true) {
            _kenGridObj.dataSource.page(1);
        }
        _kenGridObj.dataSource.read();
    }
}

/*刷新并重新选中*/
function gridrefreshs(objname) {
    var selgrid = $("#" + objname).data("kendoGrid");
    var crow = selgrid.select();
    var rowis = [];
    var rowindex = $("#" + objname + " td#" + selgrid.current()[0].id).closest("tr")[0].rowIndex;
    $.each(crow, function (n, irow) {
        rowis.push("#" + objname + " tr:eq(" + (irow.rowIndex + 1) + ")");
    });
    var focusedCellIndex = selgrid.current()[0].cellIndex;

    //selgrid.refresh();
    selgrid.dataSource.read();
    setTimeout(function () {
        $.each(rowis, function (n, rowi) {
            selgrid.select(rowi);
        });
    }, 500);
    setTimeout(function () {
        return function () {
            selgrid.current(selgrid.tbody.find("tr").eq(rowindex).find("td").eq(focusedCellIndex));
        }
    }(), 200);
}

//获取多选列表显示文本，使用","分隔
function getMultiSelectText(multiId, valuename, textname) {
    if (typeof multiId == "string" && $.trim(multiId) != "") {
        if (typeof valuename == undefined || $.trim(valuename) == "") {
            valuename = "value";
        }
        if (typeof textname == undefined || $.trim(textname) == "") {
            textname = "text";
        }
        var arrList = [];
        var multiselect = $("#" + multiId).data("kendoMultiSelect");
        var dataItem = multiselect.dataItems();
        $(dataItem).each(function (index, obj) {
            if (obj[valuename] != "") {
                arrList.push(obj[textname]);
            }
        });
        var strTxt = arrList.join(",");
        return strTxt;
    }
    return "";
}

/************************************************
 *** 级联城市
 ************************************************/
/*节点ID形式 */
function SetThreeCascadeCity(province, provpath, prefectcity, precitypath, city, citypath) {
    $("#" + province).kendoDropDownList({
        optionLabel: "请选择省份...",
        dataValueField: "CityId",
        dataTextField: "CityName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: provpath
            }
        }
    }).data("kendoDropDownList");
    $("#" + prefectcity).kendoDropDownList({
        autoBind: false,
        cascadeFrom: province,
        optionLabel: "请选择市...",
        dataValueField: "CityId",
        dataTextField: "CityName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: precitypath
            }
        }
    }).data("kendoDropDownList");
    $("#" + city).kendoDropDownList({
        autoBind: false,
        cascadeFrom: prefectcity,
        optionLabel: "请选择地区...",
        dataValueField: "CityId",
        dataTextField: "CityName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: citypath
            }
        }
    }).data("kendoDropDownList");
}


/************************************************
 *** 级联费用类型
 ************************************************/
/*节点ID形式 */
function SetThreeCascadeOption(OptionCategory, OptionCategoryPath, OptionType, OptionTypePath) {
    $("#" + OptionCategory).kendoDropDownList({
        optionLabel: "请选择大类...",
        dataValueField: "OptionId",
        dataTextField: "OptionName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: OptionCategoryPath
            }
        }
    }).data("kendoDropDownList");
    $("#" + OptionType).kendoDropDownList({
        autoBind: false,
        cascadeFrom: OptionCategory,
        optionLabel: "请选择类型...",
        dataValueField: "OptionId",
        dataTextField: "OptionName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: OptionTypePath
            }
        }
    }).data("kendoDropDownList");
}

/************************************************
 *** 级联公司账户
 ************************************************/
/*节点ID形式 */
function SetThreeCascadeAccount(ErpoOrganization, ErpoOrganizationPath, ErpAccont, ErpAccontPath) {
    $("#" + ErpoOrganization).kendoDropDownList({
        optionLabel: "请选择组织机构...",
        dataValueField: "OrganizationId",
        dataTextField: "OrganizationName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: ErpoOrganizationPath + "?r=" + new Date()
            }
        }
    }).data("kendoDropDownList");
    $("#" + ErpAccont).kendoDropDownList({
        autoBind: false,
        cascadeFrom: ErpoOrganization,
        optionLabel: "请选择账户...",
        dataValueField: "AccountId",
        dataTextField: "AccountName",
        dataSource: {
            type: "json",
            serverFiltering: true,
            transport: {
                read: ErpAccontPath + "?r=" + new Date()
            }
        },
        index: 1    //默认选择第二个选项
    }).data("kendoDropDownList");
}


/*节点 DOM选择器*/
function OpenCityMap(winobj, winurl, pointobj, cityobj) {
    var point = $(pointobj).attr("value");
    var citydata = $(cityobj).data("kendoDropDownList");
    var cityname = "";
    if ($.trim(citydata.value()) != "") {
        cityname = $.trim(citydata.text());
    }
    $(winobj).kendoWindow({
        width: 600,
        height: 400,
        title: "坐标选择",
        content: winurl + "?point=" + point + "&cityname=" + cityname,
        iframe: true,
        animation: false,
        modal: true,
        close: function (e) {
            if (window.frames.length > 0) {
                for (var i = 0; i < window.frames.length; i++) {
                    //if (typeof window.frames[i].parent.mapReturn != 'undefined') {
                    //    $(pointobj).attr("value", window.frames[i].parent.mapReturn());
                    //}
                    if (typeof window.frames[i].mapReturn != 'undefined') {
                        $(pointobj).attr("value", window.frames[i].mapReturn());
                    }
                }
            }

        }
    });
    var _window = $(winobj).data("kendoWindow");
    _window.center().open();
}

function _get_select_fileUpload(objId, saveUrl, multipleflag, fileTypes, size, hidreturnId, showreturnId) {
    if (multipleflag != true) {
        multipleflag = false;
    }

    $("#" + objId).kendoUpload({
        multiple: multipleflag,
        async: {
            saveUrl: saveUrl,
            autoUpload: true
        },
        localization: {
            select: '请选择图片'
        },
        showFileList: false,
        upload: onUpload,
        error: onError
    });
    function onUpload(e) {
        fileTypes = fileTypes || ".ico|.png|.jpg|.jpeg|.bmp|.gif";
        var files = e.files;
        $.each(files, function () {
            if (fileTypes.indexOf(this.extension.toLowerCase()) < 0) {
                alert("上传文件格式不支持")
                e.preventDefault();
            }
            if (this.size > size * 1024) {
                alert("上传图片太大（不要大于" + size + "KB）")
                e.preventDefault();
            }
        });
    }

    function onError(e) {
        $("#upselwraper .k-upload").addClass("upselwraperzone");
        var msg = e.XMLHttpRequest.responseText;
        var resultObj = null;
        var splitLoc = msg.lastIndexOf("__");//纯粹的Json字符串前台无法接收
        if (splitLoc > 0) {
            var result = msg.substr(0, splitLoc);
            resultObj = JSON.parse(msg.substr(0, splitLoc));
        }
        if (resultObj != null && resultObj.Key != null) {
            var msgContent = msg.substr(splitLoc + 1, msg.length - splitLoc);
            if (resultObj.Key == "success") {
                $("#" + hidreturnId).val(resultObj.SavePath);
            }
            else {
                $("#" + hidreturnId).val("");
            }
            $("#" + showreturnId).attr("src", resultObj.ShowPath);
            alert(resultObj.Msg);
        }
    }

    return $("#" + objId).data("kendoUpload");
}


//***********************************上传操作**********************************
//function common_file_upload(opts) {
//    //_obj, _fileId, _data, _url, _success, _error
//    var _params = {
//        id: opts.id || null,
//        obj: opts.obj || null,
//        url: opts.url || "/common/upload",
//        data: opts.data || null,
//        value: opts.value || null,
//        success: opts.success || null,
//        error: opts.error || null
//    };
//    if (typeof _params.data != 'undefined') {
//        _params.data.Id = _params.data.Id || _params.id;
//    }
//    else {
//        _params.data = {}
//    }
//    $(_params.obj).GysUpload({
//        id: _params.id,
//        change: function (item, el) {
//            $.ajaxFileUpload({
//                url: _params.url,
//                secureuri: false,
//                fileElementId: el.Id,
//                dataType: 'json',
//                data: _params.data,
//                success: _params.success,
//                error: _params.error
//            });
//        }
//    });
//}

/*
 *******************************************************   统一表格绑定方法（开始） **********************************************************
 */
(function (window, undefined) {
    //参数说明
    //obj_argument = {
    //	--grid_name		: '格式名称'；grid_name +‘_’ +grid_id，构成在整个系统中的唯一标识
    //	grid_id			: '',			// 表格div的id属性名
    //	list_url		: '',			// ajax 请求路径
    //	link_url		: '',			// 双击时的跳转页连接
    //	order_id		: '',			// 
    //	search_model	: '',			// 查询mod
    //	grid_model		: '',			//	
    //	grid_column		: '',			// 表格列名mod
    //	selec_table		: 'row',		// 是否可多行选中，默认为单行选中
    //	sort_flag		: true,			// 排序
    //	show_no			: false,		// 是否显示序号
    //	message_obj		: 'gridTotal',	// 统计信息显示对象
    //	msg_select		: 'tooltip'		// 选中数据统计显示对象
    //	auto_bind		: true			// （true）加载表格并查询数据
    //	action_success	: '',			// ajax请求成功时执行的方法
    //	action_change	: '',			// 选中行改变时的方法
    //	action_dataBound: ''			// 数据绑定后事件 dataBound
    //  dataBound_type:""               //数据绑定类型（有 'url'地址请求 和 'hidden'隐藏域）
    //	fee_type		：，            // 表示费用类型  主要区别于付款或收款操作
    //	biao_shi		:,				// 表示要标识区分，起辅助作用，给赋不同的值有不同的意义
    //	groupable		: false			// 分组
    //  collapseRow     : true          // 分组时是否折叠（true: 折叠）
    //	grid_child_column: '',			// 子表列 model
    //	grid_child_data_field : ''		// 主表中,子表数据源对应的字段
    //	toolbar			: []			// 要显示的菜单按钮
    //	excel_filename	: ''			// 导出Excel文件名称
    //  tab_name        :'',            // 双击表格打开新选项卡页面的名字
    //	filterable		: true,			// 过滤
    //  edi_table       : false         // 可编辑
    //  reor_derable    : false         // 表头列不允许拉动
    //	unpageable		: false			// 是不分页
    //  page_size       : 1000          // 每页显示行数
    //  id_field        :''             //双击表格传递的Id参数
    //  isOpenKen_Window ：true        //是否是弹出窗口默认false(undifinder)
    //  openKenWindow_width:            //弹出窗口的宽度
    //  openKenWindow_hight             //弹出窗口的高度
    //  dblCLickType:""                 //双击时模式：“url”进行跳转，“func”执行此函数
    //  dblCLickFunc:function()         //双击回调执行的函数
    // detailTemplate:""                //模板字符串
    //detailUrl:""                      //明细表格数据源的请求url
    //detailGridModel:""                //明细表格数据源grid_model
    //detailSelectable:""               //明细表格选择模式
    //detailColumn:""                   //明细表格列
    //detailDbFun:""                    //明细表格
    //show_checkbox                     //是否显示checkbox以及全选功能
    //}
    var LOCALSTORAGE_Customer = 'KendoGrid_';		//自定义列
    var CommonJs = (function () {
        var _commonJs = function (selector) {
            return new jQuery(selector);
        }
        _commonJs.KendoGridBind = function (obj_argument) {
            var _customer_setting = [];//获取新表头
            var args = obj_argument;
            if (!args.grid_id || !args.grid_column)
                return null;
            if (!args.message_obj)			// 给统计信息显示控件名设置默认值
                args.message_obj = 'gridTotal';
            if (!args.msg_select)
                args.msg_select = 'tooltip';
            // 当前页面action名	 
            args.action_name = args.list_url.substr(args.list_url.lastIndexOf("/") + 1);
            // 每页显示行数
            args.page_size = args.page_size || _gys_grid_PageSizes;
            // 是否添加序号列（默认添加）
            args.show_no = args.show_no != false;
            // 表格所在页面
            args.grid_name = window.location.href;
            //生成表格唯一标识
            var urlId = args.grid_name.substring(args.grid_name.lastIndexOf(":") + 1, args.grid_name.lastIndexOf("?") > 0 ? args.grid_name.lastIndexOf("?") : args.grid_name.length);
            args.grid_name = urlId.substring(urlId.indexOf("/") + 1, urlId.length);
            // 表格列属性处理
            if (typeof args.grid_column != 'undefined') {
                // 给所有列添加只读方法 （解决editable=false时，单元格内容无法复制）
                _commonJs.KendoGridEditorIsFalse(args.grid_column);
                var lockable = false;
                for (var i in args.grid_column) {
                    if (args.grid_column[i].locked) {
                        lockable = true;
                        break;
                    }
                }
                // 给所有表格前加“序号”列
                if (args.show_no) {
                    args.grid_column.splice(0, 0, {
                        field: "No",
                        title: "序号",
                        width: Gys.Kengrid_Width.RowIndex,
                        editor: function (container, options) {
                            ReadOnly(container, options);
                        },
                        attributes: {"class": "tdNo"},
                        hidden: false,
                        sortable: false,
                        locked: lockable
                    });
                }
                //显示选择框
                if (args.show_checkbox) {
                    var change_event = null;
                    if (args.checkbox_event) {
                        change_event = args.checkbox_event;
                    }
                    args.grid_column.splice(0, 0, {
                        locked: lockable,
                        field: "Check_id",
                        headerTemplate: "<input type='checkbox' id='check-all' /><label for='check-all'>全选</label>",
                        sortable: false,
                        width: Gys.Kengrid_Width.RowIndex,
                        template: "<input type='checkbox' name='Check_id' id='#: Check_id #' onchange='" + change_event + "'/>"
                    });
                }
                // 设置表格属性
                args.grid_column = _commonJs.GetGridColumns(args.grid_column, args.grid_name);
            }
            var data_source = "";
            if (args.dataBound_type != 'hidden') {
                // 数据源
                data_source = new kendo.data.DataSource({
                    transport: {
                        read: function (options) {
                            var queryItem = $.extend(options.data, args.search_model);
                            if (typeof queryItem.filter != "undefined") {
                                queryItem.filter = kendo.stringify(queryItem.filter);
                            }
                            if (queryItem.filter == undefined && args.auto_bind)
                                queryItem.filter = "DDDD";
                            //初始化时的条件，页面初始化时添加的条件不包含在filter中。
                            queryItem.autoParam=$.extend({}, args.search_model);
                            options.data.t = Math.random();
                            $.ajax({
                                url: args.list_url,
                                dataType: "json",
                                data: options.data,
                                type: "post",
                                //type: "get",
                                success: function (result) {
                                    if(result.message&&result.message!=""){
                                        GysAlert({content:result.message});
                                        options.error(result);
                                    }else{
                                        result.list = eval(result.list);
                                        options.success(result);
                                        if (args.show_checkbox) {
                                            $("#check-all").prop('checked', false);
                                        }
                                        if (result)
                                            if (args.action_success) {
                                                // 执行传递的方法
                                                var _callback = eval(args.action_success);
                                                if (typeof _callback != 'undefined') {
                                                    _callback(result);
                                                    //_callback(result.showcount, args.message_obj, args.action_name);
                                                }
                                            }
                                    }
                                },
                                error: function (result) {
                                    options.error(result);
                                }
                            });
                        },
                        cache: false
                    },
                    pageSize: _gys_grid_PageSize,
                    serverPaging: true,
                    serverFiltering: true,
                    serverSorting: true,
                    schema: {
                        data: "list",
                        total: "total",
                        model: args.grid_model
                    }
                });
            } else {
                //数据格式
                data_source = new kendo.data.DataSource({
                    data: dataSource,
                    schema: {
                        model: gridModel
                    }
                });
            }

            var isEdit = args.edi_table;
            var isReor = args.reor_derable;
            if (typeof isEdit == "undefined") isEdit = false;
            if (typeof isReor == "undefined") isReor = true;
            if (typeof args.auto_bind == "undefined") args.auto_bind = true;

            var gridPageable = {
                refresh: true,
                pageSizes: args.page_size,
                buttonCount: 5,
                messages: {
                    display: "{0} - {1} 共 {2} 条数据",
                    empty: "没有要显示的数据",
                    itemsPerPage: "条每页",
                    first: "首页",
                    previous: "前一页",
                    next: "下一页",
                    last: "最后一页",
                    refresh: "刷新"
                }
            };
            if (args.unpageable)//不分页
            {
                gridPageable = false;
            }
            var options = {
                dataSource: data_source, //改
                autoBind: args.auto_bind,
                pageable: gridPageable,
                sortable: args.sort_flag != false,		//排序属性
                selectable: args.selec_table || "row",
                scrollable: true,
                resizable: true,
                reorderable: isReor,
                navigatable: true,
                height: "99%",
                columns: args.grid_column,
                editable: isEdit,
                change: function (e) {
                    var _callback = eval(args.action_change);
                    if (typeof _callback != 'undefined') {
                        _callback(e);
                    } else {
                        _commonJs.CallBackChangeOfTotal(args.grid_id, args.action_name, args.stock_status);
                    }
                },
                dataBinding: function (e) {
                    if (args.show_no) { // 如果有“序号”列，则填充
                        var _page_no_count = 0;
                        if (typeof gridPageable == "object") {
                            var _page_index = e.sender.pager.dataSource.page(),
                                _page_size = e.sender.pager.dataSource.pageSize();
                            if (typeof _page_index != 'undefined' && typeof _page_size != 'undefined') {
                                _page_no_count = (_page_index - 1) * _page_size;
                            }
                        }
                        if (typeof (e.items) != "undefined") {
                            for (var i = 0; i < e.items.length; i++) {
                                e.items[i].No = parseInt(_page_no_count) + i + 1;
                            }
                        }
                    }
                    if (args.show_checkbox) { // 如果有“序号”列，则填充
                        //获得表格中每行的唯一key，schema的id
                        var schema_id = e.sender.dataSource.options.schema.model.id;
                        if (args.checkbox_id)
                            schema_id = args.checkbox_id;
                        if (typeof (e.items) != "undefined") {
                            for (var i = 0; i < e.items.length; i++) {
                                e.items[i].Check_id = e.sender.dataItems()[i][schema_id];
                            }
                        }
                    }
                },
                dataBound: function (e) {
                    var _callback = eval(args.action_dataBound);
                    if (typeof _callback != 'undefined') {
                        _callback(e);
                    }
                    // 如果有分组，默认全部折叠
                    if (args.groupable === true && args.collapseRow === true)
                        this.collapseRow('.k-grouping-row');
                },
                toolbar: args.toolbar || null,
                messages: {
                    commands: {
                        cancel: "Cancel changes",
                        canceledit: "Cancel",
                        create: "Add new record",
                        destroy: "Delete",
                        edit: "Edit",
                        save: "Save changes",
                        select: "Select",
                        update: "Update",
                        excel: '导出Excel'
                    }
                },
                columnReorder: function (e) {
                    // 设置列属性（位置）
                    _commonJs.CustomersSettingForIndex(args.grid_name, e.sender.columns, e.column.field, e.newIndex, e.oldIndex);
                },
                columnResize: function (e) {
                    // 设置列属性（宽度）
                    _commonJs.CustomersSetting(args.grid_name, e.column.field, 'width', e.newWidth);
                },
                detailCollapse: function (e) {
                    console.log(e.masterRow, e.detailRow);
                },
                detailExpand: function (e) {
                    console.log(e.masterRow, e.detailRow);
                }
            };

            // 如果分组属性为true，设置分组区域显示内容
            if (args.groupable === true) {
                options.groupable = {
                    messages: {empty: "　将列拖到此处进行分组..."}
                };
            }
            //display: block
            // 列设置按钮功能
            if (args.biao_shi != "报表统计") {
                args.columnMenu = args.columnMenu || true;
                if (args.columnMenu) {
                    options.columnMenu = {
                        messages: {
                            columns: "选择列名",
                            filter: "过滤",
                            sortAscending: "正序",
                            sortDescending: "倒序"
                        }
                    };
                    options.columnMenuInit = function (e) {
                        var menu = e.container.find(".k-menu").data("kendoMenu");
                        var field = e.field;
                        var btn_name = '恢复初始设置';
                        menu.append('<li class="k-item k-columns-item k-state-default k-first k-state-border-right" role="menuitem" style="z-index: 101;"><span class="k-link"><span class="k-sprite k-i-refresh"></span>' + btn_name + '</span></li>');
                        menu.bind("select", function (e) {
                            if ($(e.item).text() == btn_name) {
                                var option = {
                                    content: "是否恢复初始设置",
                                    confirmTrueEvent: function () {
                                        _commonJs.localStorageData.remove(LOCALSTORAGE_Customer + args.grid_name);
                                        GysAlert({content: btn_name + "成功，请刷新页面！！"});
                                    }
                                };
                                GysConfirm(option);
                            }
                        });
                    };
                    options.columnHide = function (e) {
                        console.log(e.column.field);
                        _commonJs.CustomersSetting(args.grid_name, e.column.field, 'hidden', true);
                    };
                    options.columnShow = function (e) {
                        _commonJs.CustomersSetting(args.grid_name, e.column.field, 'hidden', false);
                        console.log(e.column.field);
                    };
                }
            }
            // 列过滤功能
            if (args.filterable) {
                // filter menu settings
                options.filterable = {
                    name: "FilterMenu",
                    extra: false,						// turns on/off the second filter option（是否使用第二级查询）
                    messages: {
                        info: " ", //Custom header text:	// sets the text on top of the filter menu
                        filter: "查询",  //	CustomFilter		// sets the text for the "Filter" button
                        clear: "清空",  //CustomClear			// sets the text for the "Clear" button

                        // when filtering boolean numbers
                        isTrue: "是", //custom is true			// sets the text for "isTrue" radio button
                        isFalse: "否", //custom is false			// sets the text for "isFalse" radio button

                        //changes the text of the "And" and "Or" of the filter menu
                        and: "且",  //CustomAnd
                        or: "或者"   //CustomOr
                    },
                    operators: {
                        //filter menu for "string" type columns
                        string: {
                            //eq: "Custom Equal to",
                            //neq: "Custom Not equal to",
                            //startswith: "Custom Starts with",
                            contains: "筛选"  //Custom Contains 
                            //endswith: "Custom Ends with"
                        },
                        //filter menu for "number" type columns
                        number: {
                            eq: "筛选"  //Custom Equal to
                            //neq: "Custom Not equal to",
                            //gte: "大于或者等于",  //Custom Is greater than or equal to
                            //gt: "Custom Is greater than",
                            //lte: "Custom Is less than or equal to",
                            //lt: "小于"  //Custom Is less than
                        },
                        //filter menu for "date" type columns
                        date: {
                            eq: "筛选"
                            //neq: "Custom Not equal to",
                            //gte: "大于或者等于",  //Custom Is after or equal to
                            //gt: "Custom Is after",
                            //lte: "Custom Is before or equal to",
                            //lt: "小于"  //Custom Is before 
                        }
                    }
                }
            }

            // 子表配置
            //if (typeof args.grid_child_column != 'undefined') {
            //    options.detailTemplate = '<div class="grid_child"></div>';
            //    // 点击主数据前的箭头,执行子表的绑定(options.detailInit)
            //    options.detailInit = function (e) {
            //        e.detailRow.find(".grid_child").kendoGrid({
            //            columns: args.grid_child_column,
            //            dataSource: e.data[args.grid_child_data_field]
            //        });
            //    };
            //}

            //明细模板
            //Grid明细-暂注释需要时将下面注释取消
            if (args.detailTemplate != undefined && args.detailTemplate != "") {
                options.detailTemplate = args.detailTemplate;

                options.detailInit = function (e) {
                    var detailRow = e.detailRow;
                    var detailGrid = detailRow.find(".details").kendoGrid({
                        dataSource: {
                            type: "json",
                            transport: {
                                read: args.detailUrl
                            },
                            serverSorting: true,
                            serverFiltering: true,
                            filter: {field: e.data.idField, operator: "eq", value: e.data.id},
                            schema: {
                                data: "list",
                                total: "total",
                                model: args.detailGridModel
                            }
                        },
                        scrollable: false,
                        sortable: true,
                        selectable: args.detailSelectable,
                        columns: args.detailColumn,
                        resizable: true,//列宽可变
                        dataBound: function (e) {
                            var detailGrid = this;
                            //caojun 添加判断，如果设置了不显示详细的表头，再隐藏，默认是显示的
                            if (!(args.IsShowDetailHead != undefined && args.IsShowDetailHead != null && args.IsShowDetailHead)) {
                                var tHead = this.table.children("thead");
                                tHead.find("tr:first").css("display", "none");
                            }
                            if (typeof args.detailDbFun == "function") {
                                var tBody = this.table.children("tbody");
                                $("tr", tBody).bind("dblclick", function () {
                                    var selItem = detailGrid.dataSource.at($(this).index());
                                    args.detailDbFun(selItem);
                                    return false;
                                });
                            }
                        }
                    });
                };
            }

            if (args.grid_id.indexOf('#') < 0)
                args.grid_id = '#' + args.grid_id;
            var _grid = $(args.grid_id).kendoGrid(options);
            // 双击时的跳转
            if (args.dblCLickType == undefined || args.dblCLickType == "url") {
                if (args.link_url) {
                    $(args.grid_id).find(".k-grid-content").dblclick(function () {
                        if (_grid != null && typeof _grid != 'undefined' && args.link_url != null && args.link_url != "") {
                            var _grid_data = _grid.data("kendoGrid");
                            var _data_item = _grid_data.dataItem(_grid_data.select());
                            var link_url = "";
                            var tab_name = "";
                            try {
                                var _callback = eval(args.link_url);
                                if (typeof _callback != 'undefined') {
                                    link_url = _callback(_data_item);
                                }
                                var _clback = eval(args.tab_name);
                                if (typeof _clback != 'undefined') {
                                    tab_name = _clback(_data_item);
                                }
                            } catch (e) {
                                //此处异常让程序继续运行
                                link_url = link_url == "" ? args.link_url : link_url;
                                tab_name = tab_name == "" ? args.tab_name : tab_name;
                            }

                            if (args.id_field == 'undefined' || args.id_field == null || args.id_field == "") {
                                args.id_field = _data_item.idField;
                            }
                            var path = "";
                            if (link_url.indexOf('?') > 0) {
                                path = link_url + "&" + args.id_field + "=" + _data_item.id;
                            }
                            else {
                                path = link_url + "?" + args.id_field + "=" + _data_item.id;
                            }
                            //是否在Iframe中显示
                            var isInFrame = args.openKenWindow_isInFrame;
                            if (isInFrame == undefined)
                                isInFrame = true;
                            if (args.isOpenKen_Window) {
                                args.openKenWindow_width != undefined && args.openKenWindow_hight != undefined ? openKenWindow(path, args.tab_name, args.openKenWindow_width, args.openKenWindow_hight, isInFrame) : openKenWindow(path, args.tab_name, true);
                            } else {
                                top.pageLinkToTab(tab_name, path, true);
                            }
                        }
                    });
                }
            } else if (args.dblCLickType == "func") {
                if (typeof dblCLickFunc == "function") {
                    dblCLickFunc();
                }
            }

            return _grid;
        };

        _commonJs.GetGridRowChecked = function (grid_id) {
            if (grid_id.indexOf('#') < 0)
                grid_id = '#' + grid_id;
            var checkList = $(grid_id).find("input[type='checkbox']:checked");
            console.log(checkList);
        }

        // 设置Grid列头过滤
        _commonJs.SetGridMenuFilter = function (grid_id) {
            if (grid_id.indexOf('#') < 0)
                grid_id = '#' + grid_id;
            var filter = {
                name: "FilterMenu",
                extra: false,						// turns on/off the second filter option（是否使用第二级查询）
                messages: {
                    info: " ", //Custom header text:	// sets the text on top of the filter menu
                    filter: "查询",  //	CustomFilter		// sets the text for the "Filter" button
                    clear: "清空",  //CustomClear			// sets the text for the "Clear" button

                    // when filtering boolean numbers
                    isTrue: "是", //custom is true			// sets the text for "isTrue" radio button
                    isFalse: "否", //custom is false			// sets the text for "isFalse" radio button

                    //changes the text of the "And" and "Or" of the filter menu
                    and: "且",  //CustomAnd
                    or: "或者"   //CustomOr
                },
                operators: {
                    //filter menu for "string" type columns
                    string: {
                        //eq: "Custom Equal to",
                        //neq: "Custom Not equal to",
                        //startswith: "Custom Starts with",
                        contains: "筛选"  //Custom Contains
                        //endswith: "Custom Ends with"
                    },
                    //filter menu for "number" type columns
                    number: {
                        eq: "筛选"  //Custom Equal to 
                    },
                    //filter menu for "date" type columns
                    date: {
                        eq: "筛选"
                        //neq: "Custom Not equal to",
                        //gte: "大于或者等于",  //Custom Is after or equal to
                        //gt: "Custom Is after",
                        //lte: "Custom Is before or equal to",
                        //lt: "小于"  //Custom Is before 
                    }
                }
            }
            $(grid_id).data("kendoGrid").setOptions({
                filterable: filter
            });
        }

        // 根据配置的列名，设置列属性
        _commonJs.GetGridColumns = function (models, grid_name) {
            if (typeof models == 'undefined')
                return [];

            var col = [];
            var customer_setting = JSON.parse(_commonJs.localStorageData.get(LOCALSTORAGE_Customer + grid_name))
            var customer_cols = {};
            if (customer_setting != null)
                customer_cols = customer_setting.cols;
            // 将初始列属性与用户自定义的列属性合并，以用户自定义的属性为主
            $.each(models, function (n, item) {
                var _field = {};
                if ((typeof item).toLowerCase() === 'object')
                    _field = item['field'];
                else
                    _field = item;

                var _tmp = item || {};
                // 用户自定义的属性
                var _tmp_customer = customer_cols[_field] || {};
                _tmp.width = (_tmp_customer.width || item.width || _tmp.width) || 75;
                _tmp.hidden = (_tmp_customer.hidden || item.hidden) || false;

                var initHidden = false;
                if (typeof _tmp.initHidden != "undefined") {
                    initHidden = _tmp.initHidden;
                }
                if (!initHidden) {
                    if (typeof _tmp_customer.index != "undefined") {
                        _tmp.index = _tmp_customer.index;
                        col.splice(_tmp.index, 0, _tmp);
                    }
                    else {
                        _tmp.index = n;
                        col.push(_tmp);
                    }
                }
            });

            return col;
        };

        // 设置列顺序
        _commonJs.CustomersSettingForIndex = function (grid_name, columns, field, newIndex, oldIndex) {
            var _customer_setting = {
                name: grid_name
            };
            var _customer_cols = {};
            $.each(columns, function (i, item) {
                //if (item.field.toLowerCase() !== 'no') {
                item.hidden = item.hidden === true;
                item.index = i;
                if (item.field == field)
                    item.index = newIndex;
                else {
                    if (newIndex < oldIndex) {	// 移动的列向前移动
                        if (item.index >= newIndex && item.index < oldIndex)
                            item.index++;
                    } else {
                        if (item.index > newIndex)
                            item.index++;
                        else if ((item.index > oldIndex && item.index < newIndex) || item.index == newIndex)
                            item.index--;
                    }
                }
                //获取改变列位置后的表头
                _customer_cols[item.field] = {
                    field: item.field,
                    hidden: item.hidden,
                    width: item.width,
                    index: item.index
                };
                //}		
            });
            _customer_setting.cols = _customer_cols;
            _commonJs.localStorageData.set(LOCALSTORAGE_Customer + grid_name, JSON.stringify(_customer_setting));//保存缓存;
            //return _customer_setting;
        }
        // 设置列属性
        _commonJs.CustomersSetting = function (grid_name, field, attr_name, attr_value) {
            var _customer_cols = {};
            var _customer_col = {};
            var _customer_setting = JSON.parse(_commonJs.localStorageData.get(LOCALSTORAGE_Customer + grid_name)) || {
                    name: grid_name,
                    cols: {}
                };
            _customer_cols = _customer_setting.cols;
            if (typeof _customer_cols[field] === 'undefined')
                _customer_cols[field] = {};
            _customer_col = _customer_cols[field];
            _customer_col[attr_name] = attr_value;

            _commonJs.localStorageData.set(LOCALSTORAGE_Customer + grid_name, JSON.stringify(_customer_setting));//保存缓存;
            //return _customer_setting;
        }
        // 选中数据统计
        _commonJs.CallBackChangeOfTotal = function () {
            var _grid_id = arguments[0],
                _action = arguments[1],
                _stock_status = arguments[2];
            var _grid = $(_grid_id).data("kendoGrid");
            var _grid_sel = Gys.GridGetSelect(_grid_id);
            var retWN = [0, 0, 0, 0, 0];
            switch (_action) {
                case 'FeeSettlePageList':
                    $.each(_grid_sel, function (n, item) {
                        var price = parseFloat(item.FeeReceivedTotal);
                        var wei = parseFloat(item.TotalWeight);
                        if (!isNaN(price)) {
                            retWN[2] += price;
                        }
                        if (!isNaN(wei)) {
                            retWN[1] += wei;
                        }
                    });
                    break;
                case 'FeeInfoDetailViewPageList':
                // 待结费用
                case 'FeeSettleDetailPageList':
                    $.each(_grid_sel, function (n, item) {
                        var price = parseFloat(item.FeePriceTotal);
                        var wei = parseFloat(item.LogicWeight);
                        var yhprice = parseFloat(item.YHFeePriceTotal);
                        if (!isNaN(price)) {
                            retWN[2] += price;
                        }
                        if (!isNaN(wei)) {
                            retWN[1] += wei;
                        }
                        if (!isNaN(yhprice)) {
                            retWN[4] += yhprice;
                        }
                    });
                    break;
                case 'FeePaymentPageList':
                    $.each(_grid_sel, function (n, item) {
                        var price = parseFloat(item.PayMoney);
                        if (!isNaN(price)) {
                            retWN[2] += price;
                        }
                    });
                    break;
                //库存查询
                case 'StockWindowPageLists':
                case 'GetStockListsFromWMStock':
                case 'StockPageList':
                    if (typeof _stock_status != "undefined" && _stock_status == "in") {
                        $.each(_grid_sel, function (n, item) {
                            var number = parseFloat(item.OriginalNumber);
                            var wei = parseFloat(item.OriginalWeight);
                            if (!isNaN(number)) {
                                retWN[0] += number;
                            }
                            if (!isNaN(wei)) {
                                retWN[1] += wei;
                            }
                        });
                        break;
                    } else {
                        $.each(_grid_sel, function (n, item) {
                            var number = parseFloat(item.Number);
                            var wei = parseFloat(item.LogicWeight);
                            var realWeight = parseFloat(item.RealWeight);
                            if (!isNaN(number)) retWN[0] += number;
                            if (!isNaN(wei)) retWN[1] += wei;
                            if (!isNaN(realWeight)) retWN[3] += realWeight;
                        });
                        break;
                    }
                case 'GetRazProcessLists':
                    //加工单查询
                    $.each(_grid_sel, function (n, item) {
                        var number = parseFloat(item.TotalCount);
                        var wei = parseFloat(item.TotalWeight);
                        if (!isNaN(number)) {
                            retWN[0] += number;
                        }
                        if (!isNaN(wei)) {
                            retWN[1] += wei;
                        }
                    });
                    break;
                case 'GetRazAllPreProdouctList':
                    $.each(_grid_sel, function (n, item) {
                        var number = parseFloat(item.Number);
                        var price = parseFloat(item.ProcessFee);
                        var wei = parseFloat(item.LogicWeight);
                        if (!isNaN(number)) {
                            retWN[0] += number;
                        }
                        if (!isNaN(wei)) {
                            retWN[1] += wei;
                        }
                        if (!isNaN(price)) {
                            retWN[2] += price;
                        }
                    });
                    break;
                case 'FeeInvoiceDetailPageList':
                    $.each(_grid_sel, function (n, item) {
                        var price = parseFloat(item.FeeSettleTotalPrice);
                        if (!isNaN(price)) {
                            retWN[2] += price;
                        }
                    });
                    break;
            }

            //$('.gridTotal2').text(retWN[2].toFixed(Gys.PriceLength));//结算费用 实收金额
            $('#tooltip .spValueW').text(retWN[1].toFixed(Gys.WeightLength));
            $("#tooltip .spValueN").text(retWN[0].toFixed(Gys.PriceLength));
            $('#tooltip .spValueP').text(retWN[2].toFixed(Gys.PriceLength));
            $('#tooltip .spValueRealWeight').text(retWN[3].toFixed(Gys.WeightLength));
            $('#tooltip .YHValueP').text(retWN[4].toFixed(Gys.PriceLength));
        };
        // 设置表格所有列的编辑状态为只读文本框
        _commonJs.KendoGridEditorIsFalse = function (grid_cloumns) {
            $.each(grid_cloumns, function (n, item) {
                if (typeof item.editor != "undefined")
                    return;
                item.editor = function (container, options) {
                    _commonJs.KendoGridEditorForReadonly(options, container);
                };
            });

            return grid_cloumns;
        };
        // 设置 Grid 单元格不可编辑（替代 editor=false 属性，作用是可以复制单元格内容）
        _commonJs.KendoGridEditorForReadonly = function (options, parent_ctl) {
            if (typeof (options) == 'undefined' || typeof (parent_ctl) == 'undefined')
                return;
            var _value = options.model[options.field];
            if (_value == null)
                return;
            //如果包含values属性，鼠标点击时显示的是template的值
            if (options.values) {
                //如果是一个方法，则得到方法的返回值，避免bool类型的值出现true或false的情况
                if (typeof options.values == "function") {
                    var _templateFunction = eval(options.values);
                    if (typeof _templateFunction != 'undefined') {
                        _value = _templateFunction(options.model);
                    }
                } else
                    _value = options.model[options.values];
            }
            switch (options.format) {
                case '{0:n2}':
                    _value = _value.toFixed(2);
                    break;
                case '{0:n3}':
                    _value = _value.toFixed(3);
                    break;
                case '{0:yyyy-MM-dd}':
                    _value = _value.format('yyyy-MM-dd');
                    break;
                case '{0:MM/dd HH:mm}':
                    _value = _value.format('MM/dd hh:mm');
                    break;
                case '{0:yyyy-MM-dd HH:mm}':
                    _value = _value.format('yyyy-MM-dd hh:mm');
                    break;
                case '{0:yyyy-MM-dd HH:mm:ss}':
                    _value = _value.format('yyyy-MM-dd hh:mm:ss');
                    break;
            }
            var _input = $("<input style='border:none; background:none; width:100%; padding-left: 0.1em; color: blue; font-size: 12px; font-family:Verdana, Geneva, sans-serif;' />");
            _input.attr('readonly', 'true')
                //.attr('name',	options.field)		// 加上这句代码，会导致字符的格式化失效
                .attr('value', _value)
                .appendTo(parent_ctl);
            _input.focus(function () {
                this.select();
            })
                .click(function () {
                    this.select();
                });
        };
        // localStorageData 本地存储
        _commonJs.localStorageData = {
            hname: location.hostname ? location.hostname : 'localStatus',
            isLocalStorage: window.localStorage ? true : false,
            dataDom: null,
            initDom: function () { //初始化userData
                if (!this.dataDom) {
                    try {
                        this.dataDom = document.createElement('input');		//这里使用hidden的input元素
                        this.dataDom.type = 'hidden';
                        this.dataDom.style.display = "none";
                        this.dataDom.addBehavior('#default#userData');		//这是userData的语法
                        document.body.appendChild(this.dataDom);
                        var exDate = new Date();
                        exDate = exDate.getDate() + 30;
                        this.dataDom.expires = exDate.toUTCString();		//设定过期时间
                    } catch (ex) {
                        return false;
                    }
                }
                return true;
            },
            set: function (key, value) {
                if (this.isLocalStorage) {
                    window.localStorage.setItem(key, value);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        this.dataDom.setAttribute(key, value);
                        this.dataDom.save(this.hname);
                    }
                }
            },
            get: function (key) {
                if (this.isLocalStorage) {
                    return window.localStorage.getItem(key);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        return this.dataDom.getAttribute(key);
                    }
                }
            },
            remove: function (key) {
                if (this.isLocalStorage) {
                    localStorage.removeItem(key);
                } else {
                    if (this.initDom()) {
                        this.dataDom.load(this.hname);
                        this.dataDom.removeAttribute(key);
                        this.dataDom.save(this.hname);
                    }
                }
            },
            clear: function () {
                localStorage.clear();
            }
        };
        return _commonJs;
    })();
    window.CommonJs = CommonJs;
})(window);

/*
 *******************************************************   统一表格绑定方法（结束） **********************************************************
 */
/*表格加载开始*/
function progress(toggle) {
    var mask = $("#mask"),
        support = kendo.support,
        browser = support.browser,
        isRtl, leftRight, webkitCorrection, containerScrollLeft;
    if (toggle) {
        if (!mask.length) {
            if (typeof container == 'undefined')
                container = $('form')
            isRtl = support.isRtl(container);
            leftRight = isRtl ? "right" : "left";
            containerScrollLeft = container.scrollLeft();
            webkitCorrection = browser.webkit ? (!isRtl ? 0 : container[0].scrollWidth - container.width() - 2 * containerScrollLeft) : 0;

            mask = $("<div class='k-overlay k-loading-mask' id='mask' style='display: block; z-index: 10002; opacity: 0.5;'><span class='k-loading-text'>Loading...</span><div class='k-loading-image'/><div class='k-loading-color'/></div>")
                .width("100%").height("100%")
                .css("top", container.scrollTop())
                .css(leftRight, Math.abs(containerScrollLeft) + webkitCorrection)
                .prependTo(container);
        }
    } else if (mask) {
        mask[0].remove();
    }
}
/*结束*/

/*重写KendoTooltip展示方法（用于grid单元格展示不充分时鼠标悬停展示）*/
function overrideKendoTooltipShow() {
    kendo.ui.Tooltip.fn._show = function (show) {
        return function (target) {
            var e = {
                sender: this,
                target: target,
                preventDefault: function () {
                    this.isDefaultPrevented = true;
                }
            };
            if (typeof this.options.beforeShow === "function") {
                this.options.beforeShow.call(this, e);
            }
            if (!e.isDefaultPrevented) {
                show.call(this, target);
            }
        };
    }(kendo.ui.Tooltip.fn._show);
}

function gridToolTipShow(gridId) {
    if (gridId.indexOf("#") == -1)
        gridId = "#" + gridId;
    $(gridId).kendoTooltip({
        filter: "td.tdTooltip,th>a.k-link",
        animation: {
            close: {
                effects: "fade:out",
                duration: 1000
            }
        },
        position: "top",
        width: 260,
        content: function (e) {
            var target = e.target;
            return target.text();
        },
        beforeShow: function (e) {
            var target = e.target;
            console.log(target.text());
            if (target.text() == "") {
                e.preventDefault();//调用之前所定义的方法
            }
        }
    });
}
/*导出Excel动画
 btnID 按钮ID
 */
function downExcelFlash(btnID) {
    if (btnID.indexOf("#") == -1)
        btnID = "#" + btnID;
    $(btnID).attr("disabled", true);
    var _div = $("<div style='display: none; overflow:hidden;'>" +
        "<div style='font-size:1.3em;padding-left: 15px;'>正在下载数据，请稍候...</div>" +
        "<div align='center'><img src='/assets/images/material.gif' alt='请等待' style='width: 100px;height: 100px;'></div></div>");
    var kenwin = _div.kendoWindow({
        title: '',
        width: 280,
        height: 140,
        animation: false,
        resizable: false,
        draggable: false,
        animation: {
            close: {
                duration: 2000
            }
        },
        modal: true
    }).data("kendoWindow");
    kenwin.center().open();
}
/*导出Excel方法
 excelUrl 请求的url
 excelParam 请求传递的参数
 btnID 按钮ID，避免多次点击数据下载
 */
function kendoExportExcel(excelUrl, excelParam,btnID) {
    if (btnID.indexOf("#") == -1)
        btnID = "#" + btnID;
    $(btnID).attr("disabled",true);
    var _div = $("<div style='display: none; overflow:hidden;'>" +
        "<div style='font-size:1.3em;padding-left: 15px;'>正在下载数据，请稍候...</div>" +
        "<div align='center'><img src='/assets/images/material.gif' alt='请等待' style='width: 100px;height: 100px;'></div></div>");
    var kenwin = _div.kendoWindow({
        title: '',
        width: 280,
        height: 140,
        animation: false,
        resizable: false,
        draggable: false,
        animation: {
            close: {
                duration: 2000
            }
        },
        modal: true
    }).data("kendoWindow");
    kenwin.center().open();
    $.ajax({
        url: excelUrl,
        dataType: "json",
        data: excelParam,
        type: "post",
        success: function (jsonObj) {
            var sheetList=jsonObj.sheetList;
            if(sheetList[0].exportData.length==0){
                kenwin.close();
                GysAlert({content: '没有找到要下载的数据...'});
                $(btnID).attr("disabled",false);
            }else{
                var fileName = jsonObj.fileName;  //生成的excel名称
                var sheets=[]; //sheet数组
                //循环sheet页
                for(var s=0;s<sheetList.length;s++){
                    var result=sheetList[s]; //每一个sheet页的对象
                    var data = result.exportData; //要导出的数据
                    var columns = result.columns; //列英文名，标签，宽度
                    var sheetName = result.sheetName;  //生成的sheet名称
                    //先组织列名
                    var rowCells = [];
                    var columnWidth = [];
                    for (var k = 0; k < columns.length; k++) {
                        rowCells.push({value: columns[k].label});
                        columnWidth.push({width: columns[k].width});
                    }
                    var rows = [{cells: rowCells}];
                    //循环每行数据，添加至rows数组中
                    for (var i = 0; i < data.length; i++) {
                        var cell = [];
                        for (var j = 0; j < columns.length; j++) {
                            var colName = columns[j].name;
                            cell.push({value: data[i][colName]});
                        }
                        rows.push({
                            cells: cell
                        })
                    }

                    sheets.push({columns: columnWidth,
                        // Title of the sheet
                        title: sheetName,
                        // Rows of the sheet
                        rows: rows});
                }

                var workbook = new kendo.ooxml.Workbook({
                    //sheets: [
                    //    {
                    //        columns: columnWidth,
                    //        // Title of the sheet
                    //        title: sheetName,
                    //        // Rows of the sheet
                    //        rows: rows
                    //    }
                    //]
                    sheets:sheets
                });
                kenwin.close();
                $(btnID).attr("disabled",false);
                //save the file as Excel file with extension xlsx
                kendo.saveAs({dataURI: workbook.toDataURL(), fileName: fileName + ".xlsx"});
            }
        },
        error: function (result) {
            kenwin.close();
            $(btnID).attr("disabled",false);
            GysAlert({content: '请求数据失败...'});
        }
    });
}
/**
 * 弹出提示信息 用于批量下载
 * @param btnID
 */
function openWindow(btnID) {
    if (btnID.indexOf("#") == -1)
        btnID = "#" + btnID;
    $(btnID).attr("disabled", true);
    var _div = $("<div style='display: none; overflow:hidden;'>" +
        "<div style='font-size:1.3em;padding-left: 15px;'>正在下载数据，请稍候...</div>" +
        "<div align='center'><img src='/assets/images/material.gif' alt='请等待' style='width: 100px;height: 100px;'></div></div>");
    var kenwin = _div.kendoWindow({
        title: '',
        width: 280,
        height: 140,
        animation: false,
        resizable: false,
        draggable: false,
        animation: {
            close: {
                duration: 2000
            }
        },
        modal: true
    }).data("kendoWindow");
    kenwin.center().open();
}




