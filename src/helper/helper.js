const apiBaseLink =  'https://task-app-heroku.herokuapp.com';
const Authentication = { 
    loggedIn: false,
    isLoggedIn(){
        let cookie =   getCookie('token')
        if(!cookie || cookie == null){
            return this.loggedIn = false
        }
        return this.loggedIn = true
    }
}


const getCookie = (name) => {
    let value = '';
    const decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    let matched = cookieArray.filter(item => {
        let splitItem = item.split('=');
        if(splitItem[0].trim() === name){
            value = splitItem[1]
            return value
        }
        else{
            return null;
        }
    }) 

    return value
}

const setCookie = (name,value) => {
    document.cookie = `${name}=${value}`;
}
export {getCookie, setCookie, apiBaseLink, Authentication}