
function parseTime(t) {
    t = t.trim()
    let parts = t.split(',')
    let parts1 = parts[0].split(':')
    let H = +parts1[0]
    let M = +parts1[1]
    let S = +parts1[2]
    let ms = +parts[1]
    return H * 60 * 60 + M * 60 + S + ms / 1000
}

function parseSRT(srt) {
    var blocks = [[]]
    for (let line of srt.split('\n')) {

        line = line.trim()
        if (line.length == 0) {
            blocks.push([])
        } else {
            blocks[blocks.length - 1].push(line)
        }
    }
    let list = []
    for (let block of blocks) {
        if (block.length == 0) continue
        var id = block[0]
        var times = block[1].split('-->')
        var start = parseTime(times[0])
        var end = parseTime(times[1])
        var content = block.slice(2).join('\n')
        list.push({ id, start, end, content })
    }
    return list
}

export { parseSRT }