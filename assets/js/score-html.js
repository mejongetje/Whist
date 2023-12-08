export function getScoreHTML(scores, totals){
    let rubberScore = JSON.parse(localStorage.getItem('whist-rubber'));
    if(rubberScore==null){
        rubberScore = { 'you': 0, 'opponents': 0};
    }  
    $('.scoreboard').html(`<div class="cross">
        <span class="close">X</span>
    </div>
    <div class="score-container">
        <div class="score-title">SCORE SHEET</div><br>
        <div class="rubber-title">MATCH (Best of 3)</div>
        <div class="rubber-container">
            <div class="rubber-you">YOU&PARTNER</div>
            <div class="rubber-opponents">OPPONENTS</div>
            <div class="rubber-you-score">${rubberScore['you']}</div>
            <div class="rubber-opponents-score">${rubberScore['opponents']}</div>
        </div>
        <br>
        <div class="game-title">GAME <br><span class="game-small">(first to reach 5 points or more)</span></div>
        <div class="game-container">
            <div class="round-top">round</div>
            <div class="game-you">YOU&PARTNER</div>
            <div class="game-opponents">OPPONENTS</div>
            <div class="round1">1</div>
            <div class="round1-you">${scores[0][0]}</div>
            <div class="round1-opponents">${scores[1][0]}</div>
            <div class="round2">2</div>
            <div class="round2-you">${scores[0][1]}</div>
            <div class="round2-opponents">${scores[1][1]}</div>
            <div class="round3">3</div>
            <div class="round3-you">${scores[0][2]}</div>
            <div class="round3-opponents">${scores[1][2]}</div>
            <div class="round4">4</div>
            <div class="round4-you">${scores[0][3]}</div>
            <div class="round4-opponents">${scores[1][3]}</div>
            <div class="round5">5</div>
            <div class="round5-you">${scores[0][4]}</div>
            <div class="round5-opponents">${scores[1][4]}</div>
            <div class="round6">6</div>
            <div class="round6-you">${scores[0][5]}</div>
            <div class="round6-opponents">${scores[1][5]}</div>
            <div class="round7">7</div>
            <div class="round7-you">${scores[0][6]}</div>
            <div class="round7-opponents">${scores[1][6]}</div>
            <div class="round8">8</div>
            <div class="round8-you">${scores[0][7]}</div>
            <div class="round8-opponents">${scores[1][7]}</div>
            <div class="round9">9</div>
            <div class="round9-you">${scores[0][8]}</div>
            <div class="round9-opponents">${scores[1][8]}</div>
            <div class="round-total">Total</div>
            <div class="round-total-you">${totals[0]}</div>
            <div class="round-total-opponents">${totals[1]}</div>
        </div>

    </div>`)

}