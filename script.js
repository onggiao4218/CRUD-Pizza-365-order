
"use strict";
$(document).ready(function () {
    /*** REGION 1 - Global variables - Vùng khai báo biến, hằng số, tham số TOÀN CỤC */
    const gCOLUMN_ORDER_ID = 0;
    const gCOLUMN_KICH_CO = 1;
    const gCOLUMN_LOAI_PIZZA = 2;
    const gCOLUMN_LOAI_NUOC_UONG = 3;
    const gCOLUMN_THANH_TIEN = 4;
    const gCOLUMN_HO_TEN = 5;
    const gCOLUMN_SO_DIEN_THOAI = 6;
    const gCOLUMN_TRANG_THAI = 7;
    const gCOLUMN_ACTION = 8;

    const gCOLUMN_DATA = ["orderId", "kichCo", "loaiPizza", "idLoaiNuocUong", "thanhTien", "hoTen", "soDienThoai", "trangThai", "action"];

    var gDataTable = [];

    var gPizzaSize = ["Small", "Medium", "Large"];

    var gSIZE_OF_PIZZA_DETAIL = {
        None: ["Vui lòng chọn loại Pizza", "Vui lòng chọn loại Pizza", "Vui lòng chọn loại Pizza", "Vui lòng chọn loại Pizza", "Vui lòng chọn loại Pizza"],
        Small: [20, 2, 200, 2, 150000,],
        Medium: [25, 4, 300, 3, 200000,],
        Large: [30, 8, 500, 4, 250000,],
    }

    var gId = "";
    var gOrderId = "";

    const gTYPE_OF_PIZZA_DETAIL = {
        h: ["Hương vị Hawaii"],
        s: ["Hải sản nhiệt đới"],
        b: ["Thịt xông khói"],
    }

    // định nghĩa table  - chưa có data
    var gUserTable = $("#user-table").DataTable({
        // Khai báo các cột của datatable
        columns: [
            { data: gCOLUMN_DATA[gCOLUMN_ORDER_ID] },
            { data: gCOLUMN_DATA[gCOLUMN_KICH_CO] },
            { data: gCOLUMN_DATA[gCOLUMN_LOAI_PIZZA] },
            { data: gCOLUMN_DATA[gCOLUMN_LOAI_NUOC_UONG] },
            { data: gCOLUMN_DATA[gCOLUMN_THANH_TIEN] },
            { data: gCOLUMN_DATA[gCOLUMN_HO_TEN] },
            { data: gCOLUMN_DATA[gCOLUMN_SO_DIEN_THOAI] },
            { data: gCOLUMN_DATA[gCOLUMN_TRANG_THAI] },
            { data: gCOLUMN_DATA[gCOLUMN_ACTION] }
        ],
        // Ghi đè nội dung của cột action, chuyển thành button chi tiết
        columnDefs: [
            {
                targets: gCOLUMN_ACTION,
                defaultContent: `<i class="fas fa-edit pointer" data-toggle="tooltip" data-placement="top" title="Edit"></i>
        <i class="fas fa-trash pointer" data-toggle="tooltip" data-placement="top" title="Delete"></i>`
            }]
    });

    /*** REGION 2 - Vùng gán / thực thi hàm xử lý sự kiện cho các elements */
    onPageLoading();
    getDrink();
    getPizzaSize(gPizzaSize);
    getPizzaType(gTYPE_OF_PIZZA_DETAIL);

    //gán click event handler cho button chi tiet
    $("#user-table").on("click", ".fa-edit", function () {
        onButtonChiTietClick(this); // this là button được ấn
    });
    //gán click event handler cho button xoa
    $("#user-table").on("click", ".fa-trash", function () {
        console.log("onButtonXoaClick");
        onIconTrashClick(this); // this là button được ấn
    });
    //gan click event handler cho button confirm
    $("#btn-confirm").on("click", function () {
        onBtnConfirmClick();
    })
    //gan click event handler cho button cancel
    $("#btn-cancel").on("click", function () {
        onBtnCancelClick();
    })
    //gán sự kiện click cho nút filter user 
    $("#btn-filter-user").click(function () {
        onBtnFilterUserClick();
    });

    //gán sự kiện click cho nút add order
    $("#btn-add-order").on("click", function () {
        onBtnAddOrderClick();
    });

    //gan su kien cho nut confirm add new order
    $("#btn-confirm-add-order").on("click", function () {
        onBtnConfirmAddOrderClick();
    });
    //gan su kien cho nut btn-xoa
    $("#btn-xoa").on("click", function () {
        onBtnXoaClick();
    });
    //gan su kien cho nut btn-add-cancel
    $("#btn-add-cancel").on("click", function () {
        onBtnAddCancleClick();
    });



    $("#select-pizzasize").change(function () {
        onSelectPizzaSizeChange(this);
    });

    /*** REGION 3 - Event handlers - Vùng khai báo các hàm xử lý sự kiện */
    // infoFunction sẽ là function các nút cùng gọi
    function onButtonChiTietClick(paramChiTietButton) {
        //Xác định thẻ tr là cha của nút được chọn
        var vRowSelected = $(paramChiTietButton).parents('tr');
        //Lấy datatable row
        var vDatatableRow = gUserTable.row(vRowSelected);
        //Lấy data của dòng 
        var vUserData = vDatatableRow.data();
        var vId = vUserData.id;
        console.log(vId);
        var vOrderId = vUserData.orderId;
        var vLoaiPizza = vUserData.loaiPizza;
        var vTrangThai = vUserData.trangThai;

        gId = vId;
        gOrderId = vOrderId;

        callApiGetOrderDetail(gOrderId);

        $("#update-modal").modal("show");
    }

    // hàm chạy khi trang được load
    function onPageLoading() {
        // lấy data từ server
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
            type: "GET",
            async: false,
            dataType: 'json',
            success: function (responseObject) {
                gDataTable = responseObject;

                //debugger;
                //gUserDb.users = responseObject;
                // var vDataTableFilter = validateData(gDataTable);
                // console.log(vDataTableFilter);
                // gDataTable = vDataTableFilter;
                console.log(gDataTable);
                loadDataToTable(gDataTable);
            },
            error: function (error) {
                console.assert(error.responseText);
            }
        });
    }

    // hàm xử lý sự kiện click nút filter user
    function onBtnFilterUserClick() {
        //B1: Khai báo biến và thu thập dữ liệu
        var vStatus = $("#select-status").val();
        var vPizzaType = $("#select-pizza").val();

        //B2: Kiểm tra dữ liệu (bỏ)


        //B3: Xử lý và hiển thị kết quả
        var vDataFilter = gDataTable.filter(function (paramOrder, index) {
            return (vStatus === "all" || vStatus.toUpperCase() === paramOrder.trangThai.toUpperCase())
                && (vPizzaType === "all" || vPizzaType.toUpperCase() === paramOrder.loaiPizza.toUpperCase())
        });
        loadDataToTable(vDataFilter);
    }
    //ham xu ly su kien an nut confirm
    function onBtnConfirmClick() {
        var vId = $("#input-id").val();
        console.log(vId);
        var vUpdateStatus = {
            trangThai: "confirmed"
        }
        callApiUpdateStatus(vUpdateStatus);
        $("#detail-modal").modal("hide");
        onPageLoading();
    }
    //ham xu ly su kien an nut confirm
    function onBtnCancelClick() {
        var vId = $("#input-id").val();
        console.log(vId);
        var vUpdateStatus = {
            trangThai: "cancel"
        }
        callApiUpdateStatus(vUpdateStatus);
        $("#detail-modal").modal("hide");
        onPageLoading();
    }
    //ham su ly su kien an icon trash
    function onIconTrashClick(paramIconTrash) {
        //Xác định thẻ tr là cha của nút được chọn
        var vRowSelected = $(paramIconTrash).parents('tr');
        //Lấy datatable row
        var vDatatableRow = gUserTable.row(vRowSelected);
        //Lấy data của dòng 
        var vUserData = vDatatableRow.data();
        var vId = vUserData.id;
        console.log(vId);


        gId = vId;
        $("#delete-modal").modal("show");




    }
    //ham xu ly su kien an nut xoa
    function onBtnXoaClick() {


        callApiDeleteOrder(gId);

    }
    //ham xu ly su kien an nut add order
    function onBtnAddOrderClick() {
        $("#add-order-modal").modal("show");
    }
    //ham xu ly su kien an nut confirm add order
    function onBtnConfirmAddOrderClick() {
        console.log("confirm add order");
        var vOrderDetail = {
            hoTen: "",
            email: "",
            soDienThoai: "",
            diaChi: "",
            loiNhan: "",
            idVourcher: "",
            idLoaiNuocUong: "",
            kichCo: "",
            loaiPizza: "",
            duongKinh: "",
            suon: "",
            salad: "",
            thanhTien: 0,
            percentDiscount: 0,
            discount: 0,
            priceFinal: 0,
        }
        var getOrderDetail = getDataOrderDetail(vOrderDetail);
        console.log(getOrderDetail);

        var vIsCheck = validateData(getOrderDetail);
        if (vIsCheck) {
            callApiAddOrder(getOrderDetail);
            $("#add-order-modal").modal("hide");
            onPageLoading();
        }



    }
    function onBtnAddCancleClick() {
        $("#add-order-modal").modal("hide");
    }

    /*** REGION 4 - Common funtions - Vùng khai báo hàm dùng chung trong toàn bộ chương trình */
    // load data to table
    function loadDataToTable(paramResponseObject) {
        //Xóa toàn bộ dữ liệu đang có của bảng
        gUserTable.clear();
        //Cập nhật data cho bảng 
        gUserTable.rows.add(paramResponseObject);
        //Cập nhật lại giao diện hiển thị bảng
        gUserTable.draw();
    }
    //ham call api delete order
    function callApiDeleteOrder(paramId) {



        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramId,
            method: 'DELETE',
            contentType: 'application/json; charset=UTF-8',

            success: function (res) {
                // $("#update-modal").modal("hide");
                alert("Id: " + paramId + "\nDelete thành công!");
                $("#delete-modal").modal("hide");
                onPageLoading();



            },
            error: function (ajaxContext) {
                console.log(ajaxContext);

            }
        })
    }
    // ham thu thap data tu o input vao object
    function getDataOrderDetail(paramOrderDetail) {
        paramOrderDetail.hoTen = $("#input-hoTen").val();
        paramOrderDetail.email = $("#input-email").val();
        paramOrderDetail.soDienThoai = $("#input-soDienThoai").val();
        paramOrderDetail.diaChi = $("#input-diaChi").val();
        paramOrderDetail.loiNhan = $("#input-loiNhan").val();
        paramOrderDetail.idVourcher = $("#input-idVourcher").val();
        paramOrderDetail.idLoaiNuocUong = $("#select-drink").val();
        paramOrderDetail.kichCo = $("#select-pizzasize").val();
        paramOrderDetail.loaiPizza = $("#select-loaiPizza").val();
        paramOrderDetail.duongKinh = $("#input-duongKinh").val();
        paramOrderDetail.suon = $("#input-suon").val();
        paramOrderDetail.salad = $("#input-salad").val();
        paramOrderDetail.thanhTien = $("#input-thanhTien").val();
        paramOrderDetail.percentDiscount = $("#input-percentDiscount").val();
        paramOrderDetail.discount = $("#input-discount").val();
        paramOrderDetail.priceFinal = $("#input-priceFinal").val();

        return paramOrderDetail;
    }

    // ham kiem tra data
    function validateData(paramOrderDetail) {
        var vIsCheck = true;
        if (paramOrderDetail.hoTen === "") {
            $("#input-hoTen").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#input-hoTen").removeClass("is-invalid");
        }
        if (paramOrderDetail.email != "" && paramOrderDetail.email.includes("@") === false) {
            $("#input-email").addClass("is-invalid");
            $("#input-email").val("Email không hợp lệ");
            vIsCheck = false;
        } else {
            $("#input-email").removeClass("is-invalid");
            vIsCheck = true;
        }
        if (paramOrderDetail.kichCo === "None") {
            $("#select-pizzasize").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#select-pizzasize").removeClass("is-invalid");
        }
        if (paramOrderDetail.loaiPizza === "None") {
            $("#select-loaiPizza").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#select-loaiPizza").removeClass("is-invalid");
        }
        if (paramOrderDetail.soDienThoai === "") {
            $("#input-soDienThoai").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#input-soDienThoai").removeClass("is-invalid");
        }
        if (paramOrderDetail.diaChi === "") {
            $("#input-diaChi").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#input-diaChi").removeClass("is-invalid");
        }


        if (paramOrderDetail.idLoaiNuocUong === "") {
            $("#input-idLoaiNuocUong").addClass("is-invalid");
            vIsCheck = false;
        } else {
            $("#input-idLoaiNuocUong").removeClass("is-invalid");
        }

        return vIsCheck;
    }


    // hàm thu thập dữ liệu tìm kiếm trên form
    function getFilterData(paramFilterObj) {
        paramFilterObj.trangThai = $("#select-status").val();
        paramFilterObj.loaiPizza = $("#select-pizza").val();
    }

    //ham goi api fet order by order id
    function callApiGetOrderDetail(paramOrderId) {
        "use strict";
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + paramOrderId,
            dataType: "json",
            type: "GET",
            success: function (res) {
                showOrderToModal(res);
            },
            error: function (ajaxContext) {
                alert(ajaxContext.responseText);
            }
        })
    }
    //ham goi api tao order
    function callApiAddOrder(paramOrderDetail) {
        var vJsonToString = JSON.stringify(paramOrderDetail);
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders",
            method: 'POST',
            contentType: 'application/json; charset=UTF-8',
            data: vJsonToString,
            success: function (res) {
                $("#add-order-modal").modal("hide");
                alert("Tạo thành công!");



            },
            error: function (ajaxContext) {
                console.log(ajaxContext);

            }
        })
    }
    //ham goi api update order status
    function callApiUpdateStatus(paramStatus) {
        var vJsonToString = JSON.stringify(paramStatus);
        var vId = $("#input-update-id").val();
        console.log(vId);
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/orders/" + vId,
            method: 'PUT',
            contentType: 'application/json; charset=UTF-8',
            data: vJsonToString,
            success: function (res) {
                $("#update-modal").modal("hide");
                alert("Order Id: " + res.id + "\nCập nhật thành công!");



            },
            error: function (ajaxContext) {
                console.log(ajaxContext);

            }
        })
    }
    //ham goi api get drink select
    function getDrink() {
        "use strict";
        $.ajax({
            url: "http://42.115.221.44:8080/devcamp-pizza365/drinks",
            dataType: "json",
            type: "GET",
            success: function (res) {
                handleDrinkList(res);

            },
            error: function (ajaxContext) {
                alert(ajaxContext.responseText)
            }
        });
    }

    // ham tao option cho select do uong
    function handleDrinkList(paramDrink) {
        "use strict";
        $.each(paramDrink, function (i, item) {
            $("#select-drink").append($('<option>', {
                text: item.tenNuocUong,
                value: item.maNuocUong
            }))
        })

    }

    //ham tao option cho selct
    function getPizzaSize(paramPizza) {
        "use strict";
        $.each(paramPizza, function (i, item) {
            $("#select-pizzasize").append($('<option>', {
                text: item,
                value: item
            }))
        })
    }

    //ham tao option cho selct
    function getPizzaType(paramPizza) {
        "use strict";
        $.each(paramPizza, function (i, item) {
            $("#select-loaiPizza").append($('<option>', {
                text: item,
                value: item
            }))
        })
    }

    // ham dua data vao modal
    function showOrderToModal(paramRes) {
        "use strict";
        $("#input-update-id").val(paramRes.id);
        $("#input-update-orderId").val(paramRes.orderId);
        $("#input-update-pizzasize").val(paramRes.kichCo);
        $("#input-update-duongKinh").val(paramRes.duongKinh);

        $("#input-update-suon").val(paramRes.suon);
        $("#input-update-salad").val(paramRes.salad);
        $("#input-update-loaiPizza").val(paramRes.loaiPizza);
        $("#input-update-id-voucher").val(paramRes.idVourcher);

        $("#input-update-thanhTien").val(paramRes.thanhTien);
        $("#input-update-giamGia").val(paramRes.giamGia);
        $("#input-update-drink").val(paramRes.idLoaiNuocUong);
        $("#input-update-soLuongNuoc").val(paramRes.soLuongNuoc);

        $("#input-update-hoTen").val(paramRes.hoTen);
        $("#input-update-email").val(paramRes.email);
        $("#input-update-soDienThoai").val(paramRes.soDienThoai);
        $("#input-update-diaChi").val(paramRes.diaChi);

        $("#input-update-loiNhan").val(paramRes.loiNhan);
        $("#input-update-trangThai").val(paramRes.trangThai);

        $("#input-update-ngayTao").val(paramRes.ngayTao);
        $("#input-update-ngayCapNhat").val(paramRes.ngayCapNhat);
        $

    }

    //ham validate data truoc khi truyen vao bang
    // function validateData(paramDataTable) {
    //   var vDataTableFilter = gDataTable.filter(function (item) {
    //     return (item.loaiPizza != "" && item.loaiPizza != null && item.loaiPizza != undefined);
    //   });
    //   return vDataTableFilter;

    // }

    //ham show thong tin pizza vao modal
    function onSelectPizzaSizeChange(paramPizzaSize) {
        "use strict";
        var vPizzaSize = paramPizzaSize.value;
        console.log(vPizzaSize);
        var vPizzaSizeSelect = gSIZE_OF_PIZZA_DETAIL[vPizzaSize];
        console.log(vPizzaSizeSelect);

        $("#input-duongKinh").val(vPizzaSizeSelect[0]);
        $("#input-suon").val(vPizzaSizeSelect[1]);
        $("#input-salad").val(vPizzaSizeSelect[2]);
        $("#input-soLuongNuoc").val(vPizzaSizeSelect[3]);
        $("#input-thanhTien").val(vPizzaSizeSelect[4]);
    }

    //ham call api

});
