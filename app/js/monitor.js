const path = require('path');
const osu = require('node-os-utils');
const { inherits } = require('util');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;

let cpuOverload = 10;
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
            document.getElementById('cpu-progress').style.backgroundColor = 'inherit';
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