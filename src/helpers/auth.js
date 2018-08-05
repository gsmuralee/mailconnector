import createHistory from 'history/createBrowserHistory'
const history = createHistory();

class Auth{
    static isLoggedIn(){
        const userToken = localStorage.getItem('_token');
        if(!!userToken)
            return true;
        else
            return false;
    }

    static logOut(){
        localStorage.clear();
        history.push('/');
        return true;
    }

    static verifyResponse(response){
        if(response.status === 200) {
            return response.json();
        } else if(response.status === 401) {
            this.logOut();
            return response.json();
        } else {
            return response.json();
        }
    }
}

export default Auth