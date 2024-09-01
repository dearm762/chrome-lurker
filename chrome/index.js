fetch('http://localhost:3000/chrome', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        address: window.location.hostname
    })
})
