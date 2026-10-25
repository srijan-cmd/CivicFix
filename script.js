// CivicFix - Location Feature

const locationButton = document.querySelector(".location-btn");
const locationInput = document.querySelector("#location");

if (locationButton && locationInput) {

    locationButton.addEventListener("click", function () {

        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.");
            return;
        }

        locationButton.textContent = "Getting Location...";

        navigator.geolocation.getCurrentPosition(

            function (position) {

                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                locationInput.value =
                    "Latitude: " + latitude.toFixed(6) +
                    ", Longitude: " + longitude.toFixed(6);

                locationButton.textContent = "📍 Location Added";
            },

            function () {

                alert(
                    "Unable to get your location. Please allow location access in your browser."
                );

                locationButton.textContent = "📍 Use My Location";
            }

        );

    });

}


// Complaint Submission

const complaintForm = document.querySelector("#complaintForm");

if (complaintForm) {

    complaintForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const category =
            document.querySelector("#category").value;

        const description =
            document.querySelector("#description").value;

        const location =
            document.querySelector("#location").value;

        const priority =
            document.querySelector("#priority").value;


        // Automatically assign department

        let department;

        if (category === "Pothole / Road Damage") {
            department = "Roads & Transport Department";
        } else if (category === "Garbage Accumulation") {
            department = "Sanitation Department";
        } else if (category === "Broken Streetlight") {
            department = "Electrical Department";
        } else if (category === "Water Leakage") {
            department = "Water Supply Department";
        } else if (category === "Damaged Traffic Signal") {
            department = "Traffic Department";
        } else if (category === "Fallen Tree") {
            department = "Parks & Disaster Management";
        } else {
            department = "General Civic Department";
        }


        // Generate Complaint ID

        const complaintId =
            "CF" + Date.now().toString().slice(-6);


        // Get existing complaints

        let complaints =
            JSON.parse(
                localStorage.getItem("civicFixComplaints")
            ) || [];


        // Check for duplicate complaint

        const duplicateComplaint = complaints.find(function (existingComplaint) {

            return (
                existingComplaint.category === category &&
                existingComplaint.location === location
            );

        });

        if (duplicateComplaint) {

            alert(
                "⚠️ Similar complaint already exists!\n\n" +
                "Existing Complaint ID: " +
                duplicateComplaint.id +
                "\nCategory: " +
                duplicateComplaint.category +
                "\nLocation: " +
                duplicateComplaint.location
            );

            return;
        }


        // Create complaint object

        const complaint = {

            id: complaintId,
            category: category,
            description: description,
            location: location,
            priority: priority,
            department: department,
            status: "Submitted"

        };


        // Add new complaint

        complaints.push(complaint);


        // Save complaints

        localStorage.setItem(
            "civicFixComplaints",
            JSON.stringify(complaints)
        );


        alert(
            "Complaint submitted successfully!\n\n" +
            "Complaint ID: " + complaintId + "\n" +
            "Category: " + category + "\n" +
            "Priority: " + priority + "\n" +
            "Department: " + department + "\n" +
            "Location: " + location + "\n" +
            "Status: Submitted"
        );


        complaintForm.reset();

    });

}


// Display My Complaints

const complaintsList =
    document.querySelector("#complaintsList");

if (complaintsList) {

    const complaints =
        JSON.parse(
            localStorage.getItem("civicFixComplaints")
        ) || [];


    if (complaints.length === 0) {

        complaintsList.innerHTML = `
            <div class="empty-complaints">
                <h2>No Complaints Yet</h2>
                <p>You have not reported any civic issues.</p>
                <a href="report.html">Report an Issue</a>
            </div>
        `;

    } else {

        complaintsList.innerHTML = "";

        complaints.forEach(function (complaint) {

            const complaintCard =
                document.createElement("div");

            complaintCard.className =
                "complaint-card";

            complaintCard.innerHTML = `
                <div class="complaint-top">
                    <h2>${complaint.category}</h2>
                    <span class="status">${complaint.status}</span>
                </div>

                <p>
                    <strong>Complaint ID:</strong>
                    ${complaint.id}
                </p>

                <p>
                    <strong>Description:</strong>
                    ${complaint.description}
                </p>

                <p>
                    <strong>Location:</strong>
                    ${complaint.location}
                </p>

                <p>
                    <strong>Priority:</strong>
                    ${complaint.priority}
                </p>

                <p>
                    <strong>Assigned Department:</strong>
                    ${complaint.department || "Not Assigned"}
                </p>

                <div class="status-timeline">
                    <div class="timeline-step active">
                        <div class="timeline-dot"></div>
                        <span>Submitted</span>
                    </div>

                    <div class="timeline-line"></div>

                    <div class="timeline-step">
                        <div class="timeline-dot"></div>
                        <span>Under Review</span>
                    </div>

                    <div class="timeline-line"></div>

                    <div class="timeline-step">
                        <div class="timeline-dot"></div>
                        <span>Assigned</span>
                    </div>

                    <div class="timeline-line"></div>

                    <div class="timeline-step">
                        <div class="timeline-dot"></div>
                        <span>In Progress</span>
                    </div>

                    <div class="timeline-line"></div>

                    <div class="timeline-step">
                        <div class="timeline-dot"></div>
                        <span>Resolved</span>
                    </div>
                </div>
            `;

            complaintsList.appendChild(complaintCard);

        });

    }
}
