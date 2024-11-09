export const msalConfig = {
    auth: {
        clientId: "9a1295e2-5483-450a-a420-d6bbba00128b",
        authority: "https://login.microsoftonline.com/common",
        redirectUri: "http://localhost:3000",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    }
};

export const loginRequest = {
    scopes: [
        "User.Read",
        "User.ReadBasic.All",
        "email",
        "profile",
        "openid"
    ]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me?$select=displayName,userPrincipalName,id,mail,givenName,surname,userType,preferredLanguage"
};
