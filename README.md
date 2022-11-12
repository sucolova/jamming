
# try it out!
https://monumental-fenglisu-7988d2.netlify.app/


# Things to improve:

## if you open the site and you are already logged in to spotify,
and you click search for the first time: 
- you get redirected to spotify-api and your searchterm is empty again and no searchresults are fetched.

### possible solutions:
- redirect to spotify-api login as soon as the site loads for the first time: but the problem is that new users would only see the spotify login when they open our site for the first time. that would be very confusing
- redirect to a welcome page with a login button, or better: render a welcome page in App.js with react router.

## delete old playlist name after save to spotify
## when clicked in form, make inputfield empty
## when in any inputfield, save on key event 'enter'
