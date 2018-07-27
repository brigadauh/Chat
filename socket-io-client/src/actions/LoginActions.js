//import $ from 'jquery';
//import * as utils from '../utils';

export function signin(socket, login, password, cbSuccess, cbFailure) {
    socket.register(login,password,(err,user) =>{
        if (err) {
            if (typeof cbFailure === 'function'){
                cbFailure(err);
            }
            //console.log("error:", err);
        }
        else {
            if (typeof cbSuccess === 'function'){
                cbSuccess(user);
            }
            //console.log("user registered:", user);
        }
    });


}
