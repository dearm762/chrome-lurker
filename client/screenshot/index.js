function takeScreenshot() {
    html2canvas(document.body).then(function(canvas) {
        var imageData = canvas.toDataURL('image/png');

        var blob = dataURLToBlob(imageData);

        var formData = new FormData();
        formData.append('screenshot', blob, 'screenshot.png');

        fetch('http://localhost:3000/screenshot', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Screenshot sent successfully:', data);
        })
        .catch(error => {
            console.error('Error sending screenshot:', error);
        });
    });
}

function dataURLToBlob(dataURL) {
    var arr = dataURL.split(',');
    var mime = arr[0].match(/:(.*?);/)[1];
    var bstr = atob(arr[1]);
    var n = bstr.length;
    var u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

setTimeout(takeScreenshot, 500);
