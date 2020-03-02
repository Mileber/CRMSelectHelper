let g_reservename = [];
$(function () {
    $("#delete_all").click(function (e) {
        e.preventDefault();
        chrome.storage.local.remove(['reservename'], () => {
            location.reload();
        })
    });

    $("#leadingin").click(function (e) {
        e.preventDefault();
        $('#fileInput').click();
    });


    $("#fileInput").change(function (e) {
        e.preventDefault();
        let file = $(this)[0].files[0];
        if (file.name.substr(-4).toLocaleLowerCase() != '.txt') {
            alert("请上传格式为txt的文件！");
        }
        else//如果上传文件是txt文件，则显示文件的预览
        {
            var reader = new FileReader;
            reader.readAsText(file, "gb2312");
            //reader.readAsDataURL(file);
            reader.onload = function (evt) {
                var data = evt.target.result;
                // console.log(data)
                let list = data.split('\n');
                list.forEach(item => {
                    item = $.trim(item);
                })
                console.log(list)


                chrome.storage.local.get(['reservename'], (param) => {
                    let reservename = [];
                    if (param.reservename) {
                        reservename = param.reservename;
                    }
                    let newlist = reservename.concat(list);
                    chrome.storage.local.set({
                        reservename: newlist
                    }, () => {
                        location.reload()
                    })
                })
            }
        }
    });

    //删除按钮
    $("body").on("click", ".delete", function () {
        // console.log(g_reservename);
        let target = $(this).attr("data-name");

        let newlist = g_reservename.filter(item => {
            return item != target;
        })
        chrome.storage.local.set({
            reservename: newlist
        }, () => {
            tabel_(newlist);
        })
    });
})



chrome.storage.local.get(['reservename'], (param) => {
    let reservename = [];
    if (param.reservename) {
        reservename = param.reservename;
    }
    tabel_(reservename);
})

function tabel_(reservename) {
    g_reservename = reservename;
    $('#list').bootstrapTable('destroy')
    $('#list').bootstrapTable({
        data: reservename,
        striped: true,
        pageNumber: 1,
        pagination: false,//关闭分页
        search: true,//启用搜索框
        searchAlign: "left",//搜索框位置
        searchOnEnterKey: true,
        showSearchButton: true,
        strictSearch: true,//精准搜索
        columns: [
            {
                field: 'name',
                class: "name",
                title: '候选公司名',
                formatter: function (value, row) {
                    return row
                }
            },
            {
                field: 'operate',
                class: "operate",
                title: '操作',
                formatter: function (value, row) {
                    return `<button data-name="${row}" class="btn btn-warning delete">删除</button>`
                }
            },
        ]
    })
};