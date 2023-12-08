import { Deck }  from './deck'

export class Dealer {
    constructor(dealerPosition){
        this.deck = new Deck();
        this.playDeck = JSON.parse(JSON.stringify(this.deck.deck));
        this.dealerPosition = dealerPosition;
        this.hands = [];
        this.trump = null;
    }

    shuffleDeck(){
        //Method shuffles an array of cards according to the Fisher-Yates shuffle algorithm 
        for (let i = this.playDeck.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1)); 
            [this.playDeck[i], this.playDeck[j]] = [this.playDeck[j], this.playDeck[i]];
            };
    }
    
    dealCards(){
        dealCardsBTS(this.playDeck, this.hands);    
        let leftSide = 18; 
        let topSide = 64;
        let z = 0;       
        const Timer = setInterval(() => {    
            let i = Math.trunc(z/4);           
            if(z==52){
                clearInterval(Timer);
            }
            else if(z==i*4+1){
                if(this.dealerPosition==0){
                    dealCardWest(this.hands[1][i], topSide, z);
                } else if(this.dealerPosition==1){
                    dealCardNorth(this.hands[2][i], leftSide-20, z);
                    leftSide += 17;
                } else if(this.dealerPosition==2){
                    dealCardEast(this.hands[3][i], topSide, z);
                } else {
                    dealCardSouth(this.hands[0][i], leftSide+40, z);
                }
            } else if (z==i*4+2){   
                if(this.dealerPosition==0) {  
                    dealCardNorth(this.hands[2][i], leftSide-20, z);
                    leftSide += 17;
                } else if (this.dealerPosition==1){
                    dealCardEast(this.hands[3][i], topSide, z);
                    topSide += 17;
                }else if (this.dealerPosition==2){
                    dealCardSouth(this.hands[0][i], leftSide+40, z);
                } else {
                    dealCardWest(this.hands[1][i], topSide, z);
                    topSide += 17;
                }
            } else if (z==i*4+3){
                if(this.dealerPosition==0){
                    dealCardEast(this.hands[3][i], topSide, z);
                    topSide += 17;
                } else if(this.dealerPosition==1){
                    dealCardSouth(this.hands[0][i], leftSide+40, z);
                } else if (this.dealerPosition==2) {
                    dealCardWest(this.hands[1][i], topSide, z);
                    topSide += 17;
                } else {
                    dealCardNorth(this.hands[2][i], leftSide-20, z);
                    leftSide += 17;
                }            
            } else if (z==i*4) {
                if(this.dealerPosition==0){
                    dealCardSouth(this.hands[0][i], leftSide+40, z);
                } else if(this.dealerPosition==1){
                    dealCardWest(this.hands[1][i], topSide, z);
                } else if(this.dealerPosition==2){
                    dealCardNorth(this.hands[2][i], leftSide-20, z);
                    leftSide += 17;
                } else {
                    dealCardEast(this.hands[3][i], topSide, z);
                }
            }
            if(z==51){
                this.trump = this.hands[this.dealerPosition][i].suit;
            }
            z++;
        }, 80);
        setTimeout(()=>{ 
            sortHand(this.hands[0]);
            sortHandDOM(this.hands[0]);
        }, 5000);      
    }
}


function dealCardsBTS(deck, hands){
    for(let i=0; i<4; i++){
        let hand = [];
        for(let j=0; j<13; j++){
            hand.push(deck[j*4+i]);
        }
        hands.push(hand);
    }
}

function dealCardEast(card, top, z){
    const c = z==48?card.img:card.imgBack
    $('.opponent2').append(`<img src="${c}" class="turned-card${z}">`);
        $(`.turned-card${z}`).css({
            'top': top,
            'zIndex': z,
            'position': 'absolute',
            'transform': 'rotate(-90deg)',
            'transformOrigin': '0 0'
        });
}

function dealCardWest(card, top, z){
    const c = z==48?card.img:card.imgBack
    $('.opponent1').append(`<img src="${c}" class="turned-card${z}">`);
        $(`.turned-card${z}`).css({
            'top': top-73,
            'left': '10px',
            'zIndex': z,
            'position': 'absolute',
            'transform': 'rotate(90deg)',
            'transformOrigin': '1 1'
        });
}


function dealCardNorth(card, left, z){
    const c = z==48?card.img:card.imgBack
    $('.partner').append(`<img src="${c}" class="regular-card${z}">`);
        $(`.regular-card${z}`).css({
            'left': left,
            'top': '2px',
            'zIndex': z,
            'position': 'absolute'
        });
}

function dealCardSouth(card, left, z){
    $('.player').append(`<img src="${card.img}" class="regular-card${z}">`);
        $(`.regular-card${z}`).css({
            'left': left-50,
            'top': '2px',
            'zIndex': z,
            'position': 'absolute'
        });
}

function sortHand(hand){
    hand.sort((a,b) => a.id - b.id);
}

function sortHandDOM(hand){
    $('.player').empty();
    let left = 0;
    let z = 1
    const Timer = setInterval(() => { 
        if(z==14){
            clearInterval(Timer); 
        } else {
        $('.player').append(`<img src="${hand[z-1].img}" class="player-card${z}">`);
        $(`.player-card${z}`).css({
            'left': left,
            'top': '2px',
            'zIndex': z,
            'position': 'absolute'
        });
        left += 25;
        z++;
        }
    }, 50)
}