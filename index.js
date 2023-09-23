// 1. On code le constructeur pour construire l'objet "Question":
class Question {
  constructor (text, choices, answer) {
    this.text = text;
    this.choices = choices;
    this.answer = answer;
  }
  //2.Ajout d'une fonction(méthode) pour savoir si le user a bien répondu :
  isCorrectAnswer(choice) {
    return choice === this.answer;
  }
}

//0.Déclaration des questions dans une variable Array :
const questions = [
  new Question(
    "Quelle méthode Javascript permet de filtrer les éléments d'un tableau",
    ["indexOf()", "map()", "filter()", "reduce()"],
    "filter()"
  ),
  new Question(
    "Quelle méthode Javascript permet de vérifier si un élément figure dans un tableau",
    ["isNaN()", "includes()", "findIndex()", "isOdd()"],
    "includes()"
  ),
  new Question(
    "Quelle méthode transforme du JSON en un objet Javascript ?",
    ["JSON.parse()", "JSON.stringify()", "JSON.object()", "JSON.toJS"],
    "JSON.parse()"
  ),
  new Question(
    "Quel objet Javascript permet d'arrondir à l'entier le plus proche",
    ["Math.ceil()", "Math.floor()", "Math.round()", "Math.random()"],
    "Math.round()"
  ),
];


//3. Se coder la logique du quizz en créant une classe qu'on instenciera avec toutes les questions :
class Quizz {
  //4.Donner toutes les questions en paramètre du constructeur :
  constructor(questions) {
    //Paramétrer le score à 0 qu'on incrémentera au fur et à mesure
    this.score = 0;
    this.questions = questions;
    //L'index de la question où l'on se trouve, dans le tableau Questions (au départ index [0]) :
    this.currentQuestionIndex = 0;
  }

  //5. Méthode pour savoir sur quelle question on est :
  getCurrentQuestion(){
    //this.questions = entrée du tableau de questions
    return this.questions[this.currentQuestionIndex]
  }

  //6.Méthode pour le choix du user :
  guess(answer) {
    //Si (questionEnCours) est true (isCorrectAnswer renvoi booléen)
    if (this.getCurrentQuestion().isCorrectAnswer(answer)) {
      //Incrémente le score
      this.score++;
    }
    //Si false, on ne fait rien, mais quoi qu'il arrive, on avance d'une question :
    this.currentQuestionIndex++;
  }

  //7.Méthode pour savoir si le quizz est fini :
  hasEnded() {
    //Est-ce que la question actuelle est supérieure à la longueur du tableau, si oui, c'est fini.
    return this.currentQuestionIndex >= this.questions.length;
  }
}

//11.Créer un objet pour gérer tous les affichages :
//Dans cet objet, il y aura toute une série de fonction que l'on jouera au besoin.
const display = {
  elementShown: function (id, text) {
    //Fonction qui pointe un ID sur le DOM
    let element = document.getElementById(id);
    //Et à laquell on rajoute du texte :
    element.innerHTML = text;
  },

  //12.Fonction(méthode) d'affichage de la question :
  question: function () {
    //Prend la méthode elementShown et donne lui l'id "question" sur le DOM, dans cet ID montre moi le text (.text) de la question en cours :
    this.elementShown("question", quizz.getCurrentQuestion().text )
  },

  //13.Fonction(méthode) d'affichage et de sélection des choix :
  choices: function() {
    //On récupére les array de réponses à l'intérieur de chaque question et on les met dans une variable :
    let choices = quizz.getCurrentQuestion().choices;

    //14.Créer une fonction(méthode) pour gérer le choix du user,  savoir si c'est la bonne réponse, et faire avancer si le quizz n'est pas fini :
    guessHandler = (id, guess) => {
      //Créer un seul évènement pour les 4 boutons :
      //Comme on est dans un objet, le addEventListener est impossible, donc faire un "onclick":
      document.getElementById(id).onclick = function () {
        //Lors de cet evènement, lancer la méthode guess de quizz (pour la réponse en question)
        quizz.guess(guess)
        //Ensuite relancer quizzApp pour savoir si c'est fini :
        quizzApp();
      }
    }

    //15. PUIS ENFIN : affichage des choix et prise en compte de la réponse en créant une boucle FOR :
    for (let i = 0; i < choices.length; i++) {
      //Demander à elementShown de s'éxécuter (donc d'aller chercher un ID) et le concaténer avec i, qui correspondra donc aux ID choice1, choice2 etc.
      //Et en deuxième paramètre, le choix du user :
      this.elementShown("choice" + i, choices[i]);
      //Appeler la méthode qui nous fait avancer d'une question au click (le "guess" ici est le ID du container des boutons):
      //Et en deuxième paramètre, le choix du user :
      guessHandler("guess" + i, choices[i]);
    }
  },

  //17. Coder la progression du user dans le quizz :
  progress: function() {
    //Appeler la méthode elementShown (qui permet de pointer par un id et de lui ajouter de l'innerHTML)
    //Tu vas chercher l'ID progress, et tu lui ajoutes "la question actuelle" (+1 car l'index de l'array démarre à 0) sur "la longueur de l'array questions" :
    this.elementShown("progress", `Question ${quizz.currentQuestionIndex + 1} sur ${quizz.questions.length}` )
  },

  //19.Coder l'écran de fin avec le résultat du user :
  endQuizz: function() {
    //Créer une variable pour injecter le texte qui nous intéresse (plus facile à écrire ensuite) :
    let endQuizzHTML = `
      <h1>Quizz terminé !</h1>
      <h3>Votre score est de : ${quizz.score} / ${quizz.questions.length}</h3>
    `
    //Appeler la méthode d'affichage (elementShown) dans cette fonction (endQuizzHTML = this.), lui passer l'ID "quizz" (correspond au container du Quizz en HTML) et en texte la variable crée juste avant :
    this.elementShown("quiz", endQuizzHTML);
  },
};

//9.La logique du jeu : se créer une nouvelle fonction :
quizzApp = () => {
  //Si le quizz est terminé, 
  if (quizz.hasEnded()) {
    //Affiche l'écran de fin en appelant la fonction :
    display.endQuizz();
  } else {
    //Si le jeu n'est pas fini, appelle-moi l'objet display et sa méthode question :
    display.question();
    //16.Si le jeu n'est pas fini, appelle-moi l'objet display et sa méthode choices (montre moi les choix qu'on a) :
    display.choices();
    //18.Jour la fonction (méthode) pour la progression du user :
    display.progress();
  }
};


//8.Créer un nouveau quizz (instancier un nouvel objet) :
let quizz = new Quizz(questions);
//10.Jouer la fonction de logique du jeu :
quizzApp();
