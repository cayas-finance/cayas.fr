import "https://cdn.jsdelivr.net/gh/orestbida/cookieconsent@3.1.0/dist/cookieconsent.umd.js";

/**
 * All config. options available here:
 * https://cookieconsent.orestbida.com/reference/configuration-reference.html
 */
CookieConsent.run({
  categories: {
    necessary: {
      enabled: true, // this category is enabled by default
      readOnly: true, // this category cannot be disabled
    },
    analytics: {},
  },

  language: {
    default: "fr",
    translations: {
      fr: {
        consentModal: {
          title: "Nous utilisons des cookies",
          description:
            "Avec votre accord, nous utilisons des cookies pour stocker, consulter et traiter des données personnelles telles que votre visite sur ce site internet, les adresses IP et les identifiants de cookie.",
          acceptAllBtn: "Accepter",
          acceptNecessaryBtn: "Refuser tous les cookies",
          showPreferencesBtn: "Gérer en détail",
        },
        preferencesModal: {
          title: "Gérer les cookies selon vos préférences",
          acceptAllBtn: "Accepter tous les cookies",
          acceptNecessaryBtn: "Refuser tous les cookies",
          savePreferencesBtn: "Accepter la selection suivante",
          closeIconLabel: "Fermer",
          sections: [
            {
              title: "",
              description: "",
            },
            {
              title: "Cookies strictement nécessaires",
              description:
                "Ces cookies sont nécessaires au bon fonctionnement du site et ne peuvent pas être désactivés.",
              linkedCategory: "necessary",
            },
            {
              title: "Suivi",
              description:
                "Ces cookies collectent des informations sur la façon dont vous utilisez le site. Toutes les données sont anonymisées et ne peuvent pas être utilisées pour vous identifier.",
              linkedCategory: "analytics",
            },
            // {
            //   title: "More information",
            //   description:
            //     'For any queries in relation to my policy on cookies and your choices, please <a href="#contact-page">contact us</a>',
            // },
          ],
        },
      },
    },
  },
});
