import { request, getFile, getImage, getJSON, getString, } from "tns-core-modules/http";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from "tns-core-modules/connectivity";

type RequestOptions = { url: string, data?: object };

class APIService {
    //serverAddress: string = 'http://192.168.1.111:3000';
    public serverAddress: string = 'http://192.168.100.24:3000';
    //public serverAddress: string = 'http://192.168.0.101:3000';
    private checkConnection() {
        const ConnectionType = getConnectionType();
        switch (ConnectionType) {
            case connectionType.none:
                return false;
            case connectionType.bluetooth:
                return false;
        }
        return true;
    }
    private getHeaders() {
        return {
            "Content-Type": "application/json"
        }
    }
    private post(option: RequestOptions): Promise<Object> {
        return this.request({
            url: this.serverAddress + option.url,
            method: "POST",
            headers: this.getHeaders(),
            content: JSON.stringify(option.data)
        });
    }
    private get(option: RequestOptions): Promise<Object> {
        return this.request({
            url: this.serverAddress + option.url,
            method: "GET",
            headers: this.getHeaders()
        });
    }
    private request(options): Promise<Object> {
        const $this = this;
        return new Promise(function (resolve, reject) {
            if ($this.checkConnection()) {
                request(options).then(response => {
                    var result = response.content;
                    resolve(result);
                }, (error) => {  
                    reject('An error occured. Try again');
                }).catch(error => {
                    reject('An error occured. Try again');
                });
            } else {
                reject("Connectivity issue occured. Please check your network connection");
            }
        });
    }
    /**
     * Check for user account
     *
     * @param {string} userNumber
     * @returns {Promise<Object>}
     * @memberof APIService
     */
    checkAccount(userNumber: string): Promise<Object> {
        return this.post({ url: '/account-check', data: { userNumber } });
    }
    checkAccountPassword(uid: string, password: string): Promise<Object> {
        return this.post({ url: '/account-check-auth', data: { uid, password } });
    }
    signUp(account: string, email: string, password: string): Promise<Object> {
        return this.post({ url: '/signup', data: { account, password, email } });
    }
    verifyPin(email: string, pin: string): Promise<Object> {
        return this.post({ url: '/signup/verify-pin', data: { email, pin } });
    }
    saveDPandDN(uid: string, dp: string, dn: string): Promise<Object> {
        return this.post({ url: '/signup/save-dp-dn', data: { uid, dp, dn } });
    }
    saveDP(uid: string, dp: string): Promise<Object> {
        return this.post({ url: '/save-dp', data: { uid, dp } });
    }
    getContacts(uid: string): Promise<Object> {
        return this.get({ url: '/contacts/' + uid });
    }
}

/**
 * An API wrapper for the Chat
 *
 * @class APIService
 */
export const API = new APIService;

