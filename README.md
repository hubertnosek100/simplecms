# simplecms


You can use docker image.
```
 docker run -p 3000:3000 -d nosq/simplecms
```

<strong>Login</strong>: admin </br>
<strong>Password</strong>: admin </br>

## API

Every get action is authorized by api key generate with simplecms. </br>
You can just managed all component from Dashboard tab and get it via query for example.

```
http://localhost:3000/exponent?uuid=redCoral
```

The query above return exponent with uuid 'redCoral'.

## Editing remote
In html folder is example how to use the simplecms with simple components.
You have to include simplecms.min.js and simplecms.min.css and run script described below.

```
t: simplecms.init("YOUR_SIMPLECMS_URL", "YOUR_API_KEY")
e: simplecms.init("http://localhost:3000", "85f1f9772b69f4e8762b252de9c3cafabaf6ac04")
```

For edit component just press ctrl + shift + e for edit on your website where you imported the library. </br> 
When you enabled editing just right click on your component to open menu.