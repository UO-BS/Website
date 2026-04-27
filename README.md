# Website
This is a personal website to display my other projects.
I currently use the Github API to grab my projects, so private repos and external projects are not visible here.

This project was mainly created to test and learn Angular.
Currently hosted at:
>**https://uo-bs.github.io/Website**.


Potential Future Improvements:
- Add additional information regarding projects (tags, screenshots, etc...)
    - Add "search projects by tag" bar
- Add private repository data (for personal projects. My academic and professional projects may have copyright)
- Add more information to the Contact tab
    - Add an alert saying that resume is available upon request (to avoid web scraping)
- Angular Animations repository:
    - Add sliders to allow the user to edit the animation parameters
- Add translations (with a language dropdown selector)
- Create a .ico to resolve the favicon.ico issue
- Make the Github service translatable to different languages

Build Note:
To host on github pages, I use the angular-cli-ghpages package.
I have added a "Deploy" script to package.json for ease-of-use.
