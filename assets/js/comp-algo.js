function selectBestCard(player, trick){
    if(trick.turnCount==1){   
        let card = leadHandIsDeck(player, trick);        
        if(card){            
            return card;
        } 
        card = leadHonours(player, trick);
        if(card){
            return card;
        }
        card = leadSingleton(player, trick);
        if(card){
            return card;
        } 
        card = leadLowestCard(player, trick);
        return card;

    } else if (trick.turnCount==2){
        let card = turn2FollowHigher(player, trick)
        if(card){
            return card;
        }

        card = turn2Ruff(player, trick)
        if(card){
            return card;
        }
    } else {
        let card = turn34FollowWinning(player, trick)
        if(card){
            return card;
        }
        card = turn34FollowLosing(player, trick);
        if(card){
            return card;
        }
        card = turn34Ruff(player, trick);
        if(card){
            return card;
        }
    }
}

function leadHandIsDeck(player, trick){
    const handSuitValues = player.evaluateHand();
    const deckSuitValues = trick.round.evaluateDeck();
    const strongSuit = findStrongSuit(handSuitValues, deckSuitValues)
    if(strongSuit){
        const cardOptions = player.hand.filter(card => card.suit==strongSuit && card.rank>10);  
        return cardOptions.sort((a,b) => a.rank - b.rank )[0]   
    }
    return false;
}

function leadHonours(player, trick){
    const handSuitValues = player.evaluateHand();
    for(let i=0; i<4; i++){
        if(handSuitValues[i]==36 || handSuitValues[i]==25 || handSuitValues[i]==24 || handSuitValues[i]==13){
            const ace = player.hand.filter(card => card.suit==i+1 && card.rank==13);
            return ace[0]
        }
    }
    const deckSuitValues = trick.round.evaluateDeck();
    for(let j=0; j<4; j++){
        if(deckSuitValues[j]==23||deckSuitValues[j]==12){
            let king = player.hand.filter(card => card.suit==j+1 && card.rank==12)
            if(king.length>0){
                return king[0]
            }
        }    
    }
    for(let k=0; k<4; k++){
        if(deckSuitValues[k]==11){
            let queen = player.hand.filter(card => card.suit==k+1 && card.rank==11)
            if(queen.length>0){
                return queen[0]
            }
        }    
    }
    return false;   
}

function leadSingleton(player, trick){
    const suitLengths = player.findSuitLengths();
    for(let i=0; i<4; i++){
        if(suitLengths[i]==1){
            const cardOption = player.hand.filter(card => card.suit==i+1 && card.rank<11)
            if(cardOption.length>0&&cardOption[0].suit!=trick.round.trump){
                return cardOption[0];
            }
        }
    }
    return false;
}

function leadLowestCard(player, trick){
    if(trick.round.trickCount==1){
        const suitLengths = player.findSuitLengths();
        const max = Math.max(...suitLengths);
        const index = suitLengths.indexOf(max);
        const longSuit = player.hand.filter(card => card.suit == index+1)
        return longSuit.sort((a,b) => a.rank - b.rank )[longSuit.length-4]
    }
    return player.hand.sort((a,b)=> a.rank - b.rank)[0]
}

function turn2FollowHigher(player, trick){
    const suitCards = player.findSuitCards(trick.firstCard)   
    if(trick.turnCount==2&&suitCards.length>0){
        suitCards.sort((a,b) => a.rank - b.rank)
        if(suitCards[suitCards.length-1].rank > trick.firstCard.rank){
            const suitValue = player.findSuitValue(trick.firstCard.suit);
            const deckSuitValue = trick.round.findDeckSuitValue(trick.firstCard.suit);
            if(suitValue==deckSuitValue&&suitValue!=0){
                const highCard = player.hand.filter( card => card.suit==trick.firstCard.suit && card.rank>10)
                return highCard.sort((a,b) => a.rank - b.rank)[highCard.length-1];
            } else {
                const suitCardNoHonour = player.hand.filter( card => card.suit==trick.firstCard.suit && card.rank<11)
                if(suitCardNoHonour.length>0){
                    return suitCardNoHonour[0]
                } 
                return suitCards.sort((a,b) => a.rank - b.rank )[suitCards.length-1];
        }
        } else {
            return suitCards.sort((a,b) => a.rank - b.rank )[0];
        }
    } 
    return false;
}

function turn2Ruff(player, trick){
    const suitCards = player.findSuitCards(trick.firstCard)
    if(trick.turnCount==2&&suitCards.length==0){
        const trumpCards = player.findTrumpCards(trick.round.trump);
        if(trumpCards.length>0){
            return trumpCards[0];
        } else {            
            const suitLengths = player.findSuitLengths();
            if(suitLengths.includes(1)){
                for(let i=0; i<4; i++){
                    if(suitLengths[i]==1){                    
                        const cardOption = player.hand.filter(card => card.suit==i+1 && card.rank<11)
                        if(cardOption.length>0&&cardOption[0].suit!=trick.round.trump){
                            return cardOption[0];
                        }
                    }
                }
            }  
            const min = Math.min(...suitLengths);
            const index = suitLengths.indexOf(min);
            const safeCard = player.hand.filter(card => card.suit==index+1 && card.rank < 11)
            if(safeCard.length>0){
                return safeCard[0]
            }
            return player.hand.sort((a,b) => a.rank - b.rank)[0]        
        }        
    }
}

function turn34FollowWinning(player, trick){
    const suitCards = player.findSuitCards(trick.firstCard);
    if(suitCards.length>0){  
        if(trick.areWeWinning(player)){
            return suitCards.sort((a,b) => a.rank - b.rank)[0];
        }       
    }
    return false;
}

function turn34FollowLosing(player, trick){
    const suitCards = player.findSuitCards(trick.firstCard); 
    if(suitCards.length>0){
        const highestSuitCard = suitCards.sort((a,b) => a.rank - b.rank)[suitCards.length-1];
        const bestCurrentTrickCard = trick.findBestCard();
        if(highestSuitCard.rank>bestCurrentTrickCard.rank&&highestSuitCard.suit==bestCurrentTrickCard.suit){
            if(trick.turnCount==3){
                const suitValue = player.findSuitValue(trick.firstCard.suit);
                const deckSuitValue = trick.round.findDeckSuitValue(trick.firstCard.suit);
                if(suitValue>=24||suitValue==13){
                    return highestSuitCard;
                } else if (deckSuitValue==23||deckSuitValue==12){
                    let king = suitCards.filter(card => card.rank==12)
                    if(king.length>0){
                            return king[0]
                    } 
                } else if (deckSuitValue==11){
                    let queen = suitCards.filter(card => card.rank==11)
                    if(queen.length>0){
                        return queen[0]
                    }
                } else {
                    const safeCard = suitCards.filter(card => card.rank < 11)
                    if(safeCard.length>0){
                        safeCard.sort((a,b) => a.rank - b.rank )
                        return safeCard[safeCard.length-1]
                    }
                }
            } else {
                return suitCards.sort((a,b) => a.rank - b.rank )[suitCards.length-1]
            }             
        } else {
            const suitCardNoHonour = player.hand.filter( card => card.suit==trick.firstCard.suit && card.rank<11)
            if(suitCardNoHonour.length>0){
                return suitCardNoHonour[0]
            }
            return suitCards.sort((a,b) => a.rank - b.rank )[suitCards.length-1];
        }
    }
    return false;  
}

function turn34Ruff(player, trick){
    const trumpCards = player.findTrumpCards(trick.round.trump);
        if(!trick.areWeWinning(player)&&trumpCards.length>0){
            return trumpCards[0];
        } else {         
            const suitLengths = player.findSuitLengths();
            for(let i=0; i<4; i++){
                if(suitLengths[i]==1){
                    const cardOption = player.hand.filter(card => card.suit==i+1 && card.rank<11)
                    if(cardOption.length>0&&cardOption[0].suit!=trick.round.trump){
                        return cardOption[0];
                    }
                }
            }
            const min = Math.min(...suitLengths);
            const index = suitLengths.indexOf(min);
            const safeCard = player.hand.filter(card => card.suit==index+1 && card.rank < 11)
            if(safeCard.length>0){
                return safeCard[0]
            }
            const handWithoutTrump = player.handWithoutTrump(trick.round.trump)
            if(handWithoutTrump.length>0){
                return handWithoutTrump[0]
            }
            return player.hand.sort((a,b) => a.rank - b.rank)[0]        
        }        
}


function findStrongSuit(handValues, deckValues){
    for(let i=0;i<4;i++){
        if(handValues[i]==deckValues[i]&&handValues[i]!=0){
            return i+1
        }
    }
    return false;
}

function removeCard(arr, card) {     
    return arr.filter(function(elem){ 
        return elem.img != card.src.slice(-26); 
    });
}

function findCard(arr, card) {     
    return arr.filter(function(elem){ 
        return elem.img == card.src.slice(-26); 
    });
}

function removeCardComputerHand(hand, card){
    return hand.filter(function(elem){ 
        return elem.id != card.id;
    });
}

export { selectBestCard, removeCard, findCard, removeCardComputerHand }