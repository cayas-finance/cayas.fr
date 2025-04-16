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
    analytics: {
      enabled: true,
      readOnly: false,
    },
  },

  guiOptions: {
    consentModal: {
      layout: "box wide",
      position: "bottom right",
      flipButtons: false,
      equalWeightButtons: false,
    },
  },

  language: {
    default: "fr",
    translations: {
      fr: {
        consentModal: {
          title: "Parlons des cookies 🍪",
          description: `
<strong>Non, pas les gâteaux, ceux qui nous permettent de vous accompagner pendant votre visite et d’améliorer votre expérience.
C’est OK pour vous ?</strong>
<br />
<br />
Voici pourquoi nous utilisons les cookies :
<ul style="list-style-type: disc;margin-left:1.5em;">
<li style="font-size:1em;padding-top: .5em;">Mesure d’audience et analyse de données.</li>
<li style="font-size:1em;padding-top: .5em;">Partager des données d’analyse, de publicité, de l’utilisateur et de personnalisation de la publicité avec Google.</li>
</ul>
`,
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
