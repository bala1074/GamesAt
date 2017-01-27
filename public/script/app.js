var toggleCricket=1;
var toggleBadminton=1;
var toggleTabletennis=1;
var toggleChess=1;
var toggleBowling=1;
var toggleGokarting=1;
var toggleBasketball=1;
function toggleSelectedImage(game){
    console.log(event);
    if(game == 'cricket'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleCricket+game+".png";
        if(toggleCricket==0)
            toggleCricket=1;
        else
            toggleCricket=0;
    }
    else if(game == 'badminton'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleBadminton+game+".png";
        if(toggleBadminton==0)
            toggleBadminton=1;
        else
            toggleBadminton=0;
    }
    else if(game == 'tabletennis'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleTabletennis+game+".png";
        if(toggleTabletennis==0)
            toggleTabletennis=1;
        else
            toggleTabletennis=0;
    }
    else if(game == 'chess'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleChess+game+".png";
        if(toggleChess==0)
            toggleChess=1;
        else
            toggleChess=0;
    }
    else if(game == 'bowling'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleBowling+game+".png";
        if(toggleBowling==0)
            toggleBowling=1;
        else
            toggleBowling=0;
    }
    else if(game == 'gokarting'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleGokarting+game+".png";
        if(toggleGokarting==0)
            toggleGokarting=1;
        else
            toggleGokarting=0;
    }
    else if(game == 'basketball'){
        document.getElementById("toggleImage_"+game).src="/assets/"+toggleBasketball+game+".png";
        if(toggleBasketball==0)
            toggleBasketball=1;
        else
            toggleBasketball=0;
    }
}



