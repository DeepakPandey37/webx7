let userscore = 0;
let compscore = 0;
let userscorepara = document.querySelector("#user-score");
let compscorepara = document.querySelector("#comp-score");





let msg = document.querySelector("#msg");


let generatecompchoice = () => {
let options = [ "rock" , "paper", "scissors"];
 const randomidx = Math.floor(Math.random()*3);
 return options[randomidx];
};


let choices = document.querySelectorAll(".choice");


let showwinner = (userwin) => {
if(userwin){
    userscore++;
    userscorepara.innerText = userscore;
    msg.innerText = "You win";
    msg.style.backgroundColor = "green";
 } else{
    compscore++;
    compscorepara.innerText = compscore;
        msg.innerText = "You lose";
        msg.style.backgroundColor = "red";
    }

};


let playgame = (userchoice) => {

let compchoice = generatecompchoice();
if( compchoice === userchoice){
 msg.innerText = " draw";
}else{
    let userwin = true;
    if(userchoice === "rock"){
        userwin = compchoice === "paper"?  false : true;
    } else if(userchoice === "paper" ){
            userwin = compchoice === "rock"? true : false;
        }
    else {
        if( userchoice === "scissors" ){
            userwin = compchoice === "rock" ? true : false;
        }
    }
    showwinner(userwin);
}

};


choices.forEach((choice)=> {
choice.addEventListener("click", () => {
let userchoice = choice.getAttribute("id");
playgame(userchoice);
});

});

