let check_auto_updata;
$(function () {
    console.info(`%c ${chrome.app.getDetails().name},版本：${chrome.app.getDetails().version}`, 'color:#999');


    //常驻后台检查
    clearInterval(check_auto_updata);
    check_auto_updata = setInterval(function () {
        timing();
    }, 1000 * 20)


    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        switch (request.type) {
            case "close_me": {
                chrome.tabs.remove(sender.tab.id)
            } break;
            case "active_open": {
                chrome.tabs.create({
                    url: request.url,
                    // active:true
                    active: false
                })
            }
            default:
                break;
        }
    });
})


//定时器判断
function timing() {
    chrome.storage.local.get(['state', 'timer'], (par) => {
        if (par.state == "open") {
            if (par.timer) {
                let data = par.timer;
                let time = new Date().getTime();
                let start = par.timer.start;
                let end = par.timer.end;

                if (Number(data.time < time)) {
                    //超时 执行
                    let nexttext = timecount(time + data.step, start, end);
                    chrome.storage.local.set({ //更新为下一次执行的时间
                        timer: {
                            time: nexttext,
                            step: data.step,
                            start: start,
                            end: end
                        }
                    }, () => {
                        Updateall();
                    })
                } else {
                    // 无操作 等待
                }
            }
        }
    })
}


function timecount(time, start, end) {
    // time:毫秒时间戳
    // start:HH:mm
    // end:HH:mm

    let backnextTime = time;
    let dc = Number(new Date(time).toLocaleTimeString("zh", { hour12: false }).replace(/\:/g, ""));
    console.log(dc)
    let numend = Number(end.replace(/\:/g, "").replace(/\：/g, "")) * 100;
    console.log(numend)
    let numstart = Number(start.replace(/\:/g, "").replace(/\：/g, "")) * 100;
    console.log(numstart)
    if (dc > numend) {
        // 切换到明天的开始时间
        let mingt = new Date(new Date().getTime() + 86400000).toLocaleDateString("zh", { hour12: false }) + " " + start;
        backnextTime = new Date(mingt).getTime();
    } else if (dc < numstart) {
        //切换到今天的开始时间
        let jint = new Date().toLocaleDateString("zh", { hour12: false }) + " " + start;
        backnextTime = new Date(jint).getTime()
    }
    return backnextTime
}


function Updateall() {
    chrome.tabs.create({ url: "https://laputa.alibaba-inc.com/?_path_=crm/indexChannel/high_seas&crx_auto=true", active: false })
};