const os = require('os');

async function performanceData() {
    const cpus = os.cpus();

    const osType = os.type() === 'Darwin' ? 'Mac' : os.type();

    const upTime = os.uptime(); // in seconds

    const freeMem = os.freemem(); // in bytes

    const totalMem = os.totalmem();

    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor((usedMem / totalMem) * 100) / 100;

    const cpuModel = cpus[0].model;
    const cpuSpeed = cpus[0].speed;
    const numCores = cpus.length;
    const cpuLoad = await getCpuLoad();
    return {
        freeMem,
        usedMem,
        memUsage,
        cpuModel,
        cpuSpeed,
        numCores,
        cpuLoad,
        upTime,
        osType,
    };
}

//  we need the average uptime of all the threads/cores
function cpuAverage() {
    const cpus = os.cpus();
    let idleMs = 0;
    let totalMs = 0;
    // loop through each core
    cpus.forEach((core) => {
        // loop through each property of the current core

        for (type in core.times) {
            totalMs += core.times[type];
        }

        idleMs += core.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length,
    };
}

//  the times property is time since boot,
// we will get now times, and 100ms from now times.
//  Compare them, that will give us current load
function getCpuLoad() {
    return new Promise((resolve, reject) => {
        const start = cpuAverage();
        setTimeout(() => {
            const end = cpuAverage();
            const idleDifferennce = end.idle - start.idle;
            const totalDifference = end.total - start.total;
            // calculate the % used of the cpu
            const percentageCpu = 100 - Math.floor(100 * (idleDifferennce / totalDifference));
            resolve(percentageCpu);
        }, 100);
    });
}
