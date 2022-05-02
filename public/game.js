const ref_game = firebase.database().ref('Game-data');
const ref_userdata = firebase.database().ref('UserData');
//const ref_username = firebase.database().ref('UserName');
const btnJoins = document.querySelectorAll('.btn-join');
btnJoins.forEach(btnJoin => btnJoin.addEventListener('click', joinGame));
var currentPlayer;
var user_email;
var user_uid;
var player_count;
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
// var roomid = createroom();
var roomid ;
const btnHost = document.querySelectorAll('.btn-host');
btnHost.forEach(btnHost => btnHost.addEventListener('click', createroom));
const Hostpage = document.querySelectorAll('.room');
// const btnJoinhost = document.querySelectorAll('.btn-joinhost');
// btnJoinhost.forEach(btnJoinhost => btnJoinhost.addEventListener('click', joinroom));
// const btnjoinform = document.querySelector('.room-code');
// btnjoinform.addEventListener('click', joinroom)
// btnjoinform.forEach(btnjoinform => btnjoinform.addEventListener('click', joinroom));

function showcreate(){
    Hostpage.forEach(item => item.style.display = 'block');
    loginItems.forEach(item => item.style.display = 'none');
    logoutItems.forEach(item => item.style.display = 'none');
}

const joinFeedback = document.querySelector('#feedback-msg-join');
const joinModal = new bootstrap.Modal(document.querySelector('#modal-join'));

function joinroom(){
    var room_id = '';
    room_id = document.getElementById('input-room-id').value;
    console.log(ref_game.value)
    
    if(room_id == ''){
        joinFeedback.style = `color:crimson`;
        joinFeedback.innerText = `invalid Code`;
        
    }else{
        roomid= room_id;
        ref_game.once('value' , snapshot => {
            var time = 0;
            const gameInfos = snapshot.val();
            console.log("ggg")
            console.log(Object.keys(gameInfos))
            console.log('ggg')
            try {
                    Object.keys(gameInfos).forEach(key => {
                            if(key == roomid){
                            console.log(key)
                                ref_game.once('value' , snapshot => {
                                    getGameInfo(snapshot);
                                    });
                                    var user = firebase.auth().currentUser;
                                    document.querySelector('#room-text').innerHTML = roomid;
                                    setupUI(user)
                                    showcreate()
                                    joinFeedback.style = `color:green`;
                                    joinFeedback.innerText = `joined room`;
                                    time ++;
                                    throw 'Break';
                            }
                            else{
                            console.log(key)
                            time ++;
                                joinFeedback.style = `color:crimson`;
                                joinFeedback.innerText = `room not found`;
                                }
                                console.log(time)
                });
              } catch (e) {
                if (e !== 'Break') throw e
              }

        });
    }
}

function createroom(){
   console.log(roomid);
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   roomid=result;
//    roomid='24963';
    ref_game.once('value' , snapshot => {
        if(roomid){
            
            ref_game.child(roomid).update({
            ['o-slot']: 'Empty',
            ['x-slot']: 'Empty',
            ['◻-slot']: 'Empty',
            ['∆-slot']: 'Empty',
            ['1 room-id']: roomid,})
            getGameInfo(snapshot);
        }else{
    }
    });
    

   console.log(roomid);
   var user = firebase.auth().currentUser;
   document.querySelector('#room-text').innerHTML = roomid;
    setupUI(user)
    showcreate()
   return result;
   
}

function setupUI(user) {
    if (user) {
        ref_userdata.once('value' , snapshot => {
            if(snapshot.child(user.uid).exists()){
                document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + snapshot.child(user.uid).child('Score').val() +"";
                ref_userdata.child(user.uid).update({
                    ['Name']: user.displayName,
                });
            }else{
                ref_userdata.child(user.uid).update({
                    ['Score']:0,
                });
                document.querySelector('#user-profile-name').innerHTML = user.displyname +" (0)";
                location.reload()
                location.reload()
            }
            user_uid = user.uid;
        });
        ref_game.once('value' , snapshot => {
            if(snapshot.child(roomid).child('x-slot').val() == 'Empty'){
                document.getElementById('btnJoin-x').disabled = false;
                document.getElementById('btnCancel-x').disabled = true;
            }else if(snapshot.child(roomid).child('x-slot').val() ==  user.email){
                document.getElementById('btnJoin-x').disabled = true;
                document.getElementById('btnCancel-x').disabled = false;
            }
            if(snapshot.child(roomid).child('o-slot').val() == 'Empty'){
                document.getElementById('btnJoin-o').disabled = false;
                document.getElementById('btnCancel-o').disabled = true;
            }else if(snapshot.child(roomid).child('o-slot').val() == user.email){
                document.getElementById('btnJoin-o').disabled = true;
                document.getElementById('btnCancel-o').disabled = false;

            }
            if(snapshot.child(roomid).child('◻-slot').val() == 'Empty'){
                document.getElementById('btnJoin-◻').disabled = false;
                document.getElementById('btnCancel-◻').disabled = true;
            }else if(snapshot.child(roomid).child('◻-slot').val() == user.email){
                document.getElementById('btnJoin-◻').disabled = true;
                document.getElementById('btnCancel-◻').disabled = false;
            }
            if(snapshot.child(roomid).child('∆-slot').val() == 'Empty'){
                document.getElementById('btnJoin-∆').disabled = false;
                document.getElementById('btnCancel-∆').disabled = true;
            }else if(snapshot.child(roomid).child('∆-slot').val() == user.email){
                document.getElementById('btnJoin-∆').disabled = true;
                document.getElementById('btnCancel-∆').disabled = false;
            }
        });
        user_email = user.email;
        loginItems.forEach(item => item.style.display = 'block');
        logoutItems.forEach(item => item.style.display = 'none');
        Hostpage.forEach(item => item.style.display = 'none');
    } else {
        document.querySelector('#user-profile-name').innerHTML = '';
        loginItems.forEach(item => item.style.display = 'none');
        logoutItems.forEach(item => item.style.display = 'block');
        Hostpage.forEach(item => item.style.display = 'none');
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
            let tmpName = `user-${player}-name`;
            let tmpStatus = `user-${player}-status`;
            ref_game.child(roomid).update({
                [tmpID]: currentUser.uid,
                [tmpEmail]: currentUser.email,
                [tmpName]: currentUser.displayName,
                [tmpStatus]: 'Ready',
            });
            console.log(currentUser.email + ' added. ');
            event.currentTarget.disabled = true;
        }
        ref_game.child(roomid).update({
            [`${currentPlayer}-slot`]: user_email,
        });
    }
    console.log(`inputPlayer-${player}` + ' join ' + roomid)

}

ref_game.on('value', snapshot => {
    let status_1 = snapshot.child(roomid).child("user-x-status");
    let status_2 = snapshot.child(roomid).child("user-o-status");
    let status_3 = snapshot.child(roomid).child("user-◻-status");
    let status_4 = snapshot.child(roomid).child("user-∆-status");


    if(!snapshot.child(roomid).child('GameStatus').exists()){
        if(status_1.val() == "Ready" && status_2.val() == "Ready"&& status_3.val() == "Ready"&& status_4.val() == "Ready"){
        // if (true){
            console.log('gameeee')
            btnStartGame.disabled = false;
            document.getElementById('GameStatus-text').innerHTML = 'Click START GAME';
        }
        else{
            btnStartGame.disabled = true;
            document.getElementById('GameStatus-text').innerHTML = 'Waiting for player...';
        }

        if(snapshot.child(roomid).child('x-slot').val() == 'Empty' && snapshot.child(roomid).child('o-slot').val() != user_email && snapshot.child(roomid).child('◻-slot').val() != user_email && snapshot.child(roomid).child('∆-slot').val() != user_email){
            document.querySelector('#btnJoin-x').disabled = false;
            document.querySelector('#btnCancel-x').disabled = true;
        }else if(snapshot.child(roomid).child('x-slot').val() != 'Empty' && snapshot.child(roomid).child('x-slot').val() != user_email){
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
        }else if(snapshot.child(roomid).child('x-slot').val() == user_email){
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = false;
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = true;
            document.getElementById('btnJoin-◻').disabled = true;
            document.getElementById('btnCancel-◻').disabled = true;
            document.getElementById('btnJoin-∆').disabled = true;
            document.getElementById('btnCancel-∆').disabled = true;
        }

        if(snapshot.child(roomid).child('o-slot').val() == 'Empty' && snapshot.child(roomid).child('x-slot').val() != user_email && snapshot.child(roomid).child('◻-slot').val() != user_email && snapshot.child(roomid).child('∆-slot').val() != user_email){
            document.querySelector('#btnJoin-o').disabled = false;
            document.querySelector('#btnCancel-o').disabled = true;
        }else if(snapshot.child(roomid).child('o-slot').val() != 'Empty' && snapshot.child(roomid).child('o-slot').val() != user_email){
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = true;
        }else if(snapshot.child(roomid).child('o-slot').val() == user_email){
            document.querySelector('#btnJoin-o').disabled = true;
            document.querySelector('#btnCancel-o').disabled = false;
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
            document.getElementById('btnJoin-◻').disabled = true;
            document.getElementById('btnCancel-◻').disabled = true;
            document.getElementById('btnJoin-∆').disabled = true;
            document.getElementById('btnCancel-∆').disabled = true;
        }

        if(snapshot.child(roomid).child('◻-slot').val() == 'Empty' && snapshot.child(roomid).child('x-slot').val() != user_email && snapshot.child(roomid).child('o-slot').val() != user_email && snapshot.child(roomid).child('∆-slot').val() != user_email){
            document.querySelector('#btnJoin-◻').disabled = false;
            document.querySelector('#btnCancel-◻').disabled = true;
        }else if(snapshot.child(roomid).child('◻-slot').val() != 'Empty' && snapshot.child(roomid).child('◻-slot').val() != user_email){
            document.querySelector('#btnJoin-◻').disabled = true;
            document.querySelector('#btnCancel-◻').disabled = true;
        }else if(snapshot.child(roomid).child('◻-slot').val() == user_email){
            document.querySelector('#btnJoin-◻').disabled = true;
            document.querySelector('#btnCancel-◻').disabled = false;
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
            document.getElementById('btnJoin-o').disabled = true;
            document.getElementById('btnCancel-o').disabled = true;
            document.getElementById('btnJoin-∆').disabled = true;
            document.getElementById('btnCancel-∆').disabled = true;
        }

        if(snapshot.child(roomid).child('∆-slot').val() == 'Empty' && snapshot.child(roomid).child('x-slot').val() != user_email && snapshot.child(roomid).child('◻-slot').val() != user_email && snapshot.child(roomid).child('o-slot').val() != user_email){
            document.querySelector('#btnJoin-∆').disabled = false;
            document.querySelector('#btnCancel-∆').disabled = true;
        }else if(snapshot.child(roomid).child('∆-slot').val() != 'Empty' && snapshot.child(roomid).child('∆-slot').val() != user_email){
            document.querySelector('#btnJoin-∆').disabled = true;
            document.querySelector('#btnCancel-∆').disabled = true;
        }else if(snapshot.child(roomid).child('∆-slot').val() == user_email){
            document.querySelector('#btnJoin-∆').disabled = true;
            document.querySelector('#btnCancel-∆').disabled = false;
            document.querySelector('#btnJoin-x').disabled = true;
            document.querySelector('#btnCancel-x').disabled = true;
            document.getElementById('btnJoin-◻').disabled = true;
            document.getElementById('btnCancel-◻').disabled = true;
            document.getElementById('btnJoin-o').disabled = true;
            document.getElementById('btnCancel-o').disabled = true;
        }
        
        btnEndGame.disabled = true;
        tableCols.forEach(col => {
            col.disabled = true;
            col.innerHTML = `<p class="display-4"></p>`;
        });
    }
    
    if(snapshot.child(roomid).child('table').exists()){
        tableCols.forEach(col => {
            let col_val = snapshot.child(roomid).child('table').child(col.id).val();
            col.innerHTML = `<button type="button" class="display-4 btn btn-white w-100" style="height: 4rem;"> ${col_val} </button>`;
        });
    }

    // if(!snapshot.child(roomid).child('o-slot').exists()){
    //     ref_game.child(roomid).update({
    //         ['o-slot']: 'Empty',
    //     });
    // }

    // if(!snapshot.child(roomid).child('x-slot').exists()){
    //     ref_game.child(roomid).update({
    //         ['x-slot']: 'Empty',
    //     });
    // }
    
    // if(!snapshot.child(roomid).child('◻-slot').exists()){
    //     ref_game.child(roomid).update({
    //         ['◻-slot']: 'Empty',
    //     });
    // }

    // if(!snapshot.child(roomid).child('∆-slot').exists()){
    //     ref_game.child(roomid).update({
    //         ['∆-slot']: 'Empty',
    //     });
    // }
    getGameInfo(snapshot);
});

function getGameInfo(snapshot) {
    var user = firebase.auth().currentUser;

    document.getElementById('inputPlayer-x').value = '';
    document.getElementById('inputPlayer-o').value = '';
    document.getElementById('inputPlayer-◻').value = '';
    document.getElementById('inputPlayer-∆').value = '';


    snapshot.forEach((data) => {
        const gameInfos = data.val();
        console.log('gameInfos')
        console.log(gameInfos)
        console.log('gameInfos')
        Object.keys(gameInfos).forEach(key => {
            switch (key) {
                case 'user-x-name':
                    if(gameInfos['1 room-id'] == roomid){
                        console.log(gameInfos['key']+' yasssss' + roomid)
                        player1 = gameInfos[key];
                        document.getElementById('inputPlayer-x').value = gameInfos[key];
                        document.querySelector('#btnJoin-x').disabled = true;
                        console.log(gameInfos['user-x-name']+' testx' + roomid)
                    break;}
                    else{
                        break
                    }
                    
                case 'user-o-name':
                    if(gameInfos['1 room-id'] == roomid){
                        player2 = gameInfos[key];
                        document.getElementById('inputPlayer-o').value = gameInfos[key];
                        document.querySelector('#btnJoin-o').disabled = true;
                        console.log(gameInfos[key]+' test')
                    break;}
                    else{
                        break
                    }
                case 'user-◻-name':
                    if(gameInfos['1 room-id'] == roomid){
                    player3 = gameInfos[key];
                    document.getElementById('inputPlayer-◻').value = gameInfos[key];
                    document.querySelector('#btnJoin-◻').disabled = true;
                    console.log(gameInfos[key]+' test')
                    break;}
                    else{
                        break
                    }
                case 'user-∆-name':
                    if(gameInfos['1 room-id'] == roomid){
                    player4 = gameInfos[key];
                    document.getElementById('inputPlayer-∆').value = gameInfos[key];
                    document.querySelector('#btnJoin-∆').disabled = true;
                    console.log(gameInfos[key]+' test')
                    break;}
                    else{
                        break
                    }
                    
            }
        })
    });

    var gameStatus_exists = snapshot.child(roomid).child('GameStatus').exists();
    if(gameStatus_exists){
        var gameStatus = snapshot.child(roomid).child('GameStatus').val();
        if(gameStatus == 'Playing'){
            btnCancels.forEach(btnCancel => btnCancel.disabled = true);
            
            var turn = snapshot.child(roomid).child('Turn').val();
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
                        col.removeEventListener('click', add_s_toCol);
                        col.removeEventListener('click', add_t_toCol);
                    });
                }
                
            }else if (turn == "O"){
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
                        col.removeEventListener('click', add_s_toCol);
                        col.removeEventListener('click', add_t_toCol);
                    });
                }
            }else if (turn == "◻"){
                let L_turn = turn.toLowerCase();
                let L_currentPlayer = currentPlayer.toLowerCase();
                document.getElementById('GameStatus-text').innerHTML = 'Turn: ◻';
                if(L_currentPlayer == L_turn){
                    tableCols.forEach(col => {
                        col.disabled = false;
                        col.addEventListener('click', add_s_toCol);
                    });
                }
                else{
                    tableCols.forEach(col => {
                        col.disabled = true;
                        col.removeEventListener('click', add_X_toCol);
                        col.removeEventListener('click', add_O_toCol);
                        col.removeEventListener('click', add_s_toCol);
                        col.removeEventListener('click', add_t_toCol);
                    });
                }
            }else if (turn == "∆"){
                let L_turn = turn.toLowerCase();
                let L_currentPlayer = currentPlayer.toLowerCase();
                document.getElementById('GameStatus-text').innerHTML = 'Turn: ∆';
                if(L_currentPlayer == L_turn){
                    tableCols.forEach(col => {
                        col.disabled = false;
                        col.addEventListener('click', add_t_toCol);
                    });
                }
                else{
                    tableCols.forEach(col => {
                        col.disabled = true;
                        col.removeEventListener('click', add_X_toCol);
                        col.removeEventListener('click', add_O_toCol);
                        col.removeEventListener('click', add_s_toCol);
                        col.removeEventListener('click', add_t_toCol);

                    });
                }
            }
            
        }else if(gameStatus == 'Finish'){
            tableCols.forEach(col => {
                col.disabled = true;
                col.removeEventListener('click', add_X_toCol);
                col.removeEventListener('click', add_O_toCol);
                col.removeEventListener('click', add_s_toCol);
                col.removeEventListener('click', add_t_toCol);
            });
            if(snapshot.child(roomid).child('GameResult').val() == 'X'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: X Point +10";
                if(snapshot.child(roomid).child('x-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_1 = userData.child(user_uid).child('Score').val() + 10;
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_1,
                        });
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + user_score_1;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == 'O'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: O Point +10";
                if(snapshot.child(roomid).child('o-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_2 = userData.child(user_uid).child('Score').val() + 10;
                        console.log(user_score_2);
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_2,
                        });
                        console.log(user_score_2);
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + user_score_2;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == '◻'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: ◻ Point +10";
                if(snapshot.child(roomid).child('◻-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_3 = userData.child(user_uid).child('Score').val() + 10;
                        console.log(user_score_3);
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_3,
                        });
                        console.log(user_score_3);
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + user_score_3;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == '∆'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: ∆ Point +10";
                if(snapshot.child(roomid).child('∆-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_4 = userData.child(user_uid).child('Score').val() + 10;
                        console.log(user_score_4);
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_4,
                        });
                        console.log(user_score_4);
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " +  user_score_4 ;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == 'draw'){
                document.getElementById('GameStatus-text').innerHTML = "GAME DRAW";
                ref_userdata.once('value', userData => {
                    var user_score_draw = userData.child(user_uid).child('Score').val() + 0;
                    console.log(user_score_draw);
                    ref_userdata.update({
                        ['Score']: user_score_draw,
                    });
                    console.log(user_score_draw);
                    document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " +  user_score_draw ;
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
    console.log("ca")
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute('id');
        const player = btnCancelID[btnCancelID.length - 1];
        currentPlayer = player;
        console.log(roomid + "remove")
        const playerForm = document.getElementById(`inputPlayer-${player}`);
        if (playerForm.value && playerForm.value === currentUser.displayName) {
            //Delete player from database
            let tmpID = `user-${player}-id`;
            let tmpEmail = `user-${player}-email`;
            let tmpName = `user-${player}-name`;
            let tmpStatus = `user-${player}-status`;
            ref_game.child(roomid).child(tmpID).remove();
            ref_game.child(roomid).child(tmpEmail).remove();
            ref_game.child(roomid).child(tmpName).remove();
            ref_game.child(roomid).child(tmpStatus).remove();
            console.log(`delete on id: ${currentUser.uid}`);
            document.querySelector(`#btnJoin-${player}`).disabled = false;
        }
    }
    ref_game.child(roomid).update({
        [`${currentPlayer}-slot`]: 'Empty',
    });
}

const btnStartGame = document.getElementById('btnStartGame');
btnStartGame.addEventListener('click', StartGame);
const btnEndGame = document.getElementById('btnTerminateGame');
btnEndGame.addEventListener('click', EndGame);
const tableCols = document.querySelectorAll('.table-col');


function StartGame(event) {
    ref_game.child(roomid).update({
        ['GameStatus']: 'Playing',
        ['Turn']:"X",
    });
    tableCols.forEach((col => {
        ref_game.child(roomid).child('table').update({
            [col.id]:"",
        });
    }));
}


function EndGame(event) {
    ref_game.child(roomid).child('GameStatus').remove();
    ref_game.child(roomid).child('Turn').remove();
    ref_game.child(roomid).child('table').remove();
    ref_game.child(roomid).child('GameResult').remove();
}

function add_X_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child(roomid).once('value', snapshot => {
        col_val = snapshot.child('table').child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child(roomid).child('table').update({
            [event.currentTarget.id]:"X",
        });
        game_result = gameResult();
        if(game_result == 'X'){
            ref_game.child(roomid).update({
                ['GameResult']:"X",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child(roomid).update({
                ['Turn']:"O",
            });
        }else if (game_result == 'draw'){
            ref_game.child(roomid).update({
                ['GameResult']:"draw",
                ['GameStatus']: 'Finish',
            });
        }
    }    
}

function add_O_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child(roomid).child('table').once('value', snapshot => {
        col_val = snapshot.child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child(roomid).child('table').update({
            [event.currentTarget.id]:"O",
        });
        game_result = gameResult();
        if(game_result == 'O'){
            ref_game.child(roomid).update({
                ['GameResult']:"O",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child(roomid).update({
                ['Turn']:"◻",
            });
        }else if (game_result == 'draw'){
            ref_game.child(roomid).update({
                ['GameResult']:"draw",
                ['GameStatus']: 'Finish',
            });
        }
    }
}

function add_s_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child(roomid).child('table').once('value', snapshot => {
        col_val = snapshot.child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child(roomid).child('table').update({
            [event.currentTarget.id]:"◻",
        });
        game_result = gameResult();
        if(game_result == '◻'){
            ref_game.child(roomid).update({
                ['GameResult']:"◻",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child(roomid).update({
                ['Turn']:"∆",
            });
        }else if (game_result == 'draw'){
            ref_game.child(roomid).update({
                ['GameResult']:"draw",
                ['GameStatus']: 'Finish',
            });
        }
    }
}

function add_t_toCol(event){
    var col_val = '';
    var game_result = '';
    ref_game.child(roomid).child('table').once('value', snapshot => {
        col_val = snapshot.child(event.currentTarget.id).val();
    });
    if(col_val == ''){
        ref_game.child(roomid).child('table').update({
            [event.currentTarget.id]:"∆",
        });
        game_result = gameResult();
        if(game_result == '∆'){
            ref_game.child(roomid).update({
                ['GameResult']:"∆",
                ['GameStatus']: 'Finish',
            });
        }else if (game_result == 'no'){
            ref_game.child(roomid).update({
                ['Turn']:"X",
            });
        }else if (game_result == 'draw'){
            ref_game.child(roomid).update({
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
    ref_game.child(roomid).once('value', snapshot => {
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



//Getleaderboard()

function Getleaderboard() {
    
    ref_userdata.once('value', snapshot => {
        snapshot.forEach( (data) => {
            console.log(data)
            var user_name = data.child('Name').val()
            var user_score = data.child('Score').val()
            var table = document.getElementById("leader_body");
            var row = table.insertRow(-1);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            cell1.innerHTML = user_name;
            cell2.innerHTML = user_score;
        });
        sortTable()
    });
}


function sortTable() {
    var table, rows, switching, i, x, y, shouldSwitch;
    table = document.getElementById("leader_board");
    switching = true;
    /*Make a loop that will continue until
    no switching has been done:*/
    while (switching) {
      //start by saying: no switching is done:
      switching = false;
      rows = table.rows;
      /*Loop through all table rows (except the
      first, which contains table headers):*/
      for (i = 1; i < (rows.length - 1); i++) {
        //start by saying there should be no switching:
        shouldSwitch = false;
        /*Get the two elements you want to compare,
        one from current row and one from the next:*/
        x = rows[i].getElementsByTagName("TD")[1];
        y = rows[i + 1].getElementsByTagName("TD")[1];
        //check if the two rows should switch place:
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
      if (shouldSwitch) {
        /*If a switch has been marked, make the switch
        and mark that a switch has been done:*/
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }


Getleaderboard()

// const pageAccessedByReload = (
//     (window.performance.navigation && window.performance.navigation.type === 1) ||
//       window.performance
//         .getEntriesByType('navigation')
//         .map((nav) => nav.type)
//         .includes('reload')
        
// );
// if(pageAccessedByReload){
//     ref_game.child(roomid).remove();
//     ref_game.child(roomid).update({[`o-slot`]:"Empty",});
//     ref_game.child(roomid).update({[`x-slot`]:"Empty",});


// } 

