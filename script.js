document.addEventListener('DOMContentLoaded', () => {
    new QRious({
        element: document.getElementById('qr-code'),
        value: 'https://xray.abvpn.ru/vless/1f998909-c1b7-4713-8df9-90050e300cb2/8824646835.json#abvpn',
        size: 300,
        level: 'H'
    });
});
