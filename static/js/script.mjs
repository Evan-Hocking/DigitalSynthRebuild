// buildKeys()


function addKB() {
    return new Promise((resolve, reject) => {
        var includeKB = document.createElement("script");
        includeKB.text = "buildKeys()"

        var scriptContainer = document.querySelector("#scripts")
        scriptContainer.appendChild(includeKB);
        resolve();
    });
}
addKB()
