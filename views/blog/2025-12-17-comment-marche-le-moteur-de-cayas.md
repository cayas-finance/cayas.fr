---
title: "On vous ouvre le capot : comment marche le moteur de Cayas ?"
slug: comment-marche-le-moteur-de-cayas
date: 2025-12-17
author: L’équipe Cayas
excerpt: Avec Cayas+, vous accédez à un outil de simulation intelligent pour
  tester si votre patrimoine suffit à financer vos projets de vie (retraite,
  achat immobilier, revenus exceptionnels…). Contrairement aux modèles
  classiques, notre moteur calcule une allocation dynamique et personnalisée,
  adaptée à vos contraintes de liquidité et vos objectifs concrets, grâce à une
  fonction de valeur unique. Parce que votre plan d’investissement doit être
  optimisé, en maximisant vos chances de succès mais aussi en maîtrisant le
  risque de ruine.
published: true
featured: true
tags:
  - L’avis Cayas
featured_image: /assets/blog/Hero image blog.png
seo:
  meta_title: Comment marche le moteur de Cayas ?
  meta_description: Notre modèle calcule votre allocation optimisée, adaptée à vos
    contraintes de liquidités et à vos projets de vie. Parce que votre plan
    d’investissement doit être optimisé, en maximisant vos chances de succès
    mais aussi en maîtrisant le risque de ruine. On vous explique comment.
---
Avec [l’outil Plan de vie](https://app.cayas.fr/tools/life-plan) de Cayas :

\- Vous planifiez vos projets de vie (départ à la retraite, achat ou vente de bien immobilier, dépense exceptionnelle, revenu exceptionnel… C’est vous qui dites ce qui est important).

\- Puis, vous lancez une simulation pour voir si votre patrimoine permet de les financer, dans différents scénarios de marchés, du plus pessimiste au plus optimiste.

\- Si la simulation montre un patrimoine qui s’éclate au sol, il va falloir revoir quelques détails. Ici, on ne réinvente pas l’eau chaude, il y a trois actions possibles : revoir votre projet, diminuer vos dépenses ou augmenter vos revenus.

\- Si la simulation est positive, vous découvrez l’allocation optimisée pour que « ça passe », autrement dit, pour que vos projets aient de bonnes chances d’être financés.

Maintenant, comment Cayas calcule-t-elle cette allocation optimisée ? Qu’y a-t-il sous le capot ?

Au début, on a utilisé le modèle de Merton/Markowitz. Il est particulièrement intéressant mais il souffre malheureusement de deux gros défauts qui le rendent peu utilisable en pratique :

1\. Ce modèle est basé sur une consommation intertemporelle à horizon infini. C’est un peu comme si on cherchait à répartir au mieux ses dépenses dans le temps, mais sans date de fin – ni retraite ni mort. (On sait, on sait, il y en a qui essayent de n’avoir ni retraite ni mort. On verra quand ils y arriveront.)

2\. L’allocation donnée ne tient pas compte des projets de vie ni des contraintes de liquidités. Or quand il faut décaisser de l’argent à un instant T pour un projet qui n’attend pas, c’est l’instant T qui compte, et pas l’horizon infini.

En clair : vous n’êtes pas immortel, et vous avez besoin de mobiliser des liquidités pour ces projets importants à votre bonheur.

Or votre bonheur nous tient à cœur. Ni une ni deux, nous avons donc cherché à améliorer cette base de Merton/Markowitz.

En fouillant un peu la littérature scientifique et en améliorant ce qu’on a trouvé, nous avons abouti à notre modèle. Certains dans l’équipe n’osent pas dire qu’ils ont amélioré ce que la littérature scientifique propose, mais d’autres le disent : notre modèle est révolutionnaire, voilà c’est dit.

Notre modèle repose sur une brique fondamentale : **la fonction de valeur**. C’est une fonction personnalisée, qui est créée pour chaque plan de vie dynamiquement et qui permet de savoir à quel point une allocation a de la valeur pour vous. Cette fonction prendra des valeurs d’autant plus grandes qu’elle augmente votre patrimoine, mais sera aussi punie lorsqu’elle vous fait courir un risque de ruine trop important.

En maximisant cette fonction, on peut alors déterminer, à chaque pas de temps, pour votre plan de vie, l’allocation optimale. Finalement, lorsque vous appuyez sur « Lancer la simulation », quatre étapes se lancent :

1\. D’abord, compte tenu de votre patrimoine actuel, de vos projets de vie, de vos revenus futurs, on calcule un ensemble de niveau de richesse accessible pour vous.

2\. Ensuite, on construit la fonction de valeur qui vous est propre, et on attribue à chaque niveau de richesse à chaque pas de temps un score que l’on cherchera à maximiser.

3\. Ensuite, à chaque pas de temps, on calcule la frontière efficiente compte tenu de vos actifs illiquides (résidence principale, par exemple).

4\. Enfin, pour chaque niveau de richesse et chaque pas de temps, on cherche le portefeuille sur cette frontière efficiente qui maximise l’espérance de la fonction de valeur.

C’est ce portefeuille qui vous est ensuite proposé.

Ce n’est donc pas un simple simulateur de Monte Carlo avec une allocation fixe, mais bien un outil qui vous permet, à partir d’un plan de vie, d’avoir une idée de l’allocation optimale qui vous permettra de le financer.

[![](/assets/blog/vs_blog-link-01.jpg)](https://app.cayas.fr/lessons)