# Juno Project 2: jobseekr

**View live site [here](https://jobseekr.netlify.app/).**

## Objective

To build an application in order to show an understanding of working with third-party APIs, JavaScript, DOM manipulation, error handling and UI design, and to demonstrate competence in pair programming and communication.

## Project Requirements

### Pair programming
It is just as important to work well with your partner as it is to make a functional product. Both members of the team should have a complete understanding of the technical aspects of the project.

### Code
- App is dynamic based on user interaction (e.g. drop down menu, search field)
- App and interactions are accessible
- It is clear to the user what the app does and results are displayed legibly
- App interacts with at least one API
- All code should be organized using a namespace object
- Modern ES6 variable declarations (let, const) are used correctly
- Site is live on Netlify
- Errors are handled effectively
- Naming convention throughout HTML and CSS is consistent (ie. kabob-case, camelCase, BEM, etc)
- Project is organized using Sass partials (minimum 3)
- Extraneous code is removed (including console.log)
- Semantic HTML elements are used properly
- Wrapper used to constrain content on large displays
- Do not use any external CSS libraries (i.e., Bootstrap)
- Site is responsive and uses media queries
- ID selectors should not be used to style elements

### Presentation
You will be presenting your project on the day it's due:
- Identified one technical win
- Identified one technical challenge

## Technical Wins 

### 1. Dark/light mode implementation and overall UI
We opted for a simple and clean UI using this color palette (https://coolors.co/generate/ff8552-2d3047-f6f6f6-f7e1ce) which allowed us to also easily implement a dark/light mode toggle as the colors were all compatible. Given that this project had to be in Vanilla JS, we had limited ways to implement this mode switch and it could likely be done in less code using a library/ framework like React.

### 2. Pagination & sorting of API call results

By implementating pagination in our app, the Adzuna API only loads the current page (10 results per page as defined by our fetch call). When the user moves to the next page, the app fetches the results data for the second page of results. This improves the overall website performance and results loading speed as the app does not load ALL the results for a given user query. For example, when the user first presses submit, the app only fetches the first 10 results. Then, when the user goes on the second page, the next 10 are fetched and displayed on screen. Therefore, even if there is a large number of results for a specific query, the app won't slow down as it does not wait to load all the results. The sorting functionality also works in a similar way where when the user decides to sort by date or relevance, the app will only fetch the first 10 results from the API, sorted by the desired attribute. 

### 3. Pair Programming/ Collaboration

By alternating consistently between the driver and navigator role, we were able to reinforce our understanding of core concepts applied in our app. Effective communication allowed us to minimize any code conflicts and to optimize the legibility of our code (e.g., by using meaningful variable names throughout). Additionally, we also used a Trello board to organize our tasks for this project.

## Technical Challenges

### 1. Code organization and JS structure
In order to work effectively in teams, planning the structure of our code before getting started was an important consideration. We spent a lot of time writing out our core methods and planning our code but still had to refactor several functions after our MVP was completed.

### 2. Error handling
We ran into various errors while pulling data from our API. Creating various scenarios where our fetch call would not work was a challenge given our unfamiliarity with this specific API and some lack of API documentation on potential cases that could trigger errors. For example, having no results would trigger a different error as writing random spam (like "dsadsads") as user input which would result in an `ERR_FAILED 400` error. We eventually decided to nest our fetch call inside a try-catch statement instead of throwing errors for seperate scenarios. The API also had some odd behaviours where some companies would only show up if they are called in the "Job Title" field instead of "Company". For example, searching Capital One as a company in our fetch call throws an `ERR_FAILED 503` error, however if you type Capital One in the Job Title field, results will show up as expected. 
