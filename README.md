# node-localStorage-proxy

The goal of this package is to provide an extremely simple express server which can be hosted on any subdomain to provide the ability to read and write values in the `localStorage` for the subdomain it is hosted on.

Based on the blog post https://jcubic.wordpress.com/2014/06/20/cross-domain-localstorage/
Made simple with https://gist.github.com/jlong/2428561

Jakub's opening paragraph explains the why behind this pretty clearly: 
```
As you may know, LocalStorage is domain based. You can’t read or write from localstorage that’s on different domain, even if that’s subdomain. But there is iframe trick that you can use to store data from domain to it’s subdomain.

Besically you create an iframe that’s hosted on your subdomain that set document.domain to the parent domain. Then you send PostMessage to that iframe and inside iframe you set that value of localStorage.
```

## How to use
After cloning this repository.

1. `npm install` to install the necessary modules. (express)
2. `npm start` to run the server.
3. Setup `nginx` or another web traffic proxy to enable hosting this app on the subdomain you would like to access the `localStorage` for.
4. Add iframe to parent which needs access to another subdomains `localStorage`.
5. You can now use `win.postMessage` and `win.onmessage` to get, set, and delete records stored in the iframes subdomain.

## Example
If you were needing to access `sub2.domain.com` localStorage from `sub.domain.com`, and you were proxying this express server on the `/localStoreProxy` path.
```html
<html>
  <head>
    <script type="text/javascript">
      window.onload = function() {
          var win = document.getElementsByTagName('iframe')[0].contentWindow;
          var obj = {
            name: "Jack"
          };
          // save obj in subdomain localStorage
          win.postMessage(JSON.stringify({key: 'storage', method: "set", data: obj}), "*");
          // load previously saved data
          win.postMessage(JSON.stringify({key: 'storage', method: "get"}), "*");
          window.onmessage = function(e) {
              if (e.origin != "http://sub2.domain.com") {
                  return;
              }
              // this will log "Jack"
              console.log(JSON.parse(e.data).name);
          };
      };
    </script>
  </head>
  <body>
    <iframe style="display:none;" src="http://sub2.domain.com/localStoreProxy#sub.domain.com"></iframe>
  </body>
</html>
```

## Note
You do not have to use node or express to allow for access to cross-domain `localStorage`. 
The `index.html` file in `public/` can be hosted via any webserver so long as it is on the subdomain that you wish to read/write the `localStorage` of .

The `index.html` file will use the domain passed provided the URI hash, as seen above, `http://sub2.domain.com/localStoreProxy#sub.domain.com`, in the loaded iframe, `document.domain` will be set to `sub.domain.com`. 