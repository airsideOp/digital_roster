const scriptURL =
            "https://script.google.com/macros/s/AKfycbyuhxR-ZOj6rNBmM35Y_CD3d-xWJqsbVbe-xsK29rKE2-8WmKwHyCB_d5myX3fcXQiv1Q/exec";

        const form = document.getElementById("feedbackForm");

        const submitButton =
            document.getElementById("submitButton");

        const buttonText =
            document.getElementById("buttonText");

        const loadingText =
            document.getElementById("loadingText");

        const successMessage =
            document.getElementById("successMessage");

        const formError =
            document.getElementById("formError");


        form.addEventListener("submit", function (event) {

            event.preventDefault();

            successMessage.style.display = "none";
            formError.style.display = "none";

            submitButton.disabled = true;

            buttonText.style.display = "none";
            loadingText.style.display = "inline";


            const formData = new FormData(form);


            const data = {

                erpNumber: formData.get("erpNumber"),

                staffName: formData.get("staffName"),

                managementChange:
                    formData.get("rosterChange"),

                rosterProblem:
                    formData.get("reasonRequest")
            };


            fetch(scriptURL, {

                method: "POST",

                body: JSON.stringify(data),

                headers: {
                    "Content-Type":
                        "text/plain;charset=utf-8"
                }

            })

                .then(response => response.json())

                .then(result => {

                    if (result.status === "success") {

                        successMessage.style.display = "flex";

                        form.reset();

                    } else {

                        formError.textContent =
                            result.message ||
                            "Something went wrong.";

                        formError.style.display = "flex";
                    }

                })

                .catch(error => {

                    console.error("Error:", error);

                    formError.textContent =
                        "Unable to submit your request. Please try again.";

                    formError.style.display = "flex";

                })

                .finally(() => {

                    submitButton.disabled = false;

                    buttonText.style.display = "inline";

                    loadingText.style.display = "none";

                });

        });