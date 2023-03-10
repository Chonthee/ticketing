import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client'
import Header from '../components/header';

const AppComponent = ({Component, pageProps, currentUser})=>{
    return (
    <div>
        <Header currentUser={currentUser} />
        <div className='container'>
            <Component currentUser={currentUser} {...pageProps} />
        </div>
    </div>);
};

AppComponent.getInitialProps = async (appContext) => {
    //console.log(Object.keys(appContext));

    const client = buildClient(appContext.ctx);
    const {data} = await client.get('/api/users/currentuser');
    
    //to get initaprops for both app and individual page
    let pageProps={};
    if(appContext.Component.getInitialProps){
        pageProps = await appContext.Component.getInitialProps(appContext.ctx,client,data.currentUser);
    }

    //console.log(pageProps);

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;