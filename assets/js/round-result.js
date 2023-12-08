import { getScoreHTML } from "./score-html";

export class RoundResult {
    constructor(players){
        this.players = players;
        this.team1RoundScore = 0;
        this.team2RoundScore = 0;
    }

    showStandings(winner){
        const scores = getScores();
        const totalScores = getTotalScores(scores);   
        if(totalScores[0]>=5 || totalScores[1]>=5){
            this.updateRubber(totalScores)
        }
        $('.scoreboard').css('display', 'inline-block');
        getScoreHTML(scores, totalScores);
        $('.cross').css('display', 'none')
        showRoundWinner(winner)
        if(totalScores[0]>=5 || totalScores[1]>=5){
            $('.new-round').css('display', 'none')
            showGameWinner(winner);
            let rubber = JSON.parse(localStorage.getItem('whist-rubber'));
            if(rubber['you'] >=2 || rubber['opponents']>=2){
                $('.new-game').css('display', 'none')
                showMatchWinner(winner);
            }
        }    
    }

    updateScores(){
        const winner = this.calculateResults()
        let round = JSON.parse(localStorage.getItem('round-whist'));
        round++
        localStorage.setItem('round-whist', JSON.stringify(round));
        let gameScore = JSON.parse(localStorage.getItem('gamescore-whist'));
        if(gameScore==null){
            gameScore = {}
        }
        const roundNumber = 'round' + round
        const roundResult = { [roundNumber]: { 'you': this.team1RoundScore, 'opponents': this.team2RoundScore } }
        Object.assign(gameScore, roundResult);
        localStorage.setItem(`gamescore-whist`, JSON.stringify(gameScore));
        return winner;
    }

    calculateResults(){
        const team1Score = this.players[0].tricksWon + this.players[2].tricksWon;
        const team2Score = this.players[1].tricksWon + this.players[3].tricksWon;
        if(team1Score>team2Score){
            this.team1RoundScore = team1Score - 6;
            return 'you'
        } else {
            this.team2RoundScore = team2Score - 6;
            return 'opponents'
        }
    }

    updateRubber(totals){
        let rubber = JSON.parse(localStorage.getItem('whist-rubber'));
        if(rubber==null){
            rubber = { 'you': 0, 'opponents': 0 };
        }
        let team1Rubber = rubber['you'];
        let team2Rubber = rubber['opponents'];
        if(totals[0]>totals[1]){
            team1Rubber++;
        } else {
            team2Rubber++;
        }
        rubber = { 'you': team1Rubber, 'opponents': team2Rubber }
        localStorage.setItem('whist-rubber', JSON.stringify(rubber));
    }
}

function getScores(){
    const score = JSON.parse(localStorage.getItem('gamescore-whist'))
    let team1Score = [0,0,0,0,0,0,0,0,0];
    let team2Score = [0,0,0,0,0,0,0,0,0];
    let i = 0;
    for(let key in score){
        team1Score[i] = score[key]['you'];
        team2Score[i] = score[key]['opponents'];
        i++;
    }  
    return [team1Score, team2Score];
}

function getTotalScores(scores){
    const team1TotalScore  = scores[0].reduce((acc, value) => {
        return acc + value;
      }, 0);
    const team2TotalScore = scores[1].reduce((acc, value) => {
        return acc + value;
      }, 0);
      return [ team1TotalScore, team2TotalScore ];
}

function showRoundWinner(winner){
    const winners = winner=='you'?'YOU and PARTNER':'OPPONENTS';
    $('.scoreboard').append(`<div class="round-winner">${winners} won the Round</div>
    <div class="new-round">Play another round</div)`)
    $('.new-round').on('click', () => {
        document.location.reload(true);
    });

}

function showGameWinner(winner){
    const winners = winner=='you'?'YOU and PARTNER':'OPPONENTS';
    $('.scoreboard').append(`<div class="round-winner">${winners} won the Game</div> 
    <div class="new-game">Play another game</div>`)
    $('.new-game').on('click', () => {
        const gameScore = {};
        localStorage.setItem(`gamescore-whist`, JSON.stringify(gameScore));
        document.location.reload(true);
    })
}

function showMatchWinner(winner){
    const winners = winner=='you'?'YOU and PARTNER':'OPPONENTS'  
    $('.scoreboard').append(`<div class="match-winner">${winners} won the Match</div>
        <div class="new-match">Play another match</div)`)
    $('.new-match').on('click', () => {
        localStorage.clear();
        document.location.reload(true);
    })
}

function showStandings(){
    const scores = getScores();
    const totals = getTotalScores(scores)
    $('.scoreboard').css('display', 'inline-block');
    getScoreHTML(scores, totals);
    $('.cross').on('click', () => {
        $('.scoreboard').css('display', 'none');
    });
}

export { showStandings, getScores }