const ref_game = firebase.database().ref('Game-data');
const ref_userdata = firebase.database().ref('UserData');
const btnJoins = document.querySelectorAll('.btn-join');
btnJoins.forEach(btnJoin => btnJoin.addEventListener('click', joinGame));
var currentPlayer;
var user_email;
var user_uid;
var player_count;
const logoutItems = document.querySelectorAll('.logged-out');
const loginItems = document.querySelectorAll('.logged-in');
var roomid ;
const btnHost = document.querySelectorAll('.btn-host');
btnHost.forEach(btnHost => btnHost.addEventListener('click', createroom));
const Hostpage = document.querySelectorAll('.room');
const title = document.querySelectorAll('.title-text');

const btnQHost = document.querySelectorAll('.btn-qjoin');
btnQHost.forEach(btnQHost => btnQHost.addEventListener('click', qjoinroom));


function showcreate(){
    Hostpage.forEach(item => item.style.display = 'block');
    title.forEach(item => item.style.display = 'none');
    loginItems.forEach(item => item.style.display = 'none');
    logoutItems.forEach(item => item.style.display = 'none');
}

const joinFeedback = document.querySelector('#feedback-msg-join');
const joinModal = new bootstrap.Modal(document.querySelector('#modal-join'));

function joinroom(){
    var room_id = '';
    room_id = document.getElementById('input-room-id').value;
    
    if(room_id == ''){
        joinFeedback.style = `color:crimson`;
        joinFeedback.innerText = `Please insert Code`;
        
    }else if(room_id.length != 5){
        joinFeedback.style = `color:crimson`;
        joinFeedback.innerText = `invalid Code`;

    }else{
        roomid= room_id;
        ref_game.once('value' , snapshot => {
            var time = 0;
            const gameInfos = snapshot.val();
            try {
                    Object.keys(gameInfos).forEach(key => {
                            if(key == roomid){
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
                            time ++;
                                joinFeedback.style = `color:crimson`;
                                joinFeedback.innerText = `room not found`;
                                }
                });
              } catch (e) {
                if (e !== 'Break') throw e
              }

        });
    }
}

function qjoinroom(){
    roomid = '';
        ref_game.once('value', snapshot => {
            snapshot.forEach( (data) => {
        
                var user_1 = data.child('o-slot').val()
                var user_2 = data.child('x-slot').val()
                var user_3 = data.child('◻-slot').val()
                var user_4 = data.child('∆-slot').val()
                var room = data.child('1 room-id').val()
                var player = [user_1, user_2, user_3, user_4];
                if((user_1 != 'Empty' || user_2 != 'Empty' || user_3 != 'Empty' || user_4 != 'Empty') && player.includes("Empty")){
                    roomid= room;
                    return;
                }
            });
            ref_game.once('value' , snapshot => {
                const gameInfos = snapshot.val();
                Object.keys(gameInfos).forEach(key => {
                                if(key == roomid){
                                    ref_game.once('value' , snapshot => {
                                        getGameInfo(snapshot);
                                        });
                                        var user = firebase.auth().currentUser;
                                        setupUI(user)
                                        showcreate()
                                        
                                }
                    });
            });
        });
        
    
    if(roomid == ''){
        alert("Room not Found");
    }else{
        alert("Join room");
        document.querySelector('#room-text').innerHTML = roomid;
    }
    
}


function createroom(){
    var result           = '';
    var characters       = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 5; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   roomid=result;
   ref_game.once('value', snapshot => {
    snapshot.forEach( (data) => {

        var user_1 = data.child('o-slot').val()
        var user_2 = data.child('x-slot').val()
        var user_3 = data.child('◻-slot').val()
        var user_4 = data.child('∆-slot').val()
        var room = data.child('1 room-id').val()
        if(user_1 == 'Empty' && user_2 == 'Empty' && user_3 == 'Empty' && user_4 == 'Empty'){
            ref_game.child(room).remove()
        }

    });
});
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
            event.currentTarget.disabled = true;
        }
        ref_game.child(roomid).update({
            [`${currentPlayer}-slot`]: user_email,
        });
    }

}

ref_game.on('value', snapshot => {
    let status_1 = snapshot.child(roomid).child("user-x-status");
    let status_2 = snapshot.child(roomid).child("user-o-status");
    let status_3 = snapshot.child(roomid).child("user-◻-status");
    let status_4 = snapshot.child(roomid).child("user-∆-status");


    if(!snapshot.child(roomid).child('GameStatus').exists()){
        if(status_1.val() == "Ready" && status_2.val() == "Ready"&& status_3.val() == "Ready"&& status_4.val() == "Ready"){
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
            col.innerHTML = `<p class="display-6"></p>`;
        });
    }
    
    if(snapshot.child(roomid).child('table').exists()){
        tableCols.forEach(col => {
            let col_val = snapshot.child(roomid).child('table').child(col.id).val();
            col.innerHTML = `<button type="button" class="display-4 btn btn-white w-100" > ${col_val} </button>`;
        });
    }
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
        Object.keys(gameInfos).forEach(key => {
            switch (key) {
                case 'user-x-name':
                    if(gameInfos['1 room-id'] == roomid){
                        player1 = gameInfos[key];
                        document.getElementById('inputPlayer-x').value = gameInfos[key];
                        document.querySelector('#btnJoin-x').disabled = true;
                    break;}
                    else{
                        break
                    }
                    
                case 'user-o-name':
                    if(gameInfos['1 room-id'] == roomid){
                        player2 = gameInfos[key];
                        document.getElementById('inputPlayer-o').value = gameInfos[key];
                        document.querySelector('#btnJoin-o').disabled = true;
                    break;}
                    else{
                        break
                    }
                case 'user-◻-name':
                    if(gameInfos['1 room-id'] == roomid){
                    player3 = gameInfos[key];
                    document.getElementById('inputPlayer-◻').value = gameInfos[key];
                    document.querySelector('#btnJoin-◻').disabled = true;
                    break;}
                    else{
                        break
                    }
                case 'user-∆-name':
                    if(gameInfos['1 room-id'] == roomid){
                    player4 = gameInfos[key];
                    document.getElementById('inputPlayer-∆').value = gameInfos[key];
                    document.querySelector('#btnJoin-∆').disabled = true;
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
            btnStartGame.disabled = true;
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
                document.getElementById('GameStatus-text').innerHTML = "Winner: X Points +10";
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
                document.getElementById('GameStatus-text').innerHTML = "Winner: O Points +10";
                if(snapshot.child(roomid).child('o-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_2 = userData.child(user_uid).child('Score').val() + 10;
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_2,
                        });
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + user_score_2;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == '◻'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: ◻ Points +10";
                if(snapshot.child(roomid).child('◻-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_3 = userData.child(user_uid).child('Score').val() + 10;
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_3,
                        });
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " + user_score_3;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == '∆'){
                document.getElementById('GameStatus-text').innerHTML = "Winner: ∆ Points +10";
                if(snapshot.child(roomid).child('∆-slot').val() == user_email){
                    ref_userdata.once('value', userData => {
                        var user_score_4 = userData.child(user_uid).child('Score').val() + 10;
                        ref_userdata.child(user_uid).update({
                            ['Score']: user_score_4,
                        });
                        document.querySelector('#user-profile-name').innerHTML = user.displayName + " Score : " +  user_score_4 ;
                    });
                }
            }
            else if(snapshot.child(roomid).child('GameResult').val() == 'draw'){
                document.getElementById('GameStatus-text').innerHTML = "GAME DRAW";
                ref_userdata.once('value', userData => {
                    var user_score_draw = userData.child(user_uid).child('Score').val() + 0;
                    ref_userdata.update({
                        ['Score']: user_score_draw,
                    });
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
    if (currentUser) {
        const btnCancelID = event.currentTarget.getAttribute('id');
        const player = btnCancelID[btnCancelID.length - 1];
        currentPlayer = player;
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

