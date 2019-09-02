import { request, getFile, getImage, getJSON, getString, } from "tns-core-modules/http";
import { connectionType, getConnectionType, startMonitoring, stopMonitoring } from "tns-core-modules/connectivity";

type RequestOptions = { url: string, data?: object };

class APIService {
    serverAddress: string = 'http://192.168.100.24:3000' //'http://192.168.0.101:3000';
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
    private getHeaders(){
        return {
            "Content-Type": "application/json"
        }
    }
    private post(option: RequestOptions): Promise<Object> {
        const $this = this;
        return new Promise(function (resolve, reject) {
            if ($this.checkConnection()) {
                try {
                    request({
                        url: $this.serverAddress + option.url,
                        method: "POST",
                        headers: $this.getHeaders(),
                        content: JSON.stringify(option.data)
                    }).then(response => {
                        var result = response.content;
                        resolve(result);
                    }, (error) => { 
                        reject('An error occured. Try again');
                    }).catch(error => {
                        reject('An error occured. Try again');
                    });
                } catch (error) {
                    reject(error);
                }
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
    checkAccountPassword(account:string, password: string): Promise<Object> {
        return this.post({ url: '/account-password-check', data: { account, password } });
    }
}

/**
 * An API wrapper for the Chat
 *
 * @class APIService
 */
export const API = new APIService;

