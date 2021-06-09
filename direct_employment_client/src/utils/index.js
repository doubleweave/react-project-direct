/*
* Collection of Utility function
* */

export function getRedirectTo(userType, avatar) {
    let path = '';
    if(!userType) {
        path = '/login';
    }
    if(userType === 'employer') {
        path = 'employer';
    } else {
        path = 'employee';
    }

    if(!avatar) {
        path += 'profile';
    }

    return path;
}
