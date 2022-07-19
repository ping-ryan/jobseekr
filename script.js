/* =========================
 * Initialization steps
 * ======================== */

// Create an app object (jobApp) & initialize API settings
const jobApp = {
    id: config.APP_ID,
    key: config.API_KEY,
    // for pagination
    maxPages: 0,
    pageNum: 1,
    sortByParameter: 'relevance'
};

// Create an init method to kick off the setup of the application
jobApp.init = function() {
   jobApp.getUserQuery();
}

/* =========================
 * getUserQuery method
 * - This method has an event listener on the submit button of the user form
 * - When user parameters are inputted, it passes them to the getJobs() method
 * ======================== */

jobApp.getUserQuery = function(){
    const userForm = document.getElementById('userForm');
    userForm.addEventListener('submit', function(e){
        e.preventDefault();       
        const jobTitle = document.getElementById('jobTitle');
        const company = document.getElementById('company');
        const location = document.getElementById('location');

        // get custom sorting attribute
        document.getElementById('sortResults').addEventListener('change', function(e){
            jobApp.sortByParameter = this.value;
            jobApp.getJobs(jobTitle.value, company.value, location.value, jobApp.sortByParameter);
            // reset page to first page if sorting is changed to show first page of results sorted
            jobApp.pageNum = 1;
            prevButton.style.cssText = 'opacity: 0.3; pointer-events: none;';
        });

        // pagination
        const prevButton = document.getElementById('previousPage');
        prevButton.addEventListener('click', function(e){
            if (jobApp.pageNum > 1){
                jobApp.pageNum--;
                jobApp.getJobs(jobTitle.value, company.value, location.value, jobApp.sortByParameter);
                if (jobApp.pageNum === 1) {
                    prevButton.style.cssText = 'opacity: 0.3; pointer-events: none;';
                } else {
                    nextButton.style.cssText = 'opacity: 1; pointer-events: auto';
                }
            }
        });

        const nextButton = document.getElementById('nextPage');
        nextButton.addEventListener('click', function (e) {

            if (jobApp.pageNum < jobApp.maxPages) {
                jobApp.pageNum++;
                jobApp.getJobs(jobTitle.value, company.value, location.value, jobApp.sortByParameter);
                if (jobApp.pageNum === jobApp.maxPages) {
                    nextButton.style.cssText = 'opacity: 0.3; pointer-events: none;';
                } else {
                    prevButton.style.cssText = 'opacity: 1; pointer-events: auto';
                }
            }
        });

        // pass on userParameters to getJobs function, default sorting parameter is by relevance
        jobApp.getJobs(jobTitle.value, company.value, location.value, jobApp.sortByParameter);
    });
};

/* =========================
 * getJobs method
 * - This method requests info from the API based on user parameters passed to it by getUserQuery() method
 * - It retrieves the following information on each job: jobTitle, company, location and redirect URL
 * - If the API call is successful, execute displayJobs() and pass on json results data
 * - If the API call fails, display an error message
 * ======================== */

jobApp.getJobs = function(jobTitle, company, location, sortByParameter){
    const url = new URL (`https://api.adzuna.com/v1/api/jobs/ca/search/${jobApp.pageNum}`)

    url.search = new URLSearchParams({
        app_id: jobApp.id,
        app_key: jobApp.key,
        what: jobTitle,
        where: location,
        company: company,
        sort_by: sortByParameter,
        results_per_page: 10
    });

    fetch(url)
    .then(function (response) {    
        return response.json();
    })
    .then(function (jsonData) {
        jobApp.displayJobs(jsonData.results, jsonData.count);
    });
};   

/* =========================
 * displayJobs method
 * - This method displays all the jobs returned by the getJobs() in the jobsList ul by looping through each job result 
 * - It first clears all the old results of previous searches (if applicable)
 * - Then loops through each job result and creates a list item to contain each job result
 * - It finally displays each list item by appending to existing ul 
 * ======================== */

jobApp.displayJobs = function(jobs, jobsCount) {

    // set max pages to num pages of results (10 results per page)
    jobApp.maxPages = Math.ceil((jobsCount) / 10);
    document.getElementById('currentPage').textContent = `Page ${jobApp.pageNum} of ${jobApp.maxPages}`;

    // show total number of results found
    document.getElementById('jobCount').textContent = jobsCount + " total results found.";

    // clear old results from the ul
    const jobsList = document.getElementById('jobsList');
    jobsList.innerHTML = '';

    // loop through each job result and create a list item to be appended to results ul
    jobs.forEach(job => {
        // create a list item that will contain all the job details for each job
        const listItem = document.createElement('li');

        // create paragraph tags to hold all job details        
        const jobTitle = document.createElement('p');
        jobTitle.textContent = "Title: " + job.title;
        const contractLength = document.createElement('p');
        contractLength.textContent = "Contract Type: " + job.contract_time;
        const jobLocation = document.createElement('p');
        jobLocation.textContent = "Location: " + job.location.display_name;
        const jobCompany = document.createElement('p');
        jobCompany.textContent = "Company: " + job.company.display_name;
        const dateCreated = document.createElement('p');
        dateCreated.textContent = "Date posted: " + jobApp.formatDate(job.created);
        const description = document.createElement('p');
        description.textContent = "Description: " + job.description;
        
        // create a link containing URL to apply for the job
        const redirectUrl = document.createElement('p');
        const redirectLink = document.createElement('a');
        redirectLink.setAttribute("href",job.redirect_url);
        redirectLink.textContent = 'Apply here';
        redirectUrl.appendChild(redirectLink);

        // append the job details to each job list item
        listItem.append(jobTitle, contractLength, jobLocation, jobCompany, dateCreated, redirectUrl, description);

        // append each job details to the list
        jobsList.appendChild(listItem);

    });
};

// Helper function to format the contract type text (remove _ and capitalize)
// jobApp.formatContractString = function(str){
//     let finalString = str.replace('_', '-');
//     finalString = finalString[0].toUpperCase() + finalString.substring(1);
//     return finalString;
// }

// Helper function to format the date posted (remove the timestamp)
jobApp.formatDate = function(date){
    return date.substring(0,10);
}

jobApp.init();