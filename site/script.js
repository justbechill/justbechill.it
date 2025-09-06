function greetUser(name) {
  alert("Hello, " + name + "!");
}

// FOOTER AND NAVBAR SHENANIGANS
var footerString = `
  <div class="footer">
    <p>
      All photographs on this website are under a
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        CC BY-NC-SA 4.0 License
      </a>
    </p>
  </div>`;

//INSERT FOOTER AT THE END OF THE DOCUMENT
document.querySelector("main").innerHTML += footerString;

var navbarString = `
  <div class="navbar">
    <img src="/photos/icon.svg" />
    <div class="navbar-name"><a href="/">justbechill</a></div>

    <a href="/photos">Photos</a>
    <a href="/music">Music</a>
    <a href="/movies">Movies</a>
  </div>`;

//INSERT NAVBAR AT THE START OF THE DOCUMENT
document.querySelector("main").innerHTML =
  navbarString + document.querySelector("main").innerHTML;
