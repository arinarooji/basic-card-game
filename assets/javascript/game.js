//Deck object (Organized by fighter cards and power cards)
var deck = {
    
    //Fighter card images with their corresponding values
    fighterName: ["Atticus", "Ayda", "Dorian", "Elika", "Eris", "Kyra", "Olga", "Quintus", "Rohm", "Vicar",],
    fighterImage: ["assets/images/cards/Atticus.jpg","assets/images/cards/Ayda.jpg", "assets/images/cards/Dorian.jpg",
                    "assets/images/cards/Elika.jpg", "assets/images/cards/Eris.jpg", "assets/images/cards/Kyra.jpg",
                    "assets/images/cards/Olga.jpg", "assets/images/cards/Quintus.jpg", "assets/images/cards/Rohm.jpg",
                    "assets/images/cards/Vicar.jpg"],
    fighterValue: [7, 5, 3, 4, 10, 6, 2, 1, 9, 8],

    //Power card images with their corresponding values
    powerImage: ["assets/images/cards/Companion.jpg", "assets/images/cards/Dragon.jpg", "assets/images/cards/DualAxes.jpg", 
                  "assets/images/cards/GammaBlast.jpg", "assets/images/cards/Inferno.jpg", "assets/images/cards/Onslaught.jpg",
                  "assets/images/cards/Orb.jpg", "assets/images/cards/Shuriken.jpg", "assets/images/cards/Stoneskin.jpg",
                  "assets/images/cards/ThrowingKnives.jpg",],
    powerValue: [6, 9, 4, 10, 8, 7, 5, 2, 1, 3]
}
//Initialize necessary variables...
var playerName = "";
var playerHealth = 100;
var enemyHealth = 100;
var selection = [];
var types = [];
var canFight = false;

$(".player").on("click", function(){
    //Get most recent player name
    if ($(this).attr("nm") !== undefined) {
        playerName = $(this).attr("nm");
    }
    //Push this card to the selection array
    selection.push(this);
    //Push this card type to the type array
    types.push($(this).attr("ct"));
    //Only two selections allowed. remove oldest if a new card is clicked
    if (selection.length > 2){
        selection[0].classList.remove("selected");
        selection.shift();
        types.shift();
    }
    //Add the selected class only to items currently in array
    for (var i = 0; i < selection.length; i++){
        selection[i].classList.add("selected");
    }
    //If player chose one of each type, they are ready to fight
    if (types.includes("fighter") && types.includes("power")){
        $(".btn-warning").addClass("fight");
        canFight = true;
    }
    //Else, they cannot fight yet
    else {
        $(".btn-warning").removeClass("fight");
        canFight = false;
    }
});

//On btn click...
$(".btn-warning").on("click", function(){
    //If player can fight
    if (canFight){
        //Calculate the player's total power (maximum value of 20)
        var playerPower = parseInt(selection[0].attributes[5].nodeValue) + parseInt(selection[1].attributes[5].nodeValue);
        //Calculate the computer's total power (maximum value of 20)
        var cpuPower1 = Math.floor(Math.random() * deck.fighterName.length);
        var cpuPower2 = Math.floor(Math.random() * deck.powerValue.length);
        var cpuTotalPower = deck.fighterValue[cpuPower1] + deck.powerValue[cpuPower2];
        //Update the battle log
        $(".log").html(playerName + " level " + playerPower + " VS " + deck.fighterName[cpuPower1] + " level " + cpuTotalPower);
        //Compare the two values
        if(playerPower > cpuTotalPower) {
            $(".enemy-health").css("width", (enemyHealth -= 20) + "%");
            $(".result").html("ROUND WON");
            console.log(enemyHealth);
        }
        else if (playerPower === cpuTotalPower) {
            $(".result").html("DRAW");
        }
        else {
            $(".player-health").css("width", (playerHealth -= 20) + "%");
            $(".result").html("ROUND LOST");
            console.log(playerHealth);
        }
        $(".btn-warning").removeClass("fight");
        canFight = false;

        if (playerHealth <= 0) {
            $(".log").html("");
            $(".result").html("DEFEAT!");
            $(".btn-info").show();
        }
        else if (enemyHealth <= 0) {
            $(".log").html("");
            $(".result").html("VICTORY!");
            $(".btn-info").show();
        }
        else{
            //Add new cards after 1 second
            setTimeout(function(){
                for (var a = 0; a < selection.length; a++) {
                    selection[a].classList.remove("selected");
                    selection[a].attributes[1].nodeValue = "#";
                }
                $(".log, .result").html("");
                selection = [];
                types = [];
                newCard();
            }, 2000);
        }
    }
});

//On replay btn click...
$(".btn-info").on("click", function(){
    $(".log, .result").html("");
    for (var a = 0; a < selection.length; a++) {
        selection[a].classList.remove("selected");
        selection[a].attributes[1].nodeValue = "#";
    }
    selection = [];
    types = [];
    playerHealth = 100;
    enemyHealth = 100;
    newCard();
});

//Sets a new card if needed (this process needs to be optimized!)
function newCard () {
    //recalculate randoms...
    var fighterOne = Math.floor(Math.random() * deck.fighterImage.length);
    var fighterTwo = Math.floor(Math.random() * deck.fighterImage.length);
    var powerOne = Math.floor(Math.random() * deck.powerImage.length);
    var powerTwo = Math.floor(Math.random() * deck.powerImage.length);
    $(".btn-info").hide();

    $(".player-health").css("width", playerHealth + "%");
    $(".enemy-health").css("width", enemyHealth + "%");
    
    if ($(".fighter-one").attr("src") === "#"){
        $(".fighter-one").attr({
            "src": deck.fighterImage[fighterOne],
            "val": deck.fighterValue[fighterOne],
            "ct": "fighter",
            "nm": deck.fighterName[fighterOne]
        });
    }

    if ($(".fighter-two").attr("src") === "#"){
        $(".fighter-two").attr({
            "src": deck.fighterImage[fighterTwo],
            "val": deck.fighterValue[fighterTwo],
            "ct": "fighter",
            "nm": deck.fighterName[fighterTwo]
        });
    }

    if ($(".power-one").attr("src") === "#"){
        $(".power-one").attr({
            "src": deck.powerImage[powerOne],
            "val": deck.powerValue[powerOne],
            "ct": "power"
        });
    }

    if ($(".power-two").attr("src") === "#"){
        $(".power-two").attr({
            "src": deck.powerImage[powerTwo],
            "val": deck.powerValue[powerTwo],
            "ct": "power"
        });
    }
}
newCard();

