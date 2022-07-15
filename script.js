// Initialize API preset data in the dedicated properties:

const id = config.APP_ID;
const key = config.API_KEY;

// PSEUDOCODE
// Create an app object (jobApp)

const jobApp = {};



// Create an init method to kick off the setup of the application
// - calls getUserQuery to determine what parameters to request info from the API
// - call getJobs(jobTitle, company and location) to pull information on what jobs available
// - call displayJobs(results) to display all jobs meeting criteria set by user

jobApp.init = function() {
   jobApp.getUserQuery();
}

// Create a method (getUserQuery) with parameters ‘jobTitle’, ‘company’ and ‘location’ based on user input

jobApp.getUserQuery = function(){
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function(e){

        e.preventDefault();       
        const jobTitle = document.getElementById('jobTitle');
        const company = document.getElementById('company');
        const location = document.getElementById('location');
        // pass on userParameters to displayJobs function
        jobApp.displayJobs(jobTitle.value, company.value, location.value);
        
    });
};

// Create a method (getJobs) which requests information from the API, based on what parameters the user set for jobTitle, company and location
// Retrieve info on each job: jobTitle, company, location and redirect URL (to apply)
// When the API call is successful, create an results list object to store all the jobs and return that object, it will be passed on as argument to displayJobs
// If the API call fails, display an error message 

    
    // fetch('https://api.adzuna.com/v1/api/jobs/ca/search/1?app_id=' + id + '&app_key=' + key + '&what=developer&where=toronto&company=RBC')
    //     .then(function (response) {
    //         console.log(response);
    //         return response.json();
    //     })
    //     .then(function (jsonData) {
    //         console.log(jsonData);
    //         jobApp.displayJobs(jsonData.results);
    //     })
    
    // jobApp.displayJobs = (jobs) => {
    //     jobs.forEach(job => {
    //         console.log(job);
    
    //         const listItem = document.createElement('li');
    
    //         const jobTitle = document.createElement('p');
    //         jobTitle.textContent = job.title;
    //         const jobLocation = document.createElement('p');
    //         jobLocation.textContent = job.location.display_name;
    //         const jobCompany = document.createElement('p');
    //         jobCompany.textContent = job.company.display_name;
    //         const redirectUrl = document.createElement('p');
    //         const redirectLink = document.createElement('a');
    //         redirectLink.setAttribute("href",job.redirect_url);
    //         redirectLink.textContent = 'Apply here';
    //         redirectUrl.appendChild(redirectLink);
    
            // append the job text as a child of the list item
    //         listItem.appendChild(jobTitle);
    //         listItem.appendChild(jobLocation);
    //         listItem.appendChild(jobCompany);
    //         listItem.appendChild(redirectUrl);
    
    //         document.getElementById('jobsList').appendChild(listItem);
    //     })
    // }
    
    // }
    
    // Create a method (displayJobs) which would display all the jobs returned by the getJobs() method (display the div results)
    // loop through the results object and display each job available on a new page (with jobTitle, company, location and redirect URL) with infinite scroll feature
    // if no jobs avail meeting criteria, display a message saying so
    // have an event listener on a ‘back’ button to return to search parameters page
    
    jobApp.init();