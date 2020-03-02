$(function () {
    // tabel_([]);


    $("#delete_all").click(function (e) {
        e.preventDefault();
        chrome.storage.local.remove(['savelog'], () => {
            location.reload();
        })
    });

    chrome.storage.local.get(['savelog'], (param) => {
        let savelog = [];
        if (param.savelog) {
            savelog = param.savelog;
        }
        tabel_(savelog);
    })
})


function tabel_(savelog) {
    $('#order_mate').bootstrapTable({
        data: savelog,
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
                field: 'pickTime',
                class: "pickTime",
                title: '挑入时间'
            },
            {
                field: 'name',
                class: "name",
                title: '所选名称'
            },{
                field: 'csdacr',
                class: "csdacr",
                title: '成熟度'
            },{
                field: 'sesstext',
                class: "sesstext",
                title: '操作结果'
            },{
                field: 'success',
                class: "successa",
                title: '是否成功'
            }
        ]
    })
};