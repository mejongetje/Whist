export class TrickResult {
    constructor(trick){
        this.players = trick.round.players;
        this.round = trick.round;
        this.trick = trick;
    }

    pushTrickCards(){
        this.trick.trickCardsPlayed.forEach(card => {
            this.round.cardsPlayed.push(card);
        })       
    }

    calcTrickResult(){
        this.pushTrickCards()
        const trickWinner = this.findWinner();
        trickWinner.tricksWon++
        const players = this.updatePositions(trickWinner);
        let leftSide = '';
        let topSide = '';
        if(trickWinner.name=='player'){
            leftSide = '50px'; topSide = '400px'
        } else if(trickWinner.name=='opponent1'){
            leftSide = '-200px'; topSide = '-20px'
        } else if(trickWinner.name=='partner'){
            leftSide = '-50px'; topSide = '-200px'
        } else {
            leftSide = '330px'; topSide = '20px'
        }

        setTimeout(() => {
            $('.dropzone').children().animate({opacity: 0.25, width: 'toggle', left: leftSide, top: topSide}, 400, function(){
                this.remove();});
                $('.player-tricks').text(this.players[0].tricksWon + this.players[2].tricksWon);
                $('.opponents-tricks').text(this.players[1].tricksWon + this.players[3].tricksWon);
                setTimeout(() => { 
                    this.round.playTrick(players);
                }, 1500);      
        }, 750);      
    }

    updatePositions(trickWinner){
        if(trickWinner.name=='player'){
            this.players[0].trickPosition = 0; this.players[1].trickPosition = 1;
            this.players[2].trickPosition = 2; this.players[3].trickPosition = 3;
            return [this.players[0], this.players[1], this.players[2], this.players[3]];
        } else if (trickWinner.name=='opponent1'){
            this.players[1].trickPosition = 0; this.players[2].trickPosition = 1;
            this.players[3].trickPosition = 2; this.players[0].trickPosition = 3;
           return [this.players[1], this.players[2], this.players[3], this.players[0]];
        } else if (trickWinner.name=='partner'){
            this.players[2].trickPosition = 0; this.players[3].trickPosition = 1;
            this.players[0].trickPosition = 2; this.players[1].trickPosition = 3;
            return [this.players[2], this.players[3], this.players[0], this.players[1]];
        } else {
            this.players[3].trickPosition = 0; this.players[0].trickPosition = 1;
            this.players[1].trickPosition = 2; this.players[2].trickPosition = 3;
            return [this.players[3], this.players[0], this.players[1], this.players[2]];
        }
    }

    findWinner(){
        const cards = []
        this.players.forEach( player => cards.push(player.trickCard));
        const winningCard = findWinningCard(cards, this.trick.firstCard, this.round.trump);
        const winner = this.players.filter(p => p.trickCard == winningCard)[0];
        return winner;
    }
}

function findWinningCard(cards, firstCard, trump){
    const trumpCards = cards.filter(card => card.suit == trump);
    const highestTrump = trumpCards.sort((a,b)=> a.rank-b.rank)[trumpCards.length-1]
    if(highestTrump){
        return highestTrump
    } 
    const suitFollowers = cards.filter(card => card.suit == firstCard.suit)
    const highestSuit = suitFollowers.sort((a,b)=> a.rank-b.rank)[suitFollowers.length-1]
    return highestSuit

}