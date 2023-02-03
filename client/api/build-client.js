import axios from "axios";

export default ({req}) =>{
    if(typeof window ==='undefined'){
        // window is an object only exist in browser, 
        // but not exist inside nodejs environmetn
        // We are on ther server
        return axios.create({
            baseURL:'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            headers: req.headers
        });

    } else{
        // We are on ther browser
        return axios.create({
            baseURL:'/',
        });
    }
}