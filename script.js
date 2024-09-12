
//U HTML imam name atribut. Ranije sam to vec spominjao.
//U OBJASNJENJIMA SAM PIDAO RADIO INPUT. MOZE I RADIO BUTTON. RADIO BUTTON JE LOGICNIJE. ALI CISTO DA POJASNIM.

//1.
const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");  //Targetuje sve input-e unutar score-options diva
const scoreSpans = document.querySelectorAll("#score-options span");    ////Targetuje sve span-ove unutar score options diva
const currentRoundText = document.getElementById("current-round");
const currentRoundRollsText = document.getElementById("current-round-rolls");
const totalScoreText = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");
let isModalShowing = false;         //Step 7. - When the user clicks on the Show rules button, they should be able to toggle between showing and hiding the game rules. Use let to create a variable called isModalShowing and assign it the value of false.
let diceValuesArr = [];             //Step 8. - Each time the user rolls the dice, you will need to keep track of all of the dice values. Use let to create a variable called diceValuesArr and assign it the value of an empty array.
let rolls = 0;
let score = 0;
let totalScore  = 0;
let round = 1;


//2. When the user clicks on the Show rules button, the rules for the game should display on the screen. When they click on the button again, the rules should be hidden. In the next few steps, you will build out the toggle functionality to show and hide the rules.
rulesBtn.addEventListener("click", () => {
    isModalShowing = !isModalShowing;           //Ovo je da bi radio toggle. Svaki put kad stisnem dugme menja se vrednost. Every time the user clicks on the rules button, the current boolean value for the isModalShowing variable should toggle between true and false.
    if(isModalShowing) {
        rulesBtn.textContent = "Hide Rules";
        rulesContainer.style.display = "block";
    } else {
        rulesBtn.textContent = "Show Rules";
        rulesContainer.style.display = "none";
    }
})

//3. When the user clicks on the Roll the dice button, five random die numbers should be generated and displayed on the screen. For the next few steps, you will build out this roll dice algorithm. Start by creating an arrow function called rollDice.
const rollDice = () => {
    diceValuesArr = [];                 //Each time the user rolls the dice, the list of previous dice values should be reset. Inside your rollDice function, reassign an empty array to your diceValuesArr variable.
    for (let i = 0; i < 5; i++){        //Uzima 5 brojeva (od 0 do 6).   When the user rolls the dice, you will need to generate 5 random numbers representing each die value. To start, create a for loop that will loop a total of 5 times.
        const randomDice = Math.floor(Math.random() * 6) + 1;   
        diceValuesArr.push(randomDice);
    }

    listOfAllDice.forEach((dice, index) => {            //Ovde je listOfAllDice node list, a ne array ali radi forEach i tako izgleda
        dice.textContent = diceValuesArr[index];
    })
};

//4. Now it is time to test out the rollDice function. Add an addEventListener() method on the rollDiceBtn element and pass in a click event for the first argument and an empty arrow function for the second argument.
rollDiceBtn.addEventListener("click", () => {   //** Ispod.
    if(rolls === 3) {       //U svakoj rundi moze 3 puta da se bacaju kockice.
        alert("You have made three rolls this round. Please select a score.")
      } else {
        rolls++;
        resetRadioOption();       //Dodato u koraku 51. Bitno je da bude pre getHighestDuplicates da bi funkcionisalo kako treba.
        rollDice();
        updateStats();
        getHighestDuplicates(diceValuesArr);
        detectFullHouse(diceValuesArr);     //Dodato u koraku 77.
        checkForStraights(diceValuesArr);   //Dodato u 87. koraku.
      }
});

//5. If you try to roll the dice a few times, you probably noticed that the rolls and round count do not change. To fix this, you will need to update the text content for both of those values. Start by creating an arrow function called updateStats.
const updateStats = () => {
    currentRoundRollsText.textContent = rolls;          //rolls je zadato gore.
    currentRoundText.textContent = round;               //round je zadato gore.
};

//6. Step 27. - Each time you roll the dice, you could end up with a "Three of a kind", "Four of a kind", "Full house", "Straight" or a random combination of numbers. Based on the outcome, you can make a selection and add points to your score. Start by creating an arrow function called updateRadioOption that takes optionNode and score as parameters.
const updateRadioOption = (optionNode, score) => {      
    scoreInputs[optionNode].disabled = false;               //Gore imam zadato scoreInputs, A u HTML-u imam zadato na inputima disabled property. Znaci verovatno ce biti kad dobijem "three of a kind" da ta radio opcija nije vise disabled odnosno zadajem da je disabled false. radio je ono kad imam kruzic za input. Ima u HTML-u.
    scoreInputs[optionNode].value = score; //2x             //Ne znam da li sam do sad koristio value za radio input. Step 29. - Next, you will need to update the radio button's value to the current score.
    scoreSpans[optionNode].textContent = `, score = ${score}`;      //Ovde imam teplate literal. Ispisuje koji je score kad dobijem npr "three of a kind".
};

//7.
const getHighestDuplicates = (arr) => {         //Step 33. - If you roll the dice and get a "Three of a kind" or "Four of a kind", then you can get a score totalling the sum of all five dice values. For the next few steps, you will build out an algorithm that tracks any duplicates found in the diceValuesArr and displays a score next to the first two radio buttons. Start by creating an arrow function called getHighestDuplicates that has a parameter called arr.
    const counts = {};
    for (let num of arr) {              //* Ispod.   for...of loop
        if (counts[num]) {
            counts[num]++;
        } else {
            counts[num] = 1;
        }
    }
    let highestCount = 0;               //The next step is to keep track of when a particular number appears three or four times within the arr. Use let to create a highestCount variable and assign it the value of 0.
    for (let num of arr) {
        const count = counts[num];
        if (count >= 3 && count > highestCount) {       //OVO MORAM POGLEDATI JER NE KONTAM STO IMAM OVAJ DRUGI USLOV.
            highestCount = count;
        }
        if (count >= 4 && count > highestCount) {
            highestCount = count;
        }
    }

    const sumOfAllDice = diceValuesArr.reduce((a, b) => a + b, 0);
    
    if (highestCount >=4) {
        updateRadioOption(1, sumOfAllDice);         //Ovde je jedan pozicija "Four of a kind" (1 je drugo mesto u array-u).
    }
    if (highestCount >= 3) {                        //Ovde sam mogao i sa else if da radim.
        updateRadioOption(0, sumOfAllDice);
    }

    updateRadioOption(5, 0);                        //Ovo pozivam jer uvek imam opciju da izaberem radio input koji je jednako nula.
    // console.log(counts)
};

//8. Step 47. - Before each dice roll, you will need to reset the values for the score inputs and spans so a new value can be displayed. Start by creating an arrow function called resetRadioOption.
const resetRadioOption = () => {
    scoreInputs.forEach((input) => {        //For each of the score inputs, you will need to disable the input and remove its checked attribute. Start by using a forEach on the scoreInputs. For the callback function, use input for the parameter name.
        input.disabled = true;      //Vraca sve radio inputa na disabled.
        input.checked = false;      //Ako je neki input bio cekiran onda sklanja to.
    })
    scoreSpans.forEach((span) => {          //For each of the score span elements, you will need to reset the text content.
        span.textContent = "";
      });
};

//9. When you roll the dice and make a selection, you are not able to keep the score you selected and move onto the next round. In the next few steps, you will build out an algorithm that keeps track of and displays each score for all six rounds of the game. Start by creating an arrow function called updateScore that has two parameters called selectedValue and achieved.
const updateScore = (selectedValue, achieved) => {      //selectedValue i achieved se prosledjuje iz koraka 10.
    totalScore += parseInt(selectedValue);          //**** Ispod.
    totalScoreText.textContent = totalScore;        //Ispisuje koji je total score.
    scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;        //Belezi sta sam izabrao i dodaje na listu.
};

//10. Step 55. - After a user makes a selection, they should be able to keep that score and move onto the next round. Add an event listener to your keepScoreBtn variable that takes in a click event for the first argument and an empty arrow function for the second argument.
keepScoreBtn.addEventListener("click", () => {  //*** Ispod.
    let selectedValue;              //When a radio button is checked, you will need to save its value and id. Inside your event listener function, create two let variables called selectedValue, and achieved.
    let achieved;

    for (let radioButton of scoreInputs) {
        if (radioButton.checked) {
            selectedValue = radioButton.value;  //1x
            // console.log(selectedValue)
            // console.log(typeof selectedValue)
            achieved = radioButton.id;
            break;                      //Ovako izlazim iz loop-a cim se pronadje radio input (radio button) koje je selektovano.   At the bottom of your if statement, add the break keyword to ensure that you break out of the loop when the selected radio button was found.
        }
    }
    if (selectedValue) {
        rolls = 0;
        round++;
        updateStats();                  //Ispisuje da je rolls = 0 i ispisuje da je sledeca runda.
        resetRadioOption();             //Ima gore sta radi.
        updateScore(selectedValue, achieved);           //Ima gore sta radi.
        if (round > 6) {    //Step 61. - At this point in the game, you are able to roll the dice, make a selection and play for a few rounds. However, you should notice that there is no end to the game and there are infinite rounds. According to the rules, there should be a total of six rounds and then the game ends with the final score. Inside the if statement for your keepScoreBtn event listener, add a new if statement to check if round is greater than the number 6.
            setTimeout(() => {
                alert(`Game Over! Your total score is ${totalScore}`);
                resetGame();
            }, 500)
        };
    } else {
        alert("Please select an option or roll the dice");  //Ako nisam nista selektovao, a probam da stisnem "Keep the above selected score" dugme onda izbaci alert.
    }
});

//11. Step 63. - If you go through six rounds of the game, you should see the alert show up with your final score. But when you dismiss the alert, you are able to keep playing for more rounds past the original six. To fix this, you will need to reset the game. Start by creating an arrow function called resetGame.
const resetGame = () => {
    diceValuesArr = [0, 0, 0, 0, 0];
    score = 0;
    totalScore = 0;
    rolls = 0;
    round = 1;

    listOfAllDice.forEach((dice, index) => {
        dice.textContent = diceValuesArr[index];
    });

    totalScoreText.textContent = totalScore;
    scoreHistory.innerHTML = "";
    currentRoundRollsText.textContent = rolls;
    currentRoundText.textContent = round;

    resetRadioOption();
};

//12. Step 70. - If the user rolls a "Three of a kind" and a pair, then they can receive 25 points for that round. This is known as a full house. For the next few steps you will build out an algorithm to check for both a "Three of a kind" and a pair and display that option on the screen. Start by creating an arrow function called detectFullHouse with arr for the parameter name. Inside the detectFullHouse function, create a const variable called counts and assign it an empty object.
const detectFullHouse = (arr) => {
    const counts = {};
    for (let num of arr) {
        counts[num] = counts[num] ? counts[num] + 1 : 1;    //Ako je counts[num](desno od znaka jednakosti) truthy onda to znaci da vec postoji unutar object-a i onda je counts[num] = counts[num] + 1. Zato nisam mogao da stavim counts[num]++ jer bi onda bilo counts[num]=counts[num]=counts[num]+1. Ako je falsy onda je counts[num] = 1.
    };

    const hasThreeOfAKind = Object.values(counts).includes(3);   //Object.values() pravi array u kome se nalaze vrednosti svakog property-a counts objecta. Znaci ako imam objecat {1:3, 3:2, 4:10} onda ce Object.values da izbaci [3, 2, 10]. Includes(3) proverava da li array sadrzi vrednost tri sto znaci da je property nekog key-a u counts objectu jednak 3 sto znaci da imam broj koji se ponavlja tri puta.
    const hasPair = Object.values(counts).includes(2);
    if (hasThreeOfAKind && hasPair) {   //Ako je i jedno i drugo true izvrsava se if statement.
        updateRadioOption(2, 25);       //Pozicija 2 na listi (Full house), i vrednost je 25.
    };
    updateRadioOption(5, 0);
}

//13. Ovde proverava straight. For the last portion of the game, you will need to create an algorithm that checks for the presence of a straight. A small straight is when four of the dice have consecutive values(Ex. 1234) resulting in a score of 30 points. A large straight is when all five dice have consecutive values(Ex. 12345) resulting in a score of 40 points. Start by creating an arrow function called checkForStraights that has arr for the parameter name.
const checkForStraights = (arr) => {
    const sortedNumbersArr = arr.sort((a, b) => a - b);         //Sortira od najmanjeg do najveceg broja.
    const uniqueNumbersArr = [...new Set(sortedNumbersArr)];    //A JavaScript Set is a collection of unique values. Uzima array i sacuva samo unikate, a duplikate izbaci. Znaci ako imam array [1,1,2,3,3,3,4,5] new Set ce uzeti 1,2,3,4,5 ali onda moram spread da uradim da to pretvorim u array [1,2,3,4,5].
    const uniqueNumbersStr = uniqueNumbersArr.join("");     //Ako je uniqueNumbersArr npr [1, 2, 3, 4, 5] onda je uniqueNumbersStr 12345.
    console.log(uniqueNumbersStr);
    const smallStraightsArr = ["1234", "2345", "3456"];
    const largeStraightsArr = ["12345", "23456"];

    if (largeStraightsArr.includes(uniqueNumbersStr)) {         
        updateRadioOption(4, 40);
    }

    smallStraightsArr.forEach((straight) => {           //***** Ispod.
        if (uniqueNumbersStr.includes(straight)){       
          updateRadioOption(3, 30);
        }
    })

    updateRadioOption(5, 0);
};




// *
// const getHighestDuplicates = (arr) => {         
//     const counts = {};
//     for (let num of arr) {          //U prvoj iteracjiji num je prvi clan array-a. U drugoj drugi...       
//         if (counts[num]) {          //Ako taj key vec postoji unutar counts objecta onda povecava property tog keya za 1.
//             counts[num]++;
//         } else {                    //Ako taj key ne postoji zadaje mu se property 1.
//             counts[num] = 1;
//         }
//     }
// };



// **
// Kad stisnem rollDiceBtn ako je rolls === 3 izbacuje alert, a ako je manje od 3 (npr. 0) onda podize
// rolls za 1 (rolls++).
// Posle toga se poziva rollDice() funkcija. Prvo radi diceValuesArr = [] da bi sledeci put kad stisnem dugme
// opet krenuo od praznog array-a. Posle toga generise 5 random brojeva i push-uje u diceValuesArr.
// Posle toga radi ovo:

// listOfAllDice.forEach((dice, index) => {            
//     dice.textContent = diceValuesArr[index];    //Ispisuje vrednost random brojeva koje smo dobili u polja redom. ListOfAllDice je zadato pa u prvom krugu dice postaje prvi clan iz listOfAllDice array-a (u stvari je node list valjda ali radi forEach. I gore sam napisao). I onda se dodeljuje text koji je =diceValuesArr[index]; Znaci ako imam array [2,4,3,1,5] u prvo polje ce da pise diceValuesArr[0] sto je 2.
// })

// Nakon toga se poziva updateStats()
// const updateStats = () => {
//     currentRoundRollsText.textContent = rolls;      //rolls je zadato gore. Menja rolls na ekranu. Krece od nula pa ide 1, 2, 3.
//     currentRoundText.textContent = round;           //round je zadato gore. Ovo jos nismo sredili.
// };

// Onda se poziva getHighestDuplicates(diceValuesArr).
// Ovde kreiramo prvo counts object. Znaci ako je diceValueArr = [2, 2, 1 , 3, 5] onda je u prvoj iteraciji
// num = 2, odnosno nulti clan array-a (ima ovo gore for (let num of arr)) i onda je counts[num] odnosno counts[2] falsy tako da se 
// izvrsava else statement i pravi se key 2 sa propertijem 1. Ovo znaci counts = {2:1}.
// U drugoj iteraciji posto vec key 2 imamo onda se samo dodaje +1. Znaci counts = {2:2}.
// U trecoj iteraciji num = 1 i posto taj key nemamo on se dodaje. Znaci counts = {1:1, 2:2}.
// OBJEKAT IZGLEDA PO VELICINI REDJA KEY-OVE KAD SU BROJEVI. NISAM TO DO SAD PRIMECIVAO.
// U cetvrtoj iteraciji num = 3. Znaci counts = {1:1, 2:2, 3:1}.
// U petoj iteraciji num = 5. Znaci counts = {1:1, 2:2, 3:1, 5:1}.

// Posle toga zadajem let highestCount = 0. I ovde imam for (let num of arr). U ovom koraku trazim koja je najveca
// vrednost properija i ako zadovoljava if statement onda to dodoljujem highestCount promenljivoj. Posto u mom 
// slucaju najveci property je 2 onda ne zadovoljava if uslov.
// Ali cu za sledeci korak da pretpostavim da sam imao neki propery cija je vrednost 4 (znaci da sam dobio cetiri
// ista random broja).
// Onda radim reduce da nadjem sumu svih brojeva.
// I onda ako je highestCount 4 onda se poziva updateRadioOption(1, sumOfAllDice). Ovde je 1 pozicija
// "Four of a kind" radio inputa u scoreInputs node listi. Posto je drugi na listi znaci pozicija je 1. Isto kao
// da je array u pitanju. Onda updateRadioOption funkcija sklanja "disabled"(koje je zadato u html-u) sa
// "Four of a kind", velezi value i ispusuje sumu pored "Four of a kind".

// I onda se za svaku iteraciju poziva updateRadioOption(5, 0) jer uvek imamo opciju da izaeremo skor nula.
// Ovde je 5 pozicija u node listi a 0 je vrednost skora.



// ***
// keepScoreBtn.addEventListener("click", () => { 
//     let selectedValue;      //Kreiram promenljivu.         
//     let achieved;           //Kreiram promenljivu. 

//     for (let radioButton of scoreInputs) {
//         if (radioButton.checked) {              //Ako je neko radio dugme check-irano onda se izvrsava if komanda. U prvoj iteraciji je radio button prvi clan scoreInputs-a i tako dalje. Znaci if ce se izvrsavati tek kad se nadje cekirano dugme.
//             selectedValue = radioButton.value;  //Kad se pronadje cekirano dugme (npr trece) onda selectedValue postaje radioButton.value sto je u stvari value treceg clana scoreInputs-a.
//             achieved = radioButton.id;          //Ovde achieved postaje radioButton.id odnosno id odgovarajuceg clana is scoreInputs.
//             break;       //Kad je pronadjeno cekirano dugme zaustavlja se if statement.               
//         }
//     }
//     if (selectedValue) {            //Ako je selectedValue truthy izvrsava se ovo ispod.
//         rolls = 0;                  //rolls se vraca na nulu jer pocinje nova runda.
//         round++;                    //Gore je zadato da je round = 1 pa onda to dizemo za 1.
//         updateStats();              
//         resetRadioOption();                     //Gasi svu radio dugmad i brise ako nesto pise pored njih. Mislim da sam ovo vec negde objasnio.
//         updateScore(selectedValue, achieved);   
//     }
// });



// ****
// totalScore += parseInt(selectedValue);   
// parseInt radim jer je selectedValue string.
// SelectedValue dobijam sa mesta 1x, a ono sto mi omogucava da uopste uzmem value je 2x.
// Kad radim value od inputa dobija se string pa zato moram da ga pretvorim u intager.
// Ako obrisem parseInt nece se sabirati brojevi nego se pravi string.



// *****
// Ovde nisam mogao isto kao za largeStraigtsArr. U largeStraightsArr imam dva clana sa po pet brojeva
// uniqueNumbersStr je string od pet brojeva tako da kar radim includes to funkcionise.
// Ako uradim isto i za smallStraightsArr funkcionisace ali ne kako treba. Sve ce da radi ok dok ne
// dobijem 12346. U tom slucaju smallStraightsArr ne include-uje 12346. Zato radim forEach i u tom slucaju
// gledam da li 12346 includes (u prvoj iteraciji) 1234 i posto je ovde i 12346 string i 1234 string onda
// ga pronalazi. 

