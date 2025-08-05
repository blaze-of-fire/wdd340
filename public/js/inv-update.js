const form = document.querySelector("#updateForm")
    form.addEventListener("change", function () {
        const updateInp = document.querySelector("#submitBtn")
        updateInp.removeAttribute("disabled")
    })