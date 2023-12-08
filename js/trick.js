import { Turn } from './turn';
import { TrickResult } from './trick-result';

export class Trick {
    constructor(players, round){
        this.players = players;
        this.round = round;
        this.turnCount = 0;
        this.firstCard = null;
        this.trickCardsPlayed = [];  
    }

    findNextPlayer(){
        let player = this.players[this.turnCount]; 
        this.playTurn(player); 
    }

    playTurn(player){
        const check = this.checkTurnCount();
        if(!check){
            const tr = new TrickResult(this);
            tr.calcTrickResult();
            return false;
        }
        const turn = new Turn(player, this);
        this.turnCount++;       
        turn.playCard();
    }

    checkTurnCount() {
        if(this.turnCount==4){   
            return false;
        }
        return true
    }

    findBestCard(){
        
        const trumps = this.trickCardsPlayed.filter(card => card.suit == this.round.trump)
        if(trumps.length>0){
            trumps.sort((a,b)=>a.rank-b.rank);
            return trumps[trumps.length-1]
        } 
        const sameSuit = this.trickCardsPlayed.filter( card => card.suit == this.firstCard.suit)
        return sameSuit.sort((a,b)=>a.rank-b.rank)[sameSuit.length-1];
    }

    areWeWinning(player){
        const bestCard = this.findBestCard();
        const bestPlayer = findBestPlayer(this.players, bestCard);
        if(bestPlayer.name=='opponent1' && player.name=='opponent2'){
            return true;
        } else if (bestPlayer.name=='opponent2' && player.name=='opponent1'){
            return true;
        } else if (bestPlayer.name=='partner' && player.name=='player'){
            return true;
        } else if (bestPlayer.name=='player' && player.name=='partner'){
            return true;
        }
        return false;
    }
}

function findBestPlayer(players, bestCard){
    const bestPlayer = players.filter(function(player){
        return player.trickCard == bestCard;
    })
    return bestPlayer[0]
}
