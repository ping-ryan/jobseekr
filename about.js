const aboutPage = {
    isDarkTheme: true
};

aboutPage.init = function() {
   aboutPage.themeToggle();
}

aboutPage.themeToggle = function(){
    const toggleBtn = document.getElementById('lightDarkModeBtn');
    const themeIcon = document.getElementById('themeIcon');

    // if the toggle button is clicked, switch themes
    toggleBtn.addEventListener('click', function(e){
        aboutPage.isDarkTheme = !aboutPage.isDarkTheme;

        if (!aboutPage.isDarkTheme){
            // light mode
            themeIcon.innerHTML = `<i class="fa-solid fa-cloud-moon" style="color:#2D3047;"></i>`;
            document.body.style.cssText = 'background-color: #f6f6f6; color: #2D3047;';
            document.getElementById('lightDarkModeBtn').style.border = '2px solid #2D3047';
            document.getElementById('footer').style.backgroundColor = '#f7e1ce';  
            document.querySelectorAll('.navLink, i').forEach(function(link) {
                link.style.color = '#2D3047';
                link.classList.add('hoverClass');
            });
            document.querySelectorAll('.profileImg').forEach(function(img) {
                img.style.backgroundColor = '#f7e1ce';
            });
            document.querySelectorAll('h2, h4').forEach(function(content) {
                content.style.color = '#2D3047';
            });             
        
        }else {
            // dark mode
            themeIcon.innerHTML = `<i class="fa-solid fa-cloud-sun" style="color:#f6f6f6;"></i>`;
            document.body.style.cssText = 'background-color: #2D3047; color: #f6f6f6;';
            document.getElementById('lightDarkModeBtn').style.border = '2px solid #f6f6f6';
            document.getElementById('footer').style.backgroundColor = '#f6f6f6';
            document.querySelectorAll('.navLink, i').forEach(function(link) {
                link.style.color = '#f6f6f6';
                link.classList.add('hoverClass');
            });
            document.querySelectorAll('.profileImg').forEach(function(img) {
                img.style.backgroundColor = '#f6f6f6';
            });
            document.querySelectorAll('h2, h4').forEach(function(content) {
                content.style.color = '#f6f6f6';
            });              
        }
    });
}

aboutPage.init();