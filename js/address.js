var addressJson ="";
layui.define(["form", "jquery"], function (exports) {
    var form = layui.form,
        $ = layui.jquery,
        Address = function () {};

    Address.prototype.provinces = function () {
        //加载省数据  
        var proHtml = '',
            that = this;
        $.get("../json/address.json", function (data) { 
            addressJson = data; 
            for (var i = 0; i < data.length; i++) {  
                proHtml += '<option value="' + data[i].provinceName + '">' + data[i].provinceName + '</option>';  
            }  
            //初始化省数据  
            $("select[name=province]").append(proHtml);  
            form.render();  
            form.on('select(province)', function (proData) {  
                $("select[name=area]").html('<option value="">请选择县/区</option>');  
                var value = proData.value;  
                that.citys(data[$(this).index() - 1].citys); 
            });  
        })  
    }

    //加载市数据  
    Address.prototype.citys = function (citys) {
        var cityHtml = '<option value="">请选择市</option>',
            that = this;
        for (var i = 0; i < citys.length; i++) {
            cityHtml += '<option value="' + citys[i].citysName + '">' + citys[i].citysName + '</option>';
        }
        $("select[name=city]").html(cityHtml).removeAttr("disabled");
        form.render();
    }


    var address = new Address();
    exports("address", function () {
        address.provinces();
    });
});