
const fbId = document.querySelector("meta[name='fb-id']").getAttribute('content');

const FaceBookApi = {

    init: () =>{
        window.fbAsyncInit = function() {
                FB.init({
                  appId      : fbId,
                  xfbml      : true,
                  version    : 'v2.5'
                    });
            };
            (function(d, s, id){
                 var js, fjs = d.getElementsByTagName(s)[0];
                 if (d.getElementById(id)) {return;}
                 js = d.createElement(s); js.id = id;
                 js.src = "//connect.facebook.net/en_US/sdk.js";
                 fjs.parentNode.insertBefore(js, fjs);
               }(document, 'script', 'facebook-jssdk'));


          },
        share: (image, source)=>{
                FB.ui({
                method: 'feed',
                name: 'I just edited ' + image.title +  ' on image editor',
                display: 'popup',
                link: window.location.protocol + '//' + window.location.host,
                caption: 'Image editor is your instagram on web',
                picture: source,
                description: "I just updated my image",
            }, (res) =>{
                console.log(res);
            });
        }


    }
export default FaceBookApi;