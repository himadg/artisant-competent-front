globalThis.dataLayer = globalThis.dataLayer || [];
function gtag() {
    globalThis.dataLayer.push(arguments);
}

gtag('js', new Date());
gtag('config', 'G-KT92099KBQ');
gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
});

function allConsentGranted() {
    gtag('consent', 'update', {
        ad_user_data: 'granted',
        ad_personalization: 'granted',
        ad_storage: 'granted',
        analytics_storage: 'granted',
    });
}
