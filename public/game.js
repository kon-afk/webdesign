const ref_game = firebase.database().ref('Game-data');
const ref_userdata = firebase.database().ref('UserData');
const btnJoins = document.querySelectorAll('.btn-join');
btnJoins.forEach(btnJoin => btnJoin.addEventListener('click', joinGame));
var currentPlayer;
var user_email;
var user_uid;
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');

console.log(ref_game);

function setupUI(user) {
    if (user) {
        ref_userdata.once('value' , snapshot => {
            if(snapshot.child(user.uid).exists()){
                document.querySelector('#user-profile-name').innerHTML = user.displayName + " " + user.email+" ("+ snapshot.child(user.uid).val() +")";
            }else{
                ref_userdata.update({
                    [user.uid]:0,
                });
                document.querySelector('#user-profile-name').innerHTML = user.email+" (0)";
            }
            user_uid = user.uid;
        });
        ref_game.once('value' , snapshot => {
            if(snapshot.child('game-1').child('x-slot').val() != 'Empty' && snapshot.child('game-1').child("user-x-email") != user.email){
                document.getElementById('btnJoin-x').disabled = true;
                document.getElementById('btnCancel-x').disabled = true;
            }else if(snapshot.child('game-1').child('x-slot').val() == 'Empty' && snapshot.child('game-1').child("user-o-email") != user.email){
                document.getElementById('btnJoin-x').disabled = false;
                document.getElementById('btnCancel-x').disabled = true;
            }
            if(snapshot.child('game-1').child('o-slot').val() != 'Empty' && snapshot.child('game-1').child("user-o-email") != user.email){
                document.getElementById('btnJoin-o').disabled = true;
                document.getElementById('btnCancel-o').disabled = true;
            }else if(snapshot.child('game-1').child('o-slot').val() == 'Empty' && snapshot.child('game-1').child("user-x-email") != user.email){
                document.getElementById('btnJoin-o').disabled = false;
                document.getElementById('btnCancel-o').disabled = true;
            }
        });
        user_email = user.email;
        loginItems.forEach(item => item.style.display = 'inline-block');
        logoutItems.forEach(item => item.style.display = 'none');
    } else {
        document.querySelector('#user-profile-name').innerHTML = '';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'inline-block');
    }
}

function joinGame(event) {
    const currentUser = firebase.auth().currentUser;
    console.log('[Join] Current user:', currentUser);
    if (currentUser) {
        const btnJoinID = event.currentTarget.getAttribute('id');
        const player = btnJoinID[btnJoinID.length - 1];
        currentPlayer = player;
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value == '') {
            //add player into database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            let tmpStatus = `user-${player}-status`;
            ref_game.child('game-1').update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
                [tmpStatus]: 'Ready',
            });
            console.log(currentUser.email + ' added. ');
            event.currentTarget.disabled = true;
        }
        ref_game.child('game-1').update({
            [`${currentPlayer}-slot`]: user_email,
        });
    }

}

ref_game.on('value', snapshot => {
    let status_x = snapshot.child('game-1').child("user-x-status");
    let status_o = snapshot.child('game-1').child("user-o-status");

    if(!snapshot.child('game-1').child('GameStatus').exists()){
        if(status_x.val() == "Ready" && status_o.val() == "Ready"){
            btnStartGame.disabled = false;
            document.getElementById('GameStatus-text').innerHTML = 'Click START GAME';
        }
        else{
            btnStartGame.disabled = true;
            document.getElementById('GameStatus-text').innerHTML = 'Waiting for player...';
        }

        if(snapshot.child('game-1').child('x-slot').val() == 'Empty' && snapshot.child('game-1').child('o-slot').val() != user_email){
            document.querySelector('#btnJoin-x').disabled = false;
            document.querySelector('#btnCancel-x').disabled = true;
        }else if(snapshot.child('game-1').child('x-slot').val() != 'Empty' && snapshot.child('game-1').child('x-slot').val() != user_email){
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
        }else if(snapshot.child('game-1').child('x-slot').val() == user_email){
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = false;
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = true;
        }

        if(snapshot.child('game-1').child('o-slot').val() == 'Empty' && snapshot.child('game-1').child('x-slot').val() != user_email){
            document.querySelector('#btnJoin-o').disabled = false;
            document.querySelector('#btnCancel-o').disabled = true;
        }else if(snapshot.child('game-1').child('o-slot').val() != 'Empty' && snapshot.child('game-1').child('o-slot').val() != user_email){
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = true;
        }else if(snapshot.child('game-1').child('o-slot').val() == user_email){
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = false;
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
        }
        
        btnEndGame.disabled = true;
        tableCols.forEach(col => {
            col.disabled = true;
            col.innerHTML = `<p class="display-4"></p>`;
        });
    }
    
    if(snapshot.child('game-1').child('table').exists()){
        tableCols.forEach(col => {
            let col_val = snapshot.child('game-1').child('table').child(col.id).val();
            col.innerHTML = `<button type="button" class="display-4 btn btn-white w-100" style="height: 4rem;"> ${col_val} </button>`;
        });
    }

    if(!snapshot.child('game-1').child('o-slot').exists()){
        ref_game.child('game-1').update({
            ['o-slot']: 'Empty',
        });
    }

    if(!snapshot.child('game-1').child('x-slot').exists()){
        ref_game.child('game-1').update({
            ['x-slot']: 'Empty',
        });
    }
    getGameInfo(snapshot);
});

function getGameInfo(snapshot) {
    document.getElementById('inputPlayer-x').value = '';
    document.getElementById('inputPlayer-o').value = '';

    snapshot.forEach((data) => {
        const gameInfos = data.val();
        Object.keys(gameInfos).forEach(key => {
            switch (key) {
                case 'user-x-email':
                    playerX = gameInfos[key];
                    document.getElementById('inputPlayer-x').value = gameInfos[key];
                    document.querySelector('#btnJoin-x').disabled = true;
                    break;
                case 'user-o-email':
                    playerO = gameInfos[key];
                    document.getElementById('inputPlayer-o').value = gameInfos[key];
                    document.querySelector('#btnJoin-o').disabled = true;
                    break;
            }
        })
    });

    var gameStatus_exists = snapshot.child('game-1').child('GameStatus').exists();
    if(gameStatus_exists){
        var gameStatus = snapshot.child('game-1').child('GameStatus').val();
        if(gameStatus == 'Playing'){
            btnCancels.forEach(btnCancel => btnCancel.disabled = true);
            
            var turn = snapshot.child('game-1').child('Turn').val();
            if(turn == "X"){
                let L_turn = turn.toLowerCase();
                let L_currentPlayer = currentPlayer.toLowerCase();
                document.getElementById('GameStatus-text').innerHTML = 'Turn: X';
                if(L_currentPlayer == L_turn){
                    tableCols.forEach(col => {
                        col.disabled = false;
                        col.addEventListener('click', add_X_toCol);
                    });
                }
                else{
                    tableCols.forEach(col => {
                        col.disabled = true;
                        col.removeEventListener('click', add_X_toCol);
                        col.removeEventListener('click', add_O_toCol);
                    });
                }
                
            }else{
                let L_turn = turn.toLowerCase();
                let L_currentPlayer = currentPlayer.toLowerCase();
                document.getElementById('GameStatus-text').innerHTML = 'Turn: O';
                if(L_currentPlayer == L_turn){
                    tableCols.forEach(col => {
                        col.disabled = false;
                        col.addEventListener('click', add_O_toCol);
                    });
                }
                else{
                    tableCols.forEach(col => {
                        col.disabled = true;
                        col.removeEventListener('click', add_X_toCol);
                        col.removeEventListener('click', add_O_toCol);
                    });
                }
            }
        }else if(gameStatus == 'Finish'){
            tableCols.forEach(col => {
                col.disabled = true;
                col.removeEventListener('click', add_X_toCol);
                col.removeEventListener('click', add_O_toCol);
            });
            if(snapshot.child('game-1').child('GameResult').val() == 'X'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: X";
                if(snapshot.child('game-1').child('x-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_x = userData.child(user_uid).val() + 3;
                        ref_userdata.update({
                            [user_uid]: user_score_x,
                        });
                        document.querySelector('#user-profile-name').innerHTML = user_email +" ("+ user_score_x +")";
                    });
                }
            }
            else if(snapshot.child('game-1').child('GameResult').val() == 'O'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: O";
                if(snapshot.child('game-1').child('o-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_o = userData.child(user_uid).val() + 3;
                        console.log(user_score_o);
                        ref_userdata.update({
                            [user_uid]: user_score_o,
                        });
                        console.log(user_score_o);
                        document.querySelector('#user-profile-name').innerHTML = user_email +" ("+ user_score_o +")";
                    });
                }
            }
            else if(snapshot.child('game-1').child('GameResult').val() == 'draw'){
                document.getElementById('GameStatus-text').innerHTML = "GAME DRAW";
                ref_userdata.once('value', userData => {
                    var user_score_draw = userData.child(user_uid).val() + 1;
                    console.log(user_score_draw);
                    ref_userdata.update({
                        [user_uid]: user_score_draw,
                    });
                    console.log(user_score_draw);
                    document.querySelector('#user-profile-name').innerHTML = user_email +" ("+ user_score_draw +")";
                });
            }
            btnEndGame.disabled = false;
            btnStartGame.disabled = true;
        }
    }
}

const btnCancels = document.querySelectorAll('.btn-cancel-join-game');
btnCancels.forEach((btnCancel) => {
    btnCancel.addEventListener('click', cancelJoin);
});

function cancelJoin(event) {
    const currentUser = firebase.auth().currentUser;
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute('id');
        const player = btnCancelID[btnCancelID.length - 1];
        currentPlayer = player;
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.email) {
            //Delete player from database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            let tmpStatus = `user-${player}-status`;
            ref_game.child('game-1').child(tmpID).remove();
            ref_game.child('game-1').child(tmpEmail).remove();
            ref_game.child('game-1').child(tmpStatus).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
    }
    ref_game.child('game-1').update({
        [`${currentPlayer}-slot`]: 'Empty',
    });
}

const btnStartGame = document.getElementById('btnStartGame');
btnStartGame.addEventListener('click', StartGame);
const btnEndGame = document.getElementById('btnTerminateGame');
btnEndGame.addEventListener('click', EndGame);
const tableCols = document.querySelectorAll('.table-col');


function StartGame(event) {
    ref_game.child('game-1').update({
        ['GameStatus']: 'Playing',
        ['Turn']:"X",
    });
    tableCols.forEach((col => {
        ref_game.child('game-1').child('table').update({
            [col.id]:"",
        });
    }));
}


function EndGame(event) {
    ref_game.child('game-1').child('GameStatus').remove();
    ref_game.child('game-1').child('Turn').remove();
    ref_game.child('game-1').child('table').remove();
    ref_game.child('game-1').child('GameResult').remove();
}

function add_X_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child('game-1').once('value', snapshot => {
        col_val = snapshot.child('table').child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child('game-1').child('table').update({
            [event.currentTarget.id]:"X",
        });
        game_result = gameResult();
        if(game_result == 'X'){
            ref_game.child('game-1').update({
                ['GameResult']:"X",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child('game-1').update({
                ['Turn']:"O",
            });
        }else if (game_result == 'draw'){
            ref_game.child('game-1').update({
                ['GameResult']:"draw",
                ['GameStatus']: 'Finish',
            });
        }
    }    
}

function add_O_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child('game-1').child('table').once('value', snapshot => {
        col_val = snapshot.child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child('game-1').child('table').update({
            [event.currentTarget.id]:"O",
        });
        game_result = gameResult();
        if(game_result == 'O'){
            ref_game.child('game-1').update({
                ['GameResult']:"O",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child('game-1').update({
                ['Turn']:"X",
            });
        }else if (game_result == 'draw'){
            ref_game.child('game-1').update({
                ['GameResult']:"draw",
                ['GameStatus']: 'Finish',
            });
        }
    }
}

function gameResult(){
    var this_turn_symbol = '';
    var result = '';
    var col_val_empty = 0;
    ref_game.child('game-1').once('value', snapshot => {
        snapshot.child('table').forEach(col => {
            if(col.val() == ''){
                col_val_empty++;
            }
        });
        this_turn_symbol = snapshot.child('Turn').val();
        for (let i = 1; i < 11; i++) {
            for (let j = 1; j < 11; j++) {
                if(snapshot.child('table').child(`row-${i}-col-${j}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i}-col-${j+1}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i}-col-${j+2}`).val() == this_turn_symbol
                && snapshot.child('table').child(`row-${i}-col-${j+3}`).val() == this_turn_symbol){
                    result = this_turn_symbol;
                    return result;
                }
                else if(snapshot.child('table').child(`row-${i}-col-${j}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+1}-col-${j}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+2}-col-${j}`).val() == this_turn_symbol
                && snapshot.child('table').child(`row-${i+3}-col-${j}`).val() == this_turn_symbol){
                    result = this_turn_symbol;
                    return result;
                }
                else if(snapshot.child('table').child(`row-${i}-col-${j}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+1}-col-${j+1}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+2}-col-${j+2}`).val() == this_turn_symbol
                && snapshot.child('table').child(`row-${i+3}-col-${j+3}`).val() == this_turn_symbol){
                    result = this_turn_symbol;
                    return result;
                }
                else if(snapshot.child('table').child(`row-${i}-col-${j}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+1}-col-${j-1}`).val() == this_turn_symbol 
                && snapshot.child('table').child(`row-${i+2}-col-${j-2}`).val() == this_turn_symbol
                && snapshot.child('table').child(`row-${i+3}-col-${j-3}`).val() == this_turn_symbol){
                    result = this_turn_symbol;
                    return result;
                }
                else if(i== 10 && j == 10 && col_val_empty > 0){
                    result = 'no';
                    return result;
                }
            }
          }

    });
    return result;
}

const pageAccessedByReload = (
    (window.performance.navigation && window.performance.navigation.type === 1) ||
      window.performance
        .getEntriesByType('navigation')
        .map((nav) => nav.type)
        .includes('reload')
        
);
if(pageAccessedByReload){
    ref_game.child('game-1').remove();
    ref_game.child('game-1').update({[`o-slot`]:"Empty",});
    ref_game.child('game-1').update({[`x-slot`]:"Empty",});


}