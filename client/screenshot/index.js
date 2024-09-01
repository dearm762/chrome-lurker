const dataURLToBlob = dataURL => {
    const arr = dataURL.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    const n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], { type: mime })
}

const takeScreenshot = () => {
    html2canvas(document.body).then(function (canvas) {
        const imageData = canvas.toDataURL('image/png')
        const blob = dataURLToBlob(imageData)
        const formData = new FormData()
        formData.append('screenshot', blob, 'screenshot.png')
        fetch('http://localhost:3000/screenshot', {
            method: 'POST',
            body: formData
        }).catch(error => {
            console.log(error)
        })
    })
}

setTimeout(takeScreenshot, 500)
