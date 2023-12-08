export class Player {
    constructor(name, human, top='0px', left='0px'){
        this.name = name;
        this.human = human;
        this.top = top;
        this.left = left;
        this.hand = [];
        this.dealer = false;
        this.trickCard = null;
        this.tricksWon = 0;
    }

    evaluateHand(){
        const suitValues = [ 0,0,0,0 ];
        this.hand.forEach(card => {
            for(let i=0; i<4;i++){
                if(card.suit==i+1){
                    if(card.rank>10){
                        suitValues[i] += card.rank;
                    } 
                } 
            }
        });
        return suitValues;
    }

    findSuitLengths(){
        const suitLengths = [ 0,0,0,0 ];
        this.hand.forEach(card => {
            for(let i=0; i<4; i++){
                if(card.suit==i+1){
                    suitLengths[i]++;
                }
            }
        })
        return suitLengths;
    }

    findSuitCards(firstCard){
        const suitCards = this.hand.filter(card => card.suit == firstCard.suit)
        return suitCards
    }
    
    findSuitValue(suit){
        let suitValue = 0;
        this.hand.forEach(card => {
            if(card.suit==suit&&card.rank>10){
                suitValue += card.rank;
            }
        })
        return suitValue;
    }

    findTrumpCards(suit){
        const trumpCards = this.hand.filter(card => card.suit == suit);
        trumpCards.sort((a,b) => a.rank - b.rank)
        return trumpCards
    }

    playableImages(trick){
        const cards = playableCards(this, trick);
        const playableImages = [];
        cards.forEach(card => {
            playableImages.push(card.img)
        })
        return playableImages;
    }

    notPlayableImages(playableImages){
        const notPlayableImages = [];
        this.hand.forEach(card => {
            if(!playableImages.includes(card.img)){
                notPlayableImages.push(card.img)
            }
        })
        return notPlayableImages;
    }

    handWithoutTrump(trump){
        const trumpLess = this.hand.filter(card => card.suit != trump);
        return trumpLess.sort((a,b) => a.rank - b.rank)
    }
}

function playableCards(player, trick){
    if(trick.turnCount==1){
        return player.hand
    } else {
        const playableCards = player.findSuitCards(trick.firstCard)
        if(playableCards.length>0){
            return playableCards
        } else {
            return player.hand
        }
    }
    
}