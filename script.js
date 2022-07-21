/* =========================
 * Initialization steps
 * ======================== */

// NOTE: Azduna API Limits are 25/min, 250/day, 1000/week, 2500/month

// Create an app object (jobApp) & initialize API settings
const jobApp = {
    // API
    id: config.APP_ID,
    key: config.API_KEY,
    // for pagination
    maxPages: 1,
    pageNum: 1,
    // for sorting
    sortByParameter: 'relevance',
    // light/dark mode toggle
    isDarkTheme: true
};

// Create an init method to kick off the setup of the application
jobApp.init = function() {
   jobApp.getUserQuery();
   jobApp.themeToggle();
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

        // check if user, if so, sort results with a new API call 
        jobApp.checkSort(jobTitle.value, company.value, location.value, jobApp.sortByParameter);

        // check if user wants to change page, if so, change pages with a new API call
        jobApp.checkPageChange(jobTitle.value, company.value, location.value, jobApp.sortByParameter);

        // pass on userParameters to getJobs function, default sorting parameter is by relevance
        jobApp.getJobs(jobTitle.value, company.value, location.value, jobApp.sortByParameter);

    });
};

/* =========================
 * checkPageChange method
 * - This method checks if the user wants to change the page of results displayed after the submit
 * - If they want a different page, call the API again to retrieve results for that page
 * ======================== */   

jobApp.checkPageChange = function (jobTitle, company, location, sortByParameter) {
    const prevButton = document.getElementById('previousPage');
    prevButton.addEventListener('click', function (e) {
        if (jobApp.pageNum > 1) {
            jobApp.pageNum--;
            jobApp.getJobs(jobTitle, company, location, sortByParameter);
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
            jobApp.getJobs(jobTitle, company, location, sortByParameter);
            if (jobApp.pageNum === jobApp.maxPages) {
                nextButton.style.cssText = 'opacity: 0.3; pointer-events: none;';
            } else {
                prevButton.style.cssText = 'opacity: 1; pointer-events: auto';
            }
        }
    });
}

/* =========================
 * checkSort method
 * - This method checks if the user wants to sort results displayed after the submit
 * - If they want to sort by date instead of relevance (default), call API again with desired sorting parameter
 * ======================== */

jobApp.checkSort = function(jobTitle, company, location, sortByParameter) {
    document.getElementById('sortResults').addEventListener('change', function (e) {
        sortByParameter = this.value;
        jobApp.getJobs(jobTitle, company, location, sortByParameter);

        // reset page to first page if sorting is changed to show first page of results sorted
        jobApp.pageNum = 1;
        prevButton.style.cssText = 'opacity: 0.3; pointer-events: none;';
    });
}

/* =========================
 * getJobs method
 * - This method requests info from the API based on user parameters passed to it by getUserQuery() method
 * - It retrieves the following information on each job: jobTitle, company, location and redirect URL
 * - If the API call is successful, execute displayJobs() and pass on json results data
 * - If the API call fails, display an error message
 * ======================== */

jobApp.getJobs = async (jobTitle, company, location, sortByParameter) => {
    
    const url = new URL (`https://api.adzuna.com/v1/api/jobs/ca/search/${jobApp.pageNum}`)

    let data = {
        app_id: jobApp.id,
        app_key: jobApp.key,
        sort_by: sortByParameter,
        results_per_page: 10
    }

    if (jobTitle){
        data.what = jobTitle;
    }
    if (location) {
        data.where = location;
    }
    if (company) {
        data.company = company;
    }

    url.search = new URLSearchParams(data);

    try {
        const response = await fetch(url);
        const jsonData = await response.json();
        // error handling - when there are no results identified
        if (jsonData.count === 0){
            jobApp.showErrorMsg();
        } else {
            jobApp.displayJobs(jsonData.results, jsonData.count);
        }
    }
    catch(error) {
        console.log(error);
        jobApp.showErrorMsg();
    }
};   

/* =========================
 * showErrorMsg method
 * - This method displays a basic user-friendly messages if no jobs match the parameters or the API call fails
 * ======================== */

jobApp.showErrorMsg = function(){
    document.getElementById('jobsList').innerHTML = '';
    document.getElementById('jobsList').innerHTML = '<li>No matching jobs found. Please enter different parameters and try again.</li>';
    document.getElementById('currentPage').textContent = '';
    document.getElementById('jobCount').textContent = '';
}

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
        contractLength.textContent = "Contract Type: " + jobApp.formatString(job.contract_time);
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
jobApp.formatString = function(str){
    if(str){
        let finalString = str.replace('_', '-');
        finalString = finalString[0].toUpperCase() + finalString.substring(1);
        return finalString;
    } else {
        return 'N/A';
    }
}

// Helper function to format the date posted (remove the timestamp)
jobApp.formatDate = function(date){
    return date.substring(0,10);
}

/* =========================
 * Light/dark mode
 * ======================== */

jobApp.themeToggle = function(){
    const toggleBtn = document.getElementById('lightDarkModeBtn');
    const themeIcon = document.getElementById('themeIcon');

    // if the toggle button is clicked, switch themes
    toggleBtn.addEventListener('click', function(e){
        jobApp.isDarkTheme = !jobApp.isDarkTheme;

        if (!jobApp.isDarkTheme){
            // light mode
            themeIcon.innerHTML = `<i class="fa-solid fa-cloud-moon" style="color:#2D3047;"></i>`;
            document.body.style.cssText = 'background-color: #f6f6f6; color: #2D3047;';
            document.getElementById('arrowDown').style.color = '#2D3047';
            document.getElementById('lightDarkModeBtn').style.border = '2px solid #2D3047';
            document.getElementById('resultsHeader').style.color = '#2D3047';
            document.getElementById('sortResults').style.backgroundColor = '#f7e1ce';
            document.getElementById('jobseekrHeader').style.color = '#2D3047';
            document.getElementById('userInput').style.backgroundColor = '#f7e1ce'; 
            document.getElementById('footer').style.backgroundColor = '#f7e1ce';  
            document.getElementById('previousPage').style.backgroundColor = '#f7e1ce';  
            document.getElementById('nextPage').style.backgroundColor = '#f7e1ce';        
        
        }else {
            // dark mode
            themeIcon.innerHTML = `<i class="fa-solid fa-cloud-sun" style="color:#f6f6f6;"></i>`;
            document.body.style.cssText = 'background-color: #2D3047; color: #f6f6f6;';
            document.getElementById('arrowDown').style.color = '#f6f6f6';
            document.getElementById('lightDarkModeBtn').style.border = '2px solid #f6f6f6';
            document.getElementById('resultsHeader').style.color = '#f6f6f6';
            document.getElementById('sortResults').style.backgroundColor = '#f6f6f6';
            document.getElementById('jobseekrHeader').style.color = '#f6f6f6';
            document.getElementById('userInput').style.backgroundColor = '#f6f6f6';
            document.getElementById('footer').style.backgroundColor = '#f6f6f6';
            document.getElementById('previousPage').style.backgroundColor = '#f6f6f6';
            document.getElementById('nextPage').style.backgroundColor = '#f6f6f6';      
        }
    });
}

jobApp.init();