const path = require('path');
const osu = require('node-os-utils');
const { inherits } = require('util');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 10;
let alertFrequency = 1;




//run every 2sec

setInterval(() => {
    //Dynamic sys info
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').textContent = info.toFixed(2) + '%';
        document.getElementById('cpu-progress').style.width = info + '%';
        //on cpu overload set bar red color
        if(info > cpuOverload) {
            document.getElementById('cpu-progress').style.backgroundColor = 'red';
        } else {
            document.getElementById('cpu-progress').style.backgroundColor = '#30c88b';
        }

        //check overload
        if(info >= cpuOverload && runNotify(alertFrequency)) {
            notifyUser({
                title: 'CPU overload',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            });

            localStorage.setItem('lastNotify', +new Date())           

        }
    });

    cpu.free().then(info => {
        document.getElementById('cpu-free').textContent = info.toFixed(2) + "%";
    })

    os.uptime()
    document.getElementById('sys-uptime').textContent = secondsToDhms(os.uptime());

},2000)


//static sys info

//set model
document.getElementById('cpu-model').textContent = cpu.model();

//compute name
document.getElementById('comp-name').textContent = os.hostname();

//os
document.getElementById('os').textContent = `${os.type()} ${os.arch()}`;

// total memory

mem.info().then(info => {
    document.getElementById('mem-total').textContent = info.totalMemMb;

});

//show human time

function secondsToDhms(seconds) {
    seconds = +seconds;
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds) % (3600 * 24) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${d}d,${h}h,${m}m,${s}s`;
}

//send notification
function notifyUser(options) {
    new Notification(options.title, options);
}

//check how much time has passed since last notification


function runNotify(freq) {
    if(localStorage.getItem('lastNotify') === null) {
        localStorage.setItem('lastNotify', + new Date())
        return true; //return true to run notification for user
    }

    const lastNotifyTime = new Date(parseInt(localStorage.getItem('lastNotify')));
    const now = new Date();
    const diffTime = Math.abs(now - lastNotifyTime);
    const minutesPassed = Math.ceil(diffTime / (1000 * 60));
    if (minutesPassed > freq) {
        return true
    } else return false;

}