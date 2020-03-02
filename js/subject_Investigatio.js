let pageindex = 1;
let watch = false;
$(function () {
    console.log(
        `%c${"注入成功-laputa"}`,
        "background:red;font-size:30px;color:white;font-weight:bloder"
    );
    if (getUrlParam("crx_auto") == "true") {
        let check = setInterval(function () {
            console.log("等待")
            if (document.readyState == "complete" && $('div[row-id]').length) {
                clearInterval(check);
                chrome.storage.local.get(['uuid', "token", "condition", "reservename"], (param) => {
                    // if (param.uuid && param.token) {
                        // token_check(param.token, (state) => {
                        //     if (state.CanUse) {
                                pageindex = 1;
                                let sort = setInterval(function () {
                                    let canclear1 = false;
                                    let canclear2 = false;
                                    if ($('.ag-header-cell-label[role=presentation]:contains("公海时间")').find("span[ref=eSortDesc]").hasClass("ag-hidden")) {
                                        $('.ag-header-cell-label[role=presentation]:contains("公海时间")').click();
                                    } else {
                                        canclear1 = true;
                                    }
            
                                    if ($.trim($('.ag-cell.ag-cell-not-inline-editing.ag-cell-with-height.ag-cell-no-focus.ag-cell-last-left-pinned.ag-cell-value:eq(0)').find("a").text()).includes("*")) {
                                        $('.iconfont.get-info-icon').click();
                                    } else {
                                        canclear2 = true;
                                        if (canclear1 && canclear2) {
                                            clearInterval(sort);
                                            Investigation(param.condition, param.reservename);
                                            page_watch(param.condition, param.reservename);
                                        }
                                    }
                                  
                                }, 400)
                            // } else {
                            //     alert("授权失败，请检查激活状态")
                            // }
                        })
                    // } else {
                    //     alert("请先获取激活码进行激活")
                    // }
                })
            }
        })
    } else {
        //正常页面
    }
})

let canrun = false;
function page_watch(condition, reservename) {
    if (!watch) {
        watch = true;
        var atimer;
        var taragt = document.getElementsByClassName("ag-body")[0];
        taragt.addEventListener("DOMSubtreeModified", function (a) {
            if ($(a.target).hasClass("link-title")) {
                clearInterval(atimer);
                atimer = setTimeout(function () {
                    if (canrun) {
                        canrun = false;
                        Investigation(condition, reservename);
                    }
                }, 1000)
            }
        })
    }
}
// 排查函数
function Investigation(condition, reservename) {
    // alert(JSON.stringify(condition))
    let check = setInterval(function () {
        console.log("等待加载")
        if ($.trim($('.ag-cell.ag-cell-not-inline-editing.ag-cell-with-height.ag-cell-no-focus.ag-cell-last-left-pinned.ag-cell-value:eq(0)').find("a").text()).includes("*")) {
            $('.iconfont.get-info-icon').click();
        }
        if (document.readyState == "complete" && $('div[row-id]').length && !$.trim($('.ag-cell.ag-cell-not-inline-editing.ag-cell-with-height.ag-cell-no-focus.ag-cell-last-left-pinned.ag-cell-value:eq(0)').find("a").text()).includes("*")) {
            clearInterval(check);

            let namecondition = condition.namecondition;
            let screeningconditions = condition.screeningconditions;
            let pageturningnum =Number(condition.pageturningnum);


            if (pageindex <= Number(pageturningnum)) {
                //待补充
                let list = $('.ag-cell.ag-cell-not-inline-editing.ag-cell-with-height.ag-cell-no-focus.ag-cell-last-left-pinned.ag-cell-value');
                list.each(function (index, element) {
                    let name = $.trim($(element).find('a').text());
                    let rowid = $(element).parent().attr("row-id");
                    let conditions = $.trim($(`.ag-row.ag-row-no-focus.ag-row-level-0.ag-row-position-absolute[row-id=${rowid}]:eq(1)>div:eq(2)`).text());
                    let gotoUrl = $(`.ag-row.ag-row-no-focus.ag-row-level-0.ag-row-position-absolute[row-id=${rowid}]:eq(2) a`).attr('href')

                    let canselect = false;
                    let canselect1 = false;
                    if (namecondition.length == 0) {
                        canselect = true;
                    } else {
                        namecondition.forEach(item => {
                            if (name.includes(item)) {
                                canselect = true;
                            }
                        })
                    }

                    if (canselect && screeningconditions.length == 0) {
                        canselect1 = true;
                    } else if (canselect) {
                        screeningconditions.forEach(item => {
                            if (conditions.includes(item)) {
                                canselect1 = true;
                            }
                        })
                    }

                    if (!canselect1) {
                        if(reservename){
                            reservename.forEach(item => {
                                if (item == name) {
                                    conditions = "候补公司名"
                                    canselect1 = true;
                                }
                            })
                        }
                    }

                    if (canselect1) {
                        //   alert(conditions)
                        let obj = {
                            type: "active_open",
                            url: `${gotoUrl}&qdhan_crx=true&longlongago=${name}&csdacr=${conditions}`
                        }
                        chrome.runtime.sendMessage(obj, () => {

                        });
                    }
                });
                setTimeout(function () {
                    // alert("翻页")
                    pageindex += 1;

                    if (pageindex > pageturningnum) {
                        let obj = {
                            type: "close_me"
                        }
                        chrome.runtime.sendMessage(obj)
                    } else {
                        canrun = true;
                        $('.next-btn.next-btn-normal.next-btn-medium.next-pagination-item.next').click()
                    }
                }, 5000)
            }
            else {
                let obj = {
                    type: "close_me"
                }
                chrome.runtime.sendMessage(obj)
            }
        } 
    }, 1000)
};