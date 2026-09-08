/* =====================================
         GOOGLE APPS SCRIPT URL
      ===================================== */

const API_URL =
    "https://script.google.com/macros/s/AKfycbz9QpbUSFO0CCCQ7aTvKBP_eKIRq292qP-hx53Zvj40i991XLxfmCeeJKcGEpA7Jv7e/exec";



/* =====================================
   ELEMENTS
===================================== */

const erpInput =
    document.getElementById("erpInput");


const searchButton =
    document.getElementById("searchButton");


const errorMessage =
    document.getElementById("errorMessage");


const rosterSection =
    document.getElementById("rosterSection");


const loading =
    document.getElementById("loading");


const rosterTable =
    document.getElementById("rosterTable");


const rosterRequestButton =
    document.getElementById("rosterRequestButton");



/* =====================================
   INITIAL STATE
===================================== */

// Roster is hidden when page loads.
// Roster Request button remains visible.

// rosterSection.style.display = "none";
loading.style.display = "none";



/* =====================================
   SEARCH BUTTON
===================================== */

searchButton.addEventListener(
    "click",
    searchRoster
);



/* =====================================
   ENTER KEY
===================================== */

erpInput.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            searchRoster();

        }

    }
);



/* =====================================
   ROSTER REQUEST BUTTON
===================================== */

rosterRequestButton.addEventListener(
    "click",
    function () {

        /*
         * Add your Roster Request action here.
         *
         * For example, you can open another page:
         *
         * window.location.href = "request.html";
         *
         * Or open a form:
         *
         * window.open("YOUR_FORM_URL", "_blank");
         */

        alert("Roster Request");

    }
);



/* =====================================
   SEARCH ROSTER
===================================== */

async function searchRoster() {

    const erp =
        erpInput.value.trim();
    /* Clear previous error */
    errorMessage.textContent = "";
    /* Hide roster while searching */
    rosterSection.style.display = "none";
    /* Check ERP */

    if (!erp) {

        errorMessage.textContent =
            "Please enter your ERP Number.";
        return;

    }


    /* Show loading */

    loading.style.display = "block";


    /* Disable search button */

    searchButton.disabled = true;


    try {

        /* =============================
           API URL
        ============================= */

        const url =
            API_URL +
            "?erp=" +
            encodeURIComponent(erp);


        /* =============================
           FETCH DATA
        ============================= */

        const response =
            await fetch(url);


        if (!response.ok) {

            throw new Error(
                "HTTP error " +
                response.status
            );

        }


        /* =============================
           JSON RESPONSE
        ============================= */

        const data =
            await response.json();


        console.log(
            "Roster response:",
            data
        );



        /* =============================
           CHECK RESPONSE
        ============================= */

        if (!data.success) {

            errorMessage.textContent =
                data.message || "ERP number not found.";

            errorMessage.style.display = "block";

            return;

        }
        // new search starts, hide the old message
        errorMessage.style.display = "none";
        errorMessage.textContent = "";


        /* =============================
           DISPLAY EMPLOYEE
        ============================= */

        displayEmployee(data);
        // reset after the result shown in search
        erpInput.value = "";
        erpInput.focus();
    }

    catch (error) {

        console.error(
            "Roster error:",
            error
        );


        errorMessage.textContent =
            "Unable to connect to the roster system.";

    }


    finally {

        loading.style.display = "none";

        searchButton.disabled = false;

    }

}



/* =====================================
   DISPLAY EMPLOYEE
===================================== */

function displayEmployee(data) {


    /* =============================
       TEAM LEADER
    ============================= */

    document.getElementById(
        "teamLeader"
    ).textContent =
        data.teamLeader || "-";



    /* =============================
       ERP
    ============================= */

    document.getElementById(
        "employeeERP"
    ).textContent =
        data.erp || "-";



    /* =============================
       EMPLOYEE NAME
    ============================= */

    document.getElementById(
        "employeeName"
    ).textContent =
        data.name || "-";



    /* =============================
       POSITION
    ============================= */

    document.getElementById(
        "employeePosition"
    ).textContent =
        data.position || "-";



    /* =============================
       CLEAR OLD ROSTER
    ============================= */

    rosterTable.innerHTML = "";



    /* =============================
       CHECK ROSTER
    ============================= */

    if (
        !data.roster ||
        data.roster.length === 0
    ) {

        rosterTable.innerHTML = `

                    <tr>

                        <td colspan="2">
                            No roster available.
                        </td>

                    </tr>

                `;

    }


    /* =============================
       DISPLAY ROSTER
    ============================= */

    else {

        data.roster.forEach(
            function (item) {

                addRosterRow(item);

            }
        );

    }



    /* =============================
       SHOW ROSTER SECTION
    ============================= */

    rosterSection.style.display = "block";



    /* =============================
       SCROLL TO ROSTER
    ============================= */

    setTimeout(
        function () {

            rosterSection.scrollIntoView({

                behavior: "smooth",

                block: "start"

            });

        },
        100
    );

}



/* =====================================
   ADD ROSTER ROW
===================================== */

function addRosterRow(item) {


    let dateText;



    /* =============================
       SAME DATE
    ============================= */

    if (
        item.startDate ===
        item.endDate
    ) {

        dateText =
            item.startDate;

    }


    /* =============================
       DATE RANGE
    ============================= */

    else {

        dateText =
            item.startDate +
            " - " +
            item.endDate;

    }



    /* =============================
       SHIFT
    ============================= */

    const shift =
        String(item.shift || "")
            .trim();



    const shiftUpper =
        shift.toUpperCase();



    /* =============================
       DEFAULT SHIFT CLASS
    ============================= */

    let shiftClass =
        "shift-normal";



    /* =============================
       OFF IS RED
    ============================= */

    if (shiftUpper === "OFF") {

        shiftClass =
            "shift-off";

    }



    /* =============================
       CREATE ROW
    ============================= */

    const row =
        document.createElement("tr");



    row.innerHTML = `

                <td>
                    ${escapeHtml(dateText)}
                </td>

                <td class="${shiftClass}">
                    ${escapeHtml(shift)}
                </td>

            `;



    rosterTable.appendChild(row);

}



/* =====================================
   SECURITY
   PREVENT HTML INJECTION FROM SHEET
===================================== */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}
