import { Player } from './player';
import { Dealer } from './dealer';
import { Round } from './round';
import { showStandings, getScores } from './round-result';


function startRound(){
    $('.control').css('display', 'none');
    $('.hero-outer').css('gridTemplateColumns','1fr');
    $('hero-inner').css({
        'width': '95%'
    })
    clearLocalStorage();
    displayNamesPoints();
    const p1 = new Player('player', true); 
    const p2 = new Player('opponent1',  false, '100px', '200px' );
    const p3 = new Player('partner',  false, '150px', '100px');
    const p4 = new Player('opponent2', false, '80px', '-100px');
    const players = [p1,p2,p3,p4]; 
    const roundNumber = checkRoundNumber();
    const playerOrder = positionPlayers(players, roundNumber); 
    const dealerPosition = players.indexOf(playerOrder[3])
    showDealerButton(players);     
    const d = new Dealer(dealerPosition);
    d.shuffleDeck();
    d.dealCards();  
    setTimeout(() => { 
        p1.hand = d.hands[0];
        p2.hand = d.hands[1];
        p3.hand = d.hands[2];
        p4.hand = d.hands[3];
        const r = new Round(players, d.trump);  
        r.playTrick(playerOrder); 
        showTrump(d.trump) 
    }, 6000);
}


function positionPlayers(players, round){
    if(round==0){
        let x = Math.floor(Math.random()*4)
        let index = null;
        if(x==0){
            players[3].dealer = true;
            index = 3;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[0], players[1], players[2], players[3]];
        } else if (x==1){
            players[0].dealer = true;
            index = 0;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[1], players[2], players[3], players[0]];
        } else if (x==2){
            players[1].dealer = true;
            index = 1;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[2], players[3], players[0], players[1]];
        } else {
            players[2].dealer = true;
            index = 2
            localStorage.setItem('index', JSON.stringify(index))
            return [players[3], players[0], players[1], players[2]];
        }
    } else {
        let index = JSON.parse(localStorage.getItem('index'));
        if(index==0){
            players[1].dealer = true;
            index = 1;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[2], players[3], players[0], players[1]];
        } else if(index==1){
            players[2].dealer = true;
            index = 2;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[3], players[0], players[1], players[2]];
        } else if (index==2) {
            players[3].dealer = true;
            index = 3
            localStorage.setItem('index', JSON.stringify(index))
            return [players[0], players[1], players[2], players[3]];
        } else {
            players[0].dealer = true;
            index = 0;
            localStorage.setItem('index', JSON.stringify(index))
            return [players[1], players[2], players[3], players[0]];
        }

    }
    
}

function checkRoundNumber(){
    let round = JSON.parse(localStorage.getItem('round-whist'));
        if(round==null){
            round = 0;
            localStorage.setItem('round-whist', JSON.stringify(round))
        }
    return round;
}


function showDealerButton(players){
    players.forEach(player => {
        if(player.dealer){
            $(`.${player.name}-dealer`).css('display', 'block')
        }
    })
}


function displayNamesPoints(){
    $('.team-scores').css('display', 'block');
    $('.partner-name').css('display','block');
}


function showTrump(trump){
    $('.trump-text').css('display', 'block')
    if(trump==1){
        $('.trump-hearts').css('display', 'block');
    } else if(trump==2){
        $('.trump-diamonds').css('display', 'block');
    } else if (trump==3){
        $('.trump-spades').css('display', 'block');
    } else {
        $('.trump-clubs').css('display', 'block');
    }
}

function clearLocalStorage(){
    const scores = JSON.parse(localStorage.getItem(`gamescore-whist`));
    const totals = getScores(scores)
    const rubber = JSON.parse(localStorage.getItem('whist-rubber'));
    if(totals[0]>=5||totals[1]>=5){
        const gameScore = {};
        localStorage.setItem(`gamescore-whist`, JSON.stringify(gameScore));
    }
    if(rubber!=null){
        if(rubber['you']>=2||rubber['opponents']>=2){
            localStorage.clear()
        }
    }

}

$('.buttons').on('click', () => {
    startRound();
})

$('.score').on('click', ()=> {
    showStandings()
})

$('.close-ad').on('click', ()=>{
    $('.mobile-ad, .close-ad').css('display', 'none');
})

