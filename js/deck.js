import { Card } from "./card.js"

export class Deck {
    constructor(){
        this.deck = [];
        let id = 0
        for(let suit=1; suit < 5; suit++){
            id += 1
            for(let rank=1; rank < 14; rank++){
                let x = new Card(suit, rank, id)
                this.deck.push(x)
                id += 1
            }
        }
    }  
}

