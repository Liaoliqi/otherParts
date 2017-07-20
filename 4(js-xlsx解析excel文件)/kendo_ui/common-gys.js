//系统JS基类库(基于JQUERY)
(function (window, undefined) {
    //扩展Jquery光标所在位置
    $.fn.selectRange = function (start, end) {
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

    var Gys = (function () {

        var _gys = function (selector) { return new jQuery(selector); }
        var _gys_date_opt_format = "yyyy-MM-dd";
        var _gys_date_opt = { format: _gys_date_opt_format };
        var _gys_datetime_opt = { format: "yyyy-MM-dd hh:mm" };
        //表格列宽度配置
        _gys.Kengrid_Width = {
            wmname: 90,//仓库名称*******************
            status: 90,//状态***********************
            type: 100,//类型***************
            coil: 120,//捆包号********************
            number: 80,//数量************************
            weight: 100,  //件重**************************
            Price: 90,//单价**********************
            date: 100,//日期*********************
            time: 100,//时间
            datetime: 160,//时期时间*****************
            username: 120,//用户名称***************
            category: 90,//品种*******************
            origin: 60,//钢厂***********
            grade: 60,//牌号*******************
            size: 110,//规格**********************
            position: 90,//库位*************
            resourceno: 200,//采购资源号*****************
            remark: 200,//备注*************
            telphone: 110, //电话***********
            sort: 80,//排序信息***********
            onoff: 70,//开关（是否）******
            wdefault: 100,//默认宽度
            RowIndex: 60,  //序号列宽度
            MakerBy: 100,  //验收人
            producttype: 65,   //成品类型
            processstatus: 70,   //成品状态
            OrderCode: 170,  //单号*********************
            titresourcenole: 200,
            config: 80,
            CreatedOn: 150,     //创建时间
            CreatedBy: 75,      //创建人
            ModifiedOn: 130,    //修改时间
            ModifiedBy: 75,      //修改人,
            Sort2: 50,
            CustomerName: 210,  //客户名称****************
            InvoiceCode: 140,   //发票号码
            OrderType: 80,  //订单类型
            /******** NEW ***********/
            companyName: 120, //企业名称
            abbreviated_name: 100, //企业简称
            bankname:120, //开户行************
            address: 180,//仓库地址************
            CompanyCode: 130 ,//客户/供应商代码,
            Content: 300,//内容
            OperationMode: 160, //经营模式
            DetailAddress: 320 //详细地址
        };


        //重量，数量,价格格式配置        
        _gys.NumberLength = 0;
        _gys.NumberFormat = "{0:n0}";
        _gys.NumberZeroStr = "0";

        _gys.WeightLength = 4;
        _gys.WeightFormat = "{0:n4}";
        _gys.WeightZeroStr = "0.0000";

        _gys.MoneyLength = 2;
        _gys.MoneyFormat = "{0:n2}";
        _gys.MoneyZeroStr = "0.00";

        _gys.NoTaxUnitLength = 6;
        _gys.NoTaxUnitFormat = "{0:n6}";
        _gys.NoTaxUnitZeroStr = "0.000000";

        _gys.SettlePriceLength = 4;  //结算单价
        _gys.SettlePriceFormat = "{0:n4}";
        _gys.SettlePriceZeroStr = "0.0000";

        _gys.MinDiscountRate = 0; //折现率最小值
        _gys.MaxDiscountRate = 1; //折现率最大值
        _gys.DiscountRateFormat = "{0:n2}";

        _gys.MinDiscountDays = 1; //折现天数最小值
        _gys.MaxDiscountDays = 365;  //折现天数最大值
        _gys.DiscountDaysFormat = "{0:n0}";

        _gys.Date = "{0:yyyy-MM-dd}"; //时间
        _gys.DateTime = "{0:yyyy-MM-dd HH:mm}"; //时间(时分)
        _gys.DateTimeAll = "{0:yyyy-MM-dd HH:mm:ss}"; //时间(时分秒)
        _gys.EditDate = "yyyy-MM-dd"; //时间编辑
        _gys.EditDateTimeAll = "yyyy-MM-dd HH:mm:ss"; //时间(时分秒)
        _gys.empty_guid = "00000000-0000-0000-0000-000000000000";


        //默认每页显示的数据条数
        _gys.PageSize =20;
        _gys.PageSizes = [20, 50, 100, 200, 500];

        //页面渲染
        _gys.PageInit = function (container) {
            kendo.init($(container));
        }

        // 删除选中的行，默认选中下一行
        _gys.SelectRow = function (gridId) {

            var grid = $(gridId).data("kendoGrid");
            var selrows = _get_grid_select_model(gridId);  //jquery方式选中的行

            var kendo_selected = grid.select();  // kendo 方式选中的行


            var rowIndex = 0;
            if (selrows.length > 0) {
                var rowIndex = kendo_selected[kendo_selected.length - 1].rowIndex;  //  得到选中行的最后一个行的索引
                // var item = grid.dataSource.data()[selrows[selrows.length - 1].rowIndex];
                //var item = grid.dataSource.data()[selrows[0].rowIndex];
                $(selrows).each(function () {
                    // alert(this.id);
                    grid.dataSource.remove(this);

                });
                //alert(rowIndex + "*" + grid.dataSource.data().length);
                if ((rowIndex - selrows.length) >= (grid.dataSource.data().length - 1)) {
                    rowIndex = rowIndex - selrows.length;
                } else {
                    rowIndex = rowIndex - selrows.length + 1;
                }
                //grid.dataSource.sync();
            }


            //rowIndex = grid.dataSource.data().length - 1;
            //alert(rowIndex);
            var row = grid.tbody.find("tr:not(.k-grouping-row)").eq(rowIndex);
            grid.select(row);

            return rowIndex;

        }
        //编辑时选中文本框
        _gys.getRowTxtEdit = function (container, options) {
            var input = $("<input/>");
            input.attr("name", options.field);
            input.attr("class", "k-input k-textbox");
            input.focus(function () {
                var input = $(this);
                setTimeout(function () {
                    input.select();
                });
            });
            input.appendTo(container);
        }

        //获取焦点光标移动到文本最后
        _gys.getFocusEdit = function (container, options) {
            var input = $("<input/>");
            input.attr("name", options.field);
            input.attr("class", "k-input k-textbox");
            input.focus(function () {
                var inputLength = input.val().length;
                input.selectRange(inputLength, inputLength);
            });
            input.appendTo(container);
        }

        //日期选择格式：xxxx-xx-xx
        _gys.BindDate = function () {
            if (arguments.length > 0) {
                var arrDateId = arguments;
                if (arrDateId.length == 1) {
                    arrDateId = arguments[0].split(",");
                }
                for (var i = 0; i < arrDateId.length; i++) {
                    $(arrDateId[i]).kendoDatePicker({
                        format: _gys_date_opt_format,
                        change: function () {

                            if (this._oldText != "" && this.value() == null) {
                                this.value(new Date());
                            }
                        }
                    });
                }
            }
        }

        //时间选择格式：xxxx-xx-xx
        _gys.BindDateTime = function (objId, isMaxTime) {
            if (arguments.length > 0) {
                var arrDateId = arguments;
                if (arrDateId.length >= 1) {
                    arrDateId = arguments[0].split(",");
                }
                for (var i = 0; i < arrDateId.length; i++) {
                    isMaxTime = isMaxTime || false;
                    $(arrDateId[i]).kendoDateTimePicker(
                        {

                            culture: "zh-CN",
                            format: "yyyy-MM-dd HH:mm:ss",
                            open: function (e) {
                                var viewType = e.view;
                                $(this).data("viewType", viewType);
                            },
                            change: function () {

                                if (this._oldText != "" && this.value() == null) {
                                    this.value(new Date());
                                }
                                var viewType = $(this).data("viewType");
                                if (viewType == "date") {
                                    if (isMaxTime) {
                                        if ($(this).data("isSet") != "1") {
                                            var newValue = new Date(this.value()).toDateString() + " 23:59:59";
                                            this.value(new Date(newValue));
                                            $(this).data("isSet", "1");
                                        }
                                    }
                                }
                                else {
                                    $(this).data("isSet", "1");
                                }

                            }
                        });
                }
            }
        }

        //数值绑定
        _gys.BindNumber = function (obj, option) {
            var opt = option;
            if (option != null && typeof option != 'undefined') {
                opt = option;
            } else {
                opt = { length: 0, min: 0 }
            }

            var l = opt.length || 0;
            var f = "{0:n" + l.toString() + "}";
            var m = opt.min || 0;
            var max = opt.max || 999999999999;

            var upArrowText = opt.upArrowText || "增加";
            var downArrowText = opt.downArrowText || "减小";

            var arrNumIds = [];
            if (obj != null && typeof obj != 'undefined') {
                arrNumIds = obj.split(",");
            }
            for (var i = 0; i < arrNumIds.length; i++) {
                $(arrNumIds[i]).kendoNumericTextBox({ format: f, min: m, decimals: l, max: max, downArrowText: downArrowText, upArrowText: upArrowText });
            }
        }

        //绑定下拉
        _gys.BindSelect = function () {
            if (arguments.length > 0) {
                var arrSelectId = arguments;
                if (arrSelectId.length == 1) {
                    arrSelectId = arguments[0].split(",");
                }
                for (var i = 0; i < arrSelectId.length; i++) {
                    $(arrSelectId[i]).kendoDropDownList();
                }
            }
        }

        //绑定下拉联动选择
        _gys.BindSelectedRel = function (select) {
            if (typeof select != 'undefined' && select != null && select != "" && arguments.length > 1) {
                var arr = [];
                for (var i = 1; i < arguments.length; i++) {
                    arr.push(arguments[i]);
                }
                var select = $(select).data("kendoComboBox");
                select.bind("change", function () {
                    for (var i = 0; i < arr.length; i++) {
                        var thisComboxBox = $(arr[i]).data("kendoComboBox");
                        if (thisComboxBox.dataSource.data().length == 0) {
                            var insertObj = "{\"" + thisComboxBox.options.dataTextField + "\":\"" + this.text() + "\",\"" + thisComboxBox.options.dataValueField + "\":\"" + this.value() + "\"}";
                            $(arr[i]).data("kendoComboBox").dataSource.add(JSON.parse(insertObj));
                        }

                        $(arr[i]).data("kendoComboBox").value(this.value());
                        $(arr[i]).data("kendoComboBox").text(this.text());
                    }
                });
            }
        }

        //明细表格
        _gys.BindDetailGrid = function (gridControl, gridModel, gridColumn, dataSource, isEdit, isShowRowNo, Sortflag, CallbackFunc) {
            //默认设置
            isEdit = isEdit || false;

            //数据格式
            var dataSource = new kendo.data.DataSource({
                data: dataSource,
                schema: {
                    model: gridModel
                }
            });

            //数据列
            var columns = gridColumn;
            if (isShowRowNo) {
                //增加隐藏列
                gridColumn.splice(0, 0, {
                    field: "No", title: "序号", attributes: { "class": "tbRowNo" },
                    width: _gys.Kengrid_Width.RowIndex, hidden: false,
                    editor: function (container, options) {
                        ReadOnly(container, options)
                    }
                });
            }

            //var Sortflag = Gys.GetCloseOpenVariable(Gys.TableSort) === "1";
            if (Sortflag != false) {
                Sortflag = true;

            }
            //配置选项
            var options = {
                dataSource: dataSource,
                selectable: "multiple",
                sortable: Sortflag,
                scrollable: true,
                resizable: true,
                reorderable: true,
                navigatable: true,
                height: "100%",
                columns: gridColumn,
                dataBinding: function (e) {
                    var index = e.index;
                    var action = e.action;
                    if (action == "add") {
                        e.items[0].No = index + 1;
                    }
                    else if (action == "rebind") {
                        if (typeof (e.items) != "undefined") {
                            for (var i = 0; i < e.items.length; i++) {
                                e.items[i].No = i + 1;
                            }
                        }
                    }
                },
                dataBound: function (result) {
                    if (typeof CallbackFunc == "function") {
                        CallbackFunc(result);
                    }
                }
            }

            //if (kendo.support.browser.msie && kendo.support.browser.version <= 8) {
            //    options.navigatable = false;
            //}

            if (isEdit) {
                options.editable = {
                    confirmation: "是否删除这条记录?"
                }
            } else {
                options.editable = false;
            }

            var grid = $(gridControl).kendoGrid(options);

            return $(grid).data("kendoGrid");
        }

        //表格绑定
        _gys.BindGridByUrl = function (gridControl, gridId, searchModel, gridModel, gridColumn, pageUrl, isEdit, selectionType, Sortflag, callbackFunc) {

            isEdit = isEdit || false;
            selectionType = selectionType || "row";

            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: function (options) {
                        var queryItem = $.extend(options.data, searchModel);
                        if (typeof queryItem.filter != "undefined") {
                            queryItem.filter = encodeURIComponent(kendo.stringify(queryItem.filter))
                        }
                        options.data.t = Math.random();
                        $.ajax({
                            url: pageUrl,
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
                    },
                    cache: false
                },
                pageSize: _gys.PageSize,
                serverPaging: true,
                serverFiltering: true,
                serverSorting: true,
                schema: {
                    data: "list",
                    total: "total",
                    model: gridModel
                }
            });

            //数据列
            var columns = gridColumn;

            //            var Sortflag = Gys.GetCloseOpenVariable(Gys.TableSort) === "1";
            if (Sortflag != false) {
                Sortflag = true;
            }

            //Grid配置信息
            var options =
            {
                dataSource: dataSource,
                pageable: {
                    refresh: true,
                    pageSizes: _gys.PageSizes,
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
                },                //分页属性
                sortable: Sortflag,   //排序属性
                selectable: selectionType,
                scrollable: true,
                resizable: true,
                reorderable: true,
                navigatable: true,
                height: "99%",
                columns: columns,
                editable: isEdit
            };

            if (kendo.support.browser.msie && kendo.support.browser.version <= 8) {
                options.navigatable = false;
            }

            return $(gridControl).kendoGrid(options);
        }

        //获取表格选择项
        _gys.GridGetSelect = function (gridControl) {
            var selectArr = [];
            var grid = $(gridControl).data("kendoGrid");
            grid.select().each(function () {
                selectArr.push(grid.dataItem(this));
            })
            return selectArr;
        }
        //设置行号
        _gys.GetRowNo = function (gridId, pop) {
            //debugger;
            var grid;
            if (pop) {
                grid = window.parent.$("#" + gridId).data("kendoGrid");
            }
            else {
                grid = $("#" + gridId).data("kendoGrid");
            }
            //var grid=$("#" + gridId).data("kendoGrid");
            var dataSource = grid.dataSource;
            $(dataSource.data()).each(function (i, item) {
                var dataItem = dataSource.at(i);
                dataItem.No=i+1;
            });
            //if (typeof (grid) != "undefined") {
            //    grid.dataSource.sync();
            //}
            grid.refresh();
        }

        _gys.KeyDown = function (formId, eventHandler) {
            var selecter = "#" + formId + " :text";
            $(selecter).keydown(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    callback = eval(eventHandler);
                    callback();
                }
            });
        };

        _gys.KeyDownDiv = function (divId, eventHandler) {
            var selecter = "#" + divId + " :text";
            $(selecter).keydown(function (event) {
                var keycode = (event.keyCode ? event.keyCode : event.which);
                if (keycode == '13') {
                    callback = eval(eventHandler);
                    callback();
                }
            });
        };

        _gys.GetExportFilter = function (obj) {
            obj = obj || {};
            var objStr = kendo.stringify(obj);
            return encodeURIComponent("{\"logic\":\"and\",\"filters\":" + objStr + "}"); 
        }
        //获得指定Grid上的过滤条件
        _gys.GetMenuFilter = function (gridId) {
            var searchFilterList = [];
            var grid = $("#" + gridId).data("kendoGrid");
            //获得原有过滤条件
            var filters = grid.dataSource.filter();
            //获得filteralbe为true的列
            var gridColumns = grid.columns.filter(function (obj) {
                return obj.filterable != false
            });
            if (filters) {
                for (var k = 0; k < gridColumns.length; k++) {
                    var filterOrderCode = filters.filters.find(function (obj) {
                        return obj.field == gridColumns[k].field;
                    });
                    if (filterOrderCode)
                        searchFilterList.push(filterOrderCode);
                }
            } 
            return searchFilterList;
        }
        //折现率计算（参数：票据金额，折现天数，折现率）,返回值：折现额
        _gys.CalcDiscountMoney = function (billMoney, discountDays, discountRate) {
            var result = 0;
            if (billMoney > 0 && discountDays > 0 && discountRate > 0) {
                var rate = billMoney * discountDays / 365 * discountRate;
                if (isNaN(rate)) {
                    rate = 0;
                }
                result = billMoney - rate;
            }
            return result.toFixed(_gys.MoneyLength);
        };

        return _gys;

    })();
    window.Gys = Gys;
})(window);

jQuery(function () {
    //kendoUIMenu
    $(".gys-kendoui-menu").kendoMenu();
    setAutoHeightBox();
    //参考kenSetChkWithParent函数
    appendCheckUser();
    appendCheckUser2();
})

function appendCheckUser() {
    //$("[data-leave='1']").parent().append("<input type='checkbox' onclick='toggleUser(this)' title='包含离职人员'/><span id='tooltipOne'>&nbsp;&nbsp;</span>");
    //$("#tooltipOne").kendoTooltip({
    //    content: "<font style='color:white;'>包含离职人员</font>",
    //    position: "top"
    //});
}
function toggleUser(obj) {
    var ddlId = $("[data-leave='1']").attr("id");
    var dfvalue = $("#" + ddlId).data("kendoComboBox").value();
    if (obj.checked) {
        var GroupManager = _get_select_list_kendoComboBox(ddlId, "/Manager/GroupManagerList?IsApproved=1", "ManagerId", "LoginName", null, dfvalue, 250);
    } else {
        var GroupManager1 = _get_select_list_kendoComboBox(ddlId, "/Manager/GroupManagerList", "ManagerId", "LoginName", null, dfvalue, 250);
    }
}

function appendCheckUser2() {
    //$("[data-leave='2']").parent().append("<input type='checkbox' onclick='toggleUser2(this)' title='包含离职人员'/><span id='tooltipOne2'>&nbsp;&nbsp;</span>");
    //$("#tooltipOne2").kendoTooltip({
    //    content: "<font style='color:white;'>包含离职人员</font>",
    //    position: "top"
    //});
}
function toggleUser2(obj) {
    var ddlId = $("[data-leave='2']").attr("id");
    var dfvalue = $("#" + ddlId).data("kendoComboBox").value();
    if (obj.checked) {
        var GroupManager = _get_select_list_kendoComboBox(ddlId, "/Manager/GroupManagerList?IsApproved=1", "ManagerId", "LoginName", null, dfvalue, 250);
    } else {
        var GroupManager1 = _get_select_list_kendoComboBox(ddlId, "/Manager/GroupManagerList", "ManagerId", "LoginName", null, dfvalue, 250);
    }
}

$(window).resize(function () {
    setAutoHeightBox();
});

function mindatetime(data) {

}
/*  
根据所提供的格式说明符，返回此 Guid 实例值的 String 表示形式。  
N  32 位： xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx  
D  由连字符分隔的 32 位数字 xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  
B  括在大括号中、由连字符分隔的 32 位数字：{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}  
P  括在圆括号中、由连字符分隔的 32 位数字：(xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)  
*/
//判断是否为Guid值
function isGuid(s) {
    if (s != undefined && s != null) {
        s = s.replace(/\{|\(|\)|\}|-/g, "");
        s = s.toLowerCase();
        if (s.length != 32 || s.search(/[^0-9,a-f]/i) != -1) {
            return false;
        }
    }
    return true;
}


function ReadOnly(container, options) {
    var label = $("<input style='border:none;background:none;' disabled='true' readOnly='true' />");
    label.attr("name", options.field);
    label.appendTo(container);
}

function ReadCopy(container, options, tempField) {
    if (typeof (options) == 'undefined')
        return;
    var _value = "";
    if (typeof (tempField) != "undefined" && tempField != null && tempField != "") {
        _value = options.model[tempField];
    }
    else {
        _value = options.model[options.field];
    }
    if (_value == null)
        return;
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
            _value = _value.format('yyyy-MM-dd HH:mm');
            break;
    }
    var label = $("<input style='border:none;background:none;width:99%;' readOnly='true' />");
    //label.attr("name", options.field);
    label.attr('value', _value);
    label.appendTo(container);
}

//设置自动高
function setAutoHeightBox() {
    $(".gys-auto-height,.AutoHeightBox").each(function () {
        if ($.trim(this.style.display).toLowerCase() == "none" || $.trim($(this).css("display")).toLowerCase() == "none") {
            return;
        }
        var parentObj = $(this).parent();

        var parentHeight = parentObj.height();
        parentHeight -= parseFloat(($.trim((parentObj[0].style.marginTop || parentObj.css("margin-top"))).replace("px", "")));
        parentHeight -= parseFloat(($.trim((parentObj[0].style.marginBottom || parentObj.css("margin-bottom"))).replace("px", "")));
        parentHeight -= parseFloat(($.trim((parentObj[0].style.paddingTop || parentObj.css("padding-top"))).replace("px", "")));
        parentHeight -= parseFloat(($.trim((parentObj[0].style.paddingBottom || parentObj.css("padding-bottom"))).replace("px", "")));
        parentHeight -= (parseFloat(($.trim((parentObj[0].style.borderTopWidth || parentObj.css("border-top-width"))).replace("px", ""))) || 0);
        parentHeight -= (parseFloat(($.trim((parentObj[0].style.borderBottomWidth || parentObj.css("border-bottom-width"))).replace("px", ""))) || 0);

        var _otherHeight = 0;
        $($(this).siblings("div,ul")).each(function (i, v) {
            if ($.trim(this.style.display).toLowerCase() != "none" && $.trim($(this).css("display")).toLowerCase() != "none") {
                _otherHeight += $(this).height();
                _otherHeight += parseFloat(($.trim((this.style.marginTop || $(this).css("margin-top"))).replace("px", "")));
                _otherHeight += parseFloat(($.trim((this.style.marginBottom || $(this).css("margin-bottom"))).replace("px", "")));
                _otherHeight += parseFloat(($.trim((this.style.paddingTop || $(this).css("padding-top"))).replace("px", "")));
                _otherHeight += parseFloat(($.trim((this.style.paddingBottom || $(this).css("padding-bottom"))).replace("px", "")));
                _otherHeight += (parseFloat(($.trim((this.style.borderTopWidth || $(this).css("border-top-width"))).replace("px", ""))) || 0);
                _otherHeight += (parseFloat(($.trim((this.style.borderBottomWidth || $(this).css("border-bottom-width"))).replace("px", ""))) || 0);
            }
        });

        var thisLength = 0;
        thisLength += parseFloat(($.trim((this.style.marginTop || $(this).css("margin-top"))).replace("px", "")));
        thisLength += parseFloat(($.trim((this.style.marginBottom || $(this).css("margin-bottom"))).replace("px", "")));
        thisLength += parseFloat(($.trim((this.style.paddingTop || $(this).css("padding-top"))).replace("px", "")));
        thisLength += parseFloat(($.trim((this.style.paddingBottom || $(this).css("padding-bottom"))).replace("px", "")));
        thisLength += (parseFloat(($.trim((this.style.borderTopWidth || $(this).css("border-top-width"))).replace("px", ""))) || 0);
        thisLength += (parseFloat(($.trim((this.style.borderBottomWidth || $(this).css("border-bottom-width"))).replace("px", ""))) || 0);

        if ((parentHeight - _otherHeight - thisLength) <= 470) {
            $(this).height(470);  //配合样式表中的最小高度
        }
        else {
            $(this).height(parentHeight - _otherHeight - thisLength - 2);
        }
    });
}

