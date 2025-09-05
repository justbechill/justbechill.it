function greetUser(name) {
  alert("Hello, " + name + "!");
}

// FOOTER AND HEADER SHENANIGANS
var footerString = `
    <p>
      All photographs on this website are licensed under a
      <a
        href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
      >
        CC BY-NC-SA 4.0 License
      </a>
    </p>`;

let footerElement = document.getElementById("footer");
footerElement.className = "footer";
footerElement.innerHTML = footerString;
