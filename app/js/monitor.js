const path = require('path');
const osu = require('node-os-utils');
const cpu = osu.cpu;
const mem = osu.mem;
const os = osu.os;


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