const { exec } = require('child_process')
const { join } = require('path')
const fs = require('fs')

const Args = process
    .argv
    .slice(process.argv.indexOf('--') + 1)
    .map(item=>item.replace('--', ''))
    .reduce((args,item) => Object.assign(args, {
        [item]: true
    }), {})

const Profile = 'Release'
const Command = (cmd, options = {}) => new Promise((
    resolve, 
    reject, 
    ps = exec('$ProgressPreference = \'SilentlyContinue\';' + cmd,  {
        shell: 'powershell.exe',
        cwd: __dirname,
        ...options,
    }
)) => {
    ps.stdout.pipe(process.stdout)
    ps.stderr.pipe(process.stderr)
    
    ps.on('close', resolve)
    ps.on('error', reject)
})

/* async block */ void (async () => {

for (const path of [
    './build',
]) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path)
    }
}

await Command(`cmake -DCMAKE_BUILD_TYPE=${Profile} ..`, { cwd: join(__dirname, './build') })
await Command(`cmake --build . --config=${Profile}`, { cwd: join(__dirname, './build') })
await Command([
    'cmd.exe /k "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\Tools\\VsDevCmd.bat" -startdir=none -arch=x64 -host_arch=x64;',
    [
        'lib /out:rtc.lib',
        `./${Profile}/rtc.lib`,
        '../third_party/ffmpeg-n6.1.1-156-g69bcdb4575-win64-lgpl-shared-6.1/lib/avcodec.lib',
        '../third_party/ffmpeg-n6.1.1-156-g69bcdb4575-win64-lgpl-shared-6.1/lib/avutil.lib',
        `../third_party/webrtc/src/out/${Profile}/obj/webrtc.lib`,
    ].join(' '),
].join(';'), { cwd: join(__dirname, './build') })

/* async block end */ })()
