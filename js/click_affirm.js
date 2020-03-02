$(function () {
    console.log(
        `%c${"确认页面"}`,
        "background:red;font-size:30px;color:white;font-weight:bloder"
    );

    if (getUrlParam("qdhan_crx") == "true") {

        //自动点击
        let check = setInterval(function () {
            if (document.readyState == "complete" && $('.shy-button[value="立刻挑入"]').length) {
                clearInterval(check);

                $('.shy-button[value="立刻挑入"]')[0].click();
                
                let backtext = $('td>.shy-text[id]').text();
                // alert(backtext)

                let obj = {
                    pickTime: new Date().toLocaleString("zh", { hour12: false }),
                    name: getUrlParam('longlongago'),
                    csdacr: getUrlParam('csdacr'),
                    sesstext:backtext,
                    success:backtext.includes("成功")
                }
                chrome.storage.local.get(['savelog'], (param) => {
                    let savelog = [];
                    if (param.savelog) {
                        savelog = param.savelog;
                    }
                    savelog.push(obj);
                    chrome.storage.local.set({
                        savelog: savelog
                    }, () => {
                        let obj = {
                            type: "close_me"
                        }
                        chrome.runtime.sendMessage(obj);
                    })
                })


            }
        })
    } else {
        //正常处理
    }
});