function showLogoPage() {
    const logoPage = document.getElementById("logo-page");
    setTimeout(() => {
        logoPage.remove();
        location.replace("home-page.html");
    }, 5000);
}
showLogoPage();