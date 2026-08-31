if (window.trustedTypes && trustedTypes.createPolicy) {
  trustedTypes.createPolicy('default', {
    createScriptURL(url) {
      // blob: (rechargement à chaud d'Angular en dev) : toujours créé par notre propre JS,
      // donc pas de risque supplémentaire à l'autoriser.
      if (url.startsWith('blob:')) return url;

      const allowedOrigins = [
        'https://www.googletagmanager.com',
        // Turnstile recharge/upgrade son propre script dynamiquement.
        'https://challenges.cloudflare.com',
      ];
      if (allowedOrigins.includes(new URL(url, location.href).origin)) {
        return url;
      }
      throw new TypeError('Blocked script URL not allowed by default Trusted Types policy: ' + url);
    },
  });
}
