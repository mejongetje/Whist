import { selectBestCard, removeCard, findCard, removeCardComputerHand } from "./comp-algo";

export class Turn {
    constructor(player, trick){
        this.player = player;
        this.trick = trick;
    }

    playCard(){
        if(this.player.human){
            playerTurn(this.player, this.trick);
        } else {
            computerTurn(this.player, this.trick);
        }
    }
}

function playerTurn(player, trick){
    setTimeout(() => { 
        $(`.message-board`).css('display', 'inline-block').text('It is your turn.');
        addPlayableStatusToCards(player, trick);
        $('.not-playable-card').on('click', () => {
            displayUnplayableMessage()
        })
        $('.playable-card').on('click', e => {
            $(`.message-board`).css('display', 'none')
            player.trickCard = findCard(player.hand, e.target)[0];
            trick.trickCardsPlayed.push(player.trickCard);
            if(trick.turnCount==1){ trick.firstCard = player.trickCard }
            player.hand = removeCard(player.hand, e.target);          
            const droppedCardSrc = e.target.src; 
            animatePlayerCard(e, droppedCardSrc, trick);
            $('.player').children().off('click');
            setTimeout(() => { 
                sortPlayerCards(player, trick.round.trickCount);   
                trick.findNextPlayer();  
            }, 1500);
        }) 
    }, 600);
}

function addPlayableStatusToCards(player, trick){
    const playableCards = player.playableImages(trick);
    const notPlayableCards = player.notPlayableImages(playableCards);
    const children = $('.player').children();
    for(let i = 0; i<children.length;i++){
        if(playableCards.includes(children[i].src.slice(-26))){
            $(children[i]).addClass('playable-card')
        }
    }
    for(let i = 0; i<children.length;i++){
        if(notPlayableCards.includes(children[i].src.slice(-26))){
            $(children[i]).addClass('not-playable-card')
        }
    }
}

function displayUnplayableMessage(){
    $(`.message-board`).css('display', 'inline-block').text('You have to follow suit. Play another card...');
}

function animatePlayerCard(e, droppedCard, trick){
    $(`.${e.currentTarget.className.slice(0,13)}`).animate({opacity: 0.25, left: '220px', top: '-158px'}, 400, function(){
        e.target.remove();
        $('.dropzone').append(`<img src="${droppedCard}" class="player-dropped-card">`);
        $(`.player-dropped-card`).css('zIndex', `${trick.turnCount}`);
    }); 
}

function sortPlayerCards(player, trick){
    player.hand.sort((a,b) => a.id - b.id);
    $(`.player`).empty();
    let left = trick*15;
    let z = 1;                
    player.hand.forEach( card => { 
        $('.player').append(`<img src="${card.img}" class="player-card${z}">`);
        $(`.player-card${z}`).css({
            'left': left,
            'top': '2px',
            'zIndex': z,
            'position': 'absolute'
        });
        left += 25;
        z++;
    })         
}


function computerTurn(player, trick){
    let card = selectBestCard(player, trick)
    if(trick.turnCount==1){ trick.firstCard = card; }      
    trick.trickCardsPlayed.push(card);
    player.trickCard = card;
    animateCompCard(player, card, trick);
    setTimeout(() => {
        player.hand = removeCardComputerHand(player.hand, card);  
        $(`.${player.name}`).empty();
        if(player.name=='partner'){
            sortOpponnentNorthHand(player, trick.round.trickCount);
        } else {
            sortOpponentEastWestHand(player, trick.round.trickCount);
        }

    }, 600);
    setTimeout(() => {
        trick.findNextPlayer();
    }, 1500); 
}

function animateCompCard(player, card, trick){
    const cards = $(`.${player.name}`).children();
    cards.each(function() {
        if(card.imgBack == this.src.slice(-30)||card.img == this.src.slice(-26)){           
            $(`.${this.className}`).animate({opacity: 0.25, width: 'toggle', left: player.left, top: player.top}, 400, function(){
                    this.remove();
                    $(`.dropzone`).append(`<img src="${card.img}" class="${player.name}-dropped-card">`);
                    $(`.${player.name}-dropped-card`).css(
                        'zIndex', `${trick.turnCount}`
                    );           
            })
        }
    })
}


function sortOpponentEastWestHand(player, trick){
    let top = 64+trick*8;
    let z = 1;
    player.hand.forEach( card => {
        $(`.${player.name}`).append(`<img src="${card.imgBack}" class="${player.name}${z}">`);
        $(`.${player.name}${z}`).css({
            'zIndex': z, 
            'position': 'absolute'          
        });
        if(player.name=='opponent1'){
            $(`.${player.name}${z}`).css({
                'top': top,
                'transform': 'rotate(-90deg)',
                'transformOrigin': '0 0'
            });
        } else {
            $(`.${player.name}${z}`).css({
                'top': top-73,
                'left': '10px',
                'transform': 'rotate(90deg)',
                'transformOrigin': '1 1'
            });
        }
        top+=17;
        z++;
    });
}

function sortOpponnentNorthHand(player, trick){
    let left = trick*8;
    let z = 1;
    player.hand.forEach( card => {
        $(`.${player.name}`).append(`<img src="${card.imgBack}" class="${player.name}${z}">`);
        $(`.${player.name}${z}`).css({
            'left': left,
            'top': '2px',
            'zIndex': z,
            'position': 'absolute'
        });
        left+=17;
        z++;
    });
}
