# Website
This is a personal website to display my other projects.
I currently use the Github API to grab my projects, so private repos and external projects are not visible here.

This project was mainly created to test and learn Angular.
Curently hosted at https://uo-bs.github.io/Website.


Potential Future Improvements:
- Add additional information regarding projects (tags, screenshots, etc...)
    - Add "search projects by tag" bar
- Add private project data
- Add more information to the Contact tab
- Angular Animations repository:
    - Have the animation preview become the actual animation when the user hovers/scrolls over the ribbon (enlarging the ribbon and adding emphasis)
        - Could add sliders to allow the user to edit the animation parameters
    - 3D rotating animation idea: A sphere of pins/points that change color when clicked on (can rotate the sphere with click-and-drag)
        - Example: Can be used to select a country on a globe
    - Remove hard-coding from the ribbons
- Remove hard-coded text and add translations (with a language dropdown selector)
    - Use a service to fetch a language JSON file; other components then call this service to get their text content

Build Note:
To host on github pages, I use the angular-cli-ghpages package.
I have added a "Deploy" script to package.json for ease-of-use.
