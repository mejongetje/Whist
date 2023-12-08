import { RoundResult } from './round-result';
import { Trick } from './trick';

export class Round {
    constructor(players, trump){
        this.players = players;
        this.trump = trump;
        this.trickCount = 0;
        this.cardsPlayed = [];       
    }

    playTrick(players){
        const check = this.checkTrickCount()
        if(!check){
            return false;
        }
        const trick = new Trick(players, this);
        this.trickCount++;
        trick.findNextPlayer(); 
    }

    checkTrickCount(){
        if(this.trickCount==13){ 
           const rr = new RoundResult(this.players)
           const winner = rr.updateScores()
           rr.showStandings(winner)
            return false;
        } 
        return true
    }

    evaluateDeck(){
        const suitValues = [ 36,36,36,36 ]
        this.cardsPlayed.forEach(card => {
            for(let i=0; i<4;i++){
                if(card.suit==i+1){
                    if(card.rank>10){
                        suitValues[i] -= card.rank;
                    } 
                } 
            }
        });
        return suitValues;
    }

    findDeckSuitValue(suit){
        let deckSuitValue = 36;
        this.cardsPlayed.forEach( card => {
            if(card.suit == suit&&card.rank>10){
                deckSuitValue -= card.rank
            }
        })
        return deckSuitValue;
    }

    
}